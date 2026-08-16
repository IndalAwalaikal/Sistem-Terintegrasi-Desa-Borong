package domain

import "time"

// Status transaksi pencatatan pajak. Mengikuti alur:
//
//	tercatat → diverifikasi → disetor → dikonfirmasi_bpd
//	tercatat/diverifikasi → dibatalkan
type StatusTransaksiPajak string

const (
	StatusPajakTercatat     StatusTransaksiPajak = "tercatat"
	StatusPajakDiverifikasi StatusTransaksiPajak = "diverifikasi"
	StatusPajakDisetor      StatusTransaksiPajak = "disetor"
	StatusPajakDikonfirmasi StatusTransaksiPajak = "dikonfirmasi_bpd"
	StatusPajakDibatalkan   StatusTransaksiPajak = "dibatalkan"
)

func (s StatusTransaksiPajak) Valid() bool {
	switch s {
	case StatusPajakTercatat, StatusPajakDiverifikasi, StatusPajakDisetor, StatusPajakDikonfirmasi, StatusPajakDibatalkan:
		return true
	}
	return false
}

// LegalNext melaporkan status yang legal dari status saat ini (state machine
// ketat; koreksi dilakukan lewat pembatalan + pencatatan baru).
func (s StatusTransaksiPajak) LegalNext() []StatusTransaksiPajak {
	switch s {
	case StatusPajakTercatat:
		return []StatusTransaksiPajak{StatusPajakDiverifikasi, StatusPajakDibatalkan}
	case StatusPajakDiverifikasi:
		return []StatusTransaksiPajak{StatusPajakDisetor, StatusPajakDibatalkan}
	case StatusPajakDisetor:
		return []StatusTransaksiPajak{StatusPajakDikonfirmasi}
	default:
		return nil
	}
}

func (s StatusTransaksiPajak) CanTo(next StatusTransaksiPajak) bool {
	for _, n := range s.LegalNext() {
		if n == next {
			return true
		}
	}
	return false
}

type StatusSetoranPajak string

const (
	StatusSetoranDisetor      StatusSetoranPajak = "disetor"
	StatusSetoranDikonfirmasi StatusSetoranPajak = "dikonfirmasi"
)

func (s StatusSetoranPajak) Valid() bool {
	return s == StatusSetoranDisetor || s == StatusSetoranDikonfirmasi
}
func (s StatusSetoranPajak) LegalNext() []StatusSetoranPajak {
	if s == StatusSetoranDisetor {
		return []StatusSetoranPajak{StatusSetoranDikonfirmasi}
	}
	return nil
}

