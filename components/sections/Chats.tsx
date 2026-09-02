import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import AnnouncementsScreen from "@/components/screens/AnnouncementsScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import PollScreen from "@/components/screens/PollScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { Eyebrow, H2_WIDE, PhoneSlot } from "./primitives";

const phones = [
  {
    key: "poll",
    src: SCREENSHOTS.poll,
    alt: "The chapter-wide chat, with an event card and a poll on the formal venue",
    shadow: "0 44px 80px rgba(0,0,0,0.4)",
    screen: <PollScreen />,
  },
  {
    key: "chat",
    src: SCREENSHOTS.chat,
    alt: "The exec board chat, with a screenshot flagged right in the thread",
    shadow: "0 56px 100px rgba(0,0,0,0.48)",
    screen: <ChatScreen />,
  },
  {
    key: "announcements",
    src: SCREENSHOTS.announcements,
    alt: "The announcements feed, where only exec can post",
    shadow: "0 44px 80px rgba(0,0,0,0.4)",
    screen: <AnnouncementsScreen />,
  },
];

export default function Chats() {
  return (
    <section id="chats" className="overflow-hidden bg-pine">
      <div className="mx-auto max-w-container px-6 pb-[clamp(80px,9vw,120px)] pt-[clamp(80px,10vw,130px)] text-center">
        <Reveal>
          <Eyebrow className="text-sage">Feeds and chats</Eyebrow>
          <h2 className={`mx-auto mb-6 max-w-[900px] ${H2_WIDE}`}>Announcements that actually get seen.</h2>
          <p className="mx-auto mb-[70px] max-w-[640px] text-pretty text-[19px] leading-[1.55] text-cream/70">
            Exec posts once and it stays pinned at the top where the chapter can find it. Tag a committee or the whole
            exec board with one mention. Every group gets its own chat, gated by role.
          </p>
        </Reveal>

        <Reveal delay={100} duration={1100} y={48}>
          <div className="rail -mx-6 items-end gap-6 px-6 pb-3 md:mx-0 md:justify-center md:overflow-visible md:px-0 md:pb-0">
            {phones.map((phone) => (
              <PhoneSlot key={phone.key} max={276} railWidth={236}>
                <PhoneFrame
                  width={276}
                  screen="#273043"
                  boxShadow={phone.shadow}
                  src={phone.src}
                  alt={phone.alt}
                >
                  {phone.screen}
                </PhoneFrame>
              </PhoneSlot>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
