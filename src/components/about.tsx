"use client";

import { useSite } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./bits";
import { about, certificates, profile, skills, ui } from "@/content/content";

export function About() {
  const { tr } = useSite();
  const allSkills = skills.flatMap((s) => s.items);

  return (
    <section id="about" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
        <Reveal>
          <SectionHeading index="02" title={tr(ui.sections.aboutTitle)} />
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.35fr_1fr] md:gap-20">
          {/* Metin */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <p className="text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[1.35] text-fg">
                {tr(profile.intro)}
              </p>
            </Reveal>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="max-w-prose text-[15px] leading-[1.75] text-dim">{tr(p)}</p>
              </Reveal>
            ))}
          </div>

          {/* "Şu an" kartları */}
          <div className="flex flex-col gap-3">
            {about.now.map((n, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="surface group flex items-baseline justify-between gap-4 p-4 transition-colors duration-300 hover:border-fg/25">
                  <span className="eyebrow shrink-0">{tr(n.label)}</span>
                  <span className="text-right text-sm text-fg">
                    {typeof n.value === "string" ? n.value : tr(n.value)}
                  </span>
                </div>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="surface mt-3 p-5">
                <p className="eyebrow mb-4">{tr(ui.sections.skillsTitle)}</p>
                <div className="flex flex-col gap-4">
                  {skills.map((g) => (
                    <div key={g.group.en} className="flex flex-col gap-1.5">
                      <span className="mono-xs text-faint">{tr(g.group)}</span>
                      <span className="text-[13px] leading-relaxed text-dim">
                        {g.items.join("  ·  ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="surface p-5">
                <p className="eyebrow mb-4">{tr(ui.sections.certificatesTitle)}</p>
                <ul className="flex flex-col gap-2.5">
                  {certificates.map((c) => (
                    <li key={c.name} className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-dim">{c.name}</span>
                      <span className="mono-xs shrink-0 text-faint">{tr(c.issuer)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Kayan teknoloji şeridi */}
      <div className="marquee mt-20 select-none overflow-hidden border-y border-line py-4">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {allSkills.map((s, i) => (
                <span key={`${dup}-${s}-${i}`} className="flex items-center">
                  <span className="display px-6 text-[clamp(1.4rem,3.2vw,2.6rem)] text-dim transition-colors duration-300 hover:text-accent">
                    {s}
                  </span>
                  <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
