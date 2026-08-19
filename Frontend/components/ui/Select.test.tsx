import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@/components/ui/Select';

describe('Select', () => {
  it('merender label dan semua opsi', () => {
    render(
      <Select
        label="Pilih Kategori"
        options={[
          { value: 'a', label: 'Kategori A' },
          { value: 'b', label: 'Kategori B' },
        ]}
      />
    );
    expect(screen.getByLabelText('Pilih Kategori')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Kategori A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Kategori B' })).toBeInTheDocument();
  });

  it('memanggil onChange saat nilai dipilih', () => {
    const onChange = vi.fn();
    render(
      <Select
        aria-label="Pilih Wilayah"
        options={['Dusun A', 'Dusun B']}
        onChange={onChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Pilih Wilayah'), { target: { value: 'Dusun B' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('menampilkan placeholder sebagai opsi nonaktif saat disediakan', () => {
    render(<Select options={['A']} placeholder="Pilih salah satu..." />);
    const placeholder = screen.getByRole('option', { name: 'Pilih salah satu...' }) as HTMLOptionElement;
    expect(placeholder).toBeDisabled();
  });

  it('menampilkan pesan error', () => {
    render(<Select options={['A']} error="Wajib diisi" />);
    expect(screen.getByText('Wajib diisi')).toBeInTheDocument();
  });
});