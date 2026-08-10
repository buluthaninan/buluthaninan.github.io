# Buluthan İnan — Portfolyo

Next.js (static export) + TypeScript + Tailwind CSS v4 ile yazılmış, iki temalı ve
iki dilli tek sayfa portfolyo. GitHub Pages'e statik olarak çıkar.

## Çalıştırma

```bash
npm run dev
```

`http://localhost:3000`

### Gerçek hızı görmek için

`npm run dev` React'i geliştirme modunda çalıştırır ve belirgin şekilde yavaştır.
Yayındaki gerçek performansı görmek için üretim çıktısını çalıştır:

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

**Tüm metinler ve veriler tek dosyada:** [`src/content/content.ts`](src/content/content.ts)

Bileşenlere dokunmadan siteyi buradan güncelleyebilirsin. Her metin `{ tr, en }`
biçiminde iki dillidir:

```ts
role: t("Full Stack & Flutter Developer", "Full Stack & Flutter Developer"),
```

| Bölüm | İçerik |
| --- | --- |
| `profile` | Ad, unvan, konum, durum rozeti, hero'da dönen kelimeler |
| `contact` | E-posta, sosyal bağlantılar, CV yolları |
| `coreStack` | Hero'nun altındaki teknoloji şeridi |
| `projects` | Proje kartları |
| `skills` | Kategorilere ayrılmış teknolojiler |
| `certificates` | Sertifikalar |
| `experience` | İş ve eğitim zaman çizelgesi |
| `about` | Hakkımda paragrafları ve bilgi kartları |
| `ui` | Buton, başlık gibi arayüz metinleri |

### Yeni proje eklemek

`projects` dizisine bir nesne ekle. Görsel zorunlu değil — `image` boşken `slug`
ve `pattern` alanlarına göre kartın kapağı SVG olarak üretilir. Kullanılabilir
desenler: `grid`, `waves`, `orbit`, `noise`, `bars`, `mesh`, `scan`.

Grid asimetrik: kartların genişliği `src/components/projects.tsx` içindeki
`SPAN_CLASS` dizisinden gelir. Proje sayısını değiştirirsen o diziyi de güncelle.

### Proje görseli eklemek

Görseli `public/` içine koy, projeye `image: "/ornek.png"` satırını ekle.

## CV

İki dildeki PDF, siteyle aynı bilgilerden üretilir:

```bash
python scripts/build_cv.py
```

Çıktı: `public/cv-buluthan-inan-tr.pdf` ve `public/cv-buluthan-inan-en.pdf`
(tek sayfa, A4). Metni değiştirmek için [`scripts/build_cv.py`](scripts/build_cv.py)
içindeki `CV` sözlüğünü düzenle — PDF'leri elle düzenleme, üretilen dosyalardır.

Gereksinim: `pip install reportlab`. Segoe UI kaydedilir, Türkçe karakterler
sorunsuz çıkar.

> Not: PDF adı değişirse `content.ts` içindeki `resume` yollarını da güncelle.
> İsim değiştirmek aynı zamanda tarayıcı önbelleğini de temizler.

## Temalar

`src/app/globals.css` içinde iki blok halinde tanımlı. Renk, font, köşe
yuvarlaklığı ve gölge değerleri sadece CSS değişkenleridir — birini değiştirmek
tüm siteye yayılır.

| Tema | Karakter |
| --- | --- |
| `editorial` | Kırık beyaz kâğıt, dev serif tipografi, mürekkep mavisi vurgu (varsayılan) |
| `terminal` | Fosfor yeşili CRT, tamamı monospace, çalışan komut satırı |

Vurgu rengini değiştirmek için ilgili temanın `--accent` değerini düzenle.

Her temanın kendi hero'su var ve **ikisi de DOM'da durur**; hangisinin
görüneceğine `.only-editorial` / `.only-terminal` sınıflarıyla CSS karar verir.
Böylece tema değişiminde React yeniden render etmez, hiçbir sıçrama olmaz.

Tema eklemek/çıkarmak için `src/lib/site.ts` içindeki `THEMES` dizisi, globals.css
içindeki token bloğu ve `nav.tsx` içindeki `THEME_ICON` birlikte güncellenmeli.
Tarayıcıda kayıtlı geçersiz bir tema adı varsayılana düşer.

## Klavye

| Kısayol | Etki |
| --- | --- |
| `⌘K` / `Ctrl+K` | Komut paleti |
| `↑` `↓` `↵` | Palette gezinme |
| `Esc` | Kapat |
| `↑↑↓↓←→←→BA` | Gizli sürpriz |

Terminal temasındaki komut satırı şunları tanır: `help`, `whoami`, `ls projects`,
`cat <proje>`, `cat about`, `skills`, `contact`, `theme <ad>`, `lang <tr|en>`,
`clear`, `sudo`.

## GitHub Pages'e yayınlama

`.github/workflows/deploy.yml` hazır. `main` dalına her push'ta site otomatik
yayınlanır. Tek seferlik yapılacaklar:

1. GitHub'da `buluthaninan.github.io` adıyla bir depo aç
2. **Settings → Pages → Build and deployment → Source: "GitHub Actions"** seç
3. Depoyu bağla ve push et:

```bash
git remote add origin https://github.com/buluthaninan/buluthaninan.github.io.git
```

```bash
git push -u origin main
```

Site birkaç dakika içinde `https://buluthaninan.github.io` adresinde yayına girer.

### Depo adı farklı olursa

`kullaniciadi.github.io/depo-adi` gibi bir alt yolda yayınlanacaksa
`.github/workflows/deploy.yml` içindeki `BASE_PATH` satırını aç ve depo adını yaz.
Yerelde denemek için:

```bash
BASE_PATH=/depo-adi npm run build
```

Bu ayar yanlışsa CSS ve görseller kırılır.

`public/.nojekyll` dosyası önemli — onsuz GitHub Pages `_next` klasörünü yok sayar.
