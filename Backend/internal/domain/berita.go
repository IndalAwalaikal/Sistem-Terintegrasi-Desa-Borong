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
	GambarTengah                       string // opsional — tampil di tengah artikel
	PenulisID                          *string
	Penulis                            string
	Tags                               []string
	Status                             BeritaStatus
	TanggalTerbit                      *time.Time
	Dibaca                             int
	CreatedAt, UpdatedAt               time.Time
}

// BeritaKomentar adalah komentar publik pada sebuah artikel berita.
type BeritaKomentar struct {
	ID        string
	BeritaID  string
	UserID    *string
	Nama      string
	Konten    string
	CreatedAt time.Time
}
