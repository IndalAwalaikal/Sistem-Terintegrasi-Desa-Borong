package mysql

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/pkg/apputil"
	"desa-borong-api/internal/usecase/persuratan"
)

type PengajuanRepo struct{ db *sql.DB }

func NewPengajuanRepo(db *sql.DB) *PengajuanRepo { return &PengajuanRepo{db: db} }

const pengajuanBase = "SELECT p.id, p.nomor_resi, p.nomor_surat_resmi, p.jenis_surat_kode, j.nama, p.pemohon_id, u.nama, p.subjek_nik, p.data_isian, p.data_snapshot, p.status, p.current_step, p.catatan_admin, p.file_pdf_url, p.qr_verification_code, p.dokumen_hasil, p.created_at, p.updated_at FROM pengajuan_surat p JOIN jenis_surat j ON j.kode=p.jenis_surat_kode JOIN users u ON u.id=p.pemohon_id"

func scanPengajuanRow(s rowScanner) (domain.PengajuanSurat, error) {
	var p domain.PengajuanSurat
	var data, status string
	var nomorResmi, subjekNik, snapshot, catatan, pdfURL, qrCode, dokHasil sql.NullString
	if err := s.Scan(
		&p.ID, &p.NomorResi, &nomorResmi, &p.JenisSuratKode, &p.JenisSuratNama,
		&p.PemohonID, &p.PemohonNama, &subjekNik, &data, &snapshot,
		&status, &p.CurrentStep, &catatan, &pdfURL, &qrCode, &dokHasil, &p.CreatedAt, &p.UpdatedAt,
	); err != nil {
		return p, err
	}
	_ = json.Unmarshal([]byte(data), &p.Data)
	if p.Data == nil {
		p.Data = map[string]string{}
	}
	if snapshot.Valid && snapshot.String != "" {
		_ = json.Unmarshal([]byte(snapshot.String), &p.DataSnapshot)
	}
	p.Status = domain.StatusPengajuan(status)
	if nomorResmi.Valid {
		p.NomorSuratResmi = &nomorResmi.String
	}
	if subjekNik.Valid {
		p.SubjekNIK = &subjekNik.String
	}
	if catatan.Valid {
		p.CatatanAdmin = &catatan.String
	}
	if pdfURL.Valid {
		p.FilePDFURL = &pdfURL.String
	}
	if qrCode.Valid {
		p.QRVerificationCode = &qrCode.String
	}
	if dokHasil.Valid && dokHasil.String != "" {
		var dh domain.DokumenHasilSurat
		if err := json.Unmarshal([]byte(dokHasil.String), &dh); err == nil {
			p.DokumenHasil = &dh
		}
	}
	return p, nil
}

func (r *PengajuanRepo) loadPengajuan(ctx context.Context, p *domain.PengajuanSurat) error {
	lampRows, err := q(ctx, r.db).QueryContext(ctx, "SELECT id,nama_file,url,ukuran_bytes,mime_type FROM pengajuan_lampiran WHERE pengajuan_id=?", p.ID)
	if err != nil {
		return err
	}
	p.Lampiran = []domain.LampiranFile{}
	for lampRows.Next() {
		var l domain.LampiranFile
		if err := lampRows.Scan(&l.ID, &l.Nama, &l.URL, &l.UkuranBytes, &l.MimeType); err != nil {
			lampRows.Close()
			return err
		}
		p.Lampiran = append(p.Lampiran, l)
	}
	lampRows.Close()

	histRows, err := q(ctx, r.db).QueryContext(ctx,
		"SELECT rs.status,rs.created_at,COALESCE(u.nama,''),COALESCE(rs.catatan,'') FROM pengajuan_riwayat_status rs LEFT JOIN users u ON u.id=rs.changed_by WHERE rs.pengajuan_id=? ORDER BY rs.created_at", p.ID)
	if err != nil {
		return err
	}
	p.Riwayat = []domain.RiwayatStatus{}
	for histRows.Next() {
		var st string
		var rw domain.RiwayatStatus
		var oleh, cat string
		if err := histRows.Scan(&st, &rw.Waktu, &oleh, &cat); err != nil {
			histRows.Close()
			return err
		}
		rw.Status = domain.StatusPengajuan(st)
		if oleh != "" {
			ow := oleh
			rw.Oleh = &ow
		}
		if cat != "" {
			cw := cat
			rw.Catatan = &cw
		}
		p.Riwayat = append(p.Riwayat, rw)
	}
	histRows.Close()

	// Load approval steps if exists
	stepRows, err := q(ctx, r.db).QueryContext(ctx,
		"SELECT pas.id, pas.pengajuan_id, pas.step_order, pas.role_required, pas.actor_id, COALESCE(u.nama, ''), pas.status, COALESCE(pas.catatan, ''), pas.signed_at FROM pengajuan_approval_step pas LEFT JOIN users u ON u.id = pas.actor_id WHERE pas.pengajuan_id = ? ORDER BY pas.step_order", p.ID)
	if err == nil {
		defer stepRows.Close()
		p.ApprovalSteps = []domain.ApprovalStep{}
		for stepRows.Next() {
			var st domain.ApprovalStep
			var actorID, actorNama, catatan sql.NullString
			var signedAt sql.NullTime
			if err := stepRows.Scan(&st.ID, &st.PengajuanID, &st.StepOrder, &st.RoleRequired, &actorID, &actorNama, &st.Status, &catatan, &signedAt); err == nil {
				if actorID.Valid {
					st.ActorID = &actorID.String
				}
				if actorNama.Valid && actorNama.String != "" {
					st.ActorNama = &actorNama.String
				}
				if catatan.Valid && catatan.String != "" {
					st.Catatan = &catatan.String
				}
				if signedAt.Valid {
					st.SignedAt = &signedAt.Time
				}
				p.ApprovalSteps = append(p.ApprovalSteps, st)
			}
		}
	}
	return nil
}

