'use client';

import React, { useEffect, useState } from 'react';
import {
  createJenisSuratAdmin,
  deleteJenisSuratAdmin,
  getAllJenisSuratAdmin,
  updateJenisSuratAdmin,
} from '@/lib/services/persuratan.service';
import type { JenisSurat } from '@/types/persuratan';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  FileStack,
  Plus,
  Edit,
  Trash2,
  Save,
  Power,
  Clock,
  ListChecks,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

export default function DashboardTemplateSuratPage() {
  const [templates, setTemplates] = useState<JenisSurat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAktif, setFilterAktif] = useState<'semua' | 'aktif' | 'nonaktif'>('semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingKode, setEditingKode] = useState<string | null>(null);
  const { showSuccess, showError } = useToastStore();
  const [form, setForm] = useState({
    kode: '',
    kategori: 'Umum',
    nama: '',
    deskripsi: '',
    estimasiHari: 2,
    persyaratan: '',
    nomorSuratFormat: '470/{index}/DB/{bulan_romawi}/{tahun}',
    templateHtml: '',
    aktif: true,
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getAllJenisSuratAdmin();
      setTemplates([...data]);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openAdd = () => {
    setEditingKode(null);
    setForm({
      kode: '',
      kategori: 'Umum',
      nama: '',
      deskripsi: '',
      estimasiHari: 2,
      persyaratan: '',
      nomorSuratFormat: '470/{index}/DB/{bulan_romawi}/{tahun}',
      templateHtml: '',
      aktif: true,
    });
    setModalOpen(true);
  };

  const openEdit = (t: JenisSurat) => {
    setEditingKode(t.kode);
    setForm({
      kode: t.kode,
      kategori: t.kategori || 'Umum',
      nama: t.nama,
      deskripsi: t.deskripsi,
      estimasiHari: t.estimasiHari,
      persyaratan: Array.isArray(t.persyaratan) ? t.persyaratan.join('\n') : (t.persyaratan || ''),
      nomorSuratFormat: t.nomorSuratFormat || '470/{index}/DB/{bulan_romawi}/{tahun}',
      templateHtml: t.templateHtml || '',
      aktif: t.aktif,
    });
    setModalOpen(true);
  };

  const handleInsertVar = (v: string) => {
    setForm((prev) => ({
      ...prev,
      templateHtml: prev.templateHtml + ' ' + v,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode.trim() || !form.nama.trim()) return;
    setSaving(true);
    try {
      const payload = {
        kode: form.kode,
        kategori: form.kategori,
        nama: form.nama,
        deskripsi: form.deskripsi,
        estimasiHari: Number(form.estimasiHari) || 1,
        persyaratan: form.persyaratan.split('\n').map((s) => s.trim()).filter(Boolean),
        nomorSuratFormat: form.nomorSuratFormat,
        templateHtml: form.templateHtml,
        aktif: form.aktif,
      };
      if (editingKode) {
        await updateJenisSuratAdmin(editingKode, payload);
        showSuccess('Template surat berhasil diperbarui!');
      } else {
        await createJenisSuratAdmin(payload);
        showSuccess('Template surat baru berhasil disimpan!');
      }
      setModalOpen(false);
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menyimpan template.');
    } finally {
      setSaving(false);
    }
  };


  const [deleteTarget, setDeleteTarget] = useState<JenisSurat | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (t: JenisSurat) => setDeleteTarget(t);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJenisSuratAdmin(deleteTarget.kode);
      showSuccess('Template surat berhasil dihapus.');
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal menghapus template.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (t: JenisSurat) => {
    try {
      await updateJenisSuratAdmin(t.kode, { aktif: !t.aktif });
      showSuccess(t.aktif ? 'Template surat dinonaktifkan.' : 'Template surat diaktifkan kembali!');
      await refresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Gagal mengubah status.');
    }
  };

  const filtered = templates.filter((t) => {
    const matchSearch =
      !search ||
      t.kode.toLowerCase().includes(search.toLowerCase()) ||
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchAktif =
      filterAktif === 'semua' || (filterAktif === 'aktif' ? t.aktif : !t.aktif);
    return matchSearch && matchAktif;
  });

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Template Surat &amp; Persyaratan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Kelola jenis surat permohonan warga, estimasi waktu penyelesaian, dan syarat dokumen lampiran.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd} className="shrink-0">
          <Plus className="w-4 h-4" /> Tambah Jenis Surat
        </Button>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-primary-600 dark:text-primary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode, nama surat, deskripsi..."
            aria-label="Cari template surat"
            className="border-none bg-neutral-50 dark:bg-neutral-950 pl-10 pr-4 py-2 text-xs shadow-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:inline">Filter:</span>
          {(['semua', 'aktif', 'nonaktif'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterAktif(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterAktif === st
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-neutral-500">
          Tidak ada jenis surat yang cocok dengan kriteria pencarian.
        </Card>
      ) : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          {filtered.map((t) => (
            <Card
              key={t.kode}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header Card: Icon, Code, Status Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                      <FileStack className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 px-2.5 py-0.5 rounded-md border border-primary-200 dark:border-primary-800">
                          KODE: {t.kode}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {t.estimasiHari} hari kerja
                        </span>
                      </div>
                      <h2 className="mt-1 font-extrabold text-neutral-900 dark:text-white text-base truncate">
                        {t.nama}
                      </h2>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => void handleToggle(t)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 transition-all border shrink-0 ${
                      t.aktif
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200'
                    }`}
                    title={t.aktif ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <Power className="h-3.5 w-3.5" />
                    {t.aktif ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                {/* Deskripsi Surat */}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.deskripsi}
                </p>

                {/* Daftar Persyaratan Dokumen */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      Dokumen Persyaratan ({Array.isArray(t.persyaratan) ? t.persyaratan.length : 0})
                    </span>
                  </div>

                  {Array.isArray(t.persyaratan) && t.persyaratan.length > 0 ? (
                    <ul className="space-y-1.5 pl-1">
                      {t.persyaratan.map((req, idx) => (
                        <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">Tidak ada persyaratan dokumen khusus.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="ghost" size="sm" onClick={() => openEdit(t)} aria-label="Ubah Template">
                  <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> Ubah
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(t)} aria-label="Hapus Template">
                  <Trash2 className="w-4 h-4 text-rose-500" /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Edit / Tambah Jenis Surat */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingKode ? `Ubah Template (${editingKode})` : 'Tambah Jenis Surat Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Kode Surat (Singkatan)"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })}
              placeholder="Contoh: SKU, SKTM, SKD"
              required
              disabled={!!editingKode}
            />
            <Input
              label="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              placeholder="Usaha / Keterangan / Nikah"
              required
            />
            <Input
              label="Estimasi (Hari Kerja)"
              type="number"
              min={1}
              value={form.estimasiHari}
              onChange={(e) => setForm({ ...form, estimasiHari: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Nama Resmi Surat"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Contoh: Surat Keterangan Usaha"
            required
          />

          <Input
            label="Format Nomor Surat Resmi"
            value={form.nomorSuratFormat}
            onChange={(e) => setForm({ ...form, nomorSuratFormat: e.target.value })}
            placeholder="Contoh: 470/{index}/DB/{bulan_romawi}/{tahun}"
            required
          />

          <Textarea
            label="Deskripsi & Peruntukan Surat"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            rows={2}
            placeholder="Jelaskan fungsi surat ini bagi warga..."
            required
          />

          <Textarea
            label="Persyaratan Dokumen (Satu per baris)"
            value={form.persyaratan}
            onChange={(e) => setForm({ ...form, persyaratan: e.target.value })}
            rows={3}
            placeholder={'Fotokopi KTP\nFotokopi Kartu Keluarga\nSurat Pengantar RT/RW'}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                Template Dokumen HTML &amp; Dynamic Variables
              </label>
              <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">
                Klik tag untuk menyisipkan
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {[
                { tag: '{{sys.pemohon.nama}}', label: 'Nama Pemohon' },
                { tag: '{{sys.pemohon.nik}}', label: 'NIK Pemohon' },
                { tag: '{{sys.pemohon.ttl}}', label: 'TTL Pemohon' },
                { tag: '{{sys.pemohon.alamat_lengkap}}', label: 'Alamat Pemohon' },
                { tag: '{{sys.pemohon.pekerjaan}}', label: 'Pekerjaan' },
                { tag: '{{sys.meta.nomor_surat}}', label: 'Nomor Surat' },
                { tag: '{{sys.meta.tanggal_surat}}', label: 'Tgl Surat' },
                { tag: '{{sys.meta.qr_code_img}}', label: 'QR Code TTD' },
                { tag: '{{sys.ttd.nama}}', label: 'Nama Kades' },
                { tag: '{{form.namaUsaha}}', label: 'Field Custom (Form)' },
              ].map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => handleInsertVar(v.tag)}
                  className="px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-md text-[11px] font-mono border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  {v.label}
                </button>
              ))}
            </div>

            <Textarea
              value={form.templateHtml}
              onChange={(e) => setForm({ ...form, templateHtml: e.target.value })}
              rows={6}
              className="font-mono text-xs"
              placeholder="<div style='font-family: Arial;'>Yang bertanda tangan di bawah ini...</div>"
            />
          </div>


          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                className="h-4 w-4 rounded accent-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">Status Aktif</span>
                <span className="text-[11px] text-neutral-500 block">
                  Jika diaktifkan, jenis surat ini akan tampil di menu permohonan warga publik.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              <Save className="h-4 w-4" /> {editingKode ? 'Simpan Perubahan' : 'Simpan Template'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Template Surat"
        message={<>Yakin ingin menghapus template surat <strong>{deleteTarget?.kode} ({deleteTarget?.nama})</strong>? Tindakan ini tidak dapat dibatalkan.</>}
        isLoading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}