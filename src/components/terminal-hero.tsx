"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./providers";
import { about, contact, profile, projects, skills, terminalHelp } from "@/content/content";
import { THEMES, type Theme } from "@/lib/site";

type Line = { kind: "in" | "out" | "sys" | "ok" | "err"; text: string };

/** Terminal temasının hero'su: gerçekten komut kabul eden bir kabuk. */
export function TerminalHero() {
  const { tr, lang, setTheme, setLang } = useSite();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const banner: Line[] =
    lang === "tr"
      ? [
          { kind: "sys", text: `${profile.handle}@portfolio — v1.0.0` },
          { kind: "out", text: `${profile.name} · ${tr(profile.role)}` },
          { kind: "out", text: tr(profile.tagline) },
          { kind: "sys", text: "Komutları görmek için 'help' yaz. İpucu: ⌘K de var." },
        ]
      : [
          { kind: "sys", text: `${profile.handle}@portfolio — v1.0.0` },
          { kind: "out", text: `${profile.name} · ${tr(profile.role)}` },
          { kind: "out", text: tr(profile.tagline) },
          { kind: "sys", text: "Type 'help' to see the commands. Tip: ⌘K works too." },
        ];

  // Açılış satırlarını harf harf değil, satır satır yaz
  useEffect(() => {
    setLines([]);
    setBooted(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLines(banner.slice(0, i));
      if (i >= banner.length) {
        clearInterval(id);
        setBooted(true);
      }
    }, 180);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const notFound = (cmd: string) =>
    lang === "tr"
      ? `komut bulunamadı: ${cmd} — 'help' dene`
      : `command not found: ${cmd} — try 'help'`;

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    push({ kind: "in", text: cmd });
    setHistory((h) => [cmd, ...h]);
    setHIndex(-1);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        push(
          ...terminalHelp.map<Line>((h) => ({
            kind: "out",
            text: `${h.cmd.padEnd(14)} ${tr(h.desc)}`,
          })),
        );
        break;

      case "whoami":
        push(
          { kind: "ok", text: profile.name },
          { kind: "out", text: `${tr(profile.role)} · ${tr(profile.location)}` },
          { kind: "out", text: tr(profile.intro) },
        );
        break;

      case "ls":
        if (arg.startsWith("project")) {
          push(
            ...projects.map<Line>((p) => ({
              kind: "out",
              text: `${p.year.padEnd(7)} ${tr(p.title).padEnd(18)} ${p.tags.slice(0, 3).join(" · ")}`,
            })),
            {
              kind: "sys",
              text: lang === "tr" ? "detay için 'cat <proje>'" : "use 'cat <project>' for details",
            },
          );
        } else {
          push({ kind: "out", text: "projects/  about  skills  contact" });
        }
        break;

      case "cat": {
        if (arg === "about") {
          push(...about.paragraphs.map<Line>((p) => ({ kind: "out", text: tr(p) })));
          break;
        }
        const p = projects.find(
          (x) => x.slug === arg || tr(x.title).toLocaleLowerCase("tr") === arg,
        );
        if (p) {
          push(
            { kind: "ok", text: `${tr(p.title)} (${p.year})` },
            { kind: "out", text: tr(p.summary) },
            { kind: "out", text: `→ ${tr(p.impact)}` },
            { kind: "sys", text: p.tags.join(" · ") },
          );
        } else {
          push({ kind: "err", text: notFound(`cat ${arg}`) });
        }
        break;
      }

      case "skills":
        push(
          ...skills.map<Line>((s) => ({
            kind: "out",
            text: `${tr(s.group).padEnd(14)} ${s.items.join(" · ")}`,
          })),
        );
        break;

      case "contact":
        push(
          ...contact.socials.map<Line>((s) => ({
            kind: "out",
            text: `${s.label.padEnd(10)} ${s.handle}`,
          })),
        );
        break;

      case "theme":
        if ((THEMES as readonly string[]).includes(arg)) {
          push({ kind: "ok", text: `→ ${arg}` });
          setTimeout(() => setTheme(arg as Theme), 260);
        } else {
          push({ kind: "err", text: `theme: ${THEMES.join(" | ")}` });
        }
        break;

      case "lang":
        if (arg === "tr" || arg === "en") {
          setLang(arg);
          push({ kind: "ok", text: `→ ${arg}` });
        } else {
          push({ kind: "err", text: "lang: tr | en" });
        }
        break;

      case "clear":
        setLines([]);
        break;

      case "sudo":
        push({
          kind: "ok",
          text:
            lang === "tr"
              ? "İzin verildi. Sanırım birlikte çalışmalıyız → " + contact.email
              : "Permission granted. I think we should work together → " + contact.email,
        });
        break;

      case "exit":
        push({
          kind: "sys",
          text: lang === "tr" ? "buradan çıkış yok :)" : "there is no exit from here :)",
        });
        break;

      default:
        push({ kind: "err", text: notFound(head) });
    }
  }

  const color: Record<Line["kind"], string> = {
    in: "text-fg",
    out: "text-dim",
    sys: "text-faint",
    ok: "text-accent",
    err: "text-red-400",
  };

  return (
    <div
      className="surface mx-auto flex h-[min(66vh,520px)] w-full max-w-3xl flex-col overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* pencere başlığı */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-500/70" />
        <span className="size-2.5 rounded-full bg-yellow-500/70" />
        <span className="size-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[11px] text-faint">
          {profile.handle}@portfolio: ~
        </span>
      </div>

      {/* çıktı */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${color[l.kind]}`}>
            {l.kind === "in" && <span className="text-accent">$ </span>}
            {l.text}
          </div>
        ))}

        {booted && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-accent">$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  run(value);
                  setValue("");
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  const next = Math.min(hIndex + 1, history.length - 1);
                  if (next >= 0) {
                    setHIndex(next);
                    setValue(history[next]);
                  }
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const next = hIndex - 1;
                  setHIndex(next);
                  setValue(next >= 0 ? history[next] : "");
                }
              }}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent font-mono text-[13px] text-fg outline-none"
              aria-label="terminal"
              placeholder={lang === "tr" ? "help" : "help"}
            />
          </div>
        )}
      </div>

      {/* alt bilgi çubuğu */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2 font-mono text-[10px] text-faint">
        <span>↑↓ {lang === "tr" ? "geçmiş" : "history"}</span>
        <span>help</span>
        <span>ls projects</span>
        <span>theme tech</span>
        <span>sudo hire-me</span>
      </div>
    </div>
  );
}
