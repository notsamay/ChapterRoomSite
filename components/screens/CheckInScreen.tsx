import { AppBar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

export default function CheckInScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar title="Chapter" subtitle="Mon 7:00 PM · Hendrix Ballroom" leading={<BackChevron />} />

      <div className="flex min-h-0 flex-1 flex-col px-u20">
        {/* Location verification — the whole point of the screen. */}
        <div className="rounded-u20 border border-sage/30 bg-sage/10 p-u16">
          <div className="flex items-center gap-u10">
            <span className="flex h-u34 w-u34 items-center justify-center rounded-full bg-sage/20 text-sage">
              <Icon path={ICONS.pin} className="h-u18 w-u18" />
            </span>
            <div>
              <div className="text-u13 font-semibold text-sage">You&rsquo;re in the room</div>
              <div className="text-u10 text-cream/50">Verified on location · 14 m from centre</div>
            </div>
          </div>
        </div>

        <div className="mt-u18 text-center">
          <div className="text-u10 font-semibold uppercase tracking-[0.16em] text-cream/45">Check-in closes in</div>
          <div className="mt-u6 font-head text-u46 leading-none tabular-nums tracking-[-0.03em]">08:42</div>
        </div>

        {/* The check-in target: a big, unmissable ring. */}
        <div className="relative mx-auto mt-u20 flex h-u148 w-u148 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-moss/25 animate-pulse-soft" />
          <span className="absolute inset-u10 rounded-full bg-moss/40" />
          <button
            type="button"
            tabIndex={-1}
            className="relative flex h-u112 w-u112 flex-col items-center justify-center rounded-full bg-moss text-cream"
          >
            <Icon path={ICONS.check} className="h-u34 w-u34" strokeWidth={2.6} />
            <span className="mt-u5 text-u13 font-semibold">Check in</span>
          </button>
        </div>

        <div className="mt-u20 space-y-u8">
          <div className="flex items-center justify-between rounded-u14 bg-cream/[0.06] px-u13 py-u10">
            <span className="text-u11 text-cream/70">Checked in</span>
            <span className="text-u12 font-semibold tabular-nums">61 / 84</span>
          </div>
          <div className="flex items-center justify-between rounded-u14 bg-cream/[0.06] px-u13 py-u10">
            <span className="text-u11 text-cream/70">Excused</span>
            <span className="text-u12 font-semibold tabular-nums">7</span>
          </div>
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="mt-u14 w-full rounded-full border border-cream/25 py-u12 text-u12 font-semibold text-cream/75"
        >
          Request an excuse instead
        </button>

        <p className="mt-u12 text-center text-u10 leading-[1.45] text-cream/35">
          Your location is checked once and never stored.
        </p>
      </div>

      <div className="mt-auto shrink-0 pb-u12 pt-u10">
        <div className="mx-auto h-u4 w-u102 rounded-full bg-cream/30" />
      </div>
    </Screen>
  );
}
