import Reveal from "@/components/Reveal";

const promises = [
  {
    title: "One app, whole chapter",
    body: "Exec, members and committees all in the same place, each seeing the version that applies to them.",
  },
  {
    title: "Check-ins that count",
    body: "Attendance is verified on location, so credit only lands when someone is actually there.",
  },
  {
    title: "Stays in the chapter",
    body: "Private by default, screenshots get flagged, and nothing sensitive travels on a link.",
  },
];

export default function Promises() {
  return (
    <section className="bg-bone text-ink">
      <div className="mx-auto max-w-[1180px] px-6 pb-[clamp(76px,9vw,110px)] pt-[clamp(80px,10vw,130px)] text-center">
        <Reveal>
          <h2 className="mx-auto mb-[26px] max-w-[860px] text-balance font-head text-[clamp(34px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Everything your chapter runs on, finally in one place.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mb-[84px] max-w-[620px] text-pretty text-[19px] leading-[1.55] text-ink/60">
            Attendance, dues, announcements, chats, albums and vouchers, set up the way your chapter already works.
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-7 text-left">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} delay={50 + i * 70} y={30}>
              <div
                className="h-full min-w-0 rounded-[26px] bg-white px-8 pb-10 pt-[38px]"
                style={{ boxShadow: "0 2px 0 rgba(11,18,14,0.05), 0 20px 40px rgba(11,18,14,0.05)" }}
              >
                <h3 className="mb-3 font-head text-[25px] font-extrabold tracking-[-0.03em]">{promise.title}</h3>
                <p className="text-[16px] leading-[1.6] text-ink/60">{promise.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
