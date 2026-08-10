export const THEMES = ["editorial", "terminal"] as const;
export type Theme = (typeof THEMES)[number];

export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_THEME: Theme = "editorial";
export const DEFAULT_LANG: Lang = "tr";

export const STORAGE = {
  theme: "portf:theme",
  lang: "portf:lang",
} as const;

export const SECTIONS = ["work", "about", "experience", "contact"] as const;
export type Section = (typeof SECTIONS)[number];

/** Yanip sonmeyi onlemek icin <head> icinde, React'ten once calisan betik. */
export const bootScript = `
(function(){
  try {
    var t = localStorage.getItem("${STORAGE.theme}");
    var l = localStorage.getItem("${STORAGE.lang}");
    var themes = ${JSON.stringify(THEMES)};
    var langs = ${JSON.stringify(LANGS)};
    document.documentElement.dataset.theme = themes.indexOf(t) > -1 ? t : "${DEFAULT_THEME}";
    document.documentElement.lang = langs.indexOf(l) > -1 ? l : "${DEFAULT_LANG}";
  } catch (e) {
    document.documentElement.dataset.theme = "${DEFAULT_THEME}";
  }
})();
`;

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
