'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  /** Target value to animate to. */
  value: number;
  /** Custom formatter — defaults to locale-aware thousands separator. */
  formatter?: (value: number) => string;
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Delay before animation starts (ms). */
  delay?: number;
  /** Extra classes for the spanned element. */
  className?: string;
}

/**
 * Animated number counter that counts from 0 → target value when the
 * element enters the viewport. Respects `prefers-reduced-motion`.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  formatter,
  duration = 2000,
  delay = 0,
  className,
}) => {
  const [count, setCount] = useState(value);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setCount(0);

          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            if (elapsed < delay) {
              requestAnimationFrame(animate);
              return;
            }
            const progress = Math.min(
              (elapsed - delay) / duration,
              1
            );
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(value * eased));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration, delay]);

  const displayValue = formatter
    ? formatter(count)
    : count.toLocaleString('id-ID');

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};
