import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
}

/**
 * Breadcrumb navigasi untuk halaman dalam. Item terakhir dianggap halaman aktif.
 * Item pertama otomatis menampilkan ikon Beranda.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const crumbs = items.filter((item) => item.label.trim() !== '');

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Beranda</span>
      </Link>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={`${crumb.label}-${index}`}>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700" aria-hidden />
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-800 dark:text-neutral-200" aria-current="page">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};