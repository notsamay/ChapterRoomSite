import FloatingChip from "@/components/FloatingChip";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import SecurityAlertScreen from "@/components/screens/SecurityAlertScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2 } from "./primitives";

const guarantees = [
  {
    title: "Flagged in the thread",
    body: "When someone screenshots a protected chat, everyone in it sees a notice, right where it happened.",
  },
  {
    title: "Admins get the capture",
    body: "A copy of what was actually on screen lands in the security log. It ends the “wasn’t me” conversation.",
  },
  {
    title: "Stamped with the viewer’s name",
    body: "At Medium and above, every message carries the name of whoever is looking at it.",
  },
  {
    title: "Admin Mode",
    body: "Officers flip one switch and home becomes a moderation view: security log, attendance and the excuse queue one tap away. It turns itself off the moment someone loses admin powers.",
  },
];

const levels = [
  {
    name: "Low",
    line: "A normal chat.",
    features: ["Nothing stamped, nothing logged", "Screenshots are nobody's business", "Right for intramurals"],
    fill: 1,
    meter: "bg-cream/40",
  },
  {
    name: "Medium",
    line: "Screenshots go on record.",
    features: [
      "Every message stamped with the viewer's name",
      "Screenshots and recordings logged",
      "Everyone in the chat sees the notice",
    ],
    fill: 2,
    meter: "bg-cream/80",
  },
  {
    name: "High",
    line: "Nothing leaves the room.",
    features: [
      "Everything in Medium",
      "Screen recording blocked, screen blurs if someone tries",
      "Images can't be saved",
    ],
    fill: 3,
    meter: "bg-brick-light",
  },
];

export default function Privacy() {
  return (
    <section id="locked" className="relative overflow-hidden bg-ink">
      {/* Soft colour low in the section, behind the glass level cards. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[68%] h-[460px] w-[560px] rounded-full bg-moss/25 blur-[120px]" />
        <div className="absolute right-[2%] top-[62%] h-[480px] w-[560px] rounded-full bg-brick/20 blur-[130px]" />
      </div>

      <div className={`relative mx-auto max-w-container ${BAND}`}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-[70px]">
          <Reveal className="min-w-0" y={30} from="left">
            <Eyebrow className="text-brick-light">Privacy</Eyebrow>
            <h2 className={`mb-6 ${H2}`}>What&rsquo;s said in the chapter stays in the chapter.</h2>
            <p className="mb-8 max-w-[520px] text-pretty text-[18.5px] leading-[1.6] text-cream/70">
              Every chat, feed and album has a security level, and the chapter picks it. In a protected chat, when
              someone screenshots, everyone in it sees a notice and admins get a copy of what was actually on screen.
              Straight up: no app can stop a camera. This one makes sure it never happens quietly.
            </p>
            <p className="mb-[30px] mt-[-14px] max-w-[520px] text-[16px] leading-[1.6] text-cream/50">
              Members join with a code from your own roster, and a copied link is dead outside the app.
            </p>

            <ul className="flex max-w-[540px] flex-col gap-4">
              {guarantees.map((guarantee) => (
                <li key={guarantee.title} className="flex items-start gap-3.5">
                  <span className="mt-[9px] h-[9px] w-[9px] shrink-0 rounded-full bg-brick-light" aria-hidden="true" />
                  <p className="text-[16px] leading-[1.55] text-cream/70">
                    <span className="font-semibold text-cream">{guarantee.title}.</span> {guarantee.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} duration={1000} y={40} from="scale" className="relative flex min-w-0 justify-center">
            {/* A dim red pool of light behind the device. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brick/20 blur-[120px]"
            />
            <div className="relative w-full max-w-[432px]">
              <FloatingChip
                initial="E"
                tone="navy"
                title="Exec Board"
                body="Tyler Nguyen took a screenshot"
                time="now"
                className="absolute -right-[150px] top-[150px] hidden xl:flex animate-float-b"
              />
              <FloatingChip
                initial="E"
                tone="brick"
                title="Flagged in the thread"
                body="Everyone in Exec Board was notified"
                time="now"
                className="absolute -left-[130px] top-[352px] hidden xl:flex animate-float-a"
              />
              <FloatingChip
                initial="T"
                tone="moss"
                title="Security log"
                body="Saved for security officers"
                time="now"
                className="absolute -left-[130px] top-[836px] hidden xl:flex animate-float-c"
              />

              <PhoneFrame
                width={432}
                screen="#4D2D3B"
                bezel="#000000"
                boxShadow="0 64px 110px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(246,242,233,0.12)"
                src={SCREENSHOTS.security}
                alt="A logged screenshot: who took it, which chat, and exactly what was on screen"
              >
                <SecurityAlertScreen />
              </PhoneFrame>
            </div>
          </Reveal>
        </div>

        {/* The three levels. */}
        <div id="security" className="mt-[clamp(80px,10vw,130px)]">
          <Reveal className="mb-[48px]" from="blur">
            <h3 className="max-w-[900px] font-head text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Three levels. Pick one per chat, feed or album.
            </h3>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
            {levels.map((item, i) => (
              <Reveal key={item.name} delay={80 + i * 90} y={30} from="scale">
                <div className="card-lift card-lift-dark flex flex-col rounded-[28px] border border-cream/10 bg-cream/[0.05] p-7 backdrop-blur-xl md:aspect-square">
                  <div className="flex items-center gap-1.5" aria-label={`Level ${item.fill} of 3`}>
                    {[1, 2, 3].map((seg) => (
                      <span
                        key={seg}
                        className={`h-1 w-6 rounded-full ${seg <= item.fill ? item.meter : "bg-cream/10"}`}
                      />
                    ))}
                  </div>

                  <div className="mt-7">
                    <div className="font-head text-[clamp(36px,3.4vw,44px)] font-extrabold leading-none tracking-[-0.035em]">
                      {item.name}
                    </div>
                    <p className="mt-2 text-[16px] text-cream/60">{item.line}</p>
                  </div>

                  <ul className="mt-8 divide-y divide-cream/10 border-t border-cream/10 text-[14.5px] leading-snug text-cream/75 md:mt-auto">
                    {item.features.map((feature) => (
                      <li key={feature} className="py-2.5">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-8 max-w-[720px] text-[15px] leading-[1.55] text-cream/45">
              Set it per conversation, so the judicial chat is locked down while the intramurals chat stays casual.
              Cross-chapter chats have a level too.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
