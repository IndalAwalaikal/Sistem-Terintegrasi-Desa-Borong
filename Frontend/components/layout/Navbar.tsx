"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/lib/i18n/useTranslation";

const logoBulukumba = "/logo-bulukumba.webp";

interface NavMenuItem {
  i18nKey?: string;
  label?: string;
  href: string;
  children?: NavMenuItem[];
}

const menuConfig: NavMenuItem[] = [
  { i18nKey: "Navbar.menuHome", href: "/" },
  {
    i18nKey: "Navbar.menuProfile",
    href: "/profil",
    children: [
      { i18nKey: "Navbar.menuProfileAbout", href: "/profil" },
      { i18nKey: "Navbar.menuProfileHistory", href: "/profil/sejarah" },
      {
        i18nKey: "Navbar.menuProfileStructure",
        href: "/profil/struktur-organisasi",
      },
      { i18nKey: "Navbar.menuProfileArea", href: "/profil/wilayah" },
    ],
  },
  {
    i18nKey: "Navbar.menuInformation",
    href: "/informasi/statistik",
    children: [
      {
        i18nKey: "Navbar.menuInformationStatistik",
        href: "/informasi/statistik",
      },
      { i18nKey: "Navbar.menuInformationApbdes", href: "/informasi/apbdes" },
      { label: "Transparansi Pajak Desa", href: "/informasi/pajak" },
      { i18nKey: "Navbar.menuInformationPeta", href: "/informasi/peta" },
      { i18nKey: "Navbar.menuInformationAgenda", href: "/informasi/agenda" },
      {
        i18nKey: "Navbar.menuInformationFasilitas",
        href: "/informasi/fasilitas",
      },
    ],
  },
  {
    i18nKey: "Navbar.menuServices",
    href: "/layanan",
    children: [
      { i18nKey: "Navbar.menuServicesApply", href: "/layanan" },
      { i18nKey: "Navbar.menuServicesTrack", href: "/layanan/lacak" },
      { i18nKey: "Navbar.menuServicesComplaints", href: "/pengaduan" },
      { i18nKey: "Navbar.menuServicesFaq", href: "/faq" },
    ],
  },
  {
    i18nKey: "Navbar.menuNews",
    href: "/berita",
    children: [
      { i18nKey: "Navbar.menuNewsBerita", href: "/berita" },
      { i18nKey: "Navbar.menuNewsGallery", href: "/galeri" },
      { i18nKey: "Navbar.menuNewsUmkm", href: "/umkm" },
    ],
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="hidden border-b border-white/10 bg-[#061a3a] text-blue-100 md:block">
        <div className="container-desa flex h-9 items-center justify-between text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-3">
            <p>{t("Navbar.portalInfo")}</p>
            <span>•</span>
            <a
              href="https://bulukumbak.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-white font-bold transition-colors underline decoration-dotted flex items-center gap-1"
            >
              Portal Pemkab Bulukumba ↗
            </a>
          </div>
          <p className="text-blue-200">{t("Navbar.officeHours")}</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${scrolled ? "border-blue-100/80 bg-white/90 shadow-[0_12px_32px_rgba(7,35,82,0.10)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90" : "border-transparent bg-white/98 dark:bg-slate-950/98"}`}
      >
        <div className="container-desa flex h-[76px] items-center justify-between gap-5">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label="Beranda Desa Borong"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-white p-1.5 shadow-[0_6px_18px_rgba(7,55,130,0.12)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_25px_rgba(7,55,130,0.18)] dark:border-slate-700 dark:bg-slate-900">
              <Image
                src={logoBulukumba}
                alt="Lambang Kabupaten Bulukumba"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block font-serif text-[19px] font-bold tracking-tight text-[#09285a] dark:text-white sm:text-[21px]">
                Desa Borong
              </span>
              <span className="mt-1 block truncate text-[10px] font-bold uppercase tracking-[0.13em] text-blue-600 dark:text-blue-300">
                Herlang · Bulukumba
              </span>
            </span>
          </Link>

          <nav
            className="hidden h-full items-center xl:flex"
            aria-label="Navigasi utama"
          >
            {menuConfig.map((menu) => {
              const menuLabel = menu.i18nKey
                ? t(menu.i18nKey)
                : (menu.label ?? "Menu");
              return (
                <div
                  key={menu.i18nKey ?? menu.href}
                  className="group relative h-full"
                >
                  <Link
                    href={menu.href}
                    className={`flex h-full items-center gap-1 px-3 text-[13px] font-semibold transition-colors ${isActive(menu.href) ? "text-blue-700 dark:text-blue-300" : "text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-white"}`}
                  >
                    {menuLabel}
                    {menu.children && (
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>
                  {menu.children && (
                    <div className="pointer-events-none absolute left-1/2 top-[68px] w-60 -translate-x-1/2 translate-y-2 rounded-2xl border border-blue-100 bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(4,35,83,0.16)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                      {menu.children.map((child) => {
                        const childLabel = child.i18nKey
                          ? t(child.i18nKey)
                          : (child.label ?? "Menu");
                        const childKey =
                          child.i18nKey ?? child.label ?? child.href;
                        return (
                          <Link
                            key={childKey}
                            href={child.href}
                            className={`block rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${pathname === child.href ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              href="/layanan/lacak"
              className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={t("Navbar.trackApplication")}
            >
              <Search className="h-4 w-4" />
            </Link>
            <LanguageToggle />
            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={t("Navbar.toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  href="/akun"
                  className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-xs font-bold text-white"
                >
                  {user?.nama?.charAt(0)}
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-slate-500 hover:text-blue-700"
                >
                  {t("Navbar.signOut")}
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="rounded-full bg-[#0b4ba8] px-4 shadow-none hover:bg-[#083b86]"
                >
                  {t("Navbar.loginWarga")}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <LanguageToggle />
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full text-slate-600 dark:text-slate-300"
              aria-label={t("Navbar.toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-800 transition hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-200"
              aria-expanded={open}
              aria-label={open ? t("Navbar.closeMenu") : t("Navbar.openMenu")}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`xl:hidden ${open ? "grid" : "hidden"} border-t border-blue-100 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950`}
        >
          <nav
            className="container-desa grid gap-1"
            aria-label={t("Navbar.mobileNav")}
          >
            {menuConfig.map((menu) => {
              const menuLabel = menu.i18nKey
                ? t(menu.i18nKey)
                : (menu.label ?? "Menu");
              return (
                <div key={menu.i18nKey ?? menu.href}>
                  <Link
                    href={menu.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${isActive(menu.href) ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                  >
                    {menuLabel}
                    {menu.children && <ChevronDown className="h-4 w-4" />}
                  </Link>
                  {menu.children && (
                    <div className="ml-4 border-l border-blue-100 py-1 pl-4 dark:border-slate-700">
                      {menu.children.map((child) => {
                        const childLabel = child.i18nKey
                          ? t(child.i18nKey)
                          : (child.label ?? "Menu");
                        const childKey =
                          child.i18nKey ?? child.label ?? child.href;
                        return (
                          <Link
                            key={childKey}
                            href={child.href}
                            className="block py-2 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400"
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-3 flex gap-2 border-t border-blue-100 pt-4 dark:border-slate-800">
              <Link href="/layanan" className="flex-1">
                <Button className="w-full rounded-full">
                  <FileText className="h-4 w-4" /> {t("Navbar.applyLetter")}
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">
                  {t("Navbar.login")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