func (r *PengajuanRepo) Create(ctx context.Context, p domain.PengajuanSurat, lampiran []domain.LampiranFile) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var snapshot any = nil
	if len(p.DataSnapshot) > 0 {
		snapshot = mustJSON(p.DataSnapshot)
	}

	if _, err := tx.ExecContext(ctx,
		"INSERT INTO pengajuan_surat(id,nomor_resi,jenis_surat_kode,pemohon_id,subjek_nik,data_isian,data_snapshot,status,current_step,catatan_admin) VALUES(?,?,?,?,?,?,?,?,?,?)",
		p.ID, p.NomorResi, p.JenisSuratKode, p.PemohonID, strPtrOrNull(p.SubjekNIK), mustJSON(p.Data), snapshot, string(p.Status), p.CurrentStep, p.CatatanAdmin); err != nil {
		return err
	}
	initial := p.Riwayat[0]
	if _, err := tx.ExecContext(ctx,
		"INSERT INTO pengajuan_riwayat_status(id,pengajuan_id,status,catatan,changed_by) VALUES(?,?,?,?,NULL)",
		apputil.NewID(), p.ID, string(initial.Status), strPtrOrNull(initial.Catatan)); err != nil {
		return err
	}
	for _, l := range lampiran {
		if _, err := tx.ExecContext(ctx,
			"INSERT INTO pengajuan_lampiran(id,pengajuan_id,nama_file,url,ukuran_bytes,mime_type) VALUES(?,?,?,?,?,?)",
			l.ID, p.ID, l.Nama, l.URL, l.UkuranBytes, l.MimeType); err != nil {
			return err
		}
	}
	for _, st := range p.ApprovalSteps {
		if _, err := tx.ExecContext(ctx,
			"INSERT INTO pengajuan_approval_step(id,pengajuan_id,step_order,role_required,status) VALUES(?,?,?,?,?)",
			apputil.NewID(), p.ID, st.StepOrder, st.RoleRequired, "pending"); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (r *PengajuanRepo) GetByNomorResi(ctx context.Context, resi string) (domain.PengajuanSurat, error) {
	return r.fetchOne(ctx, pengajuanBase+" WHERE p.nomor_resi=?", resi)
}

func (r *PengajuanRepo) GetByID(ctx context.Context, id string) (domain.PengajuanSurat, error) {
	return r.fetchOne(ctx, pengajuanBase+" WHERE p.id=?", id)
}

func (r *PengajuanRepo) GetByIDForUpdate(ctx context.Context, id string) (domain.PengajuanSurat, error) {
	return r.fetchOne(ctx, pengajuanBase+" WHERE p.id=? FOR UPDATE", id)
}

func (r *PengajuanRepo) GetByQRVerificationCode(ctx context.Context, code string) (domain.PengajuanSurat, error) {
	return r.fetchOne(ctx, pengajuanBase+" WHERE p.qr_verification_code=?", code)
}

func (r *PengajuanRepo) fetchOne(ctx context.Context, qy string, arg string) (domain.PengajuanSurat, error) {
	p, err := scanPengajuanRow(q(ctx, r.db).QueryRowContext(ctx, qy, arg))
	if err != nil {
		if err == sql.ErrNoRows {
			return p, domain.ErrNotFound
		}
		return p, err
	}
	if err := r.loadPengajuan(ctx, &p); err != nil {
		return p, err
	}
	return p, nil
}

func (r *PengajuanRepo) ListByPemohon(ctx context.Context, pemohonID string) ([]domain.PengajuanSurat, error) {
	return r.scanList(ctx, pengajuanBase+" WHERE p.pemohon_id=? ORDER BY p.created_at DESC", pemohonID)
}

func (r *PengajuanRepo) ListAll(ctx context.Context, status string) ([]domain.PengajuanSurat, error) {
	if status != "" {
		return r.scanList(ctx, pengajuanBase+" WHERE p.status=? ORDER BY p.created_at DESC", status)
	}
	return r.scanList(ctx, pengajuanBase+" ORDER BY p.created_at DESC")
}

func (r *PengajuanRepo) scanList(ctx context.Context, qy string, args ...any) ([]domain.PengajuanSurat, error) {
	rows, err := q(ctx, r.db).QueryContext(ctx, qy, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.PengajuanSurat{}
	for rows.Next() {
		p, err := scanPengajuanRow(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	for i := range out {
		if err := r.loadPengajuan(ctx, &out[i]); err != nil {
			return nil, err
		}
	}
	return out, nil
}

func (r *PengajuanRepo) UpdateStatus(ctx context.Context, id string, status domain.StatusPengajuan, catatan, changedBy *string) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"UPDATE pengajuan_surat SET status=?,catatan_admin=?,updated_at=? WHERE id=?",
		string(status), strPtrOrNull(catatan), time.Now(), id)
	return err
}

func (r *PengajuanRepo) UpdateWorkflowStep(ctx context.Context, pengajuanID string, stepOrder int, status string, actorID *string, catatan *string) error {
	now := time.Now()
	_, err := q(ctx, r.db).ExecContext(ctx,
		"UPDATE pengajuan_approval_step SET status=?, actor_id=?, catatan=?, signed_at=?, updated_at=? WHERE pengajuan_id=? AND step_order=?",
		status, strPtrOrNull(actorID), strPtrOrNull(catatan), now, now, pengajuanID, stepOrder)
	if err != nil {
		return err
	}
	_, err = q(ctx, r.db).ExecContext(ctx,
		"UPDATE pengajuan_surat SET current_step=?, updated_at=? WHERE id=?",
		stepOrder+1, now, pengajuanID)
	return err
}

func (r *PengajuanRepo) SetFinalPDFAndQR(ctx context.Context, id string, nomorResmi string, pdfURL string, qrCode string) error {
	now := time.Now()
	_, err := q(ctx, r.db).ExecContext(ctx,
		"UPDATE pengajuan_surat SET nomor_surat_resmi=?, file_pdf_url=?, qr_verification_code=?, status=?, updated_at=? WHERE id=?",
		nomorResmi, pdfURL, qrCode, string(domain.PengajuanSelesai), now, id)
	return err
}

func (r *PengajuanRepo) AddRiwayat(ctx context.Context, pengajuanID string, rw domain.RiwayatStatus) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"INSERT INTO pengajuan_riwayat_status(id,pengajuan_id,status,catatan,changed_by) VALUES(?,?,?,?,?)",
		apputil.NewID(), pengajuanID, string(rw.Status), strPtrOrNull(rw.Catatan), strPtrVal(rw.Oleh))
	return err
}

func (r *PengajuanRepo) SetDokumenHasil(ctx context.Context, id string, d domain.DokumenHasilSurat) error {
	_, err := q(ctx, r.db).ExecContext(ctx, "UPDATE pengajuan_surat SET dokumen_hasil=?,updated_at=? WHERE id=?", mustJSON(d), time.Now(), id)
	return err
}

func (r *PengajuanRepo) Delete(ctx context.Context, id string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, _ = tx.ExecContext(ctx, "DELETE FROM pengajuan_approval_step WHERE pengajuan_id=?", id)
	if _, err := tx.ExecContext(ctx, "DELETE FROM pengajuan_lampiran WHERE pengajuan_id=?", id); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, "DELETE FROM pengajuan_riwayat_status WHERE pengajuan_id=?", id); err != nil {
		return err
	}
	res, err := tx.ExecContext(ctx, "DELETE FROM pengajuan_surat WHERE id=?", id)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return domain.ErrNotFound
	}
	return tx.Commit()
}

func strPtrOrNull(p *string) any {
	if p == nil {
		return nil
	}
	return *p
}

var _ persuratan.PengajuanRepository = (*PengajuanRepo)(nil)

