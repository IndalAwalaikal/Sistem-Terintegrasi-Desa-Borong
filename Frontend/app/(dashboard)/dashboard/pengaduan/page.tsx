'use client';

import React, { useState, useEffect } from 'react';
import { getAllPengaduanAdmin, updateStatusPengaduanAdmin } from '@/lib/services/pengaduan.service';
import type { Pengaduan } from '@/types/pengaduan';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { MessageSquare, CheckCircle2 } from 'lucide-react';

export default function DashboardPengaduanPage() {
  const [list, setList] = useState<Pengaduan[]>([]);
  const [selected, setSelected] = useState<Pengaduan | null>(null);
  const [tanggapan, setTanggapan] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getAllPengaduanAdmin().then(setList);
  }, []);

  const handleRespond = async () => {
    if (!selected) return;
    const updated = await updateStatusPengaduanAdmin(selected.id, 'selesai', tanggapan);
    setList(list.map((p) => (p.id === updated.id ? updated : p)));
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Kelola Pengaduan Warga</h1>
        <p className="text-xs text-neutral-400 mt-1">Tindak lanjuti laporan dan aspirasi masyarakat.</p>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <Card key={item.id} className="p-6 bg-neutral-900 border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-secondary-400">{item.nomorTiket}</span>
              <Badge variant={item.status === 'selesai' ? 'success' : 'warning'}>{item.status}</Badge>
            </div>
            <h3 className="text-base font-bold text-white">{item.judul}</h3>
            <p className="text-xs text-neutral-400">{item.deskripsi}</p>
            <p className="text-[11px] text-neutral-500">Pelapor: {item.pelaporNama} • Lokasi: {item.lokasi || '-'}</p>

            {item.tanggapanAdmin && (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-emerald-400">
                Tanggapan Admin: {item.tanggapanAdmin}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelected(item);
                setTanggapan(item.tanggapanAdmin || '');
                setModalOpen(true);
              }}
            >
              Beri Tanggapan
            </Button>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tanggapi Pengaduan Warga">
        <div className="space-y-4">
          <Textarea
            label="Tanggapan / Tindak Lanjut Admin"
            value={tanggapan}
            onChange={(e) => setTanggapan(e.target.value)}
          />
          <Button variant="primary" className="w-full" onClick={handleRespond}>
            Simpan & Tandai Selesai
          </Button>
        </div>
      </Modal>
    </div>
  );
}
