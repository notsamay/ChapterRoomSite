import type { Metadata } from "next";
import { Suspense } from "react";
import MembersPage from "@/components/portal/pages/MembersPage";

export const metadata: Metadata = { title: "Members" };

export default function Page() {
  // The page reads the address (which record is open, which filters are on), so it renders in the browser.
  return (
    <Suspense>
      <MembersPage />
    </Suspense>
  );
}
