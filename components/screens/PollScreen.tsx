import { AppBar, Avatar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

const options = [
  { label: "Lake day", votes: 34, pct: 46 },
  { label: "Bowling + wings", votes: 22, pct: 30 },
  { label: "Movie night at the house", votes: 18, pct: 24 },
];

export default function PollScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar title="Social committee" subtitle="12 members" leading={<BackChevron />} />

      <div className="flex min-h-0 flex-1 flex-col gap-u10 overflow-hidden px-u16">
        <div className="flex items-start gap-u8">
          <Avatar initials="TW" size={26} index={2} />
          <div className="rounded-u16 rounded-tl-u4 bg-cream/[0.08] px-u12 py-u9 text-u12 leading-[1.45] text-cream/85">
            Locking in Saturday tonight — vote before 9.
          </div>
        </div>

        {/* The poll card itself. */}
        <div className="rounded-u18 border border-cream/10 bg-cream/[0.07] p-u14">
          <div className="flex items-center gap-u6 text-u9 font-semibold uppercase tracking-[0.14em] text-sage">
            <Icon path={ICONS.check} className="h-u11 w-u11" strokeWidth={2.6} />
            Poll · closes 9:00
          </div>
          <div className="mt-u8 text-u14 font-semibold leading-tight">Saturday plan?</div>

          <div className="mt-u12 flex flex-col gap-u8">
            {options.map((option, i) => (
              <div key={option.label} className="relative overflow-hidden rounded-u12 bg-ink/25">
                <div
                  className={`absolute inset-y-0 left-0 ${i === 0 ? "bg-moss" : "bg-cream/10"}`}
                  style={{ width: `${option.pct}%` }}
                />
                <div className="relative flex items-center justify-between px-u11 py-u8">
                  <span className="flex items-center gap-u6 text-u11 font-medium">
                    {i === 0 ? (
                      <span className="flex h-u13 w-u13 items-center justify-center rounded-full bg-cream text-pine">
                        <Icon path={ICONS.check} className="h-u9 w-u9" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-u13 w-u13 rounded-full border border-cream/30" />
                    )}
                    {option.label}
                  </span>
                  <span className="text-u10 font-semibold tabular-nums text-cream/70">{option.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-u10 text-u10 text-cream/40">74 of 84 voted</div>
        </div>

        <div className="ml-auto rounded-u16 rounded-br-u4 bg-moss px-u12 py-u9 text-u12 leading-[1.45]">
          Lake day it is. Sending the details.
        </div>
      </div>

      <div className="mt-auto shrink-0 px-u16 pb-u14 pt-u8">
        <div className="flex items-center gap-u8 rounded-full border border-cream/15 bg-cream/[0.06] px-u14 py-u9">
          <span className="flex-1 text-u11 text-cream/40">Message the committee</span>
          <Icon path={ICONS.send} className="h-u15 w-u15 text-cream/60" />
        </div>
      </div>
    </Screen>
  );
}
