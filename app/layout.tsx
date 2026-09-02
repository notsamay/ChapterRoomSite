import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";

// The two poster statements — the hero and the closing banner — are set in Bricolage.
// next/font self-hosts it, so it costs no third-party request.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

// The wordmark only.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-space",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chapterroom.app";

const description =
  "Attendance, dues, announcements, chats, albums and vouchers. Everything your chapter runs on, in one app that actually looks good. Launching spring 2027 on iOS and Android.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chapter Room — Run your chapter from your pocket",
    template: "%s · Chapter Room",
  },
  description,
  applicationName: "Chapter Room",
  keywords: [
    "fraternity chapter management app",
    "sorority chapter app",
    "Greek life attendance",
    "chapter dues tracking",
    "geofenced check-in",
  ],
  authors: [{ name: "Chapter Room" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Chapter Room",
    title: "Chapter Room — Run your chapter from your pocket",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Chapter Room" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chapter Room — Run your chapter from your pocket",
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#123A2E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Cabinet Grotesk (section headings) and General Sans (everything else) are
            Fontshare faces — no Google Fonts equivalent, so they load from its CDN. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="bg-pine font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
