// Package user implements admin user-management use cases (role, status).
package user

import (
	"context"

	"desa-borong-api/internal/domain"
)

// Repository exposes user records for administration.
type Repository interface {
	ListAll(ctx context.Context) ([]domain.User, error)
	GetByID(ctx context.Context, id string) (domain.User, error)
	UpdateRole(ctx context.Context, id string, role domain.Role, isActive bool) error
}
