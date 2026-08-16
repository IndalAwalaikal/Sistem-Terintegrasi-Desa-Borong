'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wrapper that fades content in from a small offset when the component
 * mounts (i.e. on every client-side route change). Uses CSS animation
 * — content is always visible in SSR / no-JS, and respects
 * `prefers-reduced-motion` via the global CSS media query.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn('animate-fade-in-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
