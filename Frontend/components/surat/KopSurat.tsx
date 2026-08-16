'use client';

// Kop resmi surat dinas — Pemerintah Kabupaten Bulukumba / Kecamatan Herlang / Desa Borong.

type KopProps = {
  title?: string;
};

function LogoEmblem() {
  return (
    <div className="shrink-0 flex items-center justify-center pr-2 sm:pr-4">
      <img
        src="/logo-bulukumba.png"
        alt="Logo Kabupaten Bulukumba"
        className="h-20 sm:h-28 w-auto object-contain"
      />
    </div>
  );
}

export default function KopSurat({ title }: KopProps) {
  return (
    <div className="kop-surat print-color font-serif">
      <div className="flex items-center justify-center gap-2 sm:gap-4 pb-1">
        <LogoEmblem />
        <div className="leading-snug text-center space-y-0.5">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-neutral-950">
            PEMERINTAH KABUPATEN BULUKUMBA
          </p>
          <p className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-neutral-950">
            KECAMATAN HERLANG
          </p>
          <p className="text-base sm:text-2xl font-black tracking-wider uppercase text-neutral-950">
            PEMERINTAH DESA BORONG
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-900 leading-tight">
            Alamat: Jl. Poros Borong–Herlang KM 3, Desa Borong, Kec. Herlang, Kab. Bulukumba, Kode Pos 92552
          </p>
          <p className="text-[10px] sm:text-[11px] text-neutral-800 font-sans italic">
            Email: desaborong.id@gmail.com | Website: https://desaborong.id
          </p>
          {title ? <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 uppercase">{title}</p> : null}
        </div>
      </div>

      {/* Garis Pembatas Ganda Khas Surat Dinas */}
      <div className="border-b-[3px] border-neutral-950 w-full mt-1" aria-hidden="true" />
      <div className="border-b border-neutral-950 mt-[2px] w-full" aria-hidden="true" />
    </div>
  );
}