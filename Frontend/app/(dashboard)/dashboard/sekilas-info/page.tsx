'use client';

import React, { useEffect, useState } from 'react';
import {
  createSekilasInfoAdmin,
  deleteSekilasInfoAdmin,
  getSekilasInfoAdmin,
  updateSekilasInfoAdmin,
} from '@/lib/services/sekilas_info.service';
import type { SekilasInfo } from '@/types/sekilas_info';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatTanggal } from '@/lib/utils/format';
import { useToastStore } from '@/store/toastStore';
import { Plus, Edit, Trash2, Save, Megaphone } from 'lucide-react';

export default function DashboardSekilasInfoPage() {
  const [list, setList] = useState<SekilasInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SekilasInfo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    konten: '',
    aktif: true,
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getSekilasInfoAdmin();
      setList([...data]);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ konten: '', aktif: true });
    setModalOpen(true);
  };

  const openEdit = (item: SekilasInfo) => {
    setEditingId(item.id);
    setForm({ konten: item.konten, aktif: item.aktif });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.konten.trim()) {
      showError('Konten sekilas info tidak boleh kosong.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateSekilasInfoAdmin(editingId, form);
        showSuccess('Sekilas info berhasil diperbarui!');
      } else {
        await createSekilasInfoAdmin(form);
        showSuccess('Sekilas info baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menyimpan sekilas info.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSekilasInfoAdmin(deleteTarget.id);
      showSuccess('Sekilas info berhasil dihapus.');
      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menghapus sekilas info.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Kelola Sekilas Info</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Informasi cepat yang tampil di ticker setelah hero selection. Hanya info dengan status Aktif yang akan ditampilkan di situs publik.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Tambah Sekilas Info
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : list.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">
          Belum ada sekilas info. Klik &quot;Tambah Sekilas Info&quot; untuk menambahkan.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map((item) => (
            <Card
              key={item.id}
              className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Megaphone className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white text-sm line-clamp-2 break-words">
                    {item.konten}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-[11px] text-neutral-500">
                    <span>{formatTanggal(item.created_at)}</span>
                    <Badge variant={item.aktif ? 'success' : 'secondary'} size="sm">
                      {item.aktif ? 'Aktif' : 'Non-aktif'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> Ubah
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
                  <Trash2 className="w-4 h-4 text-rose-500" /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Ubah Sekilas Info' : 'Tambah Sekilas Info Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Textarea
            label="Konten (maks. 500 karakter)"
            value={form.konten}
            onChange={(e) => setForm({ ...form, konten: e.target.value.slice(0, 500) })}
            rows={3}
            required
            placeholder="Masukkan teks informasi singkat yang akan tampil di ticker..."
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
              />
              <span>Aktifkan (akan tampil di situs publik)</span>
            </label>
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan Sekilas Info'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Sekilas Info"
        message={
          <>
            Yakin ingin menghapus sekilas info <strong>&quot;{deleteTarget?.konten.slice(0, 60)}...&quot;</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </>
        }
        isLoading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
