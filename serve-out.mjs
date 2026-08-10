/**
 * `out/` klasorunu yayinlayan kucuk statik sunucu — bagimlilik yok.
 * Uretim ciktisini GitHub Pages'teki gibi gormek icin:
 *   npm run build && node serve-out.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./out/", import.meta.url));
const PORT = 4000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let path = join(ROOT, normalize(url).replace(/^(\.\.[/\\])+/, ""));

    try {
      if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    } catch {
      path = path.endsWith(".html") ? path : `${path}.html`;
    }

    const body = await readFile(path);
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
  }
}).listen(PORT, () => console.log(`Uretim ciktisi: http://localhost:${PORT}`));
