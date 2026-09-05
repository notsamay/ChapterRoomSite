import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/SiteNav";

const LINK = "transition-colors hover:text-cream";

export default function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-container px-6 pt-[44px]">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8">
          <div className="max-w-[360px]">
            <div className="flex items-center gap-2">
              <Image src="/logo-mark.png" alt="" width={40} height={33} className="h-[32px] w-auto" />
              <Wordmark className="translate-y-px text-[17px]" />
            </div>
            <p className="mt-4 text-[15px] leading-[1.55] text-cream/55">
              Run your chapter from your pocket. Attendance, dues, announcements, chats, albums and vouchers, in
              one app.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8 text-[14px]">
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/40">Product</div>
              <ul className="flex flex-col gap-2 text-cream/65">
                <li><a href="/#chats" className={LINK}>Communication</a></li>
                <li><a href="/#features" className={LINK}>Essentials</a></li>
                <li><a href="/#locked" className={LINK}>Privacy</a></li>
                <li><a href="/#organization" className={LINK}>Organization</a></li>
                <li><a href="/#waitlist" className={LINK}>Early access</a></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/40">Company</div>
              <ul className="flex flex-col gap-2 text-cream/65">
                <li><a href="mailto:support@joinchapterroom.com" className={LINK}>support@joinchapterroom.com</a></li>
                <li><Link href="/privacy" className={LINK}>Privacy policy</Link></li>
                <li><Link href="/terms" className={LINK}>Terms of service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 py-6 text-[13px] text-cream/45">
          <p>&copy; {new Date().getFullYear()} Chapter Room LLC</p>
          <p>Made in Madison, Wisconsin</p>
        </div>
      </div>
    </footer>
  );
}
