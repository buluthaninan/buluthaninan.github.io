"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./providers";
import { Scramble } from "./scramble";
import { profile, ui } from "@/content/content";
import { cx } from "@/lib/site";

/** Yerel saat — hidrasyon uyuşmazlığı olmasın diye bağlanana kadar boş. */
export function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: profile.timezone,
      }).format(new Date());
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {now ?? "--:--"}
    </span>
  );
}

/** Sırayla değişen kelime — yukarı kayarak geçer. */
export function RotatingWord({ className }: { className?: string }) {
  const { tr } = useSite();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.rotating.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={cx("relative inline-block overflow-hidden align-bottom", className)}>
      {/* Genişliği en uzun kelimeye sabitle ki satır zıplamasın */}
      <span className="invisible block whitespace-nowrap" aria-hidden="true">
        {profile.rotating.map(tr).reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      {profile.rotating.map((w, idx) => (
        <span
          key={idx}
          className="absolute inset-0 whitespace-nowrap transition-all duration-700 ease-[var(--ease-out-expo)]"
          style={{
            transform: `translateY(${(idx - i) * 100}%)`,
            opacity: idx === i ? 1 : 0,
          }}
          aria-hidden={idx !== i}
        >
          {tr(w)}
        </span>
      ))}
    </span>
  );
}

/**
 * Notr durum rozeti — "iş arıyorum" izlenimi vermeden şu an nerede olduğunu söyler.
 * `profile.showStatus` ile tamamen gizlenebilir.
 */
export function StatusPill({ className }: { className?: string }) {
  const { tr } = useSite();
  if (!profile.showStatus) return null;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-line bg-surface px-3 py-1.5 text-[11px] tracking-wide",
        className,
      )}
    >
      <span className="status-dot" />
      {tr(profile.statusLabel)}
    </span>
  );
}

/** Mıknatıslı buton — imleç yaklaştıkça hafifçe çekilir. */
export function MagneticButton({
  href,
  children,
  variant = "solid",
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  // Fare hareketinde render tetiklemeyelim — transform doğrudan DOM'a yazılır.
  const el = useRef<HTMLElement>(null);
  const raf = useRef(0);
  const pending = useRef({ x: 0, y: 0 });

  const paint = () => {
    raf.current = 0;
    if (el.current) {
      el.current.style.transform = `translate(${pending.current.x}px, ${pending.current.y}px)`;
    }
  };

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pending.current = {
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
    };
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  };

  const reset = () => {
    pending.current = { x: 0, y: 0 };
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const base = cx(
    "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[var(--r-pill)] px-6 py-3 text-sm font-medium",
    "transition-[transform,background-color,color,box-shadow] duration-300 ease-[var(--ease-out-expo)]",
    variant === "solid"
      ? "bg-fg text-bg hover:shadow-[var(--glow)]"
      : "border border-line bg-surface text-fg hover:border-fg/40",
    className,
  );

  const inner = (
    <>
      {/* üzerine gelince soldan sağa geçen parıltı */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/25 opacity-0 transition-opacity duration-200 group-hover:animate-[sweep_0.9s_ease-out] group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={el as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={base}
        onMouseMove={onMove}
        onMouseLeave={reset}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={el as React.RefObject<HTMLButtonElement>}
      className={base}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}

/** Bölüm başlığı — numara, çizgi ve başlık. */
export function SectionHeading({
  index,
  title,
  note,
  id,
}: {
  index: string;
  title: string;
  note?: string;
  id?: string;
}) {
  return (
    <div className="section-rule flex flex-col gap-4 pt-6 md:flex-row md:items-end md:justify-between" id={id}>
      <div className="flex items-baseline gap-4">
        <span className="eyebrow tabular-nums">{index}</span>
        <h2 className="display text-[clamp(2rem,6vw,4.25rem)]">
          <Scramble text={title} speed={22} replayOnHover={false} />
        </h2>
      </div>
      {note && <p className="max-w-sm text-sm text-dim md:text-right">{note}</p>}
    </div>
  );
}

/** Aşağı kaydır göstergesi */
export function ScrollCue() {
  const { tr } = useSite();
  return (
    <div className="flex items-center gap-3 text-dim">
      <span className="eyebrow">{tr(ui.hero.scroll)}</span>
      <span className="relative block h-8 w-px overflow-hidden bg-line">
        <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-accent" />
      </span>
    </div>
  );
}
