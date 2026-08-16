package domain

import "time"

type StatusPengaduan string

const (
	PengaduanDiterima        StatusPengaduan = "diterima"
	PengaduanDitindaklanjuti StatusPengaduan = "ditindaklanjuti"
	PengaduanSelesai         StatusPengaduan = "selesai"
)

type Pengaduan struct {
	ID, NomorTiket, PelaporID, Kategori, Judul, Deskripsi string
	Lokasi                                                *string
	Status                                                StatusPengaduan
	TanggapanAdmin                                        *string
	ChangedBy                                             *string
	PelaporNama                                           string
	CreatedAt, UpdatedAt                                  time.Time
}
