import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('merender children dengan varian default', () => {
    render(<Badge>Aktif</Badge>);
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('menerapkan kelas warna sesuai varian', () => {
    const { container } = render(<Badge variant="success">Terverifikasi</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('bg-emerald-100');
  });
});

