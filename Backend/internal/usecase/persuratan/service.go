package persuratan

import (
	"context"
	"fmt"
	"io"
	"regexp"
	"strings"
	"time"

	"log/slog"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/pkg/apputil"
	"desa-borong-api/pkg/pdfengine"
	"desa-borong-api/pkg/security"
	"desa-borong-api/pkg/templateengine"
)


// SubmittedFile is an uploaded attachment to attach to a pengajuan.
type SubmittedFile struct {
	Filename, MimeType string
	Size               int64
	Reader             io.Reader
}

type Service struct {
	jenis      JenisSuratRepository
	pengajuan  PengajuanRepository
	penduduk   PendudukRepository
	storage    FileStorage
	tx         TxManager
	users      UserReader
	mailer     EmailSender
	appURL     string
	hmacSecret string
}

var submissionKey = regexp.MustCompile(`^[A-Za-z][A-Za-z0-9_-]{0,63}$`)

func NewService(jenis JenisSuratRepository, pengajuan PengajuanRepository, penduduk PendudukRepository, storage FileStorage, tx TxManager, users UserReader, mailer EmailSender, appURL string, hmacSecret string) *Service {
	return &Service{jenis: jenis, pengajuan: pengajuan, penduduk: penduduk, storage: storage, tx: tx, users: users, mailer: mailer, appURL: appURL, hmacSecret: hmacSecret}
}



// ---- Jenis Surat (layanan) ----

func (s *Service) ListJenis(ctx context.Context, includeInactive bool) ([]domain.JenisSurat, error) {
	return s.jenis.List(ctx, includeInactive)
}

func (s *Service) GetJenis(ctx context.Context, kode string) (domain.JenisSurat, error) {
	return s.jenis.GetByKode(ctx, strings.ToUpper(strings.TrimSpace(kode)))
}

func (s *Service) CreateJenis(ctx context.Context, j domain.JenisSurat) (domain.JenisSurat, error) {
	j.Kode = strings.ToUpper(strings.TrimSpace(j.Kode))
	if j.Ikon == "" {
		j.Ikon = "FileText"
	}
	if err := s.jenis.Create(ctx, j); err != nil {
		return j, mapConflict(err)
	}
	return j, nil
}

func (s *Service) UpdateJenis(ctx context.Context, kode string, j domain.JenisSurat) (domain.JenisSurat, error) {
	cur, err := s.jenis.GetByKode(ctx, kode)
	if err != nil {
		return cur, err
	}
	if j.Nama != "" {
		cur.Nama = j.Nama
	}
	if j.Deskripsi != "" {
		cur.Deskripsi = j.Deskripsi
	}
	if j.Persyaratan != nil {
		cur.Persyaratan = j.Persyaratan
	}
	if j.FormFields != nil {
		cur.FormFields = j.FormFields
	}
	if j.EstimasiHari > 0 {
		cur.EstimasiHari = j.EstimasiHari
	}
	if j.Ikon != "" {
		cur.Ikon = j.Ikon
	}
	cur.IsActive = j.IsActive
	if err := s.jenis.Update(ctx, cur); err != nil {
		return cur, err
	}
	return cur, nil
}

func (s *Service) DeleteJenis(ctx context.Context, kode string) error {
	return s.jenis.Delete(ctx, kode)
}

func mapConflict(err error) error {
	if err != nil && strings.Contains(strings.ToLower(err.Error()), "duplicate") {
		return domain.ErrConflict
	}
	return err
}

// ---- Pengajuan ----

