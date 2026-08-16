package mysql

import (
	"context"
	"database/sql"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/usecase/galeri"
)

type GaleriRepo struct{ db *sql.DB }

func NewGaleriRepo(db *sql.DB) *GaleriRepo { return &GaleriRepo{db: db} }

func scanAlbum(s rowScanner) (domain.GaleriAlbum, error) {
	var a domain.GaleriAlbum
	var kategori sql.NullString
	if err := s.Scan(&a.ID, &a.Judul, &a.Deskripsi, &a.Tanggal, &kategori, &a.CoverFoto); err != nil {
		return a, err
	}
	a.Kategori = nsPtr(kategori)
	return a, nil
}

func (r *GaleriRepo) List(ctx context.Context) ([]domain.GaleriAlbum, error) {
	rows, err := q(ctx, r.db).QueryContext(ctx,
		"SELECT id,judul,deskripsi,DATE_FORMAT(tanggal,'%Y-%m-%d'),kategori,cover_foto FROM galeri_album ORDER BY tanggal DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.GaleriAlbum{}
	for rows.Next() {
		a, err := scanAlbum(rows)
		if err != nil {
			return nil, err
		}
		photos, err := r.fotos(ctx, a.ID)
		if err != nil {
			return nil, err
		}
		a.Fotos = photos
		out = append(out, a)
	}
	return out, rows.Err()
}

func (r *GaleriRepo) GetByID(ctx context.Context, id string) (domain.GaleriAlbum, error) {
	a, err := scanAlbum(q(ctx, r.db).QueryRowContext(ctx,
		"SELECT id,judul,deskripsi,DATE_FORMAT(tanggal,'%Y-%m-%d'),kategori,cover_foto FROM galeri_album WHERE id=?", id))
	if err != nil {
		if err == sql.ErrNoRows {
			return a, domain.ErrNotFound
		}
		return a, err
	}
	fotos, err := r.fotos(ctx, id)
	if err != nil {
		return a, err
	}
	a.Fotos = fotos
	return a, nil
}

func (r *GaleriRepo) fotos(ctx context.Context, albumID string) ([]domain.GaleriFoto, error) {
	rows, err := q(ctx, r.db).QueryContext(ctx,
		"SELECT id,url,caption,DATE_FORMAT(tanggal,'%Y-%m-%d') FROM galeri_item WHERE album_id=? ORDER BY tanggal", albumID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.GaleriFoto{}
	for rows.Next() {
		var f domain.GaleriFoto
		if err := rows.Scan(&f.ID, &f.URL, &f.Caption, &f.Tanggal); err != nil {
			return nil, err
		}
		out = append(out, f)
	}
	return out, rows.Err()
}

func (r *GaleriRepo) Create(ctx context.Context, album domain.GaleriAlbum) error {
	return r.save(ctx, album)
}

func (r *GaleriRepo) Update(ctx context.Context, album domain.GaleriAlbum) error {
	return r.save(ctx, album)
}

func (r *GaleriRepo) save(ctx context.Context, album domain.GaleriAlbum) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx,
		"INSERT INTO galeri_album(id,judul,deskripsi,tanggal,kategori,cover_foto) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE judul=VALUES(judul),deskripsi=VALUES(deskripsi),tanggal=VALUES(tanggal),kategori=VALUES(kategori),cover_foto=VALUES(cover_foto)",
		album.ID, album.Judul, album.Deskripsi, album.Tanggal, strPtrVal(album.Kategori), album.CoverFoto); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, "DELETE FROM galeri_item WHERE album_id=?", album.ID); err != nil {
		return err
	}
	for _, f := range album.Fotos {
		if _, err := tx.ExecContext(ctx,
			"INSERT INTO galeri_item(id,album_id,url,caption,tanggal) VALUES(?,?,?,?,?)",
			f.ID, album.ID, f.URL, f.Caption, f.Tanggal); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (r *GaleriRepo) Delete(ctx context.Context, id string) error {
	_, err := q(ctx, r.db).ExecContext(ctx, "DELETE FROM galeri_album WHERE id=?", id)
	return err
}

var _ galeri.Repository = (*GaleriRepo)(nil)
