import Image from "next/image";
import { Wordmark } from "@/components/SiteNav";

export default function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-5 px-6 py-[38px]">
        <div className="flex items-center gap-2">
          <Image src="/logo-mark.png" alt="" width={40} height={33} className="h-[32px] w-auto" />
          <Wordmark className="translate-y-px text-[17px]" />
        </div>
        <p className="text-[13px] text-cream/45">© {new Date().getFullYear()} Chapter Room</p>
      </div>
    </footer>
  );
}
