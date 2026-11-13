import type { Metadata } from "next";
import { Suspense } from "react";
import RolesPage from "@/components/portal/pages/RolesPage";

export const metadata: Metadata = { title: "Roles and groups" };

export default function Page() {
  // The page reads the address (which record is open, which filters are on), so it renders in the browser.
  return (
    <Suspense>
      <RolesPage />
    </Suspense>
  );
}
