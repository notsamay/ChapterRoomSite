import Reveal from "@/components/Reveal";

const promises = [
  {
    title: "For members, a chat app",
    body: "Group chats with nicknames, reactions, pinned messages, swipe-to-reply, and event and album cards.",
    points: ["Mute forever or just for tonight", "Pick which categories buzz you", "Never double-pinged for a mention and a reply"],
    icon: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
    tone: "bg-pine/10 text-pine",
  },
  {
    title: "For officers, the operation",
    body: "Attendance, dues, the roster and the excuse queue, one tap away.",
    points: ["Present or late, set by your grace period", "Who's paid, on a plan, or owes, on one screen", "Event reminders go out an hour before"],
    icon: "M4 6h16M4 12h16M4 18h10M17 15l2 2 4-4",
    tone: "bg-moss/15 text-moss",
  },
  {
    title: "For the chapter, a locked room",
    body: "Three security levels and screenshot accountability.",
    points: ["Messages stamped with the viewer's name", "Recording blocked at High", "Roster-only join codes"],
    icon: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
    tone: "bg-brick/10 text-brick-deep",
  },
];

export default function Promises() {
  return (
    <section className="bg-bone text-ink">
      <div className="mx-auto max-w-[1180px] px-6 pb-[clamp(76px,9vw,110px)] pt-[clamp(80px,10vw,130px)] text-center">
        <Reveal>
          <h2 className="mx-auto mb-[26px] max-w-[860px] text-balance font-head text-[clamp(34px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Looks like a messaging app. Runs the whole chapter.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mb-[84px] max-w-[620px] text-pretty text-[19px] leading-[1.55] text-ink/60">
            The average member opens it to text the house. Exec opens the same app and runs the chapter from it.
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-7 text-left">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} delay={50 + i * 70} y={30} from="scale">
              <div
                className="card-lift card-lift-light flex h-full min-w-0 flex-col rounded-[26px] bg-white px-8 pb-9 pt-8 md:aspect-square"
                style={{ boxShadow: "0 2px 0 rgba(11,18,14,0.05), 0 20px 40px rgba(11,18,14,0.05)" }}
              >
                <span className={`mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${promise.tone}`}>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[22px] w-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={promise.icon} />
                  </svg>
                </span>
                <h3 className="mb-2 mt-auto font-head text-[27px] font-extrabold leading-tight tracking-[-0.03em]">
                  {promise.title}
                </h3>
                <p className="text-[15.5px] leading-[1.55] text-ink/60">{promise.body}</p>
                <ul className="mt-5 divide-y divide-ink/10 border-t border-ink/10 text-[14px] leading-snug text-ink/70">
                  {promise.points.map((point) => (
                    <li key={point} className="py-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
