import { AppBar, Avatar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

const requests = [
  { name: "Jordan P.", initials: "JP", reason: "Organic chem night exam", event: "Chapter · Mon", status: "pending" },
  { name: "Eli R.", initials: "ER", reason: "Work shift until 9", event: "Chapter · Mon", status: "pending" },
  { name: "Sam K.", initials: "SK", reason: "Family in town for the weekend", event: "Philanthropy · Sat", status: "pending" },
  { name: "Nate B.", initials: "NB", reason: "Flu, doctor's note attached", event: "Chapter · Mon", status: "approved" },
  { name: "Aiden C.", initials: "AC", reason: "Overslept", event: "Study hours · Thu", status: "denied" },
];

export default function ExcusesScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Excuses"
        subtitle="3 waiting on you"
        leading={<BackChevron />}
        trailing={<span className="rounded-full bg-cream px-u11 py-u5 text-u10 font-semibold text-pine">Clear all</span>}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-u9 overflow-hidden px-u18">
        {requests.map((request, i) => (
          <div key={request.name} className="rounded-u16 border border-cream/[0.07] bg-cream/[0.06] p-u13">
            <div className="flex items-start gap-u9">
              <Avatar initials={request.initials} size={28} index={i} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-u6">
                  <span className="truncate text-u12 font-semibold">{request.name}</span>
                  <span className="shrink-0 text-u9 text-cream/35">{request.event}</span>
                </div>
                <p className="mt-u3 line-clamp-2 text-u11 leading-[1.4] text-cream/60">{request.reason}</p>
              </div>
            </div>

            {request.status === "pending" ? (
              <div className="mt-u10 flex gap-u7">
                <span className="flex flex-1 items-center justify-center gap-u5 rounded-full bg-moss py-u7 text-u11 font-semibold">
                  <Icon path={ICONS.check} className="h-u12 w-u12" strokeWidth={2.4} />
                  Approve
                </span>
                <span className="flex flex-1 items-center justify-center gap-u5 rounded-full border border-cream/20 py-u7 text-u11 font-semibold text-cream/70">
                  <Icon path={ICONS.x} className="h-u12 w-u12" strokeWidth={2.4} />
                  Deny
                </span>
              </div>
            ) : (
              <div className="mt-u9 flex items-center gap-u5">
                <span
                  className={`inline-flex items-center gap-u4 rounded-full px-u9 py-u3 text-u9 font-semibold uppercase tracking-[0.08em] ${
                    request.status === "approved" ? "bg-sage/20 text-sage" : "bg-brick/25 text-brick"
                  }`}
                >
                  {request.status === "approved" ? "Approved" : "Denied"}
                </span>
                <span className="text-u9 text-cream/30">by you</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 pb-u12 pt-u10">
        <div className="mx-auto h-u4 w-u102 rounded-full bg-cream/30" />
      </div>
    </Screen>
  );
}
