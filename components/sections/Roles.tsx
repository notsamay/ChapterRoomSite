import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import RolesScreen from "@/components/screens/RolesScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { BAND, Eyebrow, H2 } from "./primitives";

const roles = ["Exec", "Social chair", "Risk manager", "Treasurer", "Active", "New member"];

export default function Roles() {
  return (
    <section id="roles" className="bg-bone text-ink">
      <div className={`mx-auto grid max-w-container grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-[70px] ${BAND}`}>
        <Reveal duration={1000} y={40} className="flex min-w-0 justify-center">
          <PhoneFrame
            width={316}
            screen="#273043"
            boxShadow="0 50px 90px rgba(11,18,14,0.22)"
            src={SCREENSHOTS.roles}
            alt="The roles screen, listing each role and what it can touch"
          >
            <RolesScreen />
          </PhoneFrame>
        </Reveal>

        <Reveal delay={80} y={30} className="min-w-0">
          <Eyebrow className="text-moss">Roles</Eyebrow>
          <h2 className={`mb-6 ${H2}`}>Your hierarchy. Down to the last title.</h2>
          <p className="mb-[30px] max-w-[500px] text-pretty text-[18.5px] leading-[1.6] text-ink/65">
            Name the roles your chapter actually uses, then decide what each one can touch. Social chair runs events
            without touching the roster. New members see what applies to them. Everyone joins with the code for their
            role.
          </p>

          <ul className="flex max-w-[520px] flex-wrap gap-[9px]">
            <li className="rounded-full bg-pine px-[17px] py-[11px] text-[14px] font-semibold text-cream">President</li>
            {roles.map((role) => (
              <li key={role} className="rounded-full bg-pine/10 px-[17px] py-[11px] text-[14px] font-semibold text-pine">
                {role}
              </li>
            ))}
            <li className="rounded-full bg-brick/[0.12] px-[17px] py-[11px] text-[14px] font-semibold text-brick-deep">
              Suspended
            </li>
            <li className="rounded-full border-[1.5px] border-dashed border-ink/25 px-[17px] py-[10px] text-[14px] font-semibold text-ink/50">
              + make your own
            </li>
          </ul>

          <div
            className="mt-8 max-w-[520px] rounded-[22px] bg-white px-[26px] py-6"
            style={{ boxShadow: "0 16px 34px rgba(11,18,14,0.06)" }}
          >
            <div className="mb-2 text-[15.5px] font-semibold">Suspension without the drama</div>
            <p className="text-[15.5px] leading-[1.55] text-ink/60">
              One tap freezes someone&rsquo;s posting and keeps their spot, their history and the reason on file. Turn
              it back on just as fast.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
