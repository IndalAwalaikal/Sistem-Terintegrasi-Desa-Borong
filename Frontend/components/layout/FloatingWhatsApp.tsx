'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Tombol WhatsApp melayang sebagai kanal bantuan warga.
 *
 * TODO(frontend): ganti "6288xxxxxxxx" dengan nomor resmi perangkat desa
 * (format internasional tanpa tanda + / spasi).
 */
const WA_NUMBER = '6285757106358';

const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Halo Admin Desa Borong, saya ingin bertanya tentang layanan desa.'
)}`;

export const FloatingWhatsApp: React.FC = () => {
  if (WA_NUMBER.includes('x')) {
    // Belum dikonfigurasi: jangan tampilkan tombol yang mengarah ke nomor palsu.
    return null;
  }

  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp perangkat desa"
      className="fixed bottom-20 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden md:inline">Bantuan Desa</span>
    </a>
  );
};