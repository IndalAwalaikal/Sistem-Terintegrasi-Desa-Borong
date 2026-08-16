'use client';

import React, { useEffect, useState } from 'react';
import {
  createAgendaAdmin,
  deleteAgendaAdmin,
  getAgendaKegiatan,
  updateAgendaAdmin,
} from '@/lib/services/statistik.service';
import type { AgendaKegiatan } from '@/types/statistik';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatTanggal } from '@/lib/utils/format';
import { CalendarDays, Plus, Edit, Trash2, Save, MapPin, User } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

const CATEGORI_OPTIONS = ['perayaan', 'musyawarah', 'gotong-royong', 'pelatihan', 'lainnya'];

const CATEGORI_VARIANT: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  perayaan: 'warning',
  musyawarah: 'primary',
  'gotong-royong': 'success',
  pelatihan: 'secondary',
  lainnya: 'info',
};

export default function DashboardAgendaPage() {
  const [list, setList] = useState<AgendaKegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    lokasi: '',
    penyelenggara: '',
    kategori: 'perayaan',
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getAgendaKegiatan();
      setList([...data]);
    } catch {
      setList([]);
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
    setForm({
      judul: '',
      deskripsi: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      lokasi: '',
      penyelenggara: '',
      kategori: 'perayaan',
    });
    setModalOpen(true);
  };

  const openEdit = (item: AgendaKegiatan) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi,
      tanggalMulai: item.tanggalMulai ? item.tanggalMulai.slice(0, 16) : '',
      tanggalSelesai: item.tanggalSelesai ? item.tanggalSelesai.slice(0, 16) : '',
      lokasi: item.lokasi,
      penyelenggara: item.penyelenggara,
      kategori: item.kategori,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        judul: form.judul,
        deskripsi: form.deskripsi,
        tanggalMulai: form.tanggalMulai,
        tanggalSelesai: form.tanggalSelesai || undefined,
        lokasi: form.lokasi,
        penyelenggara: form.penyelenggara,
        kategori: form.kategori as AgendaKegiatan['kategori'],
      };
      if (editingId) {
        await updateAgendaAdmin(editingId, payload);
        showSuccess('Agenda berhasil diperbarui!');
      } else {
        await createAgendaAdmin(payload);
        showSuccess('Agenda baru berhasil disimpan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menyimpan agenda.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AgendaKegiatan) => {
    if (!window.confirm(`Hapus agenda "${item.judul}"?`)) return;
    try {
      await deleteAgendaAdmin(item.id);
      showSuccess('Agenda berhasil dihapus.');
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menghapus agenda.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Agenda & Kalender Kegiatan Desa</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Jadwal yang tersimpan otomatis tampil di halaman Agenda publik.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4" /> Tambah Agenda
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Memuat agenda...</p>
      ) : list.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">Belum ada agenda kegiatan.</Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {list.map((item) => (
            <Card key={item.id} className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={CATEGORI_VARIANT[item.kategori] ?? 'secondary'} size="sm">
                  {item.kategori.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatTanggal(item.tanggalMulai)}
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">{item.judul}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.deskripsi}</p>
              <div className="space-y-1 text-[11px] text-neutral-500">
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary-600 dark:text-primary-400" /> {item.lokasi}</p>
                <p className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary-600 dark:text-primary-400" /> {item.penyelenggara}</p>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> Ubah
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(item)}>
                  <Trash2 className="w-4 h-4 text-rose-500" /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Ubah Agenda' : 'Tambah Agenda Baru'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Judul Kegiatan" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Mulai (tanggal & jam)" type="datetime-local" value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} required />
            <Input label="Selesai (opsional)" type="datetime-local" value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Lokasi" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} required />
            <Select label="Kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} options={CATEGORI_OPTIONS} />
          </div>
          <Input label="Penyelenggara" value={form.penyelenggara} onChange={(e) => setForm({ ...form, penyelenggara: e.target.value })} required />
          <Textarea label="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} />
          <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
            <Save className="h-4 w-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan Agenda'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}