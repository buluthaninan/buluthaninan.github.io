/**
 * GIZLI MESAJ URETICISI
 * ---------------------
 * Gizli kelimeyi ve odul metnini alir, `src/content/secret.ts` dosyasini uretir.
 *
 * Uretilen dosyada kelimenin KENDISI yoktur — yalnizca SHA-256 ozeti ve
 * kelimeden turetilen anahtarla AES-256-GCM ile sifrelenmis metin bulunur.
 * Kodu okuyan biri bir hash ve anlamsiz bir base64 blogu gorur; kelimeyi
 * bilmeden metni cozemez.
 *
 * Durustluk notu: dogrulama tarayicida calistigi icin kisa ya da tahmin
 * edilebilir bir kelime sozluk saldirisiyla kirilabilir. Bu "okuyandan gizli"
 * seviyesidir; sir saklama araci degildir.
 *
 * Kullanim:
 *   node scripts/build-secret.mjs "kelime" "satir 1\nsatir 2"
 *   node scripts/build-secret.mjs --file kelime.txt mesaj.txt
 */

import { webcrypto as crypto } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ITERATIONS = 210_000;

/**
 * Kelime normalizasyonu — tarayici tarafindaki `src/lib/secret.ts` ile
 * BIREBIR AYNI olmali, yoksa dogru kelime bile eslesmez.
 */
function normalize(word) {
  return word
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

const hex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function deriveKey(word, salt) {
  const base = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(normalize(word)),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
}

async function main() {
  const args = process.argv.slice(2);
  let word, message;

  if (args[0] === "--file") {
    word = readFileSync(args[1], "utf8");
    message = readFileSync(args[2], "utf8");
  } else {
    [word, message] = args;
  }

  if (!word || !message) {
    console.error('Kullanim: node scripts/build-secret.mjs "kelime" "mesaj"');
    process.exit(1);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(word, salt);

  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(message.replace(/\\n/g, "\n")),
    ),
  );

  // salt + iv + sifreli metin tek bir base64 bloguna
  const blob = new Uint8Array(salt.length + iv.length + cipher.length);
  blob.set(salt, 0);
  blob.set(iv, salt.length);
  blob.set(cipher, salt.length + iv.length);

  const hash = hex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalize(word))),
  );

  const out = `/**
 * URETILMIS DOSYA — elle duzenleme.
 * Yeniden uretmek icin: node scripts/build-secret.mjs "kelime" "mesaj"
 *
 * Burada kelimenin kendisi YOK. Sadece ozeti ve kelimeden turetilen anahtarla
 * sifrelenmis odul metni var. Kelimeyi bilmeden metin cozulemez.
 */

/** Gizli kelimenin SHA-256 ozeti (normalize edilmis hali uzerinden) */
export const SECRET_HASH = "${hash}";

/** base64(salt[16] + iv[12] + AES-256-GCM sifreli metin) */
export const SECRET_PAYLOAD =
  "${Buffer.from(blob).toString("base64")}";

/** PBKDF2 tur sayisi — cozucu tarafla ayni olmali */
export const SECRET_ITERATIONS = ${ITERATIONS};
`;

  const target = fileURLToPath(new URL("../src/content/secret.ts", import.meta.url));
  writeFileSync(target, out, "utf8");

  console.log("src/content/secret.ts yazildi");
  console.log("  kelime uzunlugu :", normalize(word).length, "karakter");
  console.log("  hash            :", hash.slice(0, 24) + "…");
  console.log("  sifreli blok    :", Buffer.from(blob).toString("base64").length, "karakter");
}

main();
