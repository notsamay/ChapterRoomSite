import { AppBar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

const vouchers = [
  { name: "Formal ticket", price: 45, note: "Includes dinner", selected: true },
  { name: "Guest pass", price: 25, note: "One per member", selected: false },
  { name: "After-party bus", price: 12, note: "Leaves 11:30", selected: false },
];

export default function VouchersScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar title="Winter Formal" subtitle="Sat · The Peninsula" leading={<BackChevron />} />

      <div className="flex min-h-0 flex-1 flex-col px-u18">
        <div className="flex flex-col gap-u8">
          {vouchers.map((voucher) => (
            <div
              key={voucher.name}
              className={`flex items-center gap-u10 rounded-u16 border px-u13 py-u11 ${
                voucher.selected ? "border-cream/40 bg-cream/[0.1]" : "border-cream/[0.07] bg-cream/[0.06]"
              }`}
            >
              <span
                className={`flex h-u16 w-u16 shrink-0 items-center justify-center rounded-full border ${
                  voucher.selected ? "border-cream bg-cream text-pine" : "border-cream/30"
                }`}
              >
                {voucher.selected && <Icon path={ICONS.check} className="h-u10 w-u10" strokeWidth={3} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-u12 font-semibold">{voucher.name}</div>
                <div className="truncate text-u10 text-cream/45">{voucher.note}</div>
              </div>
              <span className="text-u13 font-semibold tabular-nums">${voucher.price}</span>
            </div>
          ))}
        </div>

        {/* The whole point: one tap, and it's the chapter's money. */}
        <div className="mt-u12 rounded-u20 bg-cream p-u14 text-pine">
          <div className="flex items-center justify-between">
            <span className="text-u11 text-pine/60">Formal ticket</span>
            <span className="text-u11 tabular-nums text-pine/60">$45.00</span>
          </div>
          <div className="mt-u4 flex items-center justify-between">
            <span className="text-u11 text-pine/60">Fee</span>
            <span className="text-u11 tabular-nums text-pine/60">$0.00</span>
          </div>
          <div className="my-u9 h-px bg-pine/15" />
          <div className="flex items-center justify-between">
            <span className="text-u13 font-semibold">Total</span>
            <span className="text-u16 font-semibold tabular-nums">$45.00</span>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="mt-u11 flex w-full items-center justify-center gap-u6 rounded-full bg-pine py-u11 text-u12 font-semibold text-cream"
          >
            <Icon path={ICONS.ticket} className="h-u13 w-u13" />
            Pay $45
          </button>
          <div className="mt-u8 text-center text-u9 text-pine/50">Goes straight to the Alpha Sigma account</div>
        </div>

        <div className="mt-u12 flex gap-u8">
          <div className="flex-1 rounded-u16 bg-cream/[0.07] px-u12 py-u10">
            <div className="text-u9 uppercase tracking-[0.12em] text-cream/40">Sold</div>
            <div className="mt-u3 text-u16 font-semibold tabular-nums">148 / 200</div>
          </div>
          <div className="flex-1 rounded-u16 bg-cream/[0.07] px-u12 py-u10">
            <div className="text-u9 uppercase tracking-[0.12em] text-cream/40">Collected</div>
            <div className="mt-u3 text-u16 font-semibold tabular-nums">$6,660</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
