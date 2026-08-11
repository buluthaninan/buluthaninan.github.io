"use client";

import { useEffect, useState } from "react";
import { useSite } from "./providers";
import { ModKey } from "./bits";
import { profile, ui } from "@/content/content";
import { ALL_THEMES, SECTIONS, SECRET_THEME, cx, type Theme } from "@/lib/site";

const THEME_ICON: Record<Theme, React.ReactNode> = {
  editorial: (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 2.5h7l3 3v8H3z" />
      <path d="M5.5 6.5h5M5.5 9h5M5.5 11.5h3" strokeLinecap="round" />
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1.5 14 5v6l-6 3.5L2 11V5z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2.2" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4.5 6.5 8 3 11.5M8.5 11.5H13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function Nav() {
  const { lang, tr, setTheme, toggleLang, setPaletteOpen } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const links = SECTIONS.map((id) => ({ id, label: tr(ui.nav[id]) }));

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <div
          className={cx(
            "mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-5 sm:px-8",
            "transition-all duration-500",
          )}
        >
          {/* Ad / monogram */}
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 text-sm tracking-tight"
            aria-label={profile.name}
          >
            <span className="grid size-11 place-items-center rounded-[var(--r-card)] border border-line bg-surface font-mono text-[11px] font-bold sm:size-7 transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg">
              {profile.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <span className="hidden font-medium sm:inline">{profile.name}</span>
          </a>

          {/* Bölümler */}
          <nav
            className={cx(
              "hidden items-center gap-1 rounded-[var(--r-pill)] border px-1.5 py-1 md:flex",
              "transition-all duration-500",
              scrolled
                ? "border-line bg-bg/70 backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cx(
                  "relative rounded-[var(--r-pill)] px-3 py-1.5 text-[13px] transition-colors duration-300",
                  active === l.id ? "text-fg" : "text-dim hover:text-fg",
                )}
              >
                {active === l.id && (
                  <span className="absolute inset-0 -z-10 rounded-[var(--r-pill)] bg-fg/[0.07]" />
                )}
                {l.label}
              </a>
            ))}
          </nav>

          {/* Sağ taraf */}
          <div className="flex items-center gap-2">
            {/* Komut paleti */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-[var(--r-pill)] border border-line bg-surface px-3 py-1.5 text-dim transition-colors duration-300 hover:text-fg lg:flex"
              aria-label={tr(ui.palette.open)}
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3 3" strokeLinecap="round" />
              </svg>
              <ModKey className="text-[10px] tracking-widest" />
            </button>

            {/* Tema seçici */}
            <div className="flex items-center gap-0.5 rounded-[var(--r-pill)] border border-line bg-surface p-0.5">
              {ALL_THEMES.map((t) => (
                <button
                  key={t}
                  data-tkey={t}
                  data-locked={t === SECRET_THEME || undefined}
                  onClick={(e) =>
                    setTheme(t, {
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  className="theme-btn grid size-11 place-items-center rounded-[var(--r-pill)] text-dim transition-all duration-300 hover:text-fg sm:size-7"
                  aria-label={tr(ui.themes[t])}
                  title={tr(ui.themes[t])}
                >
                  {THEME_ICON[t]}
                </button>
              ))}
            </div>

            {/* Dil */}
            <button
              onClick={toggleLang}
              className="relative h-11 w-[62px] overflow-hidden rounded-[var(--r-pill)] border border-line bg-surface font-mono text-[11px] uppercase sm:h-8 sm:w-[54px]"
              aria-label="TR / EN"
            >
              <span
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[var(--r-pill)] bg-accent transition-transform duration-[400ms] ease-[var(--ease-spring)]"
                style={{ transform: `translateX(${lang === "en" ? 100 : 0}%)` }}
              />
              <span className="relative flex h-full items-center">
                <span className={cx("flex-1 transition-colors", lang === "tr" ? "text-accent-fg" : "text-dim")}>
                  TR
                </span>
                <span className={cx("flex-1 transition-colors", lang === "en" ? "text-accent-fg" : "text-dim")}>
                  EN
                </span>
              </span>
            </button>

            {/* Mobil menü */}
            <button
              onClick={() => setMenu(true)}
              className="grid size-11 place-items-center rounded-[var(--r-pill)] border border-line bg-surface md:hidden"
              aria-label={tr(ui.nav.menu)}
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 5h11M2.5 11h11" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobil tam ekran menü */}
      <div
        inert={!menu}
        className={cx(
          "fixed inset-0 z-[60] flex flex-col bg-bg transition-all duration-500 md:hidden",
          menu ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="eyebrow">{tr(ui.nav.menu)}</span>
          <button
            onClick={() => setMenu(false)}
            className="grid size-11 place-items-center rounded-[var(--r-pill)] border border-line"
            aria-label={tr(ui.nav.close)}
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-5">
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setMenu(false)}
              className="display border-b border-line py-4 text-[13vw] leading-none transition-transform duration-500"
              style={{
                transitionDelay: `${i * 40}ms`,
                transform: menu ? "none" : "translateY(16px)",
                opacity: menu ? 1 : 0,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
