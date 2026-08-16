package galeri

import (
	"context"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/pkg/apputil"
)

type Service struct{ repo Repository }

func NewService(repo Repository) *Service { return &Service{repo: repo} }

func (s *Service) List(ctx context.Context) ([]domain.GaleriAlbum, error) {
	return s.repo.List(ctx)
}

func (s *Service) GetByID(ctx context.Context, id string) (domain.GaleriAlbum, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *Service) Create(ctx context.Context, album domain.GaleriAlbum) (domain.GaleriAlbum, error) {
	album.ID = apputil.NewID()
	for i := range album.Fotos {
		if album.Fotos[i].ID == "" {
			album.Fotos[i].ID = apputil.NewID()
		}
	}
	if err := s.repo.Create(ctx, album); err != nil {
		return album, err
	}
	return album, nil
}

func (s *Service) Update(ctx context.Context, id string, album domain.GaleriAlbum) (domain.GaleriAlbum, error) {
	cur, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return cur, err
	}
	if album.Judul != "" {
		cur.Judul = album.Judul
	}
	if album.Deskripsi != "" {
		cur.Deskripsi = album.Deskripsi
	}
	if album.Tanggal != "" {
		cur.Tanggal = album.Tanggal
	}
	cur.Kategori = album.Kategori
	if album.CoverFoto != "" {
		cur.CoverFoto = album.CoverFoto
	}
	if album.Fotos != nil {
		for i := range album.Fotos {
			if album.Fotos[i].ID == "" {
				album.Fotos[i].ID = apputil.NewID()
			}
		}
		cur.Fotos = album.Fotos
	}
	if err := s.repo.Update(ctx, cur); err != nil {
		return cur, err
	}
	return cur, nil
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
