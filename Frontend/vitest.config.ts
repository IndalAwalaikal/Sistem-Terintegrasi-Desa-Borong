/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/utils/**/*.ts', 'lib/services/**/*.ts'],
      exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.test.tsx'],
    },
    server: {
      deps: {
        // recharts/leaflet dll hanyar digunakan di komponen lazy; abaikan di
        // util/component test agar tidak me-resolusi paket berat.
        inline: [/clsx/, /tailwind-merge/],
      },
    },
  },
});
