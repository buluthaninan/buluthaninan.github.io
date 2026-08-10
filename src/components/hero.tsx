"use client";

import { useEffect, useRef } from "react";
import { useSite } from "./providers";
import { StatusPill, LocalTime, MagneticButton, RotatingWord, ScrollCue } from "./bits";
import { TerminalHero } from "./terminal-hero";
import { coreStack, profile, ui } from "@/content/content";

/**
 * Üç tema, üç ayrı hero. Üçü de DOM'da durur, CSS hangisinin görüneceğine karar
 * verir — böylece tema değişiminde yeniden render/hidrasyon zıplaması olmaz.
 */
export function Hero() {
  const { tr } = useSite();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sayfa kaydıkça hero yavaşça yukarı kayıp soluyor (parallax).
  // Değerler doğrudan style'a yazılıyor: CSS değişkeni yazmak tüm alt ağacın
  // stilini yeniden hesaplatır ve kaydırmayı takar.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let done = false;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const limit = window.innerHeight;
        // Hero ekrandan tamamen çıktıysa boşuna çalışma
        if (y > limit) {
          if (!done) {
            el.style.transform = `translate3d(0, ${limit * 0.16}px, 0)`;
            el.style.opacity = "0.15";
            done = true;
          }
          return;
        }
        done = false;
        const p = Math.min(y / (limit * 0.9), 1);
        el.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
        el.style.opacity = String(1 - p * 0.85);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto flex min-h-[100svh] max-w-[86rem] flex-col justify-center px-5 pt-28 pb-16 will-change-[transform,opacity] sm:px-8"
      >
        <div className="only-editorial">
          <EditorialHero />
        </div>
        <div className="only-tech">
          <TechHero />
        </div>
        <div className="only-terminal">
          <TerminalHero />
        </div>

        {/* Ortak alt şerit */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
          <ScrollCue />
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {coreStack.map((s) => (
              <li key={s} className="mono-xs text-dim transition-colors duration-300 hover:text-accent">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function EditorialHero() {
  const { tr } = useSite();
  const words = profile.name.split(" ");

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow flex items-center gap-2">
          {tr(profile.location)}
          <span className="text-line">/</span>
          <LocalTime className="tabular-nums" />
          <span className="text-faint">{tr(ui.hero.localTime)}</span>
        </p>
        <StatusPill />
      </div>

      <h1 className="display text-[clamp(3.2rem,13.5vw,12.5rem)]">
        {words.map((w, i) => (
          <span key={i} className="block overflow-hidden">
            <span
              className="block animate-[rise_1.1s_var(--ease-out-expo)_both]"
              style={{ animationDelay: `${120 + i * 110}ms` }}
            >
              {w}
              {i === words.length - 1 && <span className="text-accent">.</span>}
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-10 grid gap-8 border-t border-line pt-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <p className="text-[clamp(1.05rem,2vw,1.45rem)] leading-snug">
          {tr(profile.role)} <span className="text-faint">—</span>{" "}
          <RotatingWord className="text-accent" />
        </p>
        <div className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-dim">{tr(profile.tagline)}</p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton href="#work">
              {tr(ui.hero.viewWork)}
              <Arrow />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              {tr(ui.hero.getInTouch)}
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function TechHero() {
  const { tr } = useSite();

  return (
    <div className="flex flex-col items-center text-center">
      <StatusPill className="mb-8" />

      <p className="eyebrow mb-5 flex items-center gap-2">
        <span className="text-accent">const</span> role =
        <span className="text-fg">&quot;{tr(profile.role)}&quot;</span>
      </p>

      <h1 className="display text-[clamp(2.8rem,10vw,8.5rem)]">
        <span className="bg-gradient-to-b from-white via-white to-white/45 bg-clip-text text-transparent">
          {profile.name}
        </span>
      </h1>

      <p className="mt-6 font-mono text-sm text-accent md:text-base">
        <span className="text-faint">~/</span>
        <RotatingWord />
        <span className="caret ml-1 align-middle" />
      </p>

      <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-dim">{tr(profile.tagline)}</p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <MagneticButton href="#work" className="!bg-accent !text-accent-fg">
          {tr(ui.hero.viewWork)}
          <Arrow />
        </MagneticButton>
        <MagneticButton href="#contact" variant="ghost">
          {tr(ui.hero.getInTouch)}
        </MagneticButton>
      </div>

      <div className="mt-10 flex items-center gap-3 font-mono text-[11px] text-faint">
        <span className="status-dot" />
        {tr(profile.location)}
        <span className="text-line">·</span>
        <LocalTime className="tabular-nums" />
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
