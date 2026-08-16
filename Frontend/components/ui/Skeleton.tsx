'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  /** Number of repeated rows (mainly for `.text` variant). */
  count?: number;
  /** Icon-like override (kept for future preset use). */
  size?: number | string;
}

const basePulse = 'animate-pulse bg-neutral-200 dark:bg-neutral-800';

const variants = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-2xl',
};

/**
 * Lightweight skeleton loader.
 *
 * Uses CSS `animate-pulse` (no JS). Respects `prefers-reduced-motion`
 * through the global styles in `globals.css` (animation duration → 0s).
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  count,
  ...props
}) => {
  if (count && count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4 w-full max-w-sm', className)}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(basePulse, variants[variant], className)}
      {...props}
    />
  );
};

/** Preset: full-width text line(s). */
export const SkeletonText: React.FC<SkeletonProps> = ({ className, count, ...props }) => (
  <Skeleton className={cn('h-4 w-full', className)} count={count} {...props} />
);
SkeletonText.displayName = 'SkeletonText';

/** Preset: article/title placeholder. */
export const SkeletonTitle: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <Skeleton className={cn('h-7 w-full max-w-xs', className)} {...props} />
);
SkeletonTitle.displayName = 'SkeletonTitle';

/** Preset: card-shaped placeholder. */
export const SkeletonCard: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <Skeleton
    variant="rectangular"
    className={cn('aspect-[4/3] w-full rounded-3xl', className)}
    {...props}
  />
);
SkeletonCard.displayName = 'SkeletonCard';

/** Preset: avatar circle placeholder. */
export const SkeletonAvatar: React.FC<SkeletonProps> = ({ className, size = 40, ...props }) => (
  <Skeleton
    variant="circular"
    className={cn(className)}
    style={{ width: size, height: size }}
    {...props}
  />
);
SkeletonAvatar.displayName = 'SkeletonAvatar';

