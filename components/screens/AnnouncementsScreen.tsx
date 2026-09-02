import { AppBar, Avatar, Icon, ICONS, Pill, Screen, StatusBar } from "./kit";

const items = [
  {
    author: "Marcus D.",
    initials: "MD",
    role: "President",
    time: "Pinned",
    body: "Chapter is mandatory this week. Dues deadline is Friday — see the treasurer if that's a problem.",
    mentions: ["@exec", "@actives"],
    pinned: true,
  },
  {
    author: "Ray H.",
    initials: "RH",
    role: "Risk manager",
    time: "2h",
    body: "Sober drivers for Saturday are posted. Two slots left on the 1am rotation.",
    mentions: ["@social-committee"],
    pinned: false,
  },
  {
    author: "Kayla L.",
    initials: "KL",
    role: "Treasurer",
    time: "Yesterday",
    body: "Spring dues invoices are out. Payment plans available through the app.",
    mentions: [],
    pinned: false,
  },
];

export default function AnnouncementsScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Announcements"
        subtitle="Exec → chapter"
        trailing={<Icon path={ICONS.bell} className="h-u18 w-u18 text-cream/60" />}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-u10 overflow-hidden px-u16">
        {items.map((item, i) => (
          <div
            key={item.author}
            className={`rounded-u18 p-u13 ${
              item.pinned ? "border border-sage/25 bg-sage/[0.08]" : "border border-cream/[0.07] bg-cream/[0.06]"
            }`}
          >
            <div className="flex items-center gap-u9">
              <Avatar initials={item.initials} size={26} index={i} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-u12 font-semibold">{item.author}</div>
                <div className="truncate text-u10 text-cream/45">{item.role}</div>
              </div>
              {item.pinned ? <Pill tone="sage">Pinned</Pill> : <span className="text-u10 text-cream/35">{item.time}</span>}
            </div>

            <p className="mt-u9 text-u12 leading-[1.45] text-cream/80">{item.body}</p>

            {item.mentions.length > 0 && (
              <div className="mt-u9 flex flex-wrap gap-u5">
                {item.mentions.map((mention) => (
                  <span key={mention} className="rounded-full bg-moss/25 px-u8 py-u3 text-u10 font-medium text-sage">
                    {mention}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-u9 flex items-center gap-u10 border-t border-cream/[0.07] pt-u8 text-u10 text-cream/40">
              <span>Seen by 79</span>
              <span>·</span>
              <span>6 replies</span>
            </div>
          </div>
        ))}
      </div>

      <TabBarSpacer />
    </Screen>
  );
}

/** Keeps the last card clear of the device's home indicator. */
function TabBarSpacer() {
  return (
    <div className="mt-auto shrink-0 pb-u14 pt-u10">
      <div className="mx-auto h-u4 w-u102 rounded-full bg-cream/30" />
    </div>
  );
}
