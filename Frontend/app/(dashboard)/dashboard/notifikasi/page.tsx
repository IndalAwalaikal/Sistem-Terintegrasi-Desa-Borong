'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getNotifikasiList,
  markNotifikasiRead,
  markAllNotifikasiRead,
  type NotifikasiItem,
} from '@/lib/services/notifikasi.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToastStore } from '@/store/toastStore';
import {
  Bell,
  BellOff,
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
} from 'lucide-react';
import { formatTanggal } from '@/lib/utils/format';

const PER_PAGE = 15;

function NotifIcon({ type }: { type: NotifikasiItem['type'] }) {
  const map = {
    info:    { icon: Info,          cls: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
    success: { icon: CheckCircle2,  cls: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
    warning: { icon: AlertTriangle, cls: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
    error:   { icon: XCircle,       cls: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
  } as const;
  const { icon: Icon, cls } = map[type] ?? map.info;
  return (
    <span className={`w-9 h-9 flex items-center justify-center rounded-xl shrink-0 ${cls}`}>
      <Icon className="w-4 h-4" />
    </span>
  );
}

function typeToBadgeVariant(type: NotifikasiItem['type']): 'info' | 'success' | 'warning' | 'danger' | 'neutral' {
  const m: Record<NotifikasiItem['type'], 'info' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'danger',
  };
  return m[type] ?? 'neutral';
}


export default function DashboardNotifikasiPage() {
  const [list, setList] = useState<NotifikasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'semua' | NotifikasiItem['type']>('semua');
  const [filterRead, setFilterRead] = useState<'semua' | 'belum' | 'sudah'>('semua');
  const [page, setPage] = useState(1);
  const [markingAll, setMarkingAll] = useState(false);
  const { showSuccess, showError } = useToastStore();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifikasiList();
      setList(data);
    } catch {
      showError('Gagal memuat riwayat notifikasi.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => { void load(); }, [load]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotifikasiRead(id);
      setList((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      showError('Gagal menandai notifikasi.');
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotifikasiRead();
      setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showSuccess('Semua notifikasi ditandai sudah dibaca.');
    } catch {
      showError('Gagal menandai semua notifikasi.');
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = list.filter((n) => {
    if (filterType !== 'semua' && n.type !== filterType) return false;
    if (filterRead === 'belum' && n.isRead) return false;
    if (filterRead === 'sudah' && !n.isRead) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unreadCount = list.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Riwayat Notifikasi
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca dari ${list.length} total.`
              : `${list.length} notifikasi. Semua sudah dibaca.`}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleMarkAllRead()}
            isLoading={markingAll}
            className="gap-2 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Filter className="w-4 h-4 text-neutral-400 shrink-0 mt-1 sm:mt-0" />
        <Select
          label=""
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value as typeof filterType); setPage(1); }}
          options={[
            { value: 'semua', label: 'Semua Tipe' },
            { value: 'info', label: 'Info' },
            { value: 'success', label: 'Berhasil' },
            { value: 'warning', label: 'Peringatan' },
            { value: 'error', label: 'Error' },
          ]}
          wrapperClassName="sm:w-44"
          className="px-3 py-2 text-xs font-bold"
        />
        <Select
          label=""
          value={filterRead}
          onChange={(e) => { setFilterRead(e.target.value as typeof filterRead); setPage(1); }}
          options={[
            { value: 'semua', label: 'Semua Status Baca' },
            { value: 'belum', label: 'Belum Dibaca' },
            { value: 'sudah', label: 'Sudah Dibaca' },
          ]}
          wrapperClassName="sm:w-52"
          className="px-3 py-2 text-xs font-bold"
        />
        <span className="text-[11px] text-neutral-400 sm:ml-auto">
          {filtered.length} hasil
        </span>
      </Card>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-16 w-full rounded-2xl" />
          ))
        ) : paginated.length === 0 ? (
          <Card className="p-12 text-center">
            <BellOff className="mx-auto mb-3 h-9 w-9 text-neutral-300 dark:text-neutral-700" />
            <p className="text-sm text-neutral-500">Tidak ada notifikasi yang cocok dengan filter.</p>
          </Card>
        ) : (
          paginated.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 flex items-start gap-3 transition-colors ${
                notif.isRead
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                  : 'bg-primary-50/60 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800'
              }`}
            >
              <NotifIcon type={notif.type} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className={`text-sm font-bold ${notif.isRead ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                    {notif.title}
                  </span>
                  <Badge variant={typeToBadgeVariant(notif.type)} className="text-[10px] px-2 py-0.5">
                    {notif.type}
                  </Badge>
                  {!notif.isRead && (
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 shrink-0" title="Belum dibaca" />
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{notif.message}</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {formatTanggal(notif.createdAt, { withTime: true })}
                  {notif.link && (
                    <a href={notif.link} className="ml-2 text-primary-500 hover:underline font-semibold">
                      Lihat →
                    </a>
                  )}
                </p>
              </div>
              {!notif.isRead && (
                <button
                  type="button"
                  onClick={() => void handleMarkRead(notif.id)}
                  title="Tandai sudah dibaca"
                  aria-label="Tandai sudah dibaca"
                  className="shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Sebelumnya
          </Button>
          <span className="text-xs font-bold text-neutral-500 px-2">
            Hal {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Berikutnya →
          </Button>
        </div>
      )}
    </div>
  );
}
