import type { Metadata } from "next";
import HomePage from "@/components/portal/pages/HomePage";

export const metadata: Metadata = { title: { absolute: "Officer portal · Chapter Room" } };

export default function Page() {
  return <HomePage />;
}
