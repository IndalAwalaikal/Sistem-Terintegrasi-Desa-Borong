import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('tidak merender konten saat isOpen=false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Hapus Berita"
        message="Yakin ingin menghapus?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.queryByText('Yakin ingin menghapus?')).not.toBeInTheDocument();
  });

  it('menampilkan judul, pesan, dan tombol saat terbuka', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Hapus Berita"
        message="Yakin ingin menghapus?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Yakin ingin menghapus?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ya, Hapus' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Batal' })).toBeInTheDocument();
  });

  it('memanggil onConfirm saat tombol konfirmasi ditekan', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="Hapus"
        message="Yakin?"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ya, Hapus' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('memanggil onCancel saat tombol batal ditekan', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="Hapus"
        message="Yakin?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});