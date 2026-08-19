'use client';

import React, { useEffect, useState } from 'react';
import {
  createGaleriAlbumAdmin,
  deleteGaleriAlbumAdmin,
  getGaleriAlbumList,
  updateGaleriAlbumAdmin,
} from '@/lib/services/galeri.service';
import type { GaleriAlbum } from '@/types/galeri';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatTanggal } from '@/lib/utils/format';
import { useToastStore } from '@/store/toastStore';
import { Plus, Edit, Trash2, Save, Calendar } from 'lucide-react';

const KATEGORI_OPTIONS = ['budaya', 'pertanian', 'gotong-royong', 'umum'];

const toFotoLines = (album: GaleriAlbum) =>
  album.fotos
    .map((f) => (f.caption ? `${f.url}|${f.caption}` : f.url))
    .join('\n');

function parseFotoLines(text: string): { url: string; caption: string }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf('|');
      if (idx === -1) return { url: line, caption: '' };
      return { url: line.slice(0, idx).trim(), caption: line.slice(idx + 1).trim() };
    });
}

export default function DashboardGaleriPage() {
  const [albums, setAlbums] = useState<GaleriAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
    tanggal: '',
    coverFoto: '',
    fotos: '',
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getGaleriAlbumList();
      setAlbums([...data]);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ judul: '', deskripsi: '', kategori: 'umum', tanggal: new Date().toISOString().slice(0, 10), coverFoto: '', fotos: '' });
    setModalOpen(true);
  };

  const openEdit = (album: GaleriAlbum) => {
    setEditingId(album.id);
    setForm({
      judul: album.judul,
      deskripsi: album.deskripsi,
      kategori: album.kategori || 'umum',
      tanggal: album.tanggal ? album.tanggal.slice(0, 10) : '',
      coverFoto: album.coverFoto,
      fotos: toFotoLines(album),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul.trim()) return;
    setSaving(true);
    try {
      const albumTanggal = form.tanggal || new Date().toISOString().slice(0, 10);
      const fotos = parseFotoLines(form.fotos).map((f) => ({
        ...f,
        tanggal: albumTanggal,
      }));
      const coverFoto = form.coverFoto.trim() || fotos[0]?.url || '';
      if (!coverFoto) throw new Error('Tambahkan cover atau minimal satu URL foto.');
      const payload = {
        judul: form.judul,
        deskripsi: form.deskripsi,
        kategori: form.kategori || undefined,
        tanggal: albumTanggal,
        coverFoto,
        fotos,
      };

      if (editingId) {
        await updateGaleriAlbumAdmin(editingId, payload);
        showSuccess('Album galeri berhasil diperbarui!');
      } else {
        await createGaleriAlbumAdmin(payload);
        showSuccess('Album galeri baru berhasil disimpan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menyimpan album.');
    } finally {
      setSaving(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<GaleriAlbum | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (album: GaleriAlbum) => setDeleteTarget(album);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGaleriAlbumAdmin(deleteTarget.id);
      showSuccess('Album galeri berhasil dihapus.');
      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menghapus album.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Kelola Galeri Kegiatan</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Album yang tersimpan otomatis tampil di Galeri publik beserta lightboxnya.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Tambah Album Foto
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : albums.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">Belum ada album galeri.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((alb) => (
            <Card key={alb.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={alb.coverFoto} alt={alb.judul} className="w-full h-40 object-cover rounded-xl" />
              {alb.kategori && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                  {alb.kategori}
                </span>
              )}
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">{alb.judul}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatTanggal(alb.tanggal)} • {alb.fotos ? alb.fotos.length : 0} Foto
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="ghost" size="sm" onClick={() => openEdit(alb)}>
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> Ubah
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(alb)}>
                  <Trash2 className="w-4 h-4 text-rose-500" /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Ubah Album' : 'Tambah Album Baru'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Judul Album" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              list="galeri-kategori"
              placeholder="budaya / pertanian / gotong-royong / umum"
            />
            <datalist id="galeri-kategori">
              {KATEGORI_OPTIONS.map((k) => <option key={k} value={k} />)}
            </datalist>
            <Input label="Tanggal (YYYY-MM-DD)" type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          </div>
          <Input
            label="URL Foto Cover"
            value={form.coverFoto}
            onChange={(e) => setForm({ ...form, coverFoto: e.target.value })}
            placeholder="https://...jpg"
          />
          <Textarea
            label="Daftar Foto (satu per baris, format: url|caption)"
            value={form.fotos}
            onChange={(e) => setForm({ ...form, fotos: e.target.value })}
            rows={5}
            placeholder={'https://.../1.jpg|Keterangan foto 1\nhttps://.../2.jpg|Keterangan foto 2'}
          />
          <Textarea
            label="Deskripsi Album"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            rows={2}
          />
          {form.coverFoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverFoto} alt="Pratinjau cover" className="h-32 w-full rounded-xl object-cover" />
          )}
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan Album'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Album"
        message={<>Yakin ingin menghapus album <strong>&quot;{deleteTarget?.judul}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.</>}
        isLoading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}