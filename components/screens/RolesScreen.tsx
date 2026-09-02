import { AppBar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

const roles = [
  { name: "President", members: 1, permissions: "Everything", tone: "bg-cream text-navy" },
  { name: "Exec", members: 9, permissions: "Feeds, attendance, dues", tone: "bg-steel/25 text-cream" },
  { name: "Social chair", members: 2, permissions: "Events, vouchers, albums", tone: "bg-steel/25 text-cream" },
  { name: "Risk manager", members: 2, permissions: "Events, security log", tone: "bg-steel/25 text-cream" },
  { name: "Treasurer", members: 1, permissions: "Dues, vouchers, payouts", tone: "bg-steel/25 text-cream" },
  { name: "Active", members: 68, permissions: "Check in, chat, pay", tone: "bg-steel/25 text-cream" },
  { name: "New member", members: 21, permissions: "Scoped feeds and chats", tone: "bg-steel/25 text-cream" },
  { name: "Suspended", members: 1, permissions: "Read only", tone: "bg-brick/30 text-brick" },
];

export default function RolesScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Roles"
        subtitle="8 roles · 105 members"
        leading={<BackChevron />}
        trailing={<Icon path={ICONS.plus} className="h-u20 w-u20 text-cream/70" strokeWidth={2.2} />}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-u7 overflow-hidden px-u18">
        {roles.map((role) => (
          <div
            key={role.name}
            className="flex items-center gap-u10 rounded-u14 border border-cream/[0.07] bg-cream/[0.06] px-u12 py-u10"
          >
            <span className={`shrink-0 rounded-full px-u10 py-u4 text-u10 font-semibold ${role.tone}`}>{role.name}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-u10 text-cream/50">{role.permissions}</div>
            </div>
            <span className="shrink-0 text-u11 font-semibold tabular-nums text-cream/70">{role.members}</span>
            <Icon path={ICONS.chevron} className="h-u13 w-u13 shrink-0 text-cream/25" strokeWidth={2.2} />
          </div>
        ))}

        <div className="flex items-center justify-center gap-u6 rounded-u14 border border-dashed border-cream/25 py-u11 text-u11 font-semibold text-cream/50">
          <Icon path={ICONS.plus} className="h-u13 w-u13" strokeWidth={2.4} />
          Make your own
        </div>
      </div>

      <div className="mt-auto shrink-0 pb-u12 pt-u10">
        <div className="mx-auto h-u4 w-u102 rounded-full bg-cream/30" />
      </div>
    </Screen>
  );
}
