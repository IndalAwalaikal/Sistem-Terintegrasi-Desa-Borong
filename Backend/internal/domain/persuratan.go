package domain

import (
	"encoding/json"
	"time"
)

type StatusPengajuan string

const (
	PengajuanDiajukan     StatusPengajuan = "diajukan"
	PengajuanDiverifikasi StatusPengajuan = "diverifikasi"
	PengajuanDiproses     StatusPengajuan = "diproses"
	PengajuanSelesai      StatusPengajuan = "selesai"
	PengajuanDitolak      StatusPengajuan = "ditolak"
)

// LegalNext returns the set of statuses reachable from s per the state machine
// defined in the frontend SPEC. 'selesai' and 'ditolak' are terminal.
func (s StatusPengajuan) LegalNext() []StatusPengajuan {
	switch s {
	case PengajuanDiajukan:
		return []StatusPengajuan{PengajuanDiverifikasi, PengajuanDitolak}
	case PengajuanDiverifikasi:
		return []StatusPengajuan{PengajuanDiproses, PengajuanDitolak}
	case PengajuanDiproses:
		return []StatusPengajuan{PengajuanSelesai, PengajuanDitolak}
	default:
		return nil
	}
}

func (s StatusPengajuan) Valid() bool {
	switch s {
	case PengajuanDiajukan, PengajuanDiverifikasi, PengajuanDiproses, PengajuanSelesai, PengajuanDitolak:
		return true
	}
	return false
}

type WorkflowStepConfig struct {
	StepOrder    int    `json:"stepOrder"`
	RoleRequired string `json:"roleRequired"`
	Action       string `json:"action"` // VERIFIKASI_BERKAS | PARAF_HIRARKI | TANDA_TANGAN_DIGITAL
	AutoNotify   bool   `json:"autoNotify"`
}

type ApprovalStep struct {
	ID          string     `json:"id"`
	PengajuanID string     `json:"pengajuanId"`
	StepOrder   int        `json:"stepOrder"`
	RoleRequired string    `json:"roleRequired"`
	ActorID     *string    `json:"actorId,omitempty"`
	ActorNama   *string    `json:"actorNama,omitempty"`
	Status      string     `json:"status"` // pending | approved | rejected
	Catatan     *string    `json:"catatan,omitempty"`
	SignedAt    *time.Time `json:"signedAt,omitempty"`
}

type Penduduk struct {
	NIK              string    `json:"nik"`
	NoKK             string    `json:"noKk"`
	Nama             string    `json:"nama"`
	TempatLahir      string    `json:"tempatLahir"`
	TanggalLahir     time.Time `json:"tanggalLahir"`
	JenisKelamin     string    `json:"jenisKelamin"` // L | P
	Agama            string    `json:"agama"`
	StatusPerkawinan string    `json:"statusPerkawinan"`
	Pekerjaan        string    `json:"pekerjaan"`
	GolonganDarah    *string   `json:"golonganDarah,omitempty"`
	HubunganKeluarga string    `json:"hubunganKeluarga"`
	Alamat           string    `json:"alamat"`
	RT               string    `json:"rt"`
	RW               string    `json:"rw"`
	Dusun            string    `json:"dusun"`
	IsActive         bool      `json:"isActive"`
}

type FormFieldConfig struct {
	Name        string   `json:"name"`
	Label       string   `json:"label"`
	Type        string   `json:"type"` // text | textarea | date | select | file | number
	Required    bool     `json:"required"`
	Placeholder string   `json:"placeholder,omitempty"`
	Options     []string `json:"options,omitempty"`
}

type JenisSurat struct {
	Kode             string               `json:"kode"`
	Kategori         string               `json:"kategori"`
	Nama             string               `json:"nama"`
	Deskripsi        string               `json:"deskripsi"`
	Persyaratan      []string             `json:"persyaratan"`
	FormFields       []FormFieldConfig    `json:"formFields"`
	TemplateHTML     *string              `json:"templateHtml,omitempty"`
	WorkflowConfig   []WorkflowStepConfig `json:"workflowConfig,omitempty"`
	NomorSuratFormat string               `json:"nomorSuratFormat"`
	EstimasiHari     int                  `json:"estimasiHari"`
	Ikon             string               `json:"ikon"`
	IsActive         bool                 `json:"aktif"`
}

type LampiranFile struct {
	ID          string `json:"id"`
	Nama        string `json:"nama"`
	URL         string `json:"url"`
	UkuranBytes int    `json:"ukuran"`
	MimeType    string `json:"tipe"`
}

type DokumenHasilSurat struct {
	Nama            string    `json:"nama"`
	URL             string    `json:"url"`
	DiterbitkanPada time.Time `json:"diterbitkanPada"`
	NomorSurat      string    `json:"nomorSurat"`
	DiterbitkanOleh string    `json:"diterbitkanOleh"`
}

type RiwayatStatus struct {
	Status  StatusPengajuan `json:"status"`
	Waktu   time.Time       `json:"waktu"`
	Oleh    *string         `json:"oleh,omitempty"`
	Catatan *string         `json:"catatan,omitempty"`
}

type PengajuanSurat struct {
	ID                 string             `json:"id"`
	NomorResi          string             `json:"nomorResi"`
	NomorSuratResmi    *string            `json:"nomorSuratResmi,omitempty"`
	JenisSuratKode     string             `json:"jenisSuratKode"`
	JenisSuratNama     string             `json:"jenisSuratNama"`
	PemohonID          string             `json:"pemohonId"`
	PemohonNama        string             `json:"pemohonNama"`
	SubjekNIK          *string            `json:"subjekNik,omitempty"`
	Data               map[string]string  `json:"data"`
	DataSnapshot       map[string]any     `json:"dataSnapshot,omitempty"`
	Lampiran           []LampiranFile     `json:"lampiran"`
	Status             StatusPengajuan    `json:"status"`
	CurrentStep        int                `json:"currentStep"`
	CatatanAdmin       *string            `json:"catatanAdmin,omitempty"`
	FilePDFURL         *string            `json:"filePdfUrl,omitempty"`
	QRVerificationCode *string            `json:"qrVerificationCode,omitempty"`
	DokumenHasil       *DokumenHasilSurat `json:"dokumenHasil,omitempty"`
	Riwayat            []RiwayatStatus    `json:"riwayatStatus"`
	ApprovalSteps      []ApprovalStep     `json:"approvalSteps,omitempty"`
	CreatedAt          time.Time          `json:"createdAt"`
	UpdatedAt          time.Time          `json:"updatedAt"`
}

// MarshalData serializes the form data map to its JSON column representation.
func (p *PengajuanSurat) MarshalData() ([]byte, error) { return json.Marshal(p.Data) }

// UnmarshalData decodes a JSON column into the data map.
func (p *PengajuanSurat) UnmarshalData(raw []byte) error { return json.Unmarshal(raw, &p.Data) }

// Lampiran is the stored row in pengajuan_lampiran (kept for reference).
type Lampiran struct {
	ID, PengajuanID, NamaFile, URL, MimeType string
	UkuranBytes                              int
}
