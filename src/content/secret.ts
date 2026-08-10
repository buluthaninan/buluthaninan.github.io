/**
 * URETILMIS DOSYA — elle duzenleme.
 * Yeniden uretmek icin: node scripts/build-secret.mjs "kelime" "mesaj"
 *
 * Burada kelimenin kendisi YOK. Sadece ozeti ve kelimeden turetilen anahtarla
 * sifrelenmis odul metni var. Kelimeyi bilmeden metin cozulemez.
 */

/** Gizli kelimenin SHA-256 ozeti (normalize edilmis hali uzerinden) */
export const SECRET_HASH = "c73a033912f55e8918a9559368a6b6b34ac83688581f8930ae25adaf489993b4";

/** base64(salt[16] + iv[12] + AES-256-GCM sifreli metin) */
export const SECRET_PAYLOAD =
  "94VCPgYTNyyhQbtkZN/MOUTfmh2/mbX809rxkBhuNXODC+JbsJa3Vc1mgjGlxN5wsx31JrnpnfURiD+60nlSADCWwaKft2GFjMrHII/K3six7A8PTfchsYuzRElK1iJffU8b77bNPCLkxzUAIbFWqqma+5qqFJ0YYkbt9Ovad9DSsbovM1rFjl190gx1yEI8fQT6yG4GQD2n6hkCvlpraVGg0tDU6hXlyExZB/ssvOFooHZTIFzX0Rw4mfd90+up0j3pK4rbNMPFDHoPEMjJxw9eW/0NDRG5OzhO6UJk0n78wWAQXjDaTtBGdc6RgpkayAPvS3M395v8DXqnwIGaa1oCEWW4BRV5hohjNRdqeoC5rIKAXheyQMtoJfDC7Ny8xe9tqOsExC9z7mqoCzkeaYMBQuMKRkunvugpOU3unWLxg5f1lUihwDlQVHmwkiOKY7wY7f83+dwe6pTs/wuqOzrQh7E92Xy8kp9A7vEkcHfCEvQb8OlZTkMHlKHFJx8MGc3dznf5N2x6jJCphfJrHaEYGzcNr8qtEm0M87XrOu0Cv9xeuq+RjUdVGn8Y+b/cGPf62nWmxXwXwOH7/f2A";

/** PBKDF2 tur sayisi — cozucu tarafla ayni olmali */
export const SECRET_ITERATIONS = 210000;
