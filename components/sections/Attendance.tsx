import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import CheckInScreen from "@/components/screens/CheckInScreen";
import ExcusesScreen from "@/components/screens/ExcusesScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2, PhoneSlot } from "./primitives";

const points = [
  "Check-in opens an hour out and closes itself",
  "Fake locations get rejected, no debate",
  "Nobody in the chapter can see where you are",
  "Chapter, philanthropy and mandatory events on record",
];

const checkIn = (
  <PhoneFrame
    width={284}
    screen="#1B5340"
    boxShadow="0 50px 90px rgba(0,0,0,0.42)"
    src={SCREENSHOTS.checkIn}
    alt="Checking in to chapter, with the location verified"
  >
    <CheckInScreen />
  </PhoneFrame>
);

const excuses = (
  <PhoneFrame
    width={284}
    screen="#1B5340"
    boxShadow="0 44px 80px rgba(0,0,0,0.38)"
    src={SCREENSHOTS.excuses}
    alt="The excuse queue, with approve and deny on each request"
  >
    <ExcusesScreen />
  </PhoneFrame>
);

export default function Attendance() {
  return (
    <section id="attendance" className="overflow-hidden bg-pine">
      <div className={`mx-auto max-w-container lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-16 ${BAND}`}>
        <Reveal className="w-full max-w-[600px]" y={30}>
          <Eyebrow className="text-sage">Attendance</Eyebrow>
          <h2 className={`mb-6 ${H2}`}>Chapter&rsquo;s at seven. Tap once, you&rsquo;re in.</h2>
          <p className="mb-[30px] text-pretty text-[18.5px] leading-[1.6] text-cream/70">
            Members check in once they are in the room. Being there is the only way to get credit, and late is late.
            Excuses go in with a reason attached, and exec clears the whole queue with a swipe.
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
        <Reveal delay={100} duration={1000} y={40} className="hidden lg:block">
          <div className="flex items-start pr-4">
            <div className="w-[264px] shrink-0">{checkIn}</div>
            <div className="relative z-10 -ml-9 mt-24 w-[264px] shrink-0">{excuses}</div>
          </div>
        </Reveal>

        {/* Below lg: a snap rail under the copy. */}
        <Reveal delay={100} duration={1000} y={40} className="mt-[60px] w-full lg:hidden">
          <div className="rail -mx-6 items-center gap-[22px] px-6 pb-3 md:mx-0 md:justify-center md:overflow-visible md:px-0 md:pb-0">
            <PhoneSlot max={284} railWidth={248}>
              {checkIn}
            </PhoneSlot>
            <PhoneSlot max={284} railWidth={248}>
              {excuses}
            </PhoneSlot>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
