import type { Metadata } from "next";
import { Suspense } from "react";
import PollsPage from "@/components/portal/pages/PollsPage";

export const metadata: Metadata = { title: "Polls" };

export default function Page() {
  // The page reads the address (which voucher or poll is open), so it renders in the browser.
  return (
    <Suspense>
      <PollsPage />
    </Suspense>
  );
}
