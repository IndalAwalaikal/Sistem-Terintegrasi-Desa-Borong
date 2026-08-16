'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAllPengajuanAdmin } from '@/lib/services/persuratan.service';
import { getAllPengaduanAdmin } from '@/lib/services/pengaduan.service';
import { getBeritaList } from '@/lib/services/berita.service';
import { getUmkmList } from '@/lib/services/umkm.service';
import { getGaleriAlbumList } from '@/lib/services/galeri.service';
import { getStatistikPenduduk } from '@/lib/services/statistik.service';
import type { PengajuanSurat } from '@/types/persuratan';
import type { Pengaduan } from '@/types/pengaduan';
import { FileText, MessageSquare, Newspaper, Users, ShoppingBag, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { darkTooltipProps } from '@/lib/utils/chartTooltip';

const STATUS_COLORS: Record<string, string> = {
  diajukan: '#f59e0b',
  diverifikasi: '#3b82f6',
  diproses: '#8b5cf6',
  selesai: '#10b981',
  ditolak: '#ef4444',
};

export default function DashboardOverviewPage() {
  const [pengajuan, setPengajuan] = useState<PengajuanSurat[]>([]);
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [counts, setCounts] = useState({ berita: 0, umkm: 0, galeri: 0, penduduk: 0, jumlahKK: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void Promise.all([
      getAllPengajuanAdmin(),
      getAllPengaduanAdmin(),
      getBeritaList({ page: 1, perPage: 100 }),
      getUmkmList(),
      getGaleriAlbumList(),
      getStatistikPenduduk(),
    ]).then(([p, pgn, berita, umkm, galeri, stat]) => {
      setPengajuan(p);
      setPengaduan(pgn);
      setCounts({
        berita: berita.total,
        umkm: umkm.length,
        galeri: galeri.length,
        penduduk: stat.totalPenduduk,
        jumlahKK: stat.jumlahKK,
      });
      setReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingSurat = pengajuan.filter((x) => x.status === 'diajukan' || x.status === 'diverifikasi').length;
  const openPengaduan = pengaduan.filter((x) => x.status !== 'selesai').length;

  const chartData = (['diajukan', 'diverifikasi', 'diproses', 'selesai', 'ditolak'] as const)
    .map((s) => ({ name: s, jumlah: pengajuan.filter((x) => x.status === s).length }));

  const recentPengaduan = pengaduan.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Ringkasan Dashboard</h1>
        <p className="text-xs text-neutral-400 mt-1">Pantau seluruh konten dan layanan desa dari satu tempat.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card className="p-5 bg-neutral-900 border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Surat Masuk</span>
            <span className="p-2.5 rounded-xl bg-primary-600/20 text-primary-400"><FileText className="w-5 h-5" /></span>
          </div>
          <h2 className="text-3xl font-black text-white mt-2">{ready ? pengajuan.length : '...'}</h2>
          <p className="text-xs text-amber-400 mt-1 font-bold">{pendingSurat} menunggu tindak lanjut</p>
          <Link href="/dashboard/pengajuan" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-400 hover:underline">Kelola <ArrowUpRight className="h-3 w-3" /></Link>
        </Card>

        <Card className="p-5 bg-neutral-900 border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Pengaduan</span>
            <span className="p-2.5 rounded-xl bg-secondary-600/20 text-secondary-400"><MessageSquare className="w-5 h-5" /></span>
          </div>
          <h2 className="text-3xl font-black text-white mt-2">{ready ? pengaduan.length : '...'}</h2>
          <p className="text-xs text-sky-400 mt-1 font-bold">{openPengaduan} perlu ditindaklanjuti</p>
          <Link href="/dashboard/pengaduan" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-400 hover:underline">Kelola <ArrowUpRight className="h-3 w-3" /></Link>
        </Card>

        <Card className="p-5 bg-neutral-900 border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Konten Publik</span>
            <span className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400"><Newspaper className="w-5 h-5" /></span>
          </div>
          <h2 className="text-3xl font-black text-white mt-2">{ready ? counts.berita : '...'}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1"><ShoppingBag className="w-3 h-3" />{counts.umkm} UMKM</span>
            <span className="inline-flex items-center gap-1"><ImageIcon className="w-3 h-3" />{counts.galeri} Galeri</span>
          </div>
          <Link href="/dashboard/berita" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-400 hover:underline">Kelola <ArrowUpRight className="h-3 w-3" /></Link>
        </Card>

        <Card className="p-5 bg-neutral-900 border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Penduduk</span>
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400"><Users className="w-5 h-5" /></span>
          </div>
          <h2 className="text-3xl font-black text-white mt-2">{ready ? counts.penduduk.toLocaleString('id-ID') : '...'}</h2>
          <p className="text-xs text-neutral-400 mt-1">{ready ? `${counts.jumlahKK.toLocaleString('id-ID')} KK` : ''}</p>
          <Link href="/dashboard/penduduk" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-400 hover:underline">Kelola Data <ArrowUpRight className="h-3 w-3" /></Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-neutral-900 border-neutral-800 lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-4">Pengajuan per Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickMargin={6} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={36} tickMargin={4} />
                <Tooltip {...darkTooltipProps} />
                <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#3b82f6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 bg-neutral-900 border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Pengaduan Terbaru</h3>
            <Link href="/dashboard/pengaduan" className="text-[11px] font-bold text-primary-400 hover:underline">Semua</Link>
          </div>
          <div className="space-y-3">
            {recentPengaduan.length === 0 ? (
              <p className="text-xs text-neutral-500">Belum ada pengaduan.</p>
            ) : (
              recentPengaduan.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-2 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.judul}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">{p.nomorTiket}</p>
                  </div>
                  <Badge variant={p.status === 'selesai' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Latest Requests Table */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" /> Permohonan Surat Terbaru
          </h3>
          <Link href="/dashboard/pengajuan" className="text-xs font-bold text-primary-400 hover:underline">Lihat Semua →</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-800 text-neutral-200 border-b border-neutral-700">
              <tr>
                <th className="p-3">Resi</th>
                <th className="p-3">Pemohon</th>
                <th className="p-3">Jenis Surat</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {pengajuan.slice(0, 6).map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/50">
                  <td className="p-3 font-mono font-bold text-primary-400">{item.nomorResi}</td>
                  <td className="p-3 font-bold text-white">{item.pemohonNama}</td>
                  <td className="p-3">{item.jenisSuratNama}</td>
                  <td className="p-3 text-neutral-400">{item.dibuatPada.slice(0, 10)}</td>
                  <td className="p-3">
                    <Badge variant={item.status === 'selesai' ? 'success' : item.status === 'ditolak' ? 'danger' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Link href={`/dashboard/pengajuan?id=${item.id}`}>
                      <span className="text-xs font-bold text-primary-400 hover:underline">Kelola</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}