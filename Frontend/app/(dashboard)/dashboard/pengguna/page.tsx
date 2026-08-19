'use client';

import React, { useEffect, useState } from 'react';
import { getUsersAdmin, updateUserRoleAdmin } from '@/lib/services/user.service';
import type { Role, User } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

export default function DashboardPenggunaPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { void getUsersAdmin().then(setUsers); }, []);

  const changeRole = async (id: string, role: Role) => {
    setSavingId(id);
    try {
      const updated = await updateUserRoleAdmin(id, role);
      setUsers((current) => current.map((user) => user.id === id ? updated : user));
    } finally { setSavingId(null); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="eyebrow">Administrasi akses</p><h1 className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">Manajemen Pengguna & Peran</h1><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Kelola warga, operator, dan hak akses pengelolaan website dari satu tempat.</p></div>
        <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-xs text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-200"><span className="font-bold text-primary-900 dark:text-white">{users.length}</span> akun terdaftar</div>
      </div>

      <Card className="overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-neutral-400"><tr><th className="p-4">Pengguna</th><th className="p-4">Kontak</th><th className="p-4">Peran saat ini</th><th className="p-4">Ubah akses</th></tr></thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-600 dark:divide-neutral-800 dark:text-neutral-300">
              {users.map((user) => <tr key={user.id} className="transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/70">
                <td className="p-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-primary-700 text-xs font-bold text-white">{user.nama.charAt(0)}</span><div><p className="font-bold text-neutral-900 dark:text-white">{user.nama}</p><p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">NIK: {user.nik || '—'}</p></div></div></td>
                <td className="p-4"><p>{user.email}</p><p className="mt-1 text-neutral-500 dark:text-neutral-400">{user.telepon || '—'}</p></td>
                <td className="p-4"><Badge variant={user.role === 'super_admin' ? 'danger' : user.role === 'admin' ? 'warning' : 'primary'}>{user.role.replace('_', ' ').toUpperCase()}</Badge></td>
                <td className="p-4"><Select aria-label={`Ubah peran ${user.nama}`} value={user.role} disabled={savingId === user.id} onChange={(event) => void changeRole(user.id, event.target.value as Role)} options={[{ value: 'warga', label: 'Warga' }, { value: 'admin', label: 'Admin' }, { value: 'super_admin', label: 'Super Admin' }]} className="px-3 py-2 text-xs font-semibold" /></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
