"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/i18n/translations";
import { useState } from "react";
import { Globe, BarChart2, PlusCircle, ChevronDown, X, Menu, Newspaper, Bot, Cloud } from "lucide-react";
import clsx from "clsx";

export default function Header() {
  const { t, lang, setLang, currentLang } = useLanguage();
  const pathname = usePathname();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop blur bar */}
      <div className="absolute inset-0 bg-[#000918]/80 backdrop-blur-xl border-b border-[rgba(0,61,165,0.4)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#FFD200] to-[#CCB000] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute inset-[1px] rounded-lg border border-[rgba(255,210,0,0.4)]" />
            <span className="font-display font-bold text-lg text-gold-gradient relative z-10 leading-none" style={{ background: 'linear-gradient(135deg, #FFF080, #FFD200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              A
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-semibold text-[#F0F4FF] leading-tight text-sm">
              {t("nav.title")}
            </div>
            <div className="text-[10px] text-[#3D6080] leading-tight tracking-wider uppercase">
              {t("nav.subtitle")}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/"
                ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200] border border-[rgba(255,210,0,0.2)]"
                : "text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            )}
          >
            <BarChart2 size={15} />
            {t("nav.home")}
          </Link>
          <Link
            href="/submit"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/submit"
                ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200] border border-[rgba(255,210,0,0.2)]"
                : "text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            )}
          >
            <PlusCircle size={15} />
            {t("nav.submit")}
          </Link>
          <Link
            href="/news"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/news"
                ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200] border border-[rgba(255,210,0,0.2)]"
                : "text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            )}
          >
            <Newspaper size={15} />
            News
          </Link>
          <Link
            href="/ai-agent"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/ai-agent"
                ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200] border border-[rgba(255,210,0,0.2)]"
                : "text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            )}
          >
            <Bot size={15} />
            AI Advisor
          </Link>
          <Link
            href="/weather"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/weather"
                ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200] border border-[rgba(255,210,0,0.2)]"
                : "text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            )}
          >
            <Cloud size={15} />
            Weather
          </Link>
        </nav>

        {/* Right: Language switcher */}
        <div className="flex items-center gap-3">
          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(10,22,40,0.6)] border border-[rgba(0,61,165,0.5)] text-[#8BB8DC] hover:text-[#F0F4FF] hover:border-[rgba(255,210,0,0.3)] transition-all text-sm"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
              <ChevronDown
                size={13}
                className={clsx("transition-transform", langMenuOpen && "rotate-180")}
              />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl overflow-hidden border border-[rgba(0,61,165,0.6)] bg-[#001028]/95 backdrop-blur-xl shadow-2xl animate-scale-in">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLang(language.code);
                        setLangMenuOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all",
                        language.code === lang
                          ? "bg-[rgba(255,210,0,0.1)] text-[#FFD200]"
                          : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.4)] hover:text-[#F0F4FF]"
                      )}
                      dir={language.dir}
                    >
                      <span className="text-lg leading-none shrink-0">{language.flag}</span>
                      <span className="flex-1 text-left">{language.nativeName}</span>
                      {language.code === lang && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD200] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#8BB8DC] hover:text-[#F0F4FF] hover:bg-[rgba(0,61,165,0.3)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden relative border-t border-[rgba(0,61,165,0.4)] bg-[#000918]/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                pathname === "/"
                  ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200]"
                  : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.3)] hover:text-[#F0F4FF]"
              )}
            >
              <BarChart2 size={16} />
              {t("nav.home")}
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                pathname === "/submit"
                  ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200]"
                  : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.3)] hover:text-[#F0F4FF]"
              )}
            >
              <PlusCircle size={16} />
              {t("nav.submit")}
            </Link>
            <Link
              href="/news"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                pathname === "/news"
                  ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200]"
                  : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.3)] hover:text-[#F0F4FF]"
              )}
            >
              <Newspaper size={16} />
              News
            </Link>
            <Link
              href="/ai-agent"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                pathname === "/ai-agent"
                  ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200]"
                  : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.3)] hover:text-[#F0F4FF]"
              )}
            >
              <Bot size={16} />
              AI Advisor
            </Link>
            <Link
              href="/weather"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                pathname === "/weather"
                  ? "bg-[rgba(255,210,0,0.12)] text-[#FFD200]"
                  : "text-[#8BB8DC] hover:bg-[rgba(0,61,165,0.3)] hover:text-[#F0F4FF]"
              )}
            >
              <Cloud size={16} />
              Weather
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