// Submit creates a new letter request for the authenticated warga.
func (s *Service) Submit(ctx context.Context, pemohon domain.User, jenisKode string, data map[string]string, files []SubmittedFile) (domain.PengajuanSurat, error) {
	jenis, err := s.jenis.GetByKode(ctx, strings.ToUpper(strings.TrimSpace(jenisKode)))
	if err != nil {
		return domain.PengajuanSurat{}, err
	}
	if !jenis.IsActive {
		return domain.PengajuanSurat{}, domain.ErrConflict
	}
	if !validSubmission(jenis, data, files) {
		return domain.PengajuanSurat{}, domain.ErrValidation
	}
	now := time.Now()
	p := domain.PengajuanSurat{
		ID:             apputil.NewID(),
		NomorResi:      apputil.Resi(jenis.Kode),
		JenisSuratKode: jenis.Kode,
		JenisSuratNama: jenis.Nama,
		PemohonID:      pemohon.ID,
		PemohonNama:    pemohon.Nama,
		Data:           data,
		Lampiran:       []domain.LampiranFile{},
		Status:         domain.PengajuanDiajukan,
		CreatedAt:      now,
		UpdatedAt:      now,
	}
	cat := "Pengajuan telah diterima oleh sistem desa."
	p.Riwayat = []domain.RiwayatStatus{{Status: domain.PengajuanDiajukan, Waktu: now, Catatan: &cat}}

	for _, f := range files {
		url, err := s.storage.Save(ctx, "pengajuan", f.Reader, f.Filename)
		if err != nil {
			deleteAttachments(ctx, s.storage, p.Lampiran)
			return domain.PengajuanSurat{}, err
		}
		p.Lampiran = append(p.Lampiran, domain.LampiranFile{
			ID: apputil.NewID(), Nama: f.Filename, URL: url,
			UkuranBytes: int(f.Size), MimeType: f.MimeType,
		})
	}
	if err := s.pengajuan.Create(ctx, p, p.Lampiran); err != nil {
		deleteAttachments(ctx, s.storage, p.Lampiran)
		return domain.PengajuanSurat{}, err
	}
	return p, nil
}

func validSubmission(j domain.JenisSurat, data map[string]string, files []SubmittedFile) bool {
	if len(data) == 0 || len(data) > 50 || len(files) > 5 {
		return false
	}
	for key, value := range data {
		if !submissionKey.MatchString(key) || len(strings.TrimSpace(value)) > 10_000 {
			return false
		}
	}
	for _, field := range j.FormFields {
		if field.Required && field.Type != "file" && strings.TrimSpace(data[field.Name]) == "" {
			return false
		}
		if field.Required && field.Type == "file" && len(files) == 0 {
			return false
		}
	}
	for _, file := range files {
		if file.Size < 1 || file.Size > 5<<20 || !oneMime(file.MimeType, "image/jpeg", "image/png", "application/pdf") {
			return false
		}
	}
	return true
}

func oneMime(mime string, allowed ...string) bool {
	for _, value := range allowed {
		if mime == value {
			return true
		}
	}
	return false
}

func deleteAttachments(ctx context.Context, storage FileStorage, files []domain.LampiranFile) {
	for _, file := range files {
		_ = storage.Delete(ctx, file.URL)
	}
}

func (s *Service) GetByResi(ctx context.Context, resi string) (domain.PengajuanSurat, error) {
	return s.pengajuan.GetByNomorResi(ctx, strings.ToUpper(strings.TrimSpace(resi)))
}

func (s *Service) GetByQRVerificationCode(ctx context.Context, code string) (domain.PengajuanSurat, error) {
	return s.pengajuan.GetByQRVerificationCode(ctx, strings.TrimSpace(code))
}

func (s *Service) GetPendudukByNIK(ctx context.Context, nik string) (domain.Penduduk, error) {
	if s.penduduk == nil {
		return domain.Penduduk{}, domain.ErrNotFound
	}
	return s.penduduk.GetByNIK(ctx, strings.TrimSpace(nik))
}


// OpenLampiran authorizes access to a personal attachment before opening it.
func (s *Service) OpenLampiran(ctx context.Context, pengajuanID, lampiranID, viewerID string, isAdmin bool) (io.ReadCloser, domain.LampiranFile, error) {
	pengajuan, err := s.pengajuan.GetByID(ctx, pengajuanID)
	if err != nil {
		return nil, domain.LampiranFile{}, err
	}
	if !isAdmin && pengajuan.PemohonID != viewerID {
		return nil, domain.LampiranFile{}, domain.ErrForbidden
	}
	for _, lampiran := range pengajuan.Lampiran {
		if lampiran.ID == lampiranID {
			file, err := s.storage.Open(ctx, lampiran.URL)
			return file, lampiran, err
		}
	}
	return nil, domain.LampiranFile{}, domain.ErrNotFound
}

