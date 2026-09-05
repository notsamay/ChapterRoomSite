import FeatureTicker from "@/components/FeatureTicker";
import FloatingChip from "@/components/FloatingChip";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import RotatingWord from "@/components/RotatingWord";
import ChapterFeedScreen from "@/components/screens/ChapterFeedScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import Spotlight from "@/components/Spotlight";

const ROTATING = ["chapter", "rush", "formal", "dues", "roster"];

export default function Hero() {
  return (
    <section
      id="top"
      className="grain relative overflow-hidden"
      style={{
        background: "radial-gradient(120% 90% at 50% -10%, #1B5340 0%, #123A2E 55%, #0B241C 100%)",
      }}
    >
      {/* Slow-moving colour behind everything. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
      </div>
      <Spotlight />

      <div className="relative z-10 mx-auto grid max-w-container-wide grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-14 px-6 pb-[90px] pt-[calc(var(--nav-h)+40px)] md:pt-[calc(var(--nav-h)+56px)]">
        <div className="min-w-0">
          <Reveal delay={60} duration={1000}>
            <h1 className="mb-[26px] text-balance font-display text-[clamp(46px,6.6vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em]">
              Run your
              <br />
              <RotatingWord words={ROTATING} />
              <br />
              from your <span className="text-shimmer">pocket.</span>
            </h1>
          </Reveal>

          <Reveal delay={120} duration={1000}>
            <p className="mb-[38px] max-w-[520px] text-pretty text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-cream/70">
              To your members it&rsquo;s a group chat. To exec it&rsquo;s the whole operation: roster, attendance,
              dues, events and security, in one app.
            </p>
          </Reveal>

          <Reveal delay={180} duration={1000}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#waitlist"
                className="btn-shine group relative overflow-hidden rounded-full bg-cream px-[30px] py-[17px] text-center text-[16px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  Get your chapter in
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
              <a
                href="#chats"
                className="rounded-full border-[1.5px] border-cream/40 px-[30px] py-4 text-center text-[16px] font-semibold text-cream transition-colors hover:border-cream/70 hover:bg-cream/10"
              >
                Take a look
              </a>
            </div>
          </Reveal>

          <Reveal delay={240} duration={1000}>
            <p className="mt-7 text-[13.5px] font-medium text-cream/45">
              Launching spring 2027 on iOS and Android. Colonies at three schools this year.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} duration={1100} y={40} className="relative flex min-w-0 justify-center">
          {/* Ambient light behind the device. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[72%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss/35 blur-[110px]"
          />
          <div className="relative w-full max-w-[432px]">
            {/* The app doing things, around the device. Wide screens only, so nothing overlaps the copy. */}
            <FloatingChip
              initial="S"
              tone="pine"
              title="Senior Send-Off"
              body="8 photos added · Albums"
              time="2d"
              className="absolute -left-[176px] top-[666px] hidden xl:flex animate-float-a"
            />
            <FloatingChip
              initial="J"
              tone="plum"
              title="Spring Formal Ticket"
              body="Paid $65 · Jordan Blake"
              time="1h"
              className="absolute -right-[176px] top-[446px] hidden xl:flex animate-float-b"
            />
            <FloatingChip
              initial="A"
              tone="pine"
              title="Announcements"
              body="Marcus: Homecoming Tailgate"
              time="9h"
              className="absolute -left-[176px] top-[226px] hidden xl:flex animate-float-c"
            />

            <PhoneFrame
              width={432}
              screen="#1B5340"
              boxShadow="0 60px 110px rgba(0,0,0,0.5)"
              src={SCREENSHOTS.chapterFeed}
              priority
              alt="The Chapter Room home screen: unread chats, the announcements feed and recent albums"
            >
              <ChapterFeedScreen />
            </PhoneFrame>
          </div>
        </Reveal>
      </div>

      <FeatureTicker />
    </section>
  );
}
