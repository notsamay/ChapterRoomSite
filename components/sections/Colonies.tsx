import ColonyMap from "@/components/ColonyMap";
import Reveal from "@/components/Reveal";
import { Eyebrow, H2_WIDE } from "./primitives";

export default function Colonies() {
  return (
    <section id="colonies" className="overflow-hidden bg-pine">
      <div className="mx-auto max-w-container px-6 pb-[clamp(70px,8vw,110px)] pt-[clamp(80px,10vw,130px)] text-center">
        <Reveal from="blur">
          <Eyebrow className="text-sage">Colony schools · Spring 2027</Eyebrow>
          <h2 className={`mx-auto mb-[22px] max-w-[820px] ${H2_WIDE}`}>Three colony schools. Yours could be next.</h2>
          <p className="mx-auto mb-[34px] max-w-[600px] text-pretty text-[19px] leading-[1.55] text-cream/70">
            Chapter Room launches spring 2027, and colony spots for that first semester are open now. We take a few
            chapters at a time and set each one up ourselves, so your roles, feeds and first event are live before
            spring recruitment starts.
          </p>
          <a
            href="#waitlist"
            className="inline-block rounded-full bg-cream px-[30px] py-[17px] text-[16px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream"
          >
            Make my school a colony
          </a>
        </Reveal>

        <Reveal delay={120} y={30} from="scale">
          <ColonyMap className="mt-[clamp(40px,5vw,64px)] max-w-[980px]" />
        </Reveal>
      </div>
    </section>
  );
}
