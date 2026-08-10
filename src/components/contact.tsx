"use client";

import { useState } from "react";
import { useSite } from "./providers";
import { Reveal } from "./reveal";
import { StatusPill, LocalTime, SectionHeading } from "./bits";
import { contact, profile, ui } from "@/content/content";

export function Contact() {
  const { tr } = useSite();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* pano erişimi yoksa sessizce geç */
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[86rem] scroll-mt-24 px-5 py-24 sm:px-8 md:py-32"
    >
      <Reveal>
        <SectionHeading
          index="04"
          title={tr(ui.sections.contactTitle)}
          note={tr(ui.sections.contactNote)}
        />
      </Reveal>

      {/* Dev e-posta bağlantısı */}
      <Reveal delay={90}>
        {/*
          Punto, en dar font olan monospace'e göre hesaplandı: 25 karakterlik
          e-posta ~15em yer kaplıyor, bu yüzden 5.2vw üstü taşırıyordu.
          whitespace-nowrap da "…gmail.co / m" gibi çirkin bölünmeyi engelliyor.
        */}
        <a
          href={`mailto:${contact.email}`}
          className="group mt-14 block whitespace-nowrap text-[clamp(1.05rem,5.2vw,4.25rem)] leading-[1.15] tracking-tight"
        >
          <span className="display bg-[linear-gradient(to_right,var(--color-accent),var(--color-accent))] bg-[length:0%_100%] bg-no-repeat bg-clip-text transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_100%] group-hover:text-transparent">
            {contact.email}
          </span>
        </a>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-line bg-surface px-4 py-2 text-[13px] text-dim transition-colors duration-300 hover:text-fg"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              {copied ? (
                <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                  <path d="M10.5 3.5h-7a1 1 0 0 0-1 1v7" strokeLinecap="round" />
                </>
              )}
            </svg>
            {copied ? tr(ui.actions.copied) : tr(ui.actions.copyEmail)}
          </button>

          {contact.resume && (
            <a
              href={tr(contact.resume)}
              download
              className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-line bg-surface px-4 py-2 text-[13px] text-dim transition-colors duration-300 hover:text-fg"
            >
              ↓ {tr(ui.actions.downloadCv)}
            </a>
          )}

          <StatusPill />
        </div>
      </Reveal>

      {/* Bağlantılar */}
      <Reveal delay={220}>
        <ul className="mt-16 grid gap-px overflow-hidden border border-line sm:grid-cols-3">
          {contact.socials.map((s) => (
            <li key={s.label} className="bg-line">
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex h-full flex-col justify-between gap-6 bg-bg p-5 transition-colors duration-300 hover:bg-bg-soft"
              >
                <span className="flex items-start justify-between">
                  <span className="text-sm font-medium">{s.label}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="mono-xs text-faint">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const { tr } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[86rem] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="mono-xs text-faint">
          © {year} {profile.name} — {tr(ui.footer.rights)}
        </p>
        <p className="mono-xs text-faint">{tr(ui.footer.secret)}</p>
        <p className="mono-xs flex items-center gap-2 text-faint">
          <span className="status-dot" />
          {tr(profile.location)}
          <span className="text-line">·</span>
          <LocalTime className="tabular-nums" />
        </p>
      </div>
    </footer>
  );
}
