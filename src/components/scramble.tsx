"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/site";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\{}[]";

/**
 * Metni önce rastgele karakterlerle gösterip harf harf "çözer".
 * Görünüm alanına ilk girişte bir kez çalışır; üzerine gelince tekrarlar.
 */
export function Scramble({
  text,
  className,
  speed = 26,
  replayOnHover = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  replayOnHover?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  const frame = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    if (prefersReducedMotion()) {
      setOut(text);
      return;
    }
    if (timer.current) clearInterval(timer.current);
    frame.current = 0;
    const total = text.length * 2 + 8;

    timer.current = setInterval(() => {
      frame.current += 1;
      const progress = frame.current / total;
      const revealed = Math.floor(progress * text.length * 1.6);

      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (frame.current >= total) {
        setOut(text);
        if (timer.current) clearInterval(timer.current);
      }
    }, speed);
  };

  // Dil değişince metni senkronla
  useEffect(() => setOut(text), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={replayOnHover ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
