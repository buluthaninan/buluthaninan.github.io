"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "./providers";
import { ModKey } from "./bits";
import { contact, projects, ui } from "@/content/content";
import { SECTIONS, THEMES, cx, type Theme } from "@/lib/site";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, tr, setTheme, setLang, lang } = useSite();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setPaletteOpen(false);
    };

    const nav: Item[] = SECTIONS.map((s) => ({
      id: `nav-${s}`,
      group: tr(ui.palette.navigate),
      label: tr(ui.nav[s]),
      hint: `#${s}`,
      run: go(s),
    }));

    const proj: Item[] = projects.map((p) => ({
      id: `proj-${p.slug}`,
      group: tr(ui.sections.workTitle),
      label: tr(p.title),
      hint: p.tags.slice(0, 2).join(" · "),
      run: go("work"),
    }));

    const themes: Item[] = THEMES.map((t) => ({
      id: `theme-${t}`,
      group: tr(ui.palette.theme),
      label: tr(ui.themes[t]),
      hint: t,
      run: () => {
        setTheme(t as Theme);
        setPaletteOpen(false);
      },
    }));

    const langs: Item[] = [
      {
        id: "lang-tr",
        group: tr(ui.palette.language),
        label: "Türkçe",
        hint: lang === "tr" ? "✓" : "tr",
        run: () => {
          setLang("tr");
          setPaletteOpen(false);
        },
      },
      {
        id: "lang-en",
        group: tr(ui.palette.language),
        label: "English",
        hint: lang === "en" ? "✓" : "en",
        run: () => {
          setLang("en");
          setPaletteOpen(false);
        },
      },
    ];

    const links: Item[] = [
      {
        id: "copy-mail",
        group: tr(ui.palette.links),
        label: tr(ui.actions.copyEmail),
        hint: contact.email,
        run: () => {
          navigator.clipboard?.writeText(contact.email);
          setPaletteOpen(false);
        },
      },
      ...contact.socials.map((s) => ({
        id: `link-${s.label}`,
        group: tr(ui.palette.links),
        label: s.label,
        hint: s.handle,
        run: () => {
          window.open(s.href, s.href.startsWith("http") ? "_blank" : "_self");
          setPaletteOpen(false);
        },
      })),
    ];

    return [...nav, ...proj, ...themes, ...langs, ...links];
  }, [tr, lang, setTheme, setLang, setPaletteOpen]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    if (!needle) return items;
    return items.filter((it) =>
      `${it.label} ${it.hint ?? ""} ${it.group}`.toLocaleLowerCase("tr").includes(needle),
    );
  }, [items, q]);

  useEffect(() => setI(0), [q, paletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      // odaklanma bir kare sonra, geçiş animasyonu bozulmasın
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${i}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [i]);

  if (!paletteOpen) return null;

  // Grup başlıklarını sırayla ekleyebilmek için
  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={() => setPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 animate-[fade_0.25s_ease-out] bg-black/45 backdrop-blur-sm" />

      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="surface panel relative flex max-h-[70vh] w-full max-w-xl animate-[pop_0.35s_var(--ease-out-expo)] flex-col overflow-hidden"
      >
        {/* Arama */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3.5">
          <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setI((v) => (v + 1) % Math.max(filtered.length, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setI((v) => (v - 1 + filtered.length) % Math.max(filtered.length, 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                filtered[i]?.run();
              }
            }}
            placeholder={tr(ui.palette.placeholder)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
            ESC
          </kbd>
        </div>

        {/* Sonuçlar */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-faint">{tr(ui.palette.empty)}</p>
          )}

          {filtered.map((it, idx) => {
            const showGroup = it.group !== lastGroup;
            lastGroup = it.group;
            return (
              <div key={it.id}>
                {showGroup && (
                  <p className="eyebrow px-4 pb-1 pt-3">{it.group}</p>
                )}
                <button
                  data-idx={idx}
                  onMouseEnter={() => setI(idx)}
                  onClick={it.run}
                  className={cx(
                    "flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm transition-colors",
                    idx === i ? "bg-accent/12 text-fg" : "text-dim",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cx(
                        "h-4 w-px transition-colors",
                        idx === i ? "bg-accent" : "bg-transparent",
                      )}
                    />
                    {it.label}
                  </span>
                  {it.hint && <span className="mono-xs shrink-0 text-faint">{it.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Alt bilgi */}
        <div className="flex shrink-0 items-center gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-faint">
          <span>↑↓ {tr(ui.palette.navigate)}</span>
          <span>↵ {tr(ui.palette.hint)}</span>
          <ModKey className="ml-auto" />
        </div>
      </div>
    </div>
  );
}
