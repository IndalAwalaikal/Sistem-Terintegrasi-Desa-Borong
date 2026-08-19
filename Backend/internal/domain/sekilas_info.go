package domain

import "time"

type SekilasInfo struct {
	ID        string    `json:"id"`
	Konten    string    `json:"konten"`
	Aktif     bool      `json:"aktif"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
