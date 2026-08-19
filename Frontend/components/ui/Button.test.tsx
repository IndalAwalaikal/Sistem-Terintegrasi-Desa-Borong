import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('merender label sebagai tombol', () => {
    render(<Button>Simpan</Button>);
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument();
  });

  it('memanggil onClick saat diklik', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Klik</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Klik' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('menonaktifkan tombol dan menampilkan spinner saat isLoading', () => {
    render(<Button isLoading>Kirim</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.querySelector('svg[class*="animate-spin"]')).not.toBeNull();
  });

  it('menerapkan kelas warna sesuai variant', () => {
    const { container } = render(<Button variant="danger">Hapus</Button>);
    expect(container.querySelector('button')?.className).toContain('bg-danger');
  });

  it('tidak memanggil onClick saat disabled', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Kirim
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});