package mysql

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"
	"time"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/usecase/berita"
)

type BeritaRepo struct{ db *sql.DB }

func NewBeritaRepo(db *sql.DB) *BeritaRepo { return &BeritaRepo{db: db} }

const beritaCols = "b.id,b.slug,b.judul,b.ringkasan,b.konten,b.kategori,b.gambar_sampul,COALESCE(u.nama,'Admin Desa Borong'),b.tags,b.status,b.tanggal_terbit,b.dibaca,b.created_at,b.updated_at"

func scanBerita(s rowScanner) (domain.Berita, error) {
	var b domain.Berita
	var tags, status string
	var penulisID sql.NullString
	var tanggal sql.NullTime
	var created, updated time.Time
	if err := s.Scan(&b.ID, &b.Slug, &b.Judul, &b.Ringkasan, &b.Konten, &b.Kategori, &b.GambarSampul, &b.Penulis, &tags, &status, &tanggal, &b.Dibaca, &created, &updated); err != nil {
		return b, err
	}
	if penulisID.Valid {
		b.PenulisID = &penulisID.String
	}
	if tanggal.Valid {
		b.TanggalTerbit = &tanggal.Time
	}
	b.Status = domain.BeritaStatus(status)
	_ = json.Unmarshal([]byte(tags), &b.Tags)
	b.CreatedAt, b.UpdatedAt = created, updated
	if b.Tags == nil {
		b.Tags = []string{}
	}
	return b, nil
}

func (r *BeritaRepo) List(ctx context.Context, f berita.ListFilter) ([]domain.Berita, int, error) {
	where := []string{"1=1"}
	args := []any{}
	if !f.IncludeDraft {
		where = append(where, "b.status='terbit'")
	}
	if f.Kategori != "" {
		where = append(where, "b.kategori = ?")
		args = append(args, f.Kategori)
	}
	if s := strings.TrimSpace(f.Search); s != "" {
		where = append(where, "(b.judul LIKE ? OR b.ringkasan LIKE ? OR b.tags LIKE ?)")
		args = append(args, "%"+s+"%", "%"+s+"%", "%"+s+"%")
	}
	whereSQL := " WHERE " + strings.Join(where, " AND ")

	var total int
	if err := q(ctx, r.db).QueryRowContext(ctx, "SELECT COUNT(*) FROM berita b LEFT JOIN users u ON u.id=b.penulis_id"+whereSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	limit, offset := f.Limit, (f.Page-1)*f.Limit
	rows, err := q(ctx, r.db).QueryContext(ctx,
		"SELECT "+beritaCols+" FROM berita b LEFT JOIN users u ON u.id=b.penulis_id"+whereSQL+" ORDER BY b.tanggal_terbit IS NULL, b.tanggal_terbit DESC LIMIT ? OFFSET ?",
		append(append([]any{}, args...), limit, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()
	out := []domain.Berita{}
	for rows.Next() {
		b, err := scanBerita(rows)
		if err != nil {
			return nil, 0, err
		}
		out = append(out, b)
	}
	return out, total, rows.Err()
}

func (r *BeritaRepo) GetByID(ctx context.Context, id string) (domain.Berita, error) {
	return scanBerita(q(ctx, r.db).QueryRowContext(ctx, "SELECT "+beritaCols+" FROM berita b LEFT JOIN users u ON u.id=b.penulis_id WHERE b.id=?", id))
}

func (r *BeritaRepo) GetBySlug(ctx context.Context, slug string) (domain.Berita, error) {
	return scanBerita(q(ctx, r.db).QueryRowContext(ctx, "SELECT "+beritaCols+" FROM berita b LEFT JOIN users u ON u.id=b.penulis_id WHERE b.slug=?", slug))
}

func (r *BeritaRepo) Create(ctx context.Context, b domain.Berita) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"INSERT INTO berita(id,slug,judul,ringkasan,konten,kategori,gambar_sampul,penulis_id,tags,status,tanggal_terbit,dibaca) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
		b.ID, b.Slug, b.Judul, b.Ringkasan, b.Konten, b.Kategori, b.GambarSampul, b.PenulisID, mustJSON(b.Tags), string(b.Status), b.TanggalTerbit, 0)
	return err
}

func (r *BeritaRepo) Update(ctx context.Context, b domain.Berita) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"UPDATE berita SET slug=?,judul=?,ringkasan=?,konten=?,kategori=?,gambar_sampul=?,tags=?,status=?,tanggal_terbit=?,updated_at=? WHERE id=?",
		b.Slug, b.Judul, b.Ringkasan, b.Konten, b.Kategori, b.GambarSampul, mustJSON(b.Tags), string(b.Status), b.TanggalTerbit, time.Now(), b.ID)
	return err
}

func (r *BeritaRepo) Delete(ctx context.Context, id string) error {
	_, err := q(ctx, r.db).ExecContext(ctx, "DELETE FROM berita WHERE id=?", id)
	return err
}

func (r *BeritaRepo) IncrementRead(ctx context.Context, id string) error {
	_, err := q(ctx, r.db).ExecContext(ctx, "UPDATE berita SET dibaca=dibaca+1 WHERE id=?", id)
	return err
}

func mustJSON(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}
