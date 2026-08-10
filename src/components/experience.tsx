"use client";

import { useState } from "react";
import { useSite } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./bits";
import { experience, ui } from "@/content/content";
import { cx } from "@/lib/site";

export function Experience() {
  const { tr } = useSite();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="experience"
      className="relative mx-auto max-w-[86rem] scroll-mt-24 px-5 py-24 sm:px-8 md:py-32"
    >
      <Reveal>
        <SectionHeading index="03" title={tr(ui.sections.experienceTitle)} />
      </Reveal>

      <ul className="mt-12">
        {experience.map((e, i) => {
          const isOpen = open === i;
          return (
            <Reveal as="li" key={e.org + e.period.en} delay={i * 70}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group grid w-full grid-cols-[auto_1fr] items-start gap-x-5 gap-y-2 border-b border-line py-6 text-left transition-colors duration-300 hover:border-fg/30 md:grid-cols-[10rem_1fr_auto] md:gap-x-10"
              >
                {/* Dönem */}
                <span className="mono-xs flex items-center gap-2 pt-1 text-faint tabular-nums">
                  {e.current && <span className="status-dot" />}
                  {tr(e.period)}
                </span>

                {/* Rol + kurum */}
                <span className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="display text-[clamp(1.4rem,3.2vw,2.25rem)] transition-colors duration-300 group-hover:text-accent">
                      {tr(e.role)}
                    </span>
                    <span className="text-sm text-dim">{e.org}</span>
                  </span>

                  {/* Açıklama — açıldığında yumuşakça iner */}
                  <span
                    className={cx(
                      "grid transition-all duration-500 ease-[var(--ease-out-expo)]",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-2xl pt-2 text-sm leading-relaxed text-dim">
                        {tr(e.description)}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {e.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-[var(--r-pill)] border border-line px-2 py-0.5 font-mono text-[10px] text-faint"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </span>

                {/* Aç/kapa göstergesi */}
                <span className="col-start-2 row-start-1 justify-self-end md:col-start-3">
                  <span
                    className={cx(
                      "grid size-7 place-items-center rounded-[var(--r-pill)] border border-line text-dim transition-all duration-500",
                      isOpen && "rotate-45 border-accent text-accent",
                    )}
                  >
                    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
