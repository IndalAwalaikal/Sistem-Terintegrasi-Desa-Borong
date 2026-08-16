// Package mysql implements all infrastructure repositories backed by a MySQL
// connection, following the repository/port interfaces defined in the usecase
// layer (Clean Architecture dependency inversion).
package mysql

import (
	"context"
	"database/sql"
)

// Queryer is the subset of *sql.DB / *sql.Tx used by repositories.
type Queryer interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...any) *sql.Row
}

type txKeyType struct{}

var txKey txKeyType

// q returns the current transaction (if the request is inside one) or the
// default *sql.DB, so every repository read/write becomes transaction-aware.
func q(ctx context.Context, db *sql.DB) Queryer {
	if tx, ok := ctx.Value(txKeyType{}).(*sql.Tx); ok && tx != nil {
		return tx
	}
	return db
}

// Tx runs use cases inside a database transaction.
type Tx struct{ db *sql.DB }

func NewTx(db *sql.DB) *Tx { return &Tx{db: db} }

func (t *Tx) WithinTx(ctx context.Context, fn func(context.Context) error) error {
	tx, err := t.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()
	if err := fn(context.WithValue(ctx, txKey, tx)); err != nil {
		return err
	}
	return tx.Commit()
}
