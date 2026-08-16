// Package umkm implements the UMKM directory use cases.
package umkm

import (
	"context"

	"desa-borong-api/internal/domain"
)

// Repository persists UMKM records.
type Repository interface {
	List(ctx context.Context, kategori string) ([]domain.Umkm, error)
	GetBySlug(ctx context.Context, slug string) (domain.Umkm, error)
	GetByID(ctx context.Context, id string) (domain.Umkm, error)
	Create(ctx context.Context, u domain.Umkm) error
	Update(ctx context.Context, u domain.Umkm) error
	Delete(ctx context.Context, id string) error
}
