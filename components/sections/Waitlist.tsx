import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import WaitlistForm from "@/components/WaitlistForm";

export default function Waitlist() {
  return (
    <section
      id="waitlist"
      className="grain relative overflow-hidden"
      style={{ background: "radial-gradient(120% 100% at 50% 0%, #1B5340 0%, #123A2E 60%, #0B241C 100%)" }}
    >
      <Spotlight />
      <div className="relative z-10 mx-auto max-w-[820px] px-6 pb-[clamp(76px,9vw,120px)] pt-[clamp(80px,10vw,130px)] text-center">
        <Reveal from="blur">
          <h2 className="mx-auto mb-6 text-balance font-display text-[clamp(40px,6.6vw,92px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            Put your chapter on the list.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mb-10 max-w-[540px] text-pretty text-[19px] leading-[1.55] text-cream/75">
            Built by brothers who wanted their chapter run properly in one place. Tell us your chapter and we will have
            you set up for spring 2027.
          </p>
        </Reveal>

        <Reveal delay={140} from="scale">
          <WaitlistForm />
        </Reveal>

        <div className="mt-[34px] flex flex-wrap justify-center gap-x-[26px] gap-y-2 text-[13.5px] font-medium text-cream/55">
          <span>Launching spring 2027</span>
          <span>iOS and Android</span>
        </div>
      </div>
    </section>
  );
}
