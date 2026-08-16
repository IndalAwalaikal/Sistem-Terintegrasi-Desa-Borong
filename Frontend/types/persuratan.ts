export type StatusPengajuan =
  | 'diajukan'
  | 'diverifikasi'
  | 'diproses'
  | 'selesai'
  | 'ditolak';

export interface WorkflowStepConfig {
  stepOrder: number;
  roleRequired: string;
  action: string; // VERIFIKASI_BERKAS | PARAF_HIRARKI | TANDA_TANGAN_DIGITAL
  autoNotify?: boolean;
}

export interface ApprovalStep {
  id: string;
  pengajuanId: string;
  stepOrder: number;
  roleRequired: string;
  actorId?: string;
  actorNama?: string;
  status: 'pending' | 'approved' | 'rejected';
  catatan?: string;
  signedAt?: string;
}

export interface Penduduk {
  nik: string;
  noKk: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  statusPerkawinan: 'belum_kawin' | 'kawin' | 'cerai_hidup' | 'cerai_mati';
  pekerjaan: string;
  golonganDarah?: string;
  hubunganKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  isActive: boolean;
}

export interface JenisSurat {
  kode: string;
  kategori?: string;
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  estimasiHari: number;
  formFields: FormFieldConfig[];
  templateHtml?: string;
  workflowConfig?: WorkflowStepConfig[];
  nomorSuratFormat?: string;
  ikon: string;
  aktif: boolean;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'file' | 'number' | 'email';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface PengajuanSurat {
  id: string;
  nomorResi: string;
  nomorSuratResmi?: string;
  jenisSuratKode: string;
  jenisSuratNama: string;
  pemohonId: string;
  pemohonNama: string;
  subjekNik?: string;
  data: Record<string, string>;
  dataSnapshot?: Record<string, any>;
  lampiran: LampiranFile[];
  status: StatusPengajuan;
  currentStep?: number;
  catatanAdmin?: string;
  filePdfUrl?: string;
  qrVerificationCode?: string;
  dokumenHasil?: DokumenHasilSurat;
  riwayatStatus: RiwayatStatus[];
  approvalSteps?: ApprovalStep[];
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface DokumenHasilSurat {
  nama: string;
  url: string;
  diterbitkanPada: string;
  nomorSurat: string;
  diterbitkanOleh: string;
}

export interface RiwayatStatus {
  status: StatusPengajuan;
  catatan?: string;
  waktu: string;
  oleh?: string;
}

export interface LampiranFile {
  id: string;
  nama: string;
  url: string;
  ukuran: number;
  tipe: string;
}

export interface SubmitPengajuanInput {
  jenisSuratKode: string;
  data: Record<string, string>;
  lampiran: File[];
}

