'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Berita } from '@/types/berita';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShareButtons } from '@/components/features/ShareButtons';
import { formatTanggal, estimasiWaktuBaca } from '@/lib/utils/format';
import { Calendar, User, Eye, ArrowLeft, Tag, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

function formatInlineText(text: string): React.ReactNode {
  if (!text) return null;
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-extrabold text-neutral-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 font-semibold underline hover:text-primary-700"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function renderMarkdownContent(content: string) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = (key: string | number) => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        elements.push(
          <p key={`p-${key}`} className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm sm:text-base mb-4">
            {formatInlineText(text)}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(idx);
      return;
    }

    if (trimmed.startsWith('#### ')) {
      flushParagraph(idx);
      elements.push(
        <h4 key={`h4-${idx}`} className="text-base font-bold text-neutral-900 dark:text-white pt-3 pb-1 mt-4">
          {formatInlineText(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className="text-lg font-bold text-neutral-900 dark:text-white pt-4 pb-1 mt-4">
          {formatInlineText(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph(idx);
      elements.push(
        <h2 key={`h2-${idx}`} className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white pt-6 pb-2 mt-6 border-b border-neutral-200 dark:border-neutral-800">
          {formatInlineText(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph(idx);
      elements.push(
        <h1 key={`h1-${idx}`} className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white pt-6 pb-2 mt-6">
          {formatInlineText(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph(idx);
      elements.push(
        <blockquote key={`bq-${idx}`} className="border-l-4 border-primary-500 pl-4 py-2 italic text-neutral-700 dark:text-neutral-300 bg-primary-50/40 dark:bg-primary-950/20 rounded-r-xl my-4 text-sm sm:text-base">
          {formatInlineText(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      return;
    }

    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushParagraph(idx);
      const [, altText, imgUrl] = imgMatch;
      elements.push(
        <div key={`img-${idx}`} className="my-6 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl} alt={altText || 'Gambar berita'} className="w-full h-auto max-h-[500px] object-cover" />
          {altText && <p className="text-center text-xs text-neutral-500 py-2 italic bg-neutral-50 dark:bg-neutral-900">{altText}</p>}
        </div>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph(idx);
      elements.push(
        <div key={`li-${idx}`} className="flex items-start gap-2 ml-4 my-1 text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
          <span className="text-primary-500 font-bold text-base leading-none mt-1">•</span>
          <span>{formatInlineText(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
      return;
    }

    currentParagraphLines.push(trimmed);
  });

  flushParagraph('final');

  return <div className="space-y-2">{elements}</div>;
}

interface BeritaDetailClientProps {
  berita: Berita;
  terkait: Berita[];
}

export const BeritaDetailClient: React.FC<BeritaDetailClientProps> = ({
  berita,
  terkait,
}) => {
  const { t } = useTranslation();

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-4xl space-y-8">
        {/* Back Link */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-primary-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('BeritaDetail.backToNews')}
        </Link>

        <Breadcrumb
          items={[
            { label: t('BeritaDetail.breadcrumb'), href: '/berita' },
            { label: berita.judul },
          ]}
        />

        {/* Article Header */}
        <div className="space-y-4">
          <Badge variant="primary" size="md">
            {berita.kategori.toUpperCase()}
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
            {berita.judul}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300">
              <User className="w-4 h-4 text-primary-500" />
              {berita.penulis}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-primary-500" />
              {formatTanggal(berita.tanggalTerbit, { withTime: true })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary-500" />
              {estimasiWaktuBaca(berita.konten)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-primary-500" />
              {berita.dibaca} {t('BeritaDetail.readCount')}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={berita.gambarSampul || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
            alt={berita.judul}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Main Content */}
        <Card className="p-8 sm:p-12 space-y-6 text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans text-sm sm:text-base">
          {berita.ringkasan && (
            <p className="text-base sm:text-lg font-medium text-neutral-700 dark:text-neutral-300 border-l-4 border-primary-500 pl-4 py-2 italic bg-primary-50/50 dark:bg-primary-950/30 rounded-r-xl">
              {berita.ringkasan}
            </p>
          )}

          <div className="prose dark:prose-invert max-w-none">
            {renderMarkdownContent(berita.konten)}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-400 mr-2" />
            {berita.tags.map((tag) => (
              <span
                key={tag}
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </Card>

        {/* Share */}
        <ShareButtons title={berita.judul} />

        {/* Related Articles */}
        {terkait.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t('BeritaDetail.relatedTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {terkait.map((item) => (
                <Card key={item.id} hoverable>
                  <div className="p-5 space-y-3">
                    <span className="block text-[11px] font-bold text-primary-600 uppercase">
                      {item.kategori}
                    </span>
                    <Link href={`/berita/${item.slug}`}>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-2">
                        {item.judul}
                      </h4>
                    </Link>
                    <p className="text-xs text-neutral-400">
                      {formatTanggal(item.tanggalTerbit)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

