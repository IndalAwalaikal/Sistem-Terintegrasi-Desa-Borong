'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface CountUpProps {
  /** Nilai akhir yang ingin ditampilkan. */
  to: number;
  /** Nilai awal (default 0). */
  from?: number;
  /** Durasi animasi dalam milidetik. */
  duration?: number;
  /** Format angka (mis. formatAngka) diterapkan pada nilai yang ditampilkan. */
  formatter?: (n: number) => string;
  /** Delay awir dalam ms sebelum animasi mulai. */
  delay?: number;
  className?: string;
  'aria-label'?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Menampilkan angka yang "count up" ke nilai target. Ringan (requestAnimationFrame,
 * tidak butuh library). Hormat prefers-reduced-motion: saat dimatikan, langsung
 * loncat ke nilai akhir.
 */
export const CountUp: React.FC<CountUpProps> = ({
  to = 0,
  from = 0,
  duration = 1800,
  formatter,
  delay = 0,
  className,
  ...props
}) => {
  const [val, setVal] = useState(from);
  const rafRef = useRef<number | null>(null);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) {
      setVal(to);
      return;
    }
    const startTime = Date.now() + delay;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setVal(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setVal(to);
      }
    };
    const d = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delay);
        return () => {
      clearTimeout(d);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, from, duration, delay, prefersReduced]);

  const display = formatter ? formatter(val) : Math.round(val);
  return (
    <span className={cn(className)} {...props}>
      {display}
    </span>
  );
};
CountUp.displayName = 'CountUp';