func (s *Service) ListByPemohon(ctx context.Context, pemohonID string) ([]domain.PengajuanSurat, error) {
	return s.pengajuan.ListByPemohon(ctx, pemohonID)
}

func (s *Service) ListAll(ctx context.Context, status string) ([]domain.PengajuanSurat, error) {
	return s.pengajuan.ListAll(ctx, strings.TrimSpace(status))
}

// ChangeStatus validates the state-machine transition then records it.
func (s *Service) ChangeStatus(ctx context.Context, id string, next domain.StatusPengajuan, catatan, changedBy *string) (domain.PengajuanSurat, error) {
	var updated domain.PengajuanSurat
	err := s.tx.WithinTx(ctx, func(txCtx context.Context) error {
		cur, err := s.pengajuan.GetByIDForUpdate(txCtx, id)
		if err != nil {
			return err
		}
		ok := false
		for _, permitted := range cur.Status.LegalNext() {
			if permitted == next {
				ok = true
				break
			}
		}
		if !ok {
			return domain.ErrInvalidState
		}
		if err := s.pengajuan.UpdateStatus(txCtx, id, next, catatan, changedBy); err != nil {
			return err
		}
		history := domain.RiwayatStatus{Status: next, Waktu: time.Now(), Oleh: changedBy, Catatan: catatan}
		if err := s.pengajuan.AddRiwayat(txCtx, id, history); err != nil {
			return err
		}
		updated, err = s.pengajuan.GetByID(txCtx, id)
		return err
	})
	return updated, err
}

func (s *Service) DeletePengajuan(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.ErrValidation
	}
	p, err := s.pengajuan.GetByID(ctx, id)
	if err != nil {
		return err
	}
	for _, l := range p.Lampiran {
		if l.URL != "" {
			_ = s.storage.Delete(ctx, l.URL)
		}
	}
	return s.pengajuan.Delete(ctx, id)
}

func romanMonth(m time.Month) string {
	romans := [...]string{"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"}
	if m >= 1 && m <= 12 {
		return romans[m]
	}
	return "I"
}

