"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ProfilDesa } from "@/types/desa";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface HeroSectionProps {
  profil: ProfilDesa;
}

/**
 * Slide hero — foto lokal Desa Borong. `imgFilter` menyeimbangkan terang-gelap
 * agar tiap slide terlihat jernih (bukan "burik") sebelum gradien overlay
 * semisutny. Gradien overlay kemudian ditiup lembut agar teks putih tetap
 * readable tanpa menghancurkan warna foto asli.
 */
interface SlideDef {
  image: string;
  imgFilter: string;
  titleKey: string;
  subtitleKey: string;
  locationKey?: string;
}

interface ResolvedSlide extends SlideDef {
  title: string;
  subtitle: string;
  location: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profil }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const slides: ResolvedSlide[] = [
    {
      // Lanskap desa tropis Indonesia — sawah & pepohonan (200 ✅)
      image:
        "https://res.cloudinary.com/euwj88eq/image/upload/e_upscale/e_enhance/w_2560,h_1440,c_fill,g_auto,q_auto:good,f_auto,fl_progressive/4607254f1ee7b1105483aa08f706d240.jpg",
      imgFilter: "brightness-100 saturate-110",
      titleKey: "Home.heroSlide1Title",
      subtitleKey: "Home.heroSlide1Subtitle",
      locationKey: "Home.heroSlide1Location",
    },
    {
      // Lanskap sawah hijau Sulawesi / Jawa — tone hangat (200 ✅)
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2560&q=90&fit=crop&crop=entropy&cs=srgb",
      imgFilter: "brightness-105 saturate-115 contrast-100",
      titleKey: "Home.heroSlide2Title",
      subtitleKey: "Home.heroSlide2Subtitle",
      locationKey: "Home.heroSlide2Location",
    },
    {
      // Alam tropis pegunungan Indonesia — nuansa biru & hijau
      image:
        "https://res.cloudinary.com/euwj88eq/image/upload/e_upscale/e_enhance/w_2560,h_1440,c_fill,g_auto,q_auto:good,f_auto,fl_progressive/825c228b351b3efc777594e8e2cc9e83.jpg",
      imgFilter: "brightness-100 saturate-110",
      titleKey: "Home.heroSlide2Title",
      subtitleKey: "Home.heroSlide2Subtitle",
      locationKey: "Home.heroSlide2Location",
    },
  ].map((s) => ({
    ...s,
    title: t(s.titleKey),
    subtitle: t(s.subtitleKey),
    location: s.locationKey ? t(s.locationKey) : "",
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTrackingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = trackingNumber.trim();
    router.push(
      query
        ? `/layanan/lacak?resi=${encodeURIComponent(query)}`
        : "/layanan/lacak",
    );
  };

  return (
    <section className="relative min-h-[74vh] overflow-hidden bg-[#061a3a] lg:min-h-[80vh]">
      {/* Background Image Slider with Gradient Overlays */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        const isPrevious =
          idx === (currentSlide - 1 + slides.length) % slides.length;
        // Render hanya slide aktif + slide sebelumnya (untuk transisi memudar) agar
        // gambar yang tidak tampil tidak ikut diunduh sekaligus saat halaman dimuat,
        // sehingga hero tetap ringan & tidak menambah beban bandwidth desa.
        if (!isActive && !isPrevious) return null;
        return (
          <div
            key={idx}
            className={`absolute inset-0 ${isActive ? "opacity-100 scale-[1.02]" : "opacity-0 scale-100"}`}
            style={{
              transition: "opacity 1s ease-in-out, transform 7s ease-out",
            }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={isActive}
              quality={75}
              sizes="(max-width: 768px) 100vw, 100vw"
              className={`object-cover ${slide.imgFilter}`}
            />

            {/* Overlay gradien yang DITIPU (bukan hitam pekat) agar foto tetap
                "terlihat", sementara teks putih tetap readable. */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/45 via-transparent to-neutral-950/30" />
          </div>
        );
      })}

      {/* Hero Content Container */}
      <div className="relative z-10 flex min-h-[74vh] items-center lg:min-h-[80vh]">
        <div className="container-desa py-20">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 border-l-2 border-primary-400 pl-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 mb-6 animate-fade-in-down">
            <span>{t("Home.heroTopBadge")}</span>
          </div>

          {/* Slide Title, Subtitle, Location */}
          <div className="max-w-3xl mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.02] tracking-tight mb-4 animate-fade-in-up">
              {slides[currentSlide].title}
            </h1>
            <p
              className="text-lg text-blue-100 max-w-2xl leading-relaxed mb-4 animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              {slides[currentSlide].subtitle}
            </p>
            <p
              className="flex items-center gap-2 text-sm text-blue-200 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <MapPin className="w-4 h-4 text-primary-300" />
              {currentSlide === 0
                ? `${profil.kecamatan}, ${profil.kabupaten}, ${profil.provinsi}`
                : slides[currentSlide].location}
            </p>
          </div>

          {/* Interactive Search / Resi Bar */}
          <form
            onSubmit={handleTrackingSubmit}
            className="w-full max-w-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/40 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-2 mb-8 animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            <div className="flex-1 w-full flex items-center px-4 py-2 sm:py-0 gap-3 text-neutral-700 dark:text-neutral-200 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800">
              <Search className="w-5 h-5 text-primary-600 shrink-0" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                aria-label={t("Home.heroSearchPlaceholder")}
                placeholder={t("Home.heroSearchPlaceholder")}
                className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-neutral-400"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto rounded-xl sm:rounded-full px-6 py-3 text-sm font-bold shadow-lg"
            >
              {t("Home.heroTrack")}
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap items-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "380ms" }}
          >
            <Link href="/layanan">
              <Button
                variant="primary"
                size="lg"
                className="shadow-xl font-bold px-8"
              >
                <FileText className="w-5 h-5" />
                {t("Home.heroApply")}
              </Button>
            </Link>
            <Link href="/informasi/apbdes">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/20 backdrop-blur-md px-8"
              >
                {t("Home.heroTransparency")}
              </Button>
            </Link>
          </div>

          {/* Carousel Slider Controls */}
          <div
            className="flex items-center gap-3 mt-12 animate-fade-in-up"
            style={{ animationDelay: "460ms" }}
          >
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? slides.length - 1 : prev - 1,
                )
              }
              aria-label={t("Home.prevSlide")}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`${t("Home.showSlide")} ${idx + 1}`}
                  aria-current={idx === currentSlide ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-primary-400"
                      : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % slides.length)
              }
              aria-label={t("Home.nextSlide")}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
