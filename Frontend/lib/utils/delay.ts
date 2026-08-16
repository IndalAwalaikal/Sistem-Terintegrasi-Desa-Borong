/**
 * Simulasi latency jaringan untuk mock service.
 * Dapat dikonfigurasi via env variable NEXT_PUBLIC_MOCK_DELAY_MS.
 */
export function delay(ms?: number): Promise<void> {
  const baseDelay = ms ?? parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY_MS || '500', 10);
  // Tambahkan variasi ±30% agar terasa lebih natural
  const variation = baseDelay * 0.3;
  const actualDelay = baseDelay + (Math.random() * variation * 2 - variation);
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, actualDelay)));
}
