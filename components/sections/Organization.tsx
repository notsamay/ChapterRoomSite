import FloatingChip from "@/components/FloatingChip";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import RolesScreen from "@/components/screens/RolesScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2 } from "./primitives";

const positions = ["VP", "Treasurer", "Social", "Risk", "Pledge"];


const positionCards = [
  {
    title: "Suspension without kicking anyone out",
    body: "A suspended brother keeps his position and history but can’t post or message until it’s lifted. The reason, the date and who did it are logged.",
  },
];

const groupCards = [
  {
    title: "Reach exactly who you mean",
    body: "Tag @Pledges, @ExecBoard or @SocialCommittee and the whole group is pinged at once.",
  },
  {
    title: "Aimed at a position",
    body: "Announcements, feeds and events can target specific positions, so a pledge-only event never shows up for actives at all.",
  },
];

const codeSteps = [
  { n: "1", title: "Hand out the code", body: "Pledges get the pledge code. New officers get the officer code. One code per position." },
  { n: "2", title: "They land in the right place", body: "Whoever uses it is in the right position the second they sign up, with the right powers and groups." },
  { n: "3", title: "Regenerate when it leaks", body: "A code gets around? Make a new one. The old one stops working." },
];

const CARD = "card-lift card-lift-light rounded-[22px] bg-white px-[24px] py-[22px]";
const CARD_SHADOW = { boxShadow: "0 16px 34px rgba(11,18,14,0.06)" };

const groupsPhone = (
  <PhoneFrame
    width={330}
    screen="#1B5340"
    boxShadow="0 50px 90px rgba(11,18,14,0.22)"
    src={SCREENSHOTS.groups}
    alt="Editing groups: Social Committee, Rush Team and Intramurals, each with a join or leave button"
  />
);

