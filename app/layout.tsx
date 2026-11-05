import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./site.css";

// The brand faces, self-hosted: Cabinet Grotesk for headlines and the wordmark,
// Commissioner for everything else.
const cabinet = localFont({
  src: [
    { path: "./fonts/CabinetGrotesk-Medium.woff2", weight: "500" },
    { path: "./fonts/CabinetGrotesk-Bold.woff2", weight: "700" },
    { path: "./fonts/CabinetGrotesk-Extrabold.woff2", weight: "800" },
  ],
  display: "swap",
  variable: "--font-cabinet",
});

const commissioner = localFont({
  src: [
    { path: "./fonts/Commissioner-Regular.woff2", weight: "400" },
    { path: "./fonts/Commissioner-Medium.woff2", weight: "500" },
    { path: "./fonts/Commissioner-SemiBold.woff2", weight: "600" },
    { path: "./fonts/Commissioner-Bold.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-commissioner",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joinchapterroom.com";

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
    icon: [{ url: "/media/app-icon.png", type: "image/png" }],
    apple: [{ url: "/media/app-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#123A2E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cabinet.variable} ${commissioner.variable}`}>
      <body className="bg-pine font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
