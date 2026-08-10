import type { Project } from "@/content/content";

/**
 * Proje görseli yoksa slug'a göre benzersiz, temaya uyumlu bir kapak deseni üretir.
 * Gerçek ekran görüntüleri gelince `image` alanı doldurulup bu devre dışı kalır.
 */
export function ProjectPattern({ project }: { project: Project }) {
  const a = project.accent;
  const id = project.slug;

  return (
    <svg
      viewBox="0 0 400 250"
      className="size-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} stopOpacity="0.34" />
          <stop offset="100%" stopColor={a} stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={`r-${id}`} cx="50%" cy="45%">
          <stop offset="0%" stopColor={a} stopOpacity="0.45" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="250" fill={`url(#g-${id})`} />

      {project.pattern === "grid" && (
        <g stroke={a} strokeOpacity="0.4" strokeWidth="0.6">
          {Array.from({ length: 17 }, (_, i) => (
            <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="250" />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} />
          ))}
          <rect x="150" y="75" width="100" height="100" fill={a} fillOpacity="0.28" />
          <rect x="175" y="100" width="50" height="50" fill={a} fillOpacity="0.5" />
        </g>
      )}

      {project.pattern === "waves" && (
        <g fill="none" stroke={a} strokeOpacity="0.55" strokeWidth="1.2">
          {Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`M0 ${40 + i * 14} C 70 ${10 + i * 14}, 130 ${80 + i * 14}, 200 ${45 + i * 14} S 330 ${
                15 + i * 14
              }, 400 ${50 + i * 14}`}
              strokeOpacity={0.5 - i * 0.03}
            />
          ))}
        </g>
      )}

      {project.pattern === "orbit" && (
        <g fill="none" stroke={a} strokeOpacity="0.5" strokeWidth="0.9">
          <circle cx="200" cy="125" r="30" fill={a} fillOpacity="0.35" stroke="none" />
          {[55, 82, 109, 136].map((r, i) => (
            <ellipse
              key={r}
              cx="200"
              cy="125"
              rx={r}
              ry={r * 0.42}
              transform={`rotate(${i * 36} 200 125)`}
            />
          ))}
          <circle cx="310" cy="90" r="5" fill={a} stroke="none" />
          <circle cx="98" cy="160" r="3.5" fill={a} stroke="none" />
        </g>
      )}

      {project.pattern === "bars" && (
        <g fill={a}>
          {Array.from({ length: 34 }, (_, i) => {
            // Sunucu ve tarayıcı aynı ondalığı üretsin diye yuvarlanıyor
            const h = Math.round((20 + Math.abs(Math.sin(i * 1.7) * 130)) * 100) / 100;
            return (
              <rect
                key={i}
                x={i * 12 + 3}
                y={Math.round((125 - h / 2) * 100) / 100}
                width="6"
                height={h}
                fillOpacity={0.2 + (i % 5) * 0.13}
                rx="1"
              />
            );
          })}
        </g>
      )}

      {project.pattern === "noise" && (
        <g fill={a}>
          {Array.from({ length: 180 }, (_, i) => {
            const x = (i * 97) % 400;
            const y = (i * 53) % 250;
            const s = 1 + ((i * 7) % 4);
            return <circle key={i} cx={x} cy={y} r={s} fillOpacity={0.12 + ((i % 6) * 0.1)} />;
          })}
          <rect x="0" y="0" width="400" height="250" fill={`url(#r-${id})`} />
        </g>
      )}

      {project.pattern === "mesh" && (
        <g stroke={a} strokeOpacity="0.45" strokeWidth="0.7" fill="none">
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 14 }, (_, c) => {
              const x = c * 30 + 15;
              const y = r * 30 + 15;
              return <circle key={`${r}-${c}`} cx={x} cy={y} r={2 + ((r * c) % 5)} />;
            }),
          )}
          <path d="M0 250 L200 60 L400 250" strokeOpacity="0.7" />
          <path d="M0 250 L120 130 L260 210 L400 100" strokeOpacity="0.4" />
        </g>
      )}

      <rect width="400" height="250" fill={`url(#r-${id})`} opacity="0.5" />
    </svg>
  );
}