export default function Organization() {
  return (
    <section id="organization" className="overflow-hidden bg-bone text-ink">
      <div className={`mx-auto max-w-container ${BAND}`}>
        {/* Positions and powers. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-[70px]">
          <Reveal duration={1000} y={40} from="left" className="relative flex min-w-0 justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss/20 blur-[100px]"
            />
            <div className="relative w-full max-w-[402px]">
              <FloatingChip
                initial="P"
                tone="navy"
                title="President"
                body="Inherits every power below"
                time="now"
                className="absolute -left-[150px] top-[222px] hidden xl:flex animate-float-a"
              />
              <FloatingChip
                initial="S"
                tone="moss"
                title="Social"
                body="Run events switched on"
                time="1h"
                className="absolute -right-[150px] top-[408px] hidden xl:flex animate-float-b"
              />
              <FloatingChip
                initial="S"
                tone="brick"
                title="Sam Whitaker"
                body="Suspended · position and history kept"
                time="2d"
                className="absolute -left-[150px] top-[621px] hidden xl:flex animate-float-c"
              />
              <PhoneFrame
                width={402}
                screen="#273043"
                boxShadow="0 50px 90px rgba(11,18,14,0.22)"
                src={SCREENSHOTS.roles}
                alt="The powers screen: a position with each of the eight powers switched on or off"
              >
                <RolesScreen />
              </PhoneFrame>
            </div>
          </Reveal>

          <Reveal delay={80} y={30} from="right" className="min-w-0">
            <Eyebrow className="text-moss">Organization</Eyebrow>
            <h2 className={`mb-6 ${H2}`}>Your hierarchy. Down to the last title.</h2>
            <p className="mb-[30px] max-w-[520px] text-pretty text-[18.5px] leading-[1.6] text-ink/65">
              Everyone is listed with their actual position, and higher positions inherit every power the ones below
              them have. Eight powers, dragged onto a position: promote members, run events, manage content, see the
              security log. The Social Chair runs events without touching the roster.
            </p>

            <ul className="flex max-w-[520px] flex-wrap gap-[9px]">
              <li className="rounded-full bg-pine px-[17px] py-[11px] text-[14px] font-semibold text-cream">President</li>
              {positions.map((position) => (
                <li key={position} className="rounded-full bg-pine/10 px-[17px] py-[11px] text-[14px] font-semibold text-pine">
                  {position}
                </li>
              ))}
              <li className="rounded-full border-[1.5px] border-dashed border-ink/25 px-[17px] py-[10px] text-[14px] font-semibold text-ink/50">
                + make your own
              </li>
            </ul>

            <div className="mt-8 grid max-w-[520px] gap-3.5">
              {positionCards.map((card) => (
                <div key={card.title} className={CARD} style={CARD_SHADOW}>
                  <div className="mb-1.5 text-[15.5px] font-semibold">{card.title}</div>
                  <p className="text-[15px] leading-[1.55] text-ink/60">{card.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Groups. */}
        <div className="mt-[clamp(72px,9vw,120px)] lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-24">
          <Reveal y={30} from="left" className="w-full max-w-[560px]">
            <h3 className="mb-5 font-head text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Groups for how the house actually runs.
            </h3>
            <p className="mb-[26px] text-pretty text-[18px] leading-[1.6] text-ink/65">
              Social Committee, Rush Team, Intramurals, Pledge Class Fall &rsquo;26. Members join and leave themselves,
              some groups lock to a single position, and a guy who changes roles is pulled out of groups he no longer
              qualifies for. Filter the roster by group when you need to know who&rsquo;s on what.
            </p>
            <ul className="flex flex-col gap-4">
              {groupCards.map((card) => (
                <li key={card.title} className="flex items-start gap-3.5">
                  <span className="mt-[9px] h-[9px] w-[9px] shrink-0 rounded-full bg-moss" aria-hidden="true" />
                  <p className="text-[16px] leading-[1.55] text-ink/65">
                    <span className="font-semibold text-ink">{card.title}.</span> {card.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} duration={1000} y={40} from="right" className="relative mt-[52px] flex justify-center lg:mt-0">
            <div className="relative w-full max-w-[330px] lg:w-[330px]">
              <FloatingChip
                initial="P"
                tone="pine"
                title="Pledge Class Fall '26"
                body="Locked to the Pledge position"
                time="now"
                className="absolute -left-[140px] top-[14px] hidden xl:flex animate-float-a"
              />
              <FloatingChip
                initial="R"
                tone="moss"
                title="Rush Team"
                body="Marcus left · changed position"
                time="now"
                className="absolute -right-[140px] bottom-[40px] hidden xl:flex animate-float-b"
              />
              {groupsPhone}
            </div>
          </Reveal>
        </div>

        {/* Role codes: turnover without setup. */}
        <div className="mt-[clamp(64px,8vw,104px)] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-x-16 gap-y-10">
          <Reveal y={30} from="left" className="min-w-0">
            <Eyebrow className="text-moss">Role codes</Eyebrow>
            <h3 className="mb-4 font-head text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              New exec, new pledge class, no setup.
            </h3>
            <p className="max-w-[480px] text-pretty text-[18px] leading-[1.6] text-ink/65">
              Turnover is one code. Nobody rebuilds the roster, nobody re-adds forty people to a group chat, and nobody
              wonders who still has the treasurer&rsquo;s permissions.
            </p>
          </Reveal>
          <Reveal y={30} delay={100} from="right" className="min-w-0">
            <ol className="divide-y divide-ink/10 border-y border-ink/10">
              {codeSteps.map((step, i) => (
                <li key={step.n} className="flex items-start gap-6 py-5">
                  <span className="w-8 shrink-0 pt-0.5 font-head text-[15px] font-extrabold text-moss">0{i + 1}</span>
                  <div>
                    <div className="font-head text-[20px] font-extrabold leading-tight tracking-[-0.02em]">{step.title}</div>
                    <p className="mt-1.5 text-[15.5px] leading-[1.55] text-ink/60">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
