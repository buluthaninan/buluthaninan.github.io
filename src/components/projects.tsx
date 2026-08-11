"use client";

import { useEffect, useRef } from "react";
import { useSite } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./bits";
import { Scramble } from "./scramble";
import { ProjectPattern } from "./project-pattern";
import { projects, ui, type Project } from "@/content/content";
import { cx } from "@/lib/site";

/**
 * Asimetrik grid: 12'lik ızgarada her karta farklı genişlik.
 * Tailwind sınıfları tarayarak ürettiği için sınıflar birebir yazılmalı.
 */
const SPAN_CLASS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export function Projects() {
  const { tr } = useSite();

  return (
    <section id="work" className="relative mx-auto max-w-[86rem] scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <Reveal>
        <SectionHeading
          index="01"
          title={tr(ui.sections.workTitle)}
          note={tr(ui.sections.workNote)}
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 90} className={cx(SPAN_CLASS[i] ?? "md:col-span-6")}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { tr } = useSite();
  const ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pending = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });

  /**
   * Fare hareketi React state'ine dokunmaz — her kare yeniden render etmek
   * yerine değerler doğrudan DOM'a yazılır ve rAF ile tek karede toplanır.
   */
  const paint = () => {
    raf.current = 0;
    const { rx, ry, gx, gy } = pending.current;
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty("--gx", `${gx}%`);
      glareRef.current.style.setProperty("--gy", `${gy}%`);
    }
  };

  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  };

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    // Takip sırasında geçiş kapalı olmalı, yoksa her kare yeni animasyon başlar
    cardRef.current?.classList.remove("tilt-ease");
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    pending.current = { rx: (0.5 - py) * 6, ry: (px - 0.5) * 8, gx: px * 100, gy: py * 100 };
    schedule();
  };

  const reset = () => {
    // Ayrılırken yumuşakça düzelsin
    cardRef.current?.classList.add("tilt-ease");
    pending.current = { rx: 0, ry: 0, gx: 50, gy: 50 };
    schedule();
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="group relative h-full"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="surface relative flex h-full flex-col overflow-hidden transition-[box-shadow] duration-500 ease-[var(--ease-out-expo)]"
      >
        {/* Kapak */}
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-bg-soft">
          <div className="size-full transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image} alt={tr(project.title)} className="size-full object-cover" />
            ) : (
              <ProjectPattern project={project} />
            )}
          </div>

          {/* imleci takip eden parıltı */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), ${project.accent}22, transparent 65%)`,
            }}
          />

          {/* yıl rozeti */}
          <span className="absolute left-3 top-3 rounded-[var(--r-pill)] border border-line bg-bg/70 px-2.5 py-1 font-mono text-[10px] tracking-widest backdrop-blur-md">
            {project.year}
          </span>

          {/* etki satırı — üzerine gelince alttan çıkar */}
          <div
            // card-impact: dokunmatik cihazda hep gorunur — mobilde hover yok
            className="card-impact absolute inset-x-0 bottom-0 translate-y-full bg-bg/85 px-4 py-2.5 font-mono text-[11px] backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
            style={{ color: project.accent }}
          >
            ↗ {tr(project.impact)}
          </div>
        </div>

        {/* Metin */}
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="display text-2xl md:text-[1.75rem]">
              <Scramble text={tr(project.title)} speed={20} replayOnHover={false} />
            </h3>
            <span className="mono-xs shrink-0 pt-1 text-faint tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <p className="max-w-prose text-sm leading-relaxed text-dim">{tr(project.summary)}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-3">
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-[var(--r-pill)] border border-line px-2 py-0.5 font-mono text-[10px] text-dim"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-3 text-[12px]">
              {project.links.live && (
                <a href={project.links.live} className="link-underline text-fg">
                  {tr(ui.actions.liveSite)} ↗
                </a>
              )}
              {project.links.repo && (
                <a href={project.links.repo} className="link-underline text-dim hover:text-fg">
                  {tr(ui.actions.sourceCode)}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* alt kenarda vurgu çizgisi */}
        <span
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
          style={{ background: project.accent }}
        />
      </div>
    </article>
  );
}
