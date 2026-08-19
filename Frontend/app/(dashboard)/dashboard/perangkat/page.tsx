'use client';

import React, { useEffect, useState } from 'react';
import {
  createPerangkatAdmin,
  deletePerangkatAdmin,
  getPerangkatDesaList,
  updatePerangkatAdmin,
} from '@/lib/services/desa.service';
import type { PerangkatDesa } from '@/types/desa';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DynamicImage } from '@/components/ui/DynamicImage';
import { Plus, Edit, Trash2, Save, Search } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';
import { JABATAN_OPTIONS, JABATAN_VALUES } from '@/lib/constants/jabatan';

// Pisahkan periode bertipe teks "2024 - 2029" menjadi dua tahun.
function parsePeriode(periode?: string): { awal: string; akhir: string } {
  const tahun = (periode || '').match(/\d{4}/g) ?? [];
  return { awal: tahun[0] || '', akhir: tahun[1] || '' };
}

export default function DashboardPerangkatPage() {
  const [list, setList] = useState<PerangkatDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', jabatan: '', nip: '', periodeAwal: '', periodeAkhir: '', foto: '' });
  const { showSuccess, showError } = useToastStore();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getPerangkatDesaList();
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
    setForm({
      nama: '',
      jabatan: '',
      nip: '',
      periodeAwal: '',
      periodeAkhir: '',
      foto: `https://ui-avatars.com/api/?name=A&size=200&background=16a34a&color=fff`,
    });
    setModalOpen(true);
  };

  const openEdit = (item: PerangkatDesa) => {
    setEditingId(item.id);
    const { awal, akhir } = parsePeriode(item.periode);
    setForm({ nama: item.nama, jabatan: item.jabatan, nip: item.nip || '', periodeAwal: awal, periodeAkhir: akhir, foto: item.foto });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tahunAwal = form.periodeAwal.trim();
    const tahunAkhir = form.periodeAkhir.trim();
    if (!/^\d{4}$/.test(tahunAwal) || !/^\d{4}$/.test(tahunAkhir)) {
      showError('Tahun periode harus diisi dengan 4 angka (misal: 2024).');
      return;
    }
    if (Number(tahunAkhir) < Number(tahunAwal)) {
      showError('Tahun akhir periode tidak boleh lebih kecil dari tahun awal.');
      return;
    }
    setSaving(true);
    try {
      const foto = form.foto.trim()
        ? form.foto
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama || 'A')}&size=200&background=16a34a&color=fff`;
      const payload = { nama: form.nama, jabatan: form.jabatan, nip: form.nip.trim() || undefined, periode: `${tahunAwal} - ${tahunAkhir}`, foto };
      if (editingId) {
        await updatePerangkatAdmin(editingId, payload);
        showSuccess('Perangkat desa berhasil diperbarui!');
      } else {
        await createPerangkatAdmin(payload);
        showSuccess('Perangkat desa baru berhasil disimpan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menyimpan perangkat.');
    } finally {
      setSaving(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<PerangkatDesa | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (item: PerangkatDesa) => setDeleteTarget(item);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePerangkatAdmin(deleteTarget.id);
      showSuccess('Perangkat desa berhasil dihapus.');
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menghapus perangkat.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

      const visible = list.filter(
    (p) => !search || [p.nama, p.jabatan].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Perangkat & Struktur Organisasi Desa</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Daftar perangkat desa yang ditampilkan di halaman Struktur Organisasi publik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Cari perangkat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="primary" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Tambah
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : visible.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">
          {search ? 'Tidak ada perangkat sesuai pencarian.' : 'Belum ada perangkat desa.'}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((item) => (
            <Card key={item.id} className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- foto URL eksternal pengguna */}
              <img
                src={item.foto}
                alt={item.foto ? `Foto ${item.nama}` : undefined}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&size=64&background=16a34a&color=fff`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{item.nama}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{item.jabatan}</p>
                <p className="text-[11px] text-neutral-500 truncate">Periode {item.periode}</p>
                {item.nip && <p className="text-[11px] text-neutral-500 truncate">NIP {item.nip}</p>}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(item)}>
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Ubah Perangkat' : 'Tambah Perangkat Baru'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nama Lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
          <div className="space-y-1.5">
            <label htmlFor="jabatan" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Jabatan <span className="text-danger ml-1">*</span>
            </label>
            <select
              id="jabatan"
              value={form.jabatan}
              onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
              required
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="" disabled>Pilih jabatan / kedudukan...</option>
              {form.jabatan && !JABATAN_VALUES.includes(form.jabatan) && (
                <option value={form.jabatan}>{form.jabatan} (data lama)</option>
              )}
              {JABATAN_OPTIONS.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.items.map((jabatan) => (
                    <option key={jabatan} value={jabatan}>{jabatan}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <Input label="NIP" placeholder="Kosongkan jika tidak ada" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tahun Awal Periode"
              type="number"
              min={1900}
              max={2100}
              placeholder="2024"
              value={form.periodeAwal}
              onChange={(e) => setForm({ ...form, periodeAwal: e.target.value })}
              required
            />
            <Input
              label="Tahun Akhir Periode"
              type="number"
              min={1900}
              max={2100}
              placeholder="2029"
              value={form.periodeAkhir}
              onChange={(e) => setForm({ ...form, periodeAkhir: e.target.value })}
              required
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-2">
            Periode disimpan sebagai pasangan tahun (misal <b>2024 - 2029</b>). Data periode lama tetap tersimpan dan bisa ditampilkan kembali di halaman Struktur Organisasi sebagai bagan periode sebelumnya.
          </p>
          <Input label="URL Foto (opsional)" placeholder="https://..." value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} helperText="Jika kosong, avatar otomatis dibuat dari nama." />
          {form.foto && (
          <DynamicImage src={form.foto} alt="" fallbackSrc="https://ui-avatars.com/api/?name=A&size=64&background=16a34a&color=fff" className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-700" />
          )}
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan Perangkat'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Perangkat"
        message={<>Yakin ingin menghapus perangkat <strong>&quot;{deleteTarget?.nama}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.</>}
        isLoading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}