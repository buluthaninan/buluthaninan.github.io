"use client";

import { useEffect, useRef } from "react";

/**
 * İki parçalı özel imleç: anında takip eden nokta + gecikmeli halka.
 * Tıklanabilir öğelerin üzerinde halka büyür. Dokunmatik cihazlarda gizli.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    let hot = false;
    let lastTarget: EventTarget | null = null;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;

      // closest() ve DOM yazımı yalnızca hedef değiştiğinde
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const el = e.target as HTMLElement | null;
        const target = el?.closest?.("a, button, [data-cursor='hot'], input, textarea") as
          | HTMLElement
          | null
          | undefined;

        // Deneyim satırları gibi tam genişlikte bloklar da <button>. Halkanın
        // onların üzerinde de büyümesi, metnin ortasında kocaman bir daire
        // bırakıyordu — büyütmeyi yalnızca elle tutulur boyuttaki hedeflere uygula.
        let next = false;
        if (target) {
          const r = target.getBoundingClientRect();
          next = r.width < 420 && r.height < 120;
        }

        if (next !== hot) {
          hot = next;
          if (ring.current) ring.current.dataset.hot = String(hot);
        }
      }
    };

    const loop = () => {
      const dx = mx - rx;
      const dy = my - ry;
      // Halka yerine oturduysa boşuna yazma
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rx += dx * 0.18;
        ry += dy * 0.18;
        if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
