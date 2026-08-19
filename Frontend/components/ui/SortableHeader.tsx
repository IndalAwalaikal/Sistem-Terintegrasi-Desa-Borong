import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface SortableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Field key this header sorts by. */
  sortKey: string;
  /** Currently sorted field (null if none active). */
  activeKey?: string | null;
  /** Current sort direction. */
  direction?: 'asc' | 'desc';
  /** Click handler — receives the sortKey. */
  onSort?: (key: string) => void;
  /** Column label. */
  children: React.ReactNode;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  className,
  sortKey,
  activeKey,
  direction = 'asc',
  onSort,
  children,
  ...props
}) => {
  const active = activeKey === sortKey;
  const Icon = active ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      {...props}
      className={cn(
        'px-4 py-3 text-left',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800/60',
        active && 'bg-neutral-100 dark:bg-neutral-800/60',
        className,
      )}
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      onClick={() => onSort?.(sortKey)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
      >
        {children}
        <span aria-hidden="true">
          <Icon className="w-3.5 h-3.5 opacity-60" />
        </span>
      </button>
    </th>
  );
};
