package domain

import "time"

type BeritaStatus string

const (
	BeritaDraft  BeritaStatus = "draft"
	BeritaTerbit BeritaStatus = "terbit"
)

type Berita struct {
	ID, Slug, Judul, Ringkasan, Konten string
	Kategori                           string
	GambarSampul                       string
	PenulisID                          *string
	Penulis                            string
	Tags                               []string
	Status                             BeritaStatus
	TanggalTerbit                      *time.Time
	Dibaca                             int
	CreatedAt, UpdatedAt               time.Time
}
