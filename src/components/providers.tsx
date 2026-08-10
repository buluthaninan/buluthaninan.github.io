"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  DEFAULT_THEME,
  LANGS,
  STORAGE,
  THEMES,
  prefersReducedMotion,
  type Lang,
  type Theme,
} from "@/lib/site";
import type { I18n } from "@/content/content";

type Ctx = {
  theme: Theme;
  lang: Lang;
  /** origin verilirse tema gecisi o noktadan dalga halinde yayilir */
  setTheme: (t: Theme, origin?: { x: number; y: number }) => void;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** iki dilli metni secili dile gore cozer */
  tr: (v: I18n) => string;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  mounted: boolean;
};

const SiteCtx = createContext<Ctx | null>(null);

export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Boot betiginin <html> uzerine yazdigi degerleri React tarafina al.
  useEffect(() => {
    const el = document.documentElement;
    const t = el.dataset.theme as Theme | undefined;
    const l = (localStorage.getItem(STORAGE.lang) ?? el.lang) as Lang;
    if (t && (THEMES as readonly string[]).includes(t)) setThemeState(t);
    if (l && (LANGS as readonly string[]).includes(l)) setLangState(l);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
    const root = document.documentElement;

    const apply = () => {
      root.dataset.theme = next;
      setThemeState(next);
      try {
        localStorage.setItem(STORAGE.theme, next);
      } catch {}
    };

    const canAnimate =
      !prefersReducedMotion() &&
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!canAnimate) {
      apply();
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    root.style.setProperty("--wipe-x", `${x}px`);
    root.style.setProperty("--wipe-y", `${y}px`);

    document.startViewTransition(apply);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE.lang, next);
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "tr" ? "en" : "tr";
      document.documentElement.lang = next;
      try {
        localStorage.setItem(STORAGE.lang, next);
      } catch {}
      return next;
    });
  }, []);

  const tr = useCallback((v: I18n) => v[lang], [lang]);

  // ⌘K / Ctrl+K komut paleti
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      lang,
      setTheme,
      setLang,
      toggleLang,
      tr,
      paletteOpen,
      setPaletteOpen,
      mounted,
    }),
    [theme, lang, setTheme, setLang, toggleLang, tr, paletteOpen, mounted],
  );

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}
