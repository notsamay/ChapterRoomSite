import type { Metadata } from "next";
import { Suspense } from "react";
import EventsPage from "@/components/portal/pages/EventsPage";

export const metadata: Metadata = { title: "Events" };

export default function Page() {
  // The page reads the address (which record is open, which filters are on), so it renders in the browser.
  return (
    <Suspense>
      <EventsPage />
    </Suspense>
  );
}
