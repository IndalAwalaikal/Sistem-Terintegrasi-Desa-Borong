package berita

import (
	"context"
	"strings"
	"time"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/pkg/apputil"
)

type Service struct{ repo Repository }

func NewService(repo Repository) *Service { return &Service{repo: repo} }

// List returns a paginated berita list. For public calls only published items
// are returned unless IncludeDraft is set.
func (s *Service) List(ctx context.Context, f ListFilter) (items []domain.Berita, total int) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.Limit < 1 {
		f.Limit = 10
	}
	if f.Limit > 100 {
		f.Limit = 100
	}
	items, total, _ = s.repo.List(ctx, f)
	return items, total
}

func (s *Service) GetByID(ctx context.Context, id string) (domain.Berita, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *Service) GetBySlug(ctx context.Context, slug string) (domain.Berita, error) {
	b, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return b, err
	}
	if b.Status != domain.BeritaTerbit {
		return domain.Berita{}, domain.ErrNotFound
	}
	_ = s.repo.IncrementRead(ctx, b.ID)
	return b, nil
}

// GetBySlugNoCount returns a berita without incrementing the read counter (used
// by related/other reads).
func (s *Service) GetBySlugNoCount(ctx context.Context, slug string) (domain.Berita, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *Service) Create(ctx context.Context, b domain.Berita, authorID *string) (domain.Berita, error) {
	b.ID = apputil.NewID()
	b.Slug = apputil.Slug(b.Judul) + "-" + strings.ToLower(uidTail())
	b.PenulisID = authorID
	if b.Tags == nil {
		b.Tags = []string{}
	}
	if b.Status == "" {
		b.Status = domain.BeritaTerbit
	}
	if b.Status != domain.BeritaDraft && b.Status != domain.BeritaTerbit {
		return b, domain.ErrValidation
	}
	if b.Status == domain.BeritaTerbit {
		now := time.Now()
		b.TanggalTerbit = &now
	}
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	if err := s.repo.Create(ctx, b); err != nil {
		return b, err
	}
	return b, nil
}

func (s *Service) Update(ctx context.Context, id string, b domain.Berita) (domain.Berita, error) {
	cur, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return cur, err
	}
	if b.Judul != "" {
		cur.Judul = b.Judul
		cur.Slug = apputil.Slug(b.Judul) + "-" + strings.ToLower(cur.ID[len(cur.ID)-4:])
	}
	if b.Ringkasan != "" {
		cur.Ringkasan = b.Ringkasan
	}
	if b.Konten != "" {
		cur.Konten = b.Konten
	}
	if b.Kategori != "" {
		cur.Kategori = b.Kategori
	}
	if b.GambarSampul != "" {
		cur.GambarSampul = b.GambarSampul
	}
	if b.Tags != nil {
		cur.Tags = b.Tags
	}
	if b.Status != "" && b.Status != cur.Status {
		if b.Status != domain.BeritaDraft && b.Status != domain.BeritaTerbit {
			return cur, domain.ErrValidation
		}
		cur.Status = b.Status
		if b.Status == domain.BeritaTerbit && cur.TanggalTerbit == nil {
			now := time.Now()
			cur.TanggalTerbit = &now
		}
	}
	cur.UpdatedAt = time.Now()
	if err := s.repo.Update(ctx, cur); err != nil {
		return cur, err
	}
	return cur, nil
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func uidTail() string { return time.Now().Format("150405") }
