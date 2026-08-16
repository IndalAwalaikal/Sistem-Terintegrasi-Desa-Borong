import { z } from 'zod';

export const pengaduanSchema = z.object({
  kategori: z.enum(['infrastruktur', 'layanan', 'lingkungan', 'lainnya'], {
    required_error: 'Pilih kategori pengaduan',
  }),
  judul: z.string().min(5, 'Judul pengaduan minimal 5 karakter'),
  deskripsi: z.string().min(15, 'Deskripsi pengaduan minimal 15 karakter'),
  lokasi: z.string().optional(),
});

export type PengaduanSchemaType = z.infer<typeof pengaduanSchema>;
