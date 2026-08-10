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

/**
 * Yanip sonmeyi onlemek icin <head> icinde, React'ten once calisan betik.
 *
 * Isletim sistemi de burada belirlenir: kisayol etiketi Apple'da ⌘, digerlerinde
 * Ctrl olmali. Tespiti React'e birakirsak sunucu ve istemci farkli seyler
 * uretir; boyle yapinca secimi CSS yapiyor ve hidrasyon uyusmazligi olmuyor.
 */
export const bootScript = `
(function(){
  var d = document.documentElement;
  try {
    var t = localStorage.getItem("${STORAGE.theme}");
    var l = localStorage.getItem("${STORAGE.lang}");
    var themes = ${JSON.stringify(THEMES)};
    var langs = ${JSON.stringify(LANGS)};
    d.dataset.theme = themes.indexOf(t) > -1 ? t : "${DEFAULT_THEME}";
    d.lang = langs.indexOf(l) > -1 ? l : "${DEFAULT_LANG}";
  } catch (e) {
    d.dataset.theme = "${DEFAULT_THEME}";
  }
  try {
    var uad = navigator.userAgentData;
    var p = (uad && uad.platform) || navigator.platform || navigator.userAgent || "";
    d.dataset.os = /mac|iphone|ipad|ipod/i.test(p) ? "apple" : "other";
  } catch (e) {
    d.dataset.os = "other";
  }
})();
`;

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Kisayolun duz metin karsiligi — terminal ciktisi gibi JSX kullanamadigimiz
 * yerler icin. Isletim sistemini acilis betiginin yazdigi `data-os` belirler.
 */
export function modKeyLabel() {
  if (typeof document === "undefined") return "Ctrl+K";
  return document.documentElement.dataset.os === "apple" ? "⌘K" : "Ctrl+K";
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
