// eslint.config.mjs — Flat config untuk ESLint 9 + Next.js 16
// Next 16 menghapus perintah `next lint`; lint kini dijalankan langsung via `eslint`.
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `react-hooks/set-state-in-effect` (aturan baru dari eslint-plugin-react-hooks v7)
      // menandai pola mount/fetch yang umum & sah di codebase ini (memuat data dalam
      // useEffect, mount portal modal, fallback IntersectionObserver). Dinonaktifkan
      // agar tidak memblokir pola standar React yang sudah dipakai.
      'react-hooks/set-state-in-effect': 'off',
      // Parameter & variabel berprefiks "_" sengaja tidak dipakai (placeholder kontrak API).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'public/**',
    'next-env.d.ts',
    'tsconfig.tsbuildinfo',
    'next.config.mjs',
    'postcss.config.mjs',
    'vitest.config.ts',
    'vitest.setup.ts',
    '**/*.test.ts',
    '**/*.test.tsx',
  ]),
]);
