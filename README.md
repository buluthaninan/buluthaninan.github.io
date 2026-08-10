# Portfolyo

Next.js (static export) + TypeScript + Tailwind CSS v4 ile yazılmış, üç temalı ve iki dilli tek sayfa portfolyo.

## Çalıştırma

```bash
npm run dev
```

`http://localhost:3000`

### Gerçek hızı görmek için

`npm run dev` React'i geliştirme modunda çalıştırır ve belirgin şekilde yavaştır.
Sitenin yayındaki gerçek performansını görmek için üretim çıktısını çalıştır:

```bash
npm run build
```

```bash
npm run preview
```

`http://localhost:4000` — GitHub Pages'te göreceğin sürümün aynısı.

> Dev sunucusu açıkken `npm run build` çalıştırma; ikisi de `.next` klasörünü
> kullandığı için dev sunucusu bozulur. Önce dev'i durdur.

## İçeriği değiştirme

**Tüm metinler ve veriler tek dosyada:** `src/content/content.ts`

Şu an içindeki her şey örnek (mock) veridir. Bileşenlere dokunmadan sadece bu dosyayı
düzenleyerek siteyi kendi bilgilerinle doldurabilirsin. Her metin `{ tr, en }` biçiminde
iki dillidir:

```ts
role: t("Yazılım Geliştirici", "Software Engineer"),
```

- `profile` — ad, unvan, konum, müsaitlik durumu, hero'da dönen kelimeler
- `contact` — e-posta, sosyal bağlantılar, CV dosyası
- `stats` — hero altındaki sayılar
- `projects` — projeler (görsel yoksa otomatik desen üretilir)
- `skills` — kategorilere ayrılmış teknolojiler
- `experience` — iş/eğitim zaman çizelgesi
- `about` — hakkımda paragrafları ve "şu an" kartları
- `ui` — butonlar, bölüm başlıkları gibi arayüz metinleri

### Proje görseli eklemek

Görseli `public/` içine koy, sonra ilgili projeye `image: "/atlas.png"` satırını ekle.
Bu alan boşken slug'a göre üretilen SVG desen kullanılır.

### CV eklemek

PDF'i `public/cv.pdf` olarak koy, `content.ts` içinde `resume: "/cv.pdf"` yap.
Boş (`null`) kaldığı sürece indirme butonu görünmez.

## Temalar

`src/app/globals.css` içinde üç blok halinde tanımlı. Renk, font, köşe yuvarlaklığı ve
gölge değerleri sadece CSS değişkenleridir — birini değiştirmek tüm siteye yayılır.

| Tema | Karakter |
| --- | --- |
| `editorial` | Kırık beyaz kâğıt, dev serif tipografi, tek sıcak vurgu (varsayılan) |
| `tech` | Koyu zemin, gradient parıltı, grid, cam yüzeyler |
| `terminal` | Fosfor yeşili CRT, tamamı monospace, çalışan komut satırı |

Vurgu rengini değiştirmek için ilgili temanın `--accent` değerini düzenle.

## Klavye

| Kısayol | Etki |
| --- | --- |
| `⌘K` / `Ctrl+K` | Komut paleti |
| `↑` `↓` `↵` | Palette gezinme |
| `Esc` | Kapat |
| `↑↑↓↓←→←→BA` | Gizli sürpriz |

Terminal temasındaki komut satırı `help`, `whoami`, `ls projects`, `cat <proje>`,
`skills`, `contact`, `theme <ad>`, `lang <tr\|en>`, `clear`, `sudo` komutlarını tanır.

## GitHub Pages'e yayınlama

`npm run build` çıktıyı `out/` klasörüne static olarak yazar.

**Site `kullaniciadi.github.io` ise** ek ayar gerekmez.

**Site `kullaniciadi.github.io/depo-adi` ise** build'i alt yol vererek al:

```bash
BASE_PATH=/depo-adi npm run build
```

`public/.nojekyll` dosyası önemli — onsuz GitHub Pages `_next` klasörünü yok sayar.
