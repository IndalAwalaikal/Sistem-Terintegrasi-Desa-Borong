-- name: CreatePengajuan :exec
INSERT INTO pengajuan_surat (id,nomor_resi,jenis_surat_kode,pemohon_id,data_isian,status) VALUES (?,?,?,?,?,?);
-- name: AddPengajuanHistory :exec
INSERT INTO pengajuan_riwayat_status (id,pengajuan_id,status,catatan,changed_by) VALUES (?,?,?,?,?);
-- name: UpdatePengajuanStatus :exec
UPDATE pengajuan_surat SET status=?,catatan_admin=? WHERE id=?;
