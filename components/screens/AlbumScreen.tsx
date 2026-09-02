import { AppBar, Avatar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

// Stand-ins for the photos themselves — the layout is the point here.
const TILES = [
  "linear-gradient(140deg,#4D2D3B,#8E3730)",
  "linear-gradient(140deg,#273043,#4E7A54)",
  "linear-gradient(140deg,#1B5340,#0B241C)",
  "linear-gradient(140deg,#63394B,#273043)",
  "linear-gradient(140deg,#4E7A54,#123A2E)",
  "linear-gradient(140deg,#8E3730,#4D2D3B)",
  "linear-gradient(140deg,#333E56,#1B5340)",
  "linear-gradient(140deg,#0B241C,#4E7A54)",
  "linear-gradient(140deg,#4D2D3B,#333E56)",
];

export default function AlbumScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Formal 2026"
        subtitle="312 photos · 28 contributors"
        leading={<BackChevron />}
        trailing={<Icon path={ICONS.plus} className="h-u20 w-u20 text-cream/70" strokeWidth={2.2} />}
      />

      <div className="flex min-h-0 flex-1 flex-col px-u14">
        <div className="relative h-u132 overflow-hidden rounded-u18" style={{ background: TILES[0] }}>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-u12">
            <div className="text-u13 font-semibold leading-tight">The Peninsula · Saturday</div>
            <div className="mt-u3 flex items-center gap-u5">
              {["MD", "TW", "KL"].map((initials, i) => (
                <span key={initials} className={i === 0 ? "" : "-ml-u10"}>
                  <Avatar initials={initials} size={18} index={i} />
                </span>
              ))}
              <span className="ml-u4 text-u10 text-cream/60">+25 adding</span>
            </div>
          </div>
        </div>

        <div className="mt-u10 grid grid-cols-3 gap-u6">
          {TILES.slice(1).map((tile, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-u10" style={{ background: tile }} />
          ))}
        </div>

        <div className="mt-u12 flex items-center gap-u7 rounded-u16 border border-cream/10 bg-cream/[0.05] px-u12 py-u10">
          <Icon path={ICONS.lock} className="h-u13 w-u13 shrink-0 text-sage" />
          <span className="text-u10 leading-[1.4] text-cream/55">Members only. A copied link is dead outside the app.</span>
        </div>
      </div>
    </Screen>
  );
}
