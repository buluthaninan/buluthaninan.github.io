"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./providers";
import {
  about,
  contact,
  fortunes,
  profile,
  projects,
  skills,
  terminalHelp,
  terminalSecrets,
} from "@/content/content";
import { ALL_THEMES, SECRET_THEME, THEMES, modKeyLabel, type Theme } from "@/lib/site";
import { isUnlocked, markUnlocked, unlockSecret } from "@/lib/secret";

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
  // Canlanan komutlarin (matrix, sudo rm) zamanlayicilari — bilesen kalkarken durdurulur
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const banner: Line[] =
    lang === "tr"
      ? [
          { kind: "sys", text: `${profile.handle}@portfolio — v1.0.0` },
          { kind: "out", text: `${profile.name} · ${tr(profile.role)}` },
          { kind: "out", text: tr(profile.tagline) },
          {
            kind: "sys",
            text: `Komutları görmek için 'help' yaz. İpucu: ${modKeyLabel()} de var.`,
          },
        ]
      : [
          { kind: "sys", text: `${profile.handle}@portfolio — v1.0.0` },
          { kind: "out", text: `${profile.name} · ${tr(profile.role)}` },
          { kind: "out", text: tr(profile.tagline) },
          {
            kind: "sys",
            text: `Type 'help' to see the commands. Tip: ${modKeyLabel()} works too.`,
          },
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

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearInterval);
  }, []);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const notFound = (cmd: string) =>
    lang === "tr"
      ? `komut bulunamadı: ${cmd} — 'help' dene`
      : `command not found: ${cmd} — try 'help'`;

  /* ---------------------------------------------------------------------- */
  /*  GIZLI KOMUTLARIN YARDIMCILARI                                          */
  /* ---------------------------------------------------------------------- */

  /** ESBAŞ'ta geçen süre — sabit yazmak yerine tarihten hesaplanıyor. */
  function uptimeLine() {
    const start = new Date(2022, 9, 1); // Ekim 2022
    const now = new Date();
    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    months %= 12;
    return lang === "tr"
      ? `ESBAŞ'ta ${years} yıl ${months} ay — hâlâ ayakta, hâlâ bakımda`
      : `up ${years} years ${months} months at ESBAŞ — still running, still maintained`;
  }

  function neofetch(): Line[] {
    const info: [string, string][] = [
      [lang === "tr" ? "kullanıcı" : "user", `${profile.handle}@portfolio`],
      [lang === "tr" ? "rol" : "role", tr(profile.role)],
      [lang === "tr" ? "konum" : "location", tr(profile.location)],
      [lang === "tr" ? "çalışma süresi" : "uptime", uptimeLine().replace(/ —.*/, "")],
      [lang === "tr" ? "diller" : "languages", "C# · Dart · JS · Java · SQL"],
      [lang === "tr" ? "kabuk" : "shell", "portfolio-sh 1.0"],
      [lang === "tr" ? "tema" : "theme", document.documentElement.dataset.theme ?? "—"],
      [lang === "tr" ? "projeler" : "projects", String(projects.length)],
    ];
    const logo = [
      "   ____  ",
      "  | __ ) ",
      "  |  _ \\ ",
      "  | |_) |",
      "  |____/ ",
      "         ",
      "         ",
      "         ",
    ];
    return info.map((row, i) => ({
      kind: i === 0 ? "ok" : "out",
      text: `${logo[i] ?? "         "}  ${row[0].padEnd(15)}${row[1]}`,
    }));
  }

  /** Ekranı birkaç saniye dijital yağmura çevirir. */
  function runMatrix() {
    const GLYPHS = "アイウエオカキクケコサシスセソ0123456789ABCDEF";
    const W = 44;
    const H = 11;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setLines(
        Array.from({ length: H }, () => ({
          kind: "ok" as const,
          text: Array.from({ length: W }, () =>
            Math.random() < 0.28 ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(""),
        })),
      );
      if (frame >= 28) {
        clearInterval(id);
        setLines([
          { kind: "sys", text: "^C" },
          {
            kind: "out",
            text: lang === "tr" ? "…tavşan deliği burada bitiyor." : "…the rabbit hole ends here.",
          },
        ]);
      }
    }, 85);
    timers.current.push(id);
  }

  /** `sudo rm -rf /` — sahte silme çubuğu, sonra gerçek. */
  function fakeDelete() {
    const steps =
      lang === "tr"
        ? ["/ siliniyor", "/usr siliniyor", "/home siliniyor", "/var siliniyor", "önyükleyici siliniyor"]
        : ["removing /", "removing /usr", "removing /home", "removing /var", "removing bootloader"];
    let i = 0;
    const id = setInterval(() => {
      if (i < steps.length) {
        const filled = "█".repeat(i * 4 + 4).padEnd(20, "░");
        push({ kind: "err", text: `${filled}  ${steps[i]}…` });
        i += 1;
        return;
      }
      clearInterval(id);
      push(
        { kind: "sys", text: "" },
        {
          kind: "ok",
          text:
            lang === "tr"
              ? "Şaka şaka. Burası statik bir site, silecek bir şey yok."
              : "Only joking. This is a static site; there is nothing to delete.",
        },
        {
          kind: "sys",
          text:
            lang === "tr"
              ? "(gerçek sistemlerde bunu yazma. cidden.)"
              : "(don't type that on a real system. seriously.)",
        },
      );
    }, 340);
    timers.current.push(id);
  }

  /** Gizli kelimeyi dener; doğruysa şifreli mesajı çözer ve temayı açar. */
  function doUnlock(word: string) {
    if (!word) {
      push({ kind: "err", text: "unlock <" + (lang === "tr" ? "kelime" : "word") + ">" });
      return;
    }
    push({ kind: "sys", text: lang === "tr" ? "çözülüyor…" : "decrypting…" });
    unlockSecret(word).then((message) => {
      if (!message) {
        push({
          kind: "err",
          text: lang === "tr" ? "çözülemedi. yanlış kelime." : "could not decrypt. wrong word.",
        });
        return;
      }
      markUnlocked();
      push(
        { kind: "sys", text: "" },
        ...message.split(/\r?\n/).map<Line>((l) => ({ kind: l ? "ok" : "sys", text: l })),
        { kind: "sys", text: "" },
        {
          kind: "sys",
          text:
            lang === "tr"
              ? `kilit açıldı — 'theme ${SECRET_THEME}' artık çalışıyor`
              : `unlocked — 'theme ${SECRET_THEME}' now works`,
        },
      );
    });
  }

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    push({ kind: "in", text: cmd });
    setHistory((h) => [cmd, ...h]);
    setHIndex(-1);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help": {
        const row = (h: { cmd: string; desc: { tr: string; en: string } }): Line => ({
          kind: "out",
          text: `${h.cmd.padEnd(16)} ${tr(h.desc)}`,
        });
        push(...terminalHelp.map(row));
        if (arg === "--all" || arg === "-a") {
          push(
            { kind: "sys", text: "" },
            {
              kind: "sys",
              text: lang === "tr" ? "— listede olmayanlar —" : "— not on the list —",
            },
            ...terminalSecrets.map(row),
          );
        } else {
          push({
            kind: "sys",
            text:
              lang === "tr"
                ? "hepsi bu kadar değil. 'help --all' dene."
                : "that isn't all of them. try 'help --all'.",
          });
        }
        break;
      }

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

      case "theme": {
        const allowed = isUnlocked() ? ALL_THEMES : THEMES;
        if ((allowed as readonly string[]).includes(arg)) {
          push({ kind: "ok", text: `→ ${arg}` });
          setTimeout(() => setTheme(arg as Theme), 260);
        } else {
          push({ kind: "err", text: `theme: ${allowed.join(" | ")}` });
        }
        break;
      }

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
        if (/^rm\s+-rf/.test(arg)) {
          fakeDelete();
          break;
        }
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

      /* ------------------------------------------------------------------ */
      /*  GIZLI KOMUTLAR — `help` ciktisinda gorunmezler                      */
      /* ------------------------------------------------------------------ */

      case "neofetch":
        push(...neofetch());
        break;

      case "uptime":
        push({ kind: "out", text: uptimeLine() });
        break;

      case "tree":
        push(
          { kind: "out", text: "." },
          { kind: "out", text: "├── projeler/        9" },
          { kind: "out", text: "│   ├── esbas/       6" },
          { kind: "out", text: "│   ├── kisisel/     1" },
          { kind: "out", text: "│   └── arastirma/   1" },
          { kind: "out", text: "├── hakkimda" },
          { kind: "out", text: "├── deneyim/         4" },
          { kind: "out", text: "├── iletisim" },
          { kind: "out", text: "└── .gizli/          ?" },
          { kind: "sys", text: lang === "tr" ? "1 klasör okunamadı" : "1 directory unreadable" },
        );
        break;

      case "fortune":
        push({ kind: "out", text: tr(fortunes[Math.floor(Math.random() * fortunes.length)]) });
        break;

      case "coffee":
        push(
          { kind: "out", text: "      )  (" },
          { kind: "out", text: "     (   ) )" },
          { kind: "out", text: "      ) ( (" },
          { kind: "out", text: "    _______)_" },
          { kind: "out", text: " .-'---------|" },
          { kind: "out", text: "( C|/\/\/\/|" },
          { kind: "out", text: " '-./\/\/\/|" },
          { kind: "out", text: "   '_________'" },
          { kind: "out", text: "    '-------'" },
          {
            kind: "sys",
            text: lang === "tr" ? "bu sitenin yakıtı" : "the fuel this site runs on",
          },
        );
        break;

      case "matrix":
        runMatrix();
        break;

      case "vim":
        push(
          { kind: "err", text: lang === "tr" ? "vim açıldı." : "vim opened." },
          {
            kind: "sys",
            text:
              lang === "tr"
                ? ":q ile çıkamazsın. :q! de olmaz. Sekmeyi kapat, tek yolu bu."
                : ":q won't save you. Neither will :q!. Close the tab, it's the only way.",
          },
        );
        break;

      case "xyzzy":
        push({ kind: "sys", text: lang === "tr" ? "Hiçbir şey olmadı." : "Nothing happens." });
        break;

      case "unlock":
        doUnlock(arg);
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
      className="surface mx-auto flex h-[min(58vh,520px)] w-full max-w-3xl flex-col overflow-hidden sm:h-[min(66vh,520px)]"
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
              // 16px altinda iOS odaklaninca sayfayi yakinlastiriyor — mobilde 16px
              className="flex-1 bg-transparent font-mono text-[16px] text-fg outline-none sm:text-[13px]"
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
        <span>theme editorial</span>
        <span>sudo hire-me</span>
      </div>
    </div>
  );
}
