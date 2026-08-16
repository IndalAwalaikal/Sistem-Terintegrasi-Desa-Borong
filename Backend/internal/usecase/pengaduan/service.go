package pengaduan

import (
	"context"
	"strings"
	"time"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/pkg/apputil"
)

type Service struct{ repo Repository }

func NewService(repo Repository) *Service { return &Service{repo: repo} }

func (s *Service) Submit(ctx context.Context, pelapor domain.User, kategori, judul, deskripsi, lokasi string) (domain.Pengaduan, error) {
	p := domain.Pengaduan{
		ID:         apputil.NewID(),
		NomorTiket: apputil.Tiket(),
		PelaporID:  pelapor.ID,
		Kategori:   kategori,
		Judul:      judul,
		Deskripsi:  deskripsi,
		Status:     domain.PengaduanDiterima,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	if v := strings.TrimSpace(lokasi); v != "" {
		p.Lokasi = &v
	}
	if err := s.repo.Create(ctx, p); err != nil {
		return p, err
	}
	return p, nil
}

func (s *Service) GetByTiket(ctx context.Context, tiket string) (domain.Pengaduan, error) {
	return s.repo.GetByNomorTiket(ctx, strings.ToUpper(strings.TrimSpace(tiket)))
}

func (s *Service) ListByPelapor(ctx context.Context, pelaporID string) ([]domain.Pengaduan, error) {
	return s.repo.ListByPelapor(ctx, pelaporID)
}

func (s *Service) ListAll(ctx context.Context, status string) ([]domain.Pengaduan, error) {
	return s.repo.ListAll(ctx, strings.TrimSpace(status))
}

func (s *Service) Respond(ctx context.Context, id string, status domain.StatusPengaduan, tanggapan string, changedBy *string) (domain.Pengaduan, error) {
	cur, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return cur, err
	}
	cur.Status = status
	cur.ChangedBy = changedBy
	if v := strings.TrimSpace(tanggapan); v != "" {
		cur.TanggapanAdmin = &v
	}
	cur.UpdatedAt = time.Now()
	if err := s.repo.Update(ctx, cur); err != nil {
		return cur, err
	}
	return cur, nil
}
