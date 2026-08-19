'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefreshListener() {
  const router = useRouter();

  useEffect(() => {
    const handleMutation = () => {
      // Invalidate Next.js Client Router Cache so fresh data is fetched
      router.refresh();
    };

    window.addEventListener('app-mutation-success', handleMutation);
    return () => {
      window.removeEventListener('app-mutation-success', handleMutation);
    };
  }, [router]);

  return null;
}
