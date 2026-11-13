import type { Metadata } from "next";
import SecurityPage from "@/components/portal/pages/SecurityPage";

export const metadata: Metadata = { title: "Security" };

export default function Page() {
  return <SecurityPage />;
}
