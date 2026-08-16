export type Role = 'warga' | 'admin' | 'super_admin';

export interface User {
  id: string;
  nama: string;
  email: string;
  nik?: string;
  noKk?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: 'L' | 'P' | string;
  agama?: string;
  statusPerkawinan?: string;
  pekerjaan?: string;
  rt?: string;
  rw?: string;
  dusun?: string;
  telepon?: string;
  alamat?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  nama: string;
  email: string;
  password: string;
  nik: string;
  telepon: string;
  alamat: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}
