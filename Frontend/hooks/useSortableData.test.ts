import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSortableData } from '@/hooks/useSortableData';

interface Row { name: string; age: number; }

const data: Row[] = [
  { name: 'Banana', age: 30 },
  { name: 'Apple', age: 25 },
  { name: 'Cherry', age: 25 },
];

describe('useSortableData', () => {
  it('mengembalikan urutan asli ketika belum ada sortKey', () => {
    const { result } = renderHook(() => useSortableData(data));
    expect(result.current.sorted.map((r) => r.name)).toEqual(['Banana', 'Apple', 'Cherry']);
    expect(result.current.sortKey).toBeNull();
  });

  it('mengurutkan string ascending lalu toggle ke descending', () => {
    const { result } = renderHook(() => useSortableData(data));
    act(() => result.current.requestSort('name'));
    expect(result.current.direction).toBe('asc');
    expect(result.current.sorted.map((r) => r.name)).toEqual(['Apple', 'Banana', 'Cherry']);

    act(() => result.current.requestSort('name'));
    expect(result.current.direction).toBe('desc');
    expect(result.current.sorted.map((r) => r.name)).toEqual(['Cherry', 'Banana', 'Apple']);
  });

  it('mengurutkan angka ascending', () => {
    const { result } = renderHook(() => useSortableData(data));
    act(() => result.current.requestSort('age'));
    expect(result.current.sorted.map((r) => r.age)).toEqual([25, 25, 30]);
    act(() => result.current.requestSort('age'));
    expect(result.current.sorted.map((r) => r.age)).toEqual([30, 25, 25]);
  });

  it('bersyarat kolom baru selalu ascending', () => {
    const { result } = renderHook(() => useSortableData(data));
    act(() => result.current.requestSort('name')); // asc
    act(() => result.current.requestSort('name')); // desc
    act(() => result.current.requestSort('age')); // new key -> asc
    expect(result.current.sortKey).toBe('age');
    expect(result.current.direction).toBe('asc');
  });

  it('menempatkan nilai null di akhir', () => {
    const withNull: Row[] = [
      { name: 'Zeta', age: 40 },
      { name: '', age: 0 },
      { name: 'Alpha', age: 10 },
    ];
    const { result } = renderHook(() => useSortableData(withNull));
    act(() => result.current.requestSort('name'));
    expect(result.current.sorted.map((r) => r.name)).toEqual(['', 'Alpha', 'Zeta']);
  });
});
