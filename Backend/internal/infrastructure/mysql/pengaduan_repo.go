package mysql

import (
	"context"
	"database/sql"
	"time"

	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/usecase/pengaduan"
)

type PengaduanRepo struct{ db *sql.DB }

func NewPengaduanRepo(db *sql.DB) *PengaduanRepo { return &PengaduanRepo{db: db} }

const aduanCols = "ad.id,ad.nomor_tiket,ad.pelapor_id,u.nama,ad.kategori,ad.judul,ad.deskripsi,ad.lokasi,ad.status,ad.tanggapan_admin,ad.changed_by,ad.created_at,ad.updated_at"

func scanPengaduan(s rowScanner) (domain.Pengaduan, error) {
	var p domain.Pengaduan
	var status string
	var lokasi, tanggapan, changed sql.NullString
	if err := s.Scan(&p.ID, &p.NomorTiket, &p.PelaporID, &p.PelaporNama, &p.Kategori, &p.Judul, &p.Deskripsi, &lokasi, &status, &tanggapan, &changed, &p.CreatedAt, &p.UpdatedAt); err != nil {
		return p, err
	}
	p.Status = domain.StatusPengaduan(status)
	p.Lokasi = nsPtr(lokasi)
	p.TanggapanAdmin = nsPtr(tanggapan)
	p.ChangedBy = nsPtr(changed)
	return p, nil
}

func nsPtr(n sql.NullString) *string {
	if !n.Valid {
		return nil
	}
	v := n.String
	return &v
}

func (r *PengaduanRepo) Create(ctx context.Context, p domain.Pengaduan) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"INSERT INTO pengaduan(id,nomor_tiket,pelapor_id,kategori,judul,deskripsi,lokasi,status) VALUES(?,?,?,?,?,?,?,?)",
		p.ID, p.NomorTiket, p.PelaporID, p.Kategori, p.Judul, p.Deskripsi, strPtrVal(p.Lokasi), string(p.Status))
	return err
}

func (r *PengaduanRepo) GetByNomorTiket(ctx context.Context, tiket string) (domain.Pengaduan, error) {
	return scanPengaduan(q(ctx, r.db).QueryRowContext(ctx, "SELECT "+aduanCols+" FROM pengaduan ad JOIN users u ON u.id=ad.pelapor_id WHERE ad.nomor_tiket=?", tiket))
}

func (r *PengaduanRepo) GetByID(ctx context.Context, id string) (domain.Pengaduan, error) {
	return scanPengaduan(q(ctx, r.db).QueryRowContext(ctx, "SELECT "+aduanCols+" FROM pengaduan ad JOIN users u ON u.id=ad.pelapor_id WHERE ad.id=?", id))
}

func (r *PengaduanRepo) ListByPelapor(ctx context.Context, pelaporID string) ([]domain.Pengaduan, error) {
	return r.scanList(ctx, "SELECT "+aduanCols+" FROM pengaduan ad JOIN users u ON u.id=ad.pelapor_id WHERE ad.pelapor_id=? ORDER BY ad.created_at DESC", pelaporID)
}

func (r *PengaduanRepo) ListAll(ctx context.Context, status string) ([]domain.Pengaduan, error) {
	if status != "" {
		return r.scanList(ctx, "SELECT "+aduanCols+" FROM pengaduan ad JOIN users u ON u.id=ad.pelapor_id WHERE ad.status=? ORDER BY ad.created_at DESC", status)
	}
	return r.scanList(ctx, "SELECT "+aduanCols+" FROM pengaduan ad JOIN users u ON u.id=ad.pelapor_id ORDER BY ad.created_at DESC")
}

func (r *PengaduanRepo) scanList(ctx context.Context, qy string, args ...any) ([]domain.Pengaduan, error) {
	rows, err := q(ctx, r.db).QueryContext(ctx, qy, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.Pengaduan{}
	for rows.Next() {
		p, err := scanPengaduan(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

func (r *PengaduanRepo) Update(ctx context.Context, p domain.Pengaduan) error {
	_, err := q(ctx, r.db).ExecContext(ctx,
		"UPDATE pengaduan SET status=?,tanggapan_admin=?,changed_by=?,updated_at=? WHERE id=?",
		string(p.Status), strPtrVal(p.TanggapanAdmin), strPtrVal(p.ChangedBy), time.Now(), p.ID)
	return err
}

var _ pengaduan.Repository = (*PengaduanRepo)(nil)
