'use client';

import React, { useEffect, useState } from 'react';
import {
  createBeritaAdmin,
  deleteBeritaAdmin,
  getBeritaList,
  updateBeritaAdmin,
} from '@/lib/services/berita.service';
import type { Berita, KategoriBerita } from '@/types/berita';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatTanggal } from '@/lib/utils/format';
import { useToastStore } from '@/store/toastStore';
import { Newspaper, Plus, Edit, Trash2, Eye, Save, Search } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80';

const KATEGORI_OPTIONS: KategoriBerita[] = ['kegiatan', 'pengumuman', 'pembangunan', 'lainnya'];

export default function DashboardBeritaPage() {
  const [articles, setArticles] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    judul: '',
    kategori: 'kegiatan' as KategoriBerita,
    ringkasan: '',
    konten: '',
    gambarSampul: DEFAULT_IMAGE,
    tags: '',
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getBeritaList({ page: 1, perPage: 100 });
      setArticles(res.data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ judul: '', kategori: 'kegiatan', ringkasan: '', konten: '', gambarSampul: DEFAULT_IMAGE, tags: '' });
    setModalOpen(true);
  };

  const openEdit = (b: Berita) => {
    setEditingId(b.id);
    setForm({
      judul: b.judul,
      kategori: b.kategori,
      ringkasan: b.ringkasan,
      konten: b.konten,
      gambarSampul: b.gambarSampul || DEFAULT_IMAGE,
      tags: b.tags?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul.trim()) return;
    setSaving(true);
    try {
      const payload = {
        judul: form.judul,
        kategori: form.kategori,
        ringkasan: form.ringkasan,
        konten: form.konten || form.ringkasan,
        gambarSampul: form.gambarSampul || DEFAULT_IMAGE,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateBeritaAdmin(editingId, payload);
        showSuccess('Berita berhasil diperbarui!');
      } else {
        await createBeritaAdmin(payload);
        showSuccess('Berita baru berhasil dipublikasikan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (err: any) {
      showError(err.message || 'Gagal menyimpan berita.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Berita) => {
    if (!confirm(`Hapus berita "${item.judul}"?`)) return;
    try {
      await deleteBeritaAdmin(item.id);
      showSuccess('Berita berhasil dihapus.');
      await refresh();
    } catch (err: any) {
      showError(err.message || 'Gagal menghapus berita.');
    }
  };

  const visible = articles.filter(
    (a) =>
      !search ||
      [a.judul, a.ringkasan, a.kategori, a.penulis].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Kelola Berita & Pengumuman</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Perubahan di sini langsung tampil di halaman Berita publik.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Tambah Berita Baru
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 max-w-md shadow-sm">
        <Search className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul, kategori, penulis..."
          aria-label="Cari berita"
          className="border-none bg-transparent p-0 shadow-none focus:ring-0"
        />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Memuat berita...</p>
      ) : visible.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">Belum ada berita yang cocok.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visible.map((item) => (
            <Card key={item.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.gambarSampul} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="sm">{item.kategori}</Badge>
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{formatTanggal(item.tanggalTerbit)}</span>
                    <span className="text-[11px] text-neutral-500">{item.dibaca} dibaca</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-sm mt-1 line-clamp-1">{item.judul}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href={`/berita/${item.slug}`} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" aria-label="Lihat berita">
                    <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </Button>
                </a>
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)} aria-label="Ubah berita">
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(item)} aria-label="Hapus berita">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Ubah Berita' : 'Tambah Berita Baru'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Berita"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value as KategoriBerita })}
              options={KATEGORI_OPTIONS}
            />
            <div className="space-y-1">
              <Input
                label="URL Gambar Sampul"
                value={form.gambarSampul}
                onChange={(e) => setForm({ ...form, gambarSampul: e.target.value })}
                placeholder="https://... atau /uploads/..."
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-500 font-bold self-center">Pilih Sampul Cepat:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gambarSampul: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80' })}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                >
                  Kegiatan
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gambarSampul: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80' })}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                >
                  Pembangunan
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gambarSampul: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80' })}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                >
                  Pengumuman
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gambarSampul: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' })}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                >
                  Kesehatan
                </button>
              </div>
            </div>
          </div>
          <Textarea
            label="Ringkasan Berita"
            value={form.ringkasan}
            onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
            rows={2}
            required
            placeholder="Ringkasan singkat berita untuk ditampilkan di kartu depan..."
          />
          <div className="space-y-1">
            <Textarea
              label="Isi Berita Lengkap"
              value={form.konten}
              onChange={(e) => setForm({ ...form, konten: e.target.value })}
              rows={8}
              placeholder="Tuliskan isi berita lengkap di sini..."
            />
            <p className="text-[11px] text-neutral-500 leading-relaxed bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              💡 <strong>Panduan Format Teks:</strong> Gunakan <code>## Subjudul Utama</code>, <code>### Subjudul Kecil</code>, <code>**Teks Tebal**</code>, <code>*Teks Miring*</code>, <code>- Poin List</code>, atau <code>![Deskripsi Gambar](https://url-gambar)</code> untuk menambahkan gambar di dalam isi berita.
            </p>
          </div>
          <Input
            label="Tag (pisahkan dengan koma)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="mis. pembangunan, jalan-tani, gotong-royong"
          />
          {form.gambarSampul && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Pratinjau Sampul:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.gambarSampul}
                alt="Pratinjau sampul"
                className="h-36 w-full rounded-xl object-cover border border-neutral-200 dark:border-neutral-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
            </div>
          )}
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Terbitkan Berita'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}