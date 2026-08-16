// Package galeri implements galeri album use cases.
package galeri

import (
	"context"

	"desa-borong-api/internal/domain"
)

// Repository persists galeri albums and their photos.
type Repository interface {
	List(ctx context.Context) ([]domain.GaleriAlbum, error)
	GetByID(ctx context.Context, id string) (domain.GaleriAlbum, error)
	Create(ctx context.Context, album domain.GaleriAlbum) error
	Update(ctx context.Context, album domain.GaleriAlbum) error
	Delete(ctx context.Context, id string) error
}
