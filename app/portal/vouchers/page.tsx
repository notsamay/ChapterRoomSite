import type { Metadata } from "next";
import { Suspense } from "react";
import VouchersPage from "@/components/portal/pages/VouchersPage";

export const metadata: Metadata = { title: "Vouchers" };

export default function Page() {
  // The page reads the address (which voucher or poll is open), so it renders in the browser.
  return (
    <Suspense>
      <VouchersPage />
    </Suspense>
  );
}