// Publish sets a 'diproses' pengajuan to 'selesai', renders dynamic PDF template, and attaches HMAC security token
func (s *Service) Publish(ctx context.Context, id, nomorSuratInput, catatan, changedBy string) (domain.PengajuanSurat, error) {
	var updated domain.PengajuanSurat
	err := s.tx.WithinTx(ctx, func(txCtx context.Context) error {
		cur, err := s.pengajuan.GetByIDForUpdate(txCtx, id)
		if err != nil {
			return err
		}
		if cur.Status != domain.PengajuanDiproses && cur.Status != domain.PengajuanDiverifikasi {
			return domain.ErrInvalidState
		}
		now := time.Now()
		nomorSurat := strings.TrimSpace(nomorSuratInput)
		if nomorSurat == "" {
			nomorSurat = fmt.Sprintf("470/%s/DB/%s/%d", cur.JenisSuratKode, romanMonth(now.Month()), now.Year())
		}

		// Generate HMAC-SHA256 Digital Verification Token
		qrCode := security.GenerateDocumentHash(s.hmacSecret, nomorSurat, cur.PemohonNama, cur.NomorResi, now.Format("2006-01-02"))


		// Prepare render context for dynamic HTML template
		jenis, _ := s.jenis.GetByKode(txCtx, cur.JenisSuratKode)
		tplHTML := ""
		if jenis.TemplateHTML != nil && *jenis.TemplateHTML != "" {
			tplHTML = *jenis.TemplateHTML
		} else {
			tplHTML = fmt.Sprintf("<div><h2>PEMERINTAH DESA BORONG</h2><h3>%s</h3><p>Nomor: %s</p><p>Menerangkan bahwa: <strong>%s</strong></p><p>Surat diterbitkan secara resmi melalui Sistem Persuratan Digital Desa Borong.</p></div>", cur.JenisSuratNama, nomorSurat, cur.PemohonNama)
		}

		renderCtx := templateengine.RenderContext{
			Pemohon: map[string]string{
				"nama":           cur.PemohonNama,
				"nik":            cur.Data["nik"],
				"ttl":            cur.Data["tempatLahir"] + ", " + cur.Data["tanggalLahir"],
				"pekerjaan":      cur.Data["pekerjaan"],
				"alamat_lengkap": cur.Data["alamatLengkap"],
			},
			Desa: map[string]string{
				"nama_desa": "Borong",
				"kecamatan": "Lappariaja",
				"kabupaten": "Bone",
			},
			TTD: map[string]string{
				"nama": "H. Muhammad Rusli, S.Sos.",
				"nip":  "19780412 200501 1 004",
			},
			Meta: map[string]string{
				"nomor_surat":   nomorSurat,
				"tanggal_surat": templateengine.FormatIndonesianDate(now),
				"qr_code_img":   fmt.Sprintf("<div style='font-family: monospace; font-size: 10px; border: 1px solid #000; padding: 4px; display: inline-block;'>QR VERIFIED: %s</div>", qrCode),
			},
			Form: cur.Data,
		}

		renderedHTML := templateengine.RenderTemplate(tplHTML, renderCtx)
		pdfDataURL, _ := pdfengine.HTMLToPDFDataURL(renderedHTML, cur.JenisSuratNama)

		doc := domain.DokumenHasilSurat{
			Nama:            fmt.Sprintf("%s-%s.pdf", cur.JenisSuratKode, cur.NomorResi),
			URL:             pdfDataURL,
			DiterbitkanPada: now,
			NomorSurat:      nomorSurat,
			DiterbitkanOleh: changedBy,
		}
		cc := strings.TrimSpace(catatan)
		if cc == "" {
			cc = "Surat telah disetujui dan dikirim ke akun pemohon."
		}
		if err := s.pengajuan.UpdateStatus(txCtx, id, domain.PengajuanSelesai, &cc, &changedBy); err != nil {
			return err
		}
		if err := s.pengajuan.SetFinalPDFAndQR(txCtx, id, nomorSurat, pdfDataURL, qrCode); err != nil {
			// Fallback set dokumen hasil if set final fails
			_ = s.pengajuan.SetDokumenHasil(txCtx, id, doc)
		} else {
			_ = s.pengajuan.SetDokumenHasil(txCtx, id, doc)
		}

		history := domain.RiwayatStatus{Status: domain.PengajuanSelesai, Waktu: now, Oleh: &changedBy, Catatan: &cc}
		if err := s.pengajuan.AddRiwayat(txCtx, id, history); err != nil {
			return err
		}
		updated, err = s.pengajuan.GetByID(txCtx, id)
		return err
	})
	if err != nil {
		return domain.PengajuanSurat{}, err
	}
	if updated.DokumenHasil != nil || updated.Status == domain.PengajuanSelesai {
		user, uerr := s.users.GetByID(ctx, updated.PemohonID)
		if uerr != nil {
			slog.Warn("failed to fetch user for completion email", "error", uerr, "pemohonID", updated.PemohonID)
		} else if strings.TrimSpace(user.Email) == "" {
			slog.Warn("user has no email address configured in database, email skipped", "pemohonID", updated.PemohonID, "pemohonNama", updated.PemohonNama)
		} else {
			slog.Info("attempting to send completion email to user", "email", user.Email, "pengajuanID", updated.ID)
			if eerr := s.mailer.Send(ctx, user.Email, "Surat Selesai - Desa Borong: "+updated.JenisSuratNama, letterDoneHTML(updated, s.appURL)); eerr != nil {
				slog.Error("failed to send surat notification email via Brevo", "error", eerr, "recipientEmail", user.Email, "pengajuanID", updated.ID)
			} else {
				slog.Info("surat notification email sent successfully", "recipientEmail", user.Email, "pengajuanID", updated.ID)
			}
		}
	}
	return updated, nil
}


