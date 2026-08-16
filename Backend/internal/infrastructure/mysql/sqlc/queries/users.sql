-- name: CreateUser :exec
INSERT INTO users (id,nama,email,password_hash,nik,telepon,alamat,role) VALUES (?,?,?,?,?,?,?,?);
-- name: GetUserByEmail :one
SELECT id,nama,email,password_hash,nik,telepon,alamat,role,avatar_url,is_active,created_at,updated_at FROM users WHERE email=? LIMIT 1;
-- name: GetUserByID :one
SELECT id,nama,email,password_hash,nik,telepon,alamat,role,avatar_url,is_active,created_at,updated_at FROM users WHERE id=? LIMIT 1;
