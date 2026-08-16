package user

import (
	"context"

	"desa-borong-api/internal/domain"
)

type Service struct{ repo Repository }

func NewService(repo Repository) *Service { return &Service{repo: repo} }

func (s *Service) ListAll(ctx context.Context) ([]domain.User, error) {
	return s.repo.ListAll(ctx)
}

func (s *Service) GetByID(ctx context.Context, id string) (domain.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *Service) UpdateRole(ctx context.Context, id string, role domain.Role, isActive bool) (domain.User, error) {
	if err := s.repo.UpdateRole(ctx, id, role, isActive); err != nil {
		return domain.User{}, err
	}
	return s.repo.GetByID(ctx, id)
}
