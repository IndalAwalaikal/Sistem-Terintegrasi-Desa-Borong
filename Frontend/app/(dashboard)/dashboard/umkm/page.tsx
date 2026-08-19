'use client';

import React, { useEffect, useState } from 'react';
import {
  createUmkmAdmin,
  deleteUmkmAdmin,
  getUmkmList,
  updateUmkmAdmin,
} from '@/lib/services/umkm.service';
import type { Umkm } from '@/types/umkm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToastStore } from '@/store/toastStore';
import { Plus, Edit, Trash2, Save, Phone, Search } from 'lucide-react';

export default function DashboardUmkmPage() {
  const [umkms, setUmkms] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    namaUsaha: '',
    pemilik: '',
    kategori: '',
    deskripsi: '',
    kontak: '',
    alamat: '',
    jamOperasional: '',
    foto: '',
    produk: '',
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getUmkmList();
      setUmkms([...data]);
    } catch {
      setUmkms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ namaUsaha: '', pemilik: '', kategori: '', deskripsi: '', kontak: '', alamat: '', jamOperasional: '', foto: '', produk: '' });
    setModalOpen(true);
  };

  const openEdit = (u: Umkm) => {
    setEditingId(u.id);
    setForm({
      namaUsaha: u.namaUsaha || '',
      pemilik: u.pemilik || '',
      kategori: u.kategori || '',
      deskripsi: u.deskripsi || '',
      kontak: u.kontak || '',
      alamat: u.alamat || '',
      jamOperasional: u.jamOperasional || '',
      foto: Array.isArray(u.foto) ? u.foto.join('\n') : (u.foto || ''),
      produk: Array.isArray(u.produkUnggulan) ? u.produkUnggulan.join(', ') : (u.produkUnggulan || ''),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const foto = form.foto.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = {
        namaUsaha: form.namaUsaha,
        pemilik: form.pemilik,
        kategori: form.kategori || 'UMKM',
        deskripsi: form.deskripsi,
        kontak: form.kontak,
        alamat: form.alamat,
        jamOperasional: form.jamOperasional,
        foto: foto.length ? foto : ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'],
        produkUnggulan: form.produk.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateUmkmAdmin(editingId, payload);
        showSuccess('Data UMKM berhasil diperbarui!');
      } else {
        await createUmkmAdmin(payload);
        showSuccess('UMKM baru berhasil disimpan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menyimpan UMKM.');
    } finally {
      setSaving(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<Umkm | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (u: Umkm) => setDeleteTarget(u);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUmkmAdmin(deleteTarget.id);
      showSuccess('Data UMKM berhasil dihapus.');
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menghapus UMKM.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const visible = umkms.filter(
    (u) => !search || [u.namaUsaha, u.pemilik, u.kategori].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Kelola Direktori UMKM</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Perubahan langsung tampil di direktori UMKM publik.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Tambah UMKM
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 max-w-md shadow-sm">
        <Search className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari usaha, pemilik, kategori..."
          aria-label="Cari UMKM"
          className="border-none bg-transparent p-0 shadow-none focus:ring-0"
        />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Memuat UMKM...</p>
      ) : visible.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">Belum ada UMKM yang cocok.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((u) => (
            <Card key={u.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={Array.isArray(u.foto) && u.foto[0] ? u.foto[0] : (typeof u.foto === 'string' ? u.foto : 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80')} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm">{u.namaUsaha}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Pemilik: {u.pemilik}</p>
                <p className="text-[11px] text-primary-600 dark:text-primary-400 font-bold">{u.kategori}</p>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {u.kontak}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(u)}>
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Ubah UMKM' : 'Tambah UMKM Baru'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nama Usaha" value={form.namaUsaha} onChange={(e) => setForm({ ...form, namaUsaha: e.target.value })} required />
            <Input label="Nama Pemilik" value={form.pemilik} onChange={(e) => setForm({ ...form, pemilik: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Kategori & Souvenir" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="Pertanian / Kuliner / Kerajinan" />
            <Input label="Kontak (WA)" value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} placeholder="0812-3456-7890" />
          </div>
          <Textarea label="Alamat" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} rows={2} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Jam Operasional" value={form.jamOperasional} onChange={(e) => setForm({ ...form, jamOperasional: e.target.value })} placeholder="08.00 - 18.00 WITA" />
            <Input label="Produk Unggulan (koma)" value={form.produk} onChange={(e) => setForm({ ...form, produk: e.target.value })} placeholder="Beras Lokal, Sayuran" />
          </div>
          <Textarea label="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} />
          <Textarea
            label="URL Foto (satu per baris)"
            value={form.foto}
            onChange={(e) => setForm({ ...form, foto: e.target.value })}
            rows={3}
            placeholder={'https://.../1.jpg\nhttps://.../2.jpg'}
          />
          {form.foto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.foto.split('\n')[0]} alt="Pratinjau" className="h-32 w-full rounded-xl object-cover" />
          )}
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan UMKM'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus UMKM"
        message={<>Yakin ingin menghapus UMKM <strong>&quot;{deleteTarget?.namaUsaha}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.</>}
        isLoading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}