// letterDoneHTML builds the HTML body for the "letter finished" email sent to
// the applicant when a surat is published. It points to the formal surat page
// on the frontend (rendered PDF-ready template).
func letterDoneHTML(p domain.PengajuanSurat, appURL string) string {
	link := appURL + "/surat/" + p.NomorResi
	if p.DokumenHasil != nil && p.DokumenHasil.URL != "" && !strings.HasPrefix(p.DokumenHasil.URL, "data:") {
		link = p.DokumenHasil.URL
	}
	return fmt.Sprintf(`<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:24px"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px"><h2 style="color:#0f172a;margin:0 0 12px">Surat Selesai — Desa Borong</h2><p style="color:#334155">Halo <strong>%s</strong>,</p><p style="color:#334155">Surat <strong>%s</strong> (Resi: %s) telah selesai dan dapat dilihat serta diunduh dalam format PDF.</p><p><a href="%s" style="display:inline-block;background:#0f4c81;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Lihat &amp; Unduh Surat</a></p><p style="color:#64748b;font-size:13px">Terima kasih telah menggunakan layanan Desa Borong.</p></div></body></html>`, p.PemohonNama, p.JenisSuratNama, p.NomorResi, link)
}

// buildPDF produces a minimal, valid PDF as a data URL placeholder.
func buildPDF(p domain.PengajuanSurat, nomorSurat string) string {
	recipient := p.PemohonNama
	if v, ok := p.Data["namaLengkap"]; ok && v != "" {
		recipient = v
	}
	keperluan := p.Data["keperluan"]
	if keperluan == "" {
		keperluan = p.Data["jenisPermohonan"]
	}
	lines := []string{
		"PEMERINTAH KABUPATEN BULUKUMBA",
		"KECAMATAN HERLANG - DESA BORONG",
		strings.ToUpper(p.JenisSuratNama),
		"Nomor: " + nomorSurat,
		"",
		"Menerangkan bahwa: " + recipient,
		"NIK: " + p.Data["nik"],
		"Keperluan: " + keperluan,
		"",
		"Dokumen elektronik ini diterbitkan melalui Sistem Desa Borong.",
	}
	var content strings.Builder
	for i, line := range lines {
		fmt.Fprintf(&content, "BT /F1 11 Tf 54 %d Td (%s) Tj ET\n", 760-i*24, pdfEscape(line))
	}
	objs := []string{
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
		fmt.Sprintf("<< /Length %d >>\nstream\n%s\nendstream", content.Len(), content.String()),
	}
	pdf := "%PDF-1.4\n"
	offsets := []int{0}
	for i, o := range objs {
		offsets = append(offsets, len(pdf))
		pdf += fmt.Sprintf("%d 0 obj\n%s\nendobj\n", i+1, o)
	}
	xref := len(pdf)
	pdf += "xref\n0 " + fmt.Sprint(len(objs)+1) + "\n0000000000 65535 f \n"
	for _, off := range offsets[1:] {
		pdf += fmt.Sprintf("%010d 00000 n \n", off)
	}
	pdf += fmt.Sprintf("trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF", len(objs)+1, xref)
	return "data:application/pdf;base64," + b64(pdf)
}

func pdfEscape(in string) string {
	r := strings.NewReplacer("\\", "\\\\", "(", "\\(", ")", "\\)")
	out := r.Replace(in)
	var b strings.Builder
	for _, c := range out {
		if c >= 0x20 && c <= 0x7E {
			b.WriteRune(c)
		} else {
			b.WriteByte(' ')
		}
	}
	return b.String()
}

func b64(s string) string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	var b strings.Builder
	data := []byte(s)
	for i := 0; i < len(data); i += 3 {
		var block [3]byte
		n := copy(block[:], data[i:])
		b.WriteByte(chars[block[0]>>2])
		b.WriteByte(chars[(block[0]&0x03)<<4|block[1]>>4])
		if n > 1 {
			b.WriteByte(chars[(block[1]&0x0F)<<2|block[2]>>6])
		} else {
			b.WriteByte('=')
		}
		if n > 2 {
			b.WriteByte(chars[block[2]&0x3F])
		} else {
			b.WriteByte('=')
		}
	}
	return b.String()
}
