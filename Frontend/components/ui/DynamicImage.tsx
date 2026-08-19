import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  /** URL pengganti saat gambar gagal dimuat (mis. avatar placeholder). */
  fallbackSrc?: string;
}

/**
 * Gambar dinamis (Blob URL hasil upload, URL eksternal pengguna, dll.) yang TIDAK
 * cocok untuk `next/image` (domain tidak statis / tidak bisa dioptimasi).
 * Komponen ini membungkus `<img>` biasa di satu tempat sehingga aturan
 * `@next/next/no-img-element` tidak menyebar ke seluruh codebase.
 */
export const DynamicImage: React.FC<DynamicImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  onError,
  ...props
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- URL dinamis (Blob/eksternal), bukan domain statis
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      onError={(event) => {
        if (fallbackSrc) {
          const el = event.target as HTMLImageElement;
          if (el.src !== fallbackSrc) el.src = fallbackSrc;
        }
        onError?.(event);
      }}
      {...props}
    />
  );
};
DynamicImage.displayName = 'DynamicImage';
