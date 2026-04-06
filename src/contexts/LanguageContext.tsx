"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LANGUAGES, LanguageOption, translations, TranslationKey } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  currentLang: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  dir: "ltr",
  currentLang: LANGUAGES[0],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("immi-lang") as Language | null;
    if (stored && translations[stored]) {
      setLangState(stored);
      return;
    }

    // 1. Try browser language tag (e.g. "zh-CN" → "zh", "hi" → "hi")
    const browserTag = navigator.language.toLowerCase();
    const browserBase = browserTag.split("-")[0] as Language;
    if (translations[browserBase]) {
      setLangState(browserBase);
      return;
    }

    // 2. Fallback: detect from IANA timezone (covers cases where browser UI is
    //    in English but the device is in a non-English locale region)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const matched = LANGUAGES.find((l) =>
        l.timezones.some((prefix) => tz === prefix || tz.startsWith(prefix + "/"))
      );
      if (matched && matched.code !== "en") {
        setLangState(matched.code);
      }
    } catch {
      // Intl not available — stay on English default
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("immi-lang", newLang);
  };

  const tFn = (key: TranslationKey): string => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: tFn, dir: currentLang.dir, currentLang }}
    >
      <div dir={currentLang.dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
