import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Link from "next/link";
import { Enhance, NavToggle } from "@/components/Enhance";
import { LogoMark } from "@/components/Logo";
import { Search } from "@/components/Search";
import { Sidebar } from "@/components/Sidebar";
import { NAV } from "@/lib/docs";
import "./tokens.css";
import "./globals.css";

// The same type as orvyn.cash and the app.
const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.orvyn.cash"),
  title: { default: "Orvyn Docs", template: "%s · Orvyn Docs" },
  description: "How to launch and run AI agents on Orvyn: tokens, earnings, Bliss plugins, limits, OrvynID and the developer APIs.",
  openGraph: { type: "website", siteName: "Orvyn Docs", images: [{ url: "https://orvyn.cash/brand/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
    { media: "(prefers-color-scheme: dark)", color: "#050608" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="topbar">
          <NavToggle />
          <Link href="/" className="topbar-brand" aria-label="Orvyn Docs home">
            <span className="topbar-mark">
              <LogoMark size={22} />
            </span>
            <span className="topbar-word">Orvyn</span>
            <span className="topbar-docs">Docs</span>
          </Link>
          <Search />
          <nav className="topbar-links" aria-label="Orvyn">
            <a href="https://orvyn.cash">orvyn.cash</a>
            <a href="https://app.orvyn.cash" className="topbar-cta">
              Launch app
            </a>
          </nav>
        </header>
        <div className="shell">
          <Sidebar nav={NAV} />
          <main className="main">{children}</main>
        </div>
        <Enhance />
      </body>
    </html>
  );
}
