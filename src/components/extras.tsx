"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./providers";

/** Sayfanın en üstünde ince ilerleme çubuğu. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]" aria-hidden="true">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Yukarı-yukarı-aşağı-aşağı… gizli sürpriz. */
export function KonamiEgg() {
  const { setTheme, lang } = useSite();
  const [fired, setFired] = useState(false);
  const pos = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const want = KONAMI[pos.current];
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === want) {
        pos.current += 1;
        if (pos.current === KONAMI.length) {
          pos.current = 0;
          setFired(true);
          setTheme("terminal");
          setTimeout(() => setFired(false), 4200);
        }
      } else {
        pos.current = got === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setTheme]);

  if (!fired) return null;

  const glyphs = ["01", "10", "{}", "</>", "$", "#", "◆", "✦", "▲", "●"];

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {Array.from({ length: 60 }, (_, i) => (
        <span
          key={i}
          className="absolute font-mono text-accent"
          style={{
            left: `${(i * 37) % 100}%`,
            top: "-6%",
            fontSize: `${10 + ((i * 7) % 16)}px`,
            opacity: 0.4 + ((i % 5) * 0.12),
            animation: `fall ${2.2 + ((i % 7) * 0.35)}s linear ${(i % 11) * 0.14}s both`,
          }}
        >
          {glyphs[i % glyphs.length]}
        </span>
      ))}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
        <p className="display animate-[pop_0.5s_var(--ease-spring)] text-[clamp(1.6rem,6vw,4rem)] text-accent">
          {lang === "tr" ? "gizli mod açıldı" : "secret mode unlocked"}
        </p>
      </div>
    </div>
  );
}
