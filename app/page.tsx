import SiteFooter from "@/components/sections/SiteFooter";
import Hero from "@/components/site/Hero";
import Hierarchy from "@/components/site/Hierarchy";
import Launch from "@/components/site/Launch";
import Nav from "@/components/site/Nav";
import Reveal from "@/components/site/Reveal";
import { ChatsAndFeeds, Events, Features, Money } from "@/components/site/Rivers";
import Security from "@/components/site/Security";
import Setup from "@/components/site/Setup";
import Splash from "@/components/site/Splash";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chapter Room",
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Android",
  description:
    "Chats, events with location check-in, membership fees with payment plans, excuses, feeds and albums, in one app for student orgs.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <div className="cr-site">
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Splash />
      <Nav />
      <main>
        {/* Grounds alternate so no two neighbours share a colour, on every screen size
            (phones hide Chats and feeds, Events and Money):
            emerald, ivory, emerald, ivory, emerald, ivory, black, ivory, emerald, then the black footer. */}
        <Hero />
        <Features />
        <ChatsAndFeeds />
        <Events />
        <Hierarchy />
        <Money />
        <Security />
        <Setup />
        <Launch />
      </main>
      <SiteFooter />
      <Reveal />
    </div>
  );
}
