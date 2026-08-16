import type { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    nama: 'Maria Liku Padang',
    email: 'maria@gmail.com',
    nik: '7326014507850003',
    telepon: '0812-3456-7890',
    alamat: 'Dusun Borong Utara RT 02/RW 01, Desa Borong',
    role: 'warga',
    avatarUrl: 'https://ui-avatars.com/api/?name=Maria+Liku+Padang&background=16a34a&color=fff',
    createdAt: '2026-01-10T10:00:00+08:00',
  },
  {
    id: 'usr-002',
    nama: 'Yohanes Sampe Allo',
    email: 'yohanes@gmail.com',
    nik: '7326011203880005',
    telepon: '0812-4567-8901',
    alamat: 'Dusun Borong Selatan RT 01/RW 01, Desa Borong',
    role: 'warga',
    avatarUrl: 'https://ui-avatars.com/api/?name=Yohanes+Sampe+Allo&background=2563eb&color=fff',
    createdAt: '2026-02-15T11:20:00+08:00',
  },
  {
    id: 'usr-admin',
    nama: 'Markus Toding (Kasi Pemerintahan)',
    email: 'admin@borong.desa.id',
    role: 'admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Markus+Toding&background=f59e0b&color=fff',
    createdAt: '2026-01-01T00:00:00+08:00',
  },
  {
    id: 'usr-super',
    nama: 'Drs. Paulus Tandilino (Kepala Desa)',
    email: 'kades@borong.desa.id',
    role: 'super_admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Paulus+Tandilino&background=dc2626&color=fff',
    createdAt: '2026-01-01T00:00:00+08:00',
  },
];
