import { AppBar, Avatar, Card, Icon, ICONS, Pill, Screen, StatusBar, TabBar } from "./kit";

const posts = [
  {
    author: "Marcus D.",
    role: "President",
    initials: "MD",
    time: "12m",
    body: "Chapter moved to the Hendrix ballroom tonight. Same time, check-in opens at 6.",
    pinned: true,
  },
  {
    author: "Tori W.",
    role: "Social chair",
    initials: "TW",
    time: "1h",
    body: "Formal vouchers drop Friday at noon. 40 of them, first come.",
    pinned: false,
  },
  {
    author: "Ben A.",
    role: "Philanthropy",
    initials: "BA",
    time: "3h",
    body: "Car wash raised $1,840. Photos are in the album.",
    pinned: false,
  },
  {
    author: "Kayla L.",
    role: "Treasurer",
    initials: "KL",
    time: "5h",
    body: "Spring dues invoices are out. Payment plans are in the app if you need one.",
    pinned: false,
  },
];

export default function ChapterFeedScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Alpha Sigma"
        subtitle="Clemson · 84 actives"
        trailing={
          <div className="flex items-center gap-u10">
            <span className="relative">
              <Icon path={ICONS.bell} className="h-u19 w-u19 text-cream/70" />
              <span className="absolute -right-u1 -top-u1 h-u7 w-u7 rounded-full bg-brick" />
            </span>
            <Avatar initials="SU" size={28} index={0} />
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-u10 overflow-hidden px-u18">
        {/* Tonight's event, promoted above the feed. */}
        <div className="rounded-u18 bg-moss p-u14">
          <div className="flex items-center justify-between">
            <span className="text-u9 font-semibold uppercase tracking-[0.14em] text-cream/70">Tonight</span>
            <span className="text-u10 font-medium text-cream/80">7:00 PM</span>
          </div>
          <div className="mt-u6 text-u17 font-semibold leading-tight">Chapter · Hendrix Ballroom</div>
          <div className="mt-u10 flex items-center gap-u8">
            <div className="flex items-center gap-u5 rounded-full bg-ink/25 px-u9 py-u4 text-u10 font-medium">
              <Icon path={ICONS.clock} className="h-u12 w-u12" />
              Check-in opens 6:00
            </div>
          </div>
        </div>

        {posts.map((post, i) => (
          <Card key={post.author} className={post.pinned ? "border-cream/20" : ""}>
            <div className="flex items-center gap-u9">
              <Avatar initials={post.initials} size={26} index={i + 1} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-u12 font-semibold">{post.author}</div>
                <div className="truncate text-u10 text-cream/45">{post.role}</div>
              </div>
              {post.pinned ? <Pill tone="sage">Pinned</Pill> : <span className="text-u10 text-cream/35">{post.time}</span>}
            </div>
            <p className="mt-u9 text-u12 leading-[1.45] text-cream/80">{post.body}</p>
          </Card>
        ))}
      </div>

      <TabBar active={0} />
    </Screen>
  );
}