// JenisPajak adalah master jenis pajak/retribusi yang dikelola desa.
type JenisPajak struct {
	ID        string    `json:"id"`
	Kode      string    `json:"kode"`
	Nama      string    `json:"nama"`
	Kategori  string    `json:"kategori"`
	Satuan    string    `json:"satuan,omitempty"`
	Periode   string    `json:"periode"`
	Aktif     bool      `json:"aktif"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

// WajibPajak adalah data obyek/warga yang membayar (boleh tanpa akun).
type WajibPajak struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId,omitempty"`
	NoObjek   string    `json:"noObjek"`
	Nama      string    `json:"nama"`
	NIK       string    `json:"nik,omitempty"`
	Alamat    string    `json:"alamat"`
	RT        string    `json:"rt"`
	RW        string    `json:"rw"`
	Dusun     string    `json:"dusun"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

// TransaksiPajak adalah satu pencatatan pembayaran pajak/retribusi.
type TransaksiPajak struct {
	ID             string               `json:"id"`
	NomorBukti     string               `json:"nomorBukti"`
	JenisPajakID   string               `json:"jenisPajakId"`
	JenisPajakKode string               `json:"jenisPajakKode"`
	JenisPajakNama string               `json:"jenisPajakNama"`
	WajibPajakID   string               `json:"wajibPajakId"`
	NoObjek        string               `json:"noObjek"`
	WajibPajakNama string               `json:"wajibPajakNama"`
	NIK            string               `json:"nik,omitempty"`
	Dusun          string               `json:"dusun"`
	Tahun          int                  `json:"tahun"`
	Periode        string               `json:"periode"`
	Nominal        float64              `json:"nominal"`
	TanggalBayar   time.Time            `json:"tanggalBayar"`
	Status         StatusTransaksiPajak `json:"status"`
	Catatan        string               `json:"catatan,omitempty"`
	CatatanBatal   string               `json:"catatanBatal,omitempty"`
	PencatatID     string               `json:"pencatatId,omitempty"`
	VerifikatorID  string               `json:"verifikatorId,omitempty"`
	TglVerifikasi  *time.Time           `json:"tglVerifikasi,omitempty"`
	SetoranID      string               `json:"setoranId,omitempty"`
	SetoranNomor   string               `json:"setoranNomor,omitempty"`
	CreatedAt      time.Time            `json:"createdAt"`
	UpdatedAt      time.Time            `json:"updatedAt"`
}

// SetoranPajak adalah batch penyetoran transaksi pajak ke BPD/pihak terkait.
type SetoranPajak struct {
	ID                   string             `json:"id"`
	NomorSetoran         string             `json:"nomorSetoran"`
	Tujuan               string             `json:"tujuan"`
	TanggalSetor         time.Time          `json:"tanggalSetor"`
	TotalSetor           float64            `json:"totalSetor"`
	Status               StatusSetoranPajak `json:"status"`
	DisetorOleh          string             `json:"disetorOleh"`
	DiterimaOleh         string             `json:"diterimaOleh,omitempty"`
	NomorBuktiPenerimaan string             `json:"nomorBuktiPenerimaan,omitempty"`
	TglKonfirmasi        *time.Time         `json:"tglKonfirmasi,omitempty"`
	URLBukti             string             `json:"urlBukti,omitempty"`
	Catatan              string             `json:"catatan,omitempty"`
	JumlahTransaksi      int                `json:"jumlahTransaksi"`
	CreatedAt            time.Time          `json:"createdAt"`
	UpdatedAt            time.Time          `json:"updatedAt"`
}

// AuditLogPajak mencatat setiap perubahan (append-only) untuk transparansi.
type AuditLogPajak struct {
	ID         string    `json:"id"`
	RefTipe    string    `json:"refTipe"` // TRANSAKSI | SETORAN
	RefID      string    `json:"refId"`
	Perubahan  string    `json:"perubahan"` // BUAT | VERIFIKASI | SETOR | KONFIRMASI | BATAL
	StatusLama string    `json:"statusLama"`
	StatusBaru string    `json:"statusBaru"`
	Catatan    string    `json:"catatan,omitempty"`
	UserID     string    `json:"userId,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// RingkasanPajak adalah agregat yang ditampilkan publik/admin.
type RingkasanPajak struct {
	Tahun                int                 `json:"tahun"`
	JumlahWajib          int                 `json:"jumlahWajib"`
	TotalTercatat        float64             `json:"totalTercatat"`
	TotalDiverifikasi    float64             `json:"totalDiverifikasi"`
	TotalDisetor         float64             `json:"totalDisetor"`
	TotalDikonfirmasiBPD float64             `json:"totalDikonfirmasiBpd"`
	TotalDibatalkan      float64             `json:"totalDibatalkan"`
	SisaBelumDisetor     float64             `json:"sisaBelumDisetor"`
	TotalSetoran         float64             `json:"totalSetoran"`
	PerJenis             []RingkasanPerJenis `json:"perJenis"`
	PerBulan             []RingkasanPerBulan `json:"perBulan"`
}

type RingkasanPerJenis struct {
	JenisPajakID    string  `json:"jenisPajakId"`
	Kode            string  `json:"kode"`
	Nama            string  `json:"nama"`
	JumlahTransaksi int     `json:"jumlahTransaksi"`
	Total           float64 `json:"total"`
	Disetorkan      float64 `json:"disetorkan"`
	Sisa            float64 `json:"sisa"`
}

type RingkasanPerBulan struct {
	Bulan           int     `json:"bulan"`
	Total           float64 `json:"total"`
	JumlahTransaksi int     `json:"jumlahTransaksi"`
}
