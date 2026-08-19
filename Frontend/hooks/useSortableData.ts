import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseSortableDataResult<T> {
  /** Sorted copy of the input list (original never mutated). */
  sorted: T[];
  /** Toggle/reqest sort by a given key. Same key toggles asc<->desc. */
  requestSort: (key: keyof T) => void;
  /** Currently sorted key (null = belum disort). */
  sortKey: keyof T | null;
  /** Current direction. */
  direction: SortDirection;
}

/**
 * Generic client-side sorting for in-memory admin table lists.
 *
 * Sorting is stable (modern engines), and handles null/undefined values
 * (sorted last) plus mixed string|number comparisons gracefully.
 *
 * Usage:
 *   const { sorted, requestSort, sortKey, direction } = useSortableData(filtered);
 *   sorted.map(...)
 */
export function useSortableData<T>(
  items: T[],
  initialKey?: keyof T,
  initialDirection: SortDirection = 'asc',
): UseSortableDataResult<T> {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialKey ?? null);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const sorted = useMemo<T[]>(() => {
    if (!sortKey) return items;
    const arr = [...items];
    arr.sort((a, b) => compareValues(a[sortKey], b[sortKey], direction));
    return arr;
  }, [items, sortKey, direction]);

  const requestSort = (key: keyof T) => {
    setSortKey(key);
    if (sortKey === key) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setDirection('asc');
    }
  };

  return { sorted, requestSort, sortKey, direction };
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') {
    return direction === 'desc' ? b - a : a - b;
  }
  const aStr = String(a);
  const bStr = String(b);
  return direction === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
}
