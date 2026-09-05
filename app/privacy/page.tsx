import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Chapter Room collects, why, who in your chapter can see it, and what you can do about it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage slug="privacy-policy" />;
}
