import FloatingChip from "@/components/FloatingChip";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import CheckInScreen from "@/components/screens/CheckInScreen";
import ExcusesScreen from "@/components/screens/ExcusesScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2, PhoneSlot } from "./primitives";

const points = [
  "Fake-location apps get rejected, no debate",
  "Present or late, set by a grace period you choose",
  "Every member sees their own attendance record",
  "Who said what and when stays on file",
];

const checkIn = (
  <PhoneFrame
    width={330}
    screen="#1B5340"
    boxShadow="0 50px 90px rgba(0,0,0,0.42)"
    src={SCREENSHOTS.checkIn}
    alt="Checking in to chapter: happening now at Memorial Union, location verified, one Check in button"
  >
    <CheckInScreen />
  </PhoneFrame>
);

const excuses = (
  <PhoneFrame
    width={330}
    screen="#1B5340"
    boxShadow="0 44px 80px rgba(0,0,0,0.38)"
    src={SCREENSHOTS.excuses}
    alt="The excuse queue for chapter meeting, with a swipe revealing approve on one request"
  >
    <ExcusesScreen />
  </PhoneFrame>
);

export default function Attendance() {
  return (
    <section id="attendance" className="grain relative overflow-hidden bg-pine">
      <Spotlight />
      <div className={`relative z-10 mx-auto max-w-container lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-16 ${BAND}`}>
        <Reveal className="w-full max-w-[600px]" y={30} from="left">
          <Eyebrow className="text-sage">Attendance</Eyebrow>
          <h2 className={`mb-6 ${H2}`}>Chapter&rsquo;s at seven. Tap once, you&rsquo;re in.</h2>
          <p className="mb-[30px] text-pretty text-[18.5px] leading-[1.6] text-cream/70">
            Members check in from their phone at the event, and the app decides whether they were really there.
            Skipping a mandatory event means picking a reason and writing a note, which lands in a queue exec swipes
            to approve or deny.
          </p>

          <ul className="flex flex-col gap-3.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3.5">
                <span className="mt-0.5 h-[22px] w-[22px] shrink-0 rounded-lg bg-moss" aria-hidden="true" />
                <span className="text-[16.5px] leading-[1.5] text-cream/85">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Desktop: the two phones sit beside the copy as an offset pair, the excuse queue
            stepped down and overlapping so they read as one composition rather than two
            objects parked under a paragraph. */}
        <Reveal delay={100} duration={1000} y={40} from="right" className="relative hidden lg:block">
          {/* The location check, drawn the way the app draws it: rings pulsing out from the
              check-in phone's centre. Behind the devices. */}
          <div aria-hidden="true" className="geofence left-[165px] top-[344px]">
            <span />
            <span />
            <span />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[165px] top-[344px] -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/20 blur-[110px]"
          />

          <div className="relative flex items-start pr-4">
            <div className="relative w-[330px] shrink-0">
              <FloatingChip
                initial="C"
                tone="navy"
                title="Chapter"
                body="Verified · 14 m from Memorial Union"
                time="7:02 PM"
                className="absolute -left-[56px] bottom-[26px] hidden xl:flex animate-float-a"
              />
              {checkIn}
            </div>
            <div className="relative z-10 -ml-14 mt-24 w-[330px] shrink-0">
              <FloatingChip
                initial="C"
                tone="plum"
                title="Chris Donovan"
                body="Approved with a swipe · Work"
                time="now"
                className="absolute -right-[156px] top-[236px] z-30 hidden xl:flex animate-float-c"
              />
              <FloatingChip
                initial="N"
                tone="moss"
                title="Nate Sullivan"
                body="Excuse approved · Sick"
                time="now"
                className="absolute -right-[156px] top-[526px] z-30 hidden xl:flex animate-float-b"
              />
              {excuses}
            </div>
          </div>
        </Reveal>

        {/* Below lg: a snap rail under the copy. */}
        <Reveal delay={100} duration={1000} y={40} className="mt-[60px] w-full lg:hidden">
          <div className="rail -mx-6 items-center gap-[22px] px-6 pb-3 md:mx-0 md:justify-center md:overflow-visible md:px-0 md:pb-0">
            <PhoneSlot max={330} railWidth={290}>
              {checkIn}
            </PhoneSlot>
            <PhoneSlot max={330} railWidth={290}>
              {excuses}
            </PhoneSlot>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
