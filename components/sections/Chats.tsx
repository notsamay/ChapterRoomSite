import FloatingChip from "@/components/FloatingChip";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import AnnouncementsScreen from "@/components/screens/AnnouncementsScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import Spotlight from "@/components/Spotlight";
import { Eyebrow, H2_WIDE } from "./primitives";

type Chip = {
  initial: string;
  tone: "navy" | "moss" | "pine" | "plum" | "brick";
  title: string;
  body: string;
  time: string;
  className: string;
};

const rows: {
  key: string;
  src: string | null;
  alt: string;
  screen: React.ReactNode;
  title: string;
  body: string;
  points: string[];
  chips: Chip[];
}[] = [
  {
    key: "chats",
    src: SCREENSHOTS.chat,
    alt: "The rush committee chat, a four-person group with medium security on",
    screen: <ChatScreen />,
    title: "One chat for the house. One for every group.",
    body: "Polls, event cards and vouchers live in the thread. Committees, the rush team and the pledge class each get their own chat, gated by position, with the security level right in the header.",
    points: [
      "Nicknames, reactions, pinned messages, swipe-to-reply",
      "Groups lock to a position when they should, and a role change pulls you out of chats you no longer qualify for",
      "Mute forever or just for tonight. Never double-pinged for a mention and a reply",
    ],
    chips: [
      { initial: "R", tone: "brick", title: "Medium security on", body: "Screenshots here get flagged and logged", time: "now", className: "left-1/2 top-[122px] -translate-x-1/2 animate-float-b" },
      { initial: "R", tone: "navy", title: "Rush Team", body: "Locked to Rush Chair + members", time: "1d", className: "-left-[150px] top-[560px] animate-float-a" },
    ],
  },
  {
    key: "feeds",
    src: SCREENSHOTS.announcements,
    alt: "The announcements feed, where only exec can post",
    screen: <AnnouncementsScreen />,
    title: "Feeds only the right people can post to.",
    body: "Broadcast feeds for officers, discussion feeds for everyone, boards for the in-between. Each feed has its own audience and its own list of who can post.",
    points: [
      "Tag @Pledges or @ExecBoard and the whole group is pinged once",
      "Aim a post at a position and nobody else sees it",
      "Event reminders go out an hour before",
    ],
    chips: [
      { initial: "A", tone: "pine", title: "Announcements", body: "Pledges only · Homecoming setup", time: "9h", className: "-right-[150px] top-[118px] animate-float-b" },
      { initial: "M", tone: "pine", title: "Marcus Webb", body: "Mentioned @exec in Announcements", time: "4h", className: "-right-[150px] top-[688px] animate-float-c" },
    ],
  },
];


export default function Chats() {
  return (
    <section id="chats" className="grain relative overflow-hidden bg-pine">
      <Spotlight />
      <div className="relative z-10 mx-auto max-w-container px-6 pb-[clamp(72px,9vw,120px)] pt-[clamp(80px,10vw,130px)]">
        <Reveal from="blur" className="mb-[clamp(56px,7vw,96px)] max-w-[900px]">
          <Eyebrow className="text-sage">Communication</Eyebrow>
          <h2 className={H2_WIDE}>Say it once. The right people see it.</h2>
        </Reveal>

        <div className="flex flex-col gap-[clamp(72px,9vw,128px)]">
          {rows.map((row, i) => {
            const flipped = i % 2 === 1;
            return (
              <div
                key={row.key}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-x-[70px] gap-y-12"
              >
                <Reveal
                  delay={60}
                  duration={1000}
                  y={40}
                  from={flipped ? "right" : "left"}
                  className={`relative flex min-w-0 justify-center ${flipped ? "md:order-2" : ""}`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/20 blur-[110px]"
                  />
                  <div className="relative w-full max-w-[402px]">
                    {row.chips.map(({ className, ...chip }) => (
                      <FloatingChip key={chip.title + chip.body} {...chip} className={`absolute hidden xl:flex ${className}`} />
                    ))}
                    <PhoneFrame
                      width={402}
                      screen="#273043"
                      boxShadow="0 56px 100px rgba(0,0,0,0.48)"
                      src={row.src}
                      alt={row.alt}
                    >
                      {row.screen}
                    </PhoneFrame>
                  </div>
                </Reveal>

                <Reveal
                  delay={140}
                  y={30}
                  from={flipped ? "left" : "right"}
                  className={`min-w-0 ${flipped ? "md:order-1" : ""}`}
                >
                  <h3 className="mb-5 max-w-[520px] font-head text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
                    {row.title}
                  </h3>
                  <p className="mb-7 max-w-[520px] text-pretty text-[18px] leading-[1.6] text-cream/70">{row.body}</p>
                  <ul className="flex max-w-[520px] flex-col gap-3.5">
                    {row.points.map((point) => (
                      <li key={point} className="flex items-start gap-3.5">
                        <span className="mt-[9px] h-[9px] w-[9px] shrink-0 rounded-full bg-sage" aria-hidden="true" />
                        <span className="text-[16px] leading-[1.55] text-cream/80">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
