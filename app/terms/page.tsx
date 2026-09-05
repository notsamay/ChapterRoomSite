import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Chapter Room, for members and for the officers who run a chapter.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage slug="terms-of-service" />;
}
