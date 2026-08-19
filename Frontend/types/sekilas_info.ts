export interface SekilasInfo {
  id: string;
  konten: string;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface SekilasInfoEditableInput {
  konten: string;
  aktif: boolean;
}