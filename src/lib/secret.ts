import { SECRET_HASH, SECRET_ITERATIONS, SECRET_PAYLOAD } from "@/content/secret";

/**
 * Gizli kelimenin dogrulanmasi ve odul metninin cozulmesi.
 *
 * Kodda kelimenin kendisi yok: yalnizca SHA-256 ozeti ve kelimeden turetilen
 * anahtarla sifrelenmis metin var. Kaynagi okuyan biri metni goremez.
 * Sifreleme `scripts/build-secret.mjs` ile uretilir.
 */

/**
 * Kelime normalizasyonu — `scripts/build-secret.mjs` icindekiyle BIREBIR AYNI
 * olmali. NFKD + birlesik isaretleri atmak, 'İ' harfinin kucultulmesinde olusan
 * ustteki noktayi da temizler; boylece BİRİNCİPERDE ile birinciperde eslesir.
 */
function normalize(word: string) {
  return word
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

function hex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function subtle() {
  return typeof crypto !== "undefined" ? crypto.subtle : undefined;
}

/** Yazilan kelime gizli kelime mi? Metni cozmeden, sadece ozetle bakar. */
export async function isSecretWord(word: string): Promise<boolean> {
  const s = subtle();
  if (!s || !word.trim()) return false;
  try {
    const digest = await s.digest("SHA-256", new TextEncoder().encode(normalize(word)));
    return hex(digest) === SECRET_HASH;
  } catch {
    return false;
  }
}

/** Dogru kelimeyle odul metnini cozer. Yanlissa null doner. */
export async function unlockSecret(word: string): Promise<string | null> {
  const s = subtle();
  if (!s) return null;
  try {
    const blob = Uint8Array.from(atob(SECRET_PAYLOAD), (c) => c.charCodeAt(0));
    const salt = blob.slice(0, 16);
    const iv = blob.slice(16, 28);
    const data = blob.slice(28);

    const base = await s.importKey(
      "raw",
      new TextEncoder().encode(normalize(word)),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    const key = await s.deriveKey(
      { name: "PBKDF2", salt, iterations: SECRET_ITERATIONS, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );

    const plain = await s.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(plain);
  } catch {
    // Yanlis anahtarda AES-GCM dogrulamasi patlar — sessizce basarisiz
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  KILIT DURUMU                                                              */
/* -------------------------------------------------------------------------- */

export const UNLOCK_KEY = "portf:unlocked";

export function isUnlocked() {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

/** Kilidi acar ve gizli temanin dugmesini gorunur kilar. */
export function markUnlocked() {
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {}
  document.documentElement.dataset.unlocked = "1";
}
