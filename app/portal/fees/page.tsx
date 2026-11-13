import { redirect } from "next/navigation";

// Membership fees moved into Vouchers, with tickets and merch.
export default function Page() {
  redirect("/portal/vouchers");
}
