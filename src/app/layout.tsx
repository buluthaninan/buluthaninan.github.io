import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { bootScript } from "@/lib/site";
import { SiteProvider } from "@/components/providers";
import { profile } from "@/content/content";

// Not: değişken adı Tailwind'in kendi `--font-sans` token'ıyla çakışmasın diye
// bilerek `--font-sans-ui`. Üçü de <html> üzerinde tanımlanır ki `:root`'taki
// tema token'ları bu değişkenleri görebilsin.
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-ui",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role.en}`,
  description: profile.tagline.en,
  openGraph: {
    title: `${profile.name} — ${profile.role.en}`,
    description: profile.tagline.en,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#06070c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      data-theme="editorial"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
