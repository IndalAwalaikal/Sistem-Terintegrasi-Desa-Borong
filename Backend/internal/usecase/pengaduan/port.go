// Package pengaduan implements the complaint use cases.
package pengaduan

import (
	"context"

	"desa-borong-api/internal/domain"
)

// Repository persists complaints.
type Repository interface {
	Create(ctx context.Context, p domain.Pengaduan) error
	GetByNomorTiket(ctx context.Context, tiket string) (domain.Pengaduan, error)
	GetByID(ctx context.Context, id string) (domain.Pengaduan, error)
	ListByPelapor(ctx context.Context, pelaporID string) ([]domain.Pengaduan, error)
	ListAll(ctx context.Context, status string) ([]domain.Pengaduan, error)
	Update(ctx context.Context, p domain.Pengaduan) error
}
