"use client";

import { useEffect, useRef } from "react";

/**
 * Siteye özel imleç.
 *
 * Nokta ve halka ayrı iki div değil, TEK bir elemanın ::before / ::after'ı.
 * Daha önce ikisi ayrı elemandı ve biri diğerinden geri kalıp kayıyormuş gibi
 * görünüyordu; tek eleman olunca tek bir transform yazılıyor ve ayrışmaları
 * yapısal olarak imkânsız.
 *
 * Sistem imleci yalnızca bu bileşen gerçekten çalıştığında gizlenir —
 * `data-cursor` özniteliğini JS koyar, betik yüklenmezse imleçsiz kalınmaz.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dokunmatik cihazda özel imleç yok; sistem imleci de gizlenmez.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const node = el.current;
    if (!node) return;

    const root = document.documentElement;
    root.dataset.cursor = "on";

    let hot = false;
    let lastTarget: EventTarget | null = null;

    const onMove = (e: MouseEvent) => {
      node.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      // closest() ve DOM yazımı yalnızca hedef değiştiğinde
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const target = (e.target as HTMLElement | null)?.closest?.(
          "a, button, [data-cursor='hot'], input, textarea",
        ) as HTMLElement | null | undefined;

        // Deneyim satırları gibi tam genişlikte bloklar da <button>. Halkanın
        // onların üzerinde de büyümesi metnin ortasında kocaman bir daire
        // bırakıyordu — büyütmeyi yalnızca elle tutulur hedeflere uygula.
        let next = false;
        if (target) {
          const r = target.getBoundingClientRect();
          next = r.width < 420 && r.height < 120;
        }
        if (next !== hot) {
          hot = next;
          node.dataset.hot = String(hot);
        }
      }
    };

    const onLeave = () => (node.style.opacity = "0");
    const onEnter = () => (node.style.opacity = "1");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      delete root.dataset.cursor;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={el} className="cursor" aria-hidden="true" />;
}
