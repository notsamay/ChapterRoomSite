import SiteNav from "@/components/SiteNav";
import Attendance from "@/components/sections/Attendance";
import Chats from "@/components/sections/Chats";
import Colonies from "@/components/sections/Colonies";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import Privacy from "@/components/sections/Privacy";
import Promises from "@/components/sections/Promises";
import Organization from "@/components/sections/Organization";
import SiteFooter from "@/components/sections/SiteFooter";
import Waitlist from "@/components/sections/Waitlist";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chapter Room",
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Android",
  description:
    "Attendance, dues, announcements, chats, albums and vouchers for Greek life chapters, in one app.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteNav />
      <main>
        <Hero />
        <Promises />
        <Chats />
        <Features />
        <Privacy />
        <Organization />
        <Attendance />
        <Colonies />
        <Waitlist />
      </main>
      <SiteFooter />
    </>
  );
}
