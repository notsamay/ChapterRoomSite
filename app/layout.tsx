import type { Metadata } from "next";
import { Alfa_Slab_One, Libre_Franklin, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const slab = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-slab" });
const sans = Libre_Franklin({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Chapter Room — Run your chapter from your pocket",
  description:
    "Chapter Room is the operating system for Greek life chapters: attendance, dues, feeds, group chats, and fully customizable roles. Coming soon to the App Store and Google Play.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${slab.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-pine text-cream font-sans antialiased">{children}</body>
    </html>
  );
}
