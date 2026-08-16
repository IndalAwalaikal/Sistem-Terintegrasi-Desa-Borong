package mysql

import (
	"context"
	"database/sql"

	"desa-borong-api/internal/domain"
	ucuser "desa-borong-api/internal/usecase/user"
)

type AdminUserRepo struct{ db *sql.DB }

func NewAdminUserRepo(db *sql.DB) *AdminUserRepo { return &AdminUserRepo{db: db} }

func (r *AdminUserRepo) ListAll(ctx context.Context) ([]domain.User, error) {
	rows, err := q(ctx, r.db).QueryContext(ctx, "SELECT "+userCols+" FROM users ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.User{}
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

func (r *AdminUserRepo) GetByID(ctx context.Context, id string) (domain.User, error) {
	return scanUser(q(ctx, r.db).QueryRowContext(ctx, "SELECT "+userCols+" FROM users WHERE id=?", id))
}

func (r *AdminUserRepo) UpdateRole(ctx context.Context, id string, role domain.Role, isActive bool) error {
	_, err := q(ctx, r.db).ExecContext(ctx, "UPDATE users SET role=?,is_active=? WHERE id=?", string(role), isActive, id)
	return err
}

var _ ucuser.Repository = (*AdminUserRepo)(nil)
