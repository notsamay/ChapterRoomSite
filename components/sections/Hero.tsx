import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import ChapterFeedScreen from "@/components/screens/ChapterFeedScreen";
import { SCREENSHOTS } from "@/components/screenshots";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(120% 90% at 50% -10%, #1B5340 0%, #123A2E 55%, #0B241C 100%)",
      }}
    >
      <div className="mx-auto grid max-w-container-wide grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-14 px-6 pb-[90px] pt-[calc(var(--nav-h)+40px)] md:pt-[calc(var(--nav-h)+56px)]">
        <div className="min-w-0">
          <Reveal delay={60} duration={1000}>
            <h1 className="mb-[26px] text-balance font-display text-[clamp(46px,6.6vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em]">
              Run your chapter from your pocket.
            </h1>
          </Reveal>

          <Reveal delay={120} duration={1000}>
            <p className="mb-[38px] max-w-[520px] text-pretty text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-cream/70">
              Attendance, dues, announcements, chats, albums and vouchers. Everything your chapter runs on, in one
              app that actually looks good.
            </p>
          </Reveal>

          <Reveal delay={180} duration={1000}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#waitlist"
                className="rounded-full bg-cream px-[30px] py-[17px] text-center text-[16px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream"
              >
                Get your chapter in
              </a>
              <a
                href="#attendance"
                className="rounded-full border-[1.5px] border-cream/40 px-[30px] py-4 text-center text-[16px] font-semibold text-cream transition-colors hover:border-cream/70 hover:bg-cream/10"
              >
                Take a look
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} duration={1100} y={40} className="flex min-w-0 justify-center">
          <PhoneFrame
            width={322}
            screen="#1B5340"
            boxShadow="0 60px 110px rgba(0,0,0,0.5)"
            src={SCREENSHOTS.chapterFeed}
            priority
            alt="The Chapter Room home screen: unread chats, the announcements feed and recent albums"
          >
            <ChapterFeedScreen />
          </PhoneFrame>
        </Reveal>
      </div>
    </section>
  );
}
