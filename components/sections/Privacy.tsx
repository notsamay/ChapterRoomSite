import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import SecurityAlertScreen from "@/components/screens/SecurityAlertScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2 } from "./primitives";

const guarantees = [
  {
    title: "Flagged in the thread",
    body: "Everyone in the chat sees when a screenshot happens, right where it happened.",
  },
  {
    title: "Kept on record",
    body: "The captured screen lands in a log only your security officers can open.",
  },
  {
    title: "No shareable links",
    body: "Photos and videos only open for members. A copied link is dead outside the app.",
  },
  {
    title: "Roster only",
    body: "Members join with a code from your own roster. Nobody else sees a thing.",
  },
];

export default function Privacy() {
  return (
    <section id="locked" className="overflow-hidden bg-ink">
      <div className={`mx-auto grid max-w-container grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-[70px] ${BAND}`}>
        <Reveal className="min-w-0" y={30}>
          <Eyebrow className="text-brick-light">Privacy</Eyebrow>
          <h2 className={`mb-6 ${H2}`}>What&rsquo;s said in the chapter stays in the chapter.</h2>
          <p className="mb-8 max-w-[520px] text-pretty text-[18.5px] leading-[1.6] text-cream/70">
            Turn up the security on any chat or feed and the app watches for screenshots. It posts a notice in the
            thread, saves what was on the screen, and files it where only the officers you pick can look. Straight up:
            no app can stop a camera. This one makes sure it never happens quietly.
          </p>
          <p className="mb-[30px] mt-[-14px] max-w-[520px] text-[16px] leading-[1.6] text-cream/50">
            Chapter business, chapter eyes. Nothing more complicated than that.
          </p>

          <div className="grid max-w-[540px] grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="rounded-[20px] border border-cream/10 bg-cream/[0.06] px-[22px] pb-6 pt-[22px]"
              >
                <div className="mb-2 font-head text-[19px] font-extrabold tracking-[-0.02em]">{guarantee.title}</div>
                <p className="text-[15px] leading-[1.55] text-cream/60">{guarantee.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100} duration={1000} y={40} className="flex min-w-0 justify-center">
          <PhoneFrame
            width={372}
            screen="#4D2D3B"
            bezel="#000000"
            boxShadow="0 64px 110px rgba(0,0,0,0.6)"
            frameStyle={{ border: "1px solid rgba(246,242,233,0.12)" }}
            src={SCREENSHOTS.security}
            alt="A logged screenshot: who took it, which chat, and exactly what was on screen"
          >
            <SecurityAlertScreen />
          </PhoneFrame>
        </Reveal>
      </div>
    </section>
  );
}
