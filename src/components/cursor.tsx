"use client";

import { useEffect, useRef } from "react";

/**
 * İki parçalı özel imleç: nokta + çevresindeki halka.
 *
 * Halka eskiden imleci gecikmeli takip ediyordu; hareket ederken imleçten
 * kopuk, boşlukta kayan bir daire gibi görünüyordu. Artık ikisi de aynı
 * karede, birebir aynı noktaya yazılıyor — kayma yok.
 *
 * Tıklanabilir öğelerin üzerinde halka büyür. Dokunmatik cihazlarda gizli.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let hot = false;
    let lastTarget: EventTarget | null = null;

    const onMove = (e: MouseEvent) => {
      // mousemove tarayıcı tarafından zaten kare başına birleştiriliyor, araya
      // requestAnimationFrame koymaya gerek yok. Doğrudan yazmak hem daha az
      // parça hem de nokta ile halkanın ayrışması imkânsız.
      const t = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (dot.current) dot.current.style.transform = t;
      if (ring.current) ring.current.style.transform = t;

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
        // bırakıyordu — büyütmeyi yalnızca elle tutulur hedeflere uygula.
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

    const setVisible = (v: string) => () => {
      if (dot.current) dot.current.style.opacity = v;
      if (ring.current) ring.current.style.opacity = v;
    };
    const onLeave = setVisible("0");
    const onEnter = setVisible("1");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
