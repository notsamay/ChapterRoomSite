import { AppBar, Avatar, BackChevron, Icon, ICONS, Screen, StatusBar } from "./kit";

const messages = [
  { from: "them", initials: "MD", name: "Marcus", body: "Exec board — budget review moved to Thursday 8pm.", index: 0 },
  { from: "them", initials: "KL", name: "Kayla", body: "Works. I'll have the dues report ready.", index: 3 },
  { from: "me", body: "@treasurer can you pull the outstanding list too?", index: 0 },
  { from: "them", initials: "KL", name: "Kayla", body: "Already exported. 11 members behind, 3 on payment plans.", index: 3 },
  { from: "me", body: "Perfect. See everyone Thursday.", index: 0 },
];

export default function ChatScreen() {
  return (
    <Screen>
      <StatusBar />
      <AppBar
        title="Exec board"
        subtitle="9 members · role-gated"
        leading={<BackChevron />}
        trailing={<Icon path={ICONS.lock} className="h-u15 w-u15 text-sage" />}
      />

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-u9 overflow-hidden px-u14 pb-u4">
        <div className="mx-auto rounded-full bg-cream/10 px-u10 py-u4 text-u9 text-cream/45">Today</div>

        {messages.map((message, i) =>
          message.from === "me" ? (
            <div key={i} className="ml-auto max-w-[78%] rounded-u16 rounded-br-u4 bg-moss px-u12 py-u9 text-u12 leading-[1.45]">
              {message.body}
            </div>
          ) : (
            <div key={i} className="flex max-w-[86%] items-end gap-u7">
              <Avatar initials={message.initials!} size={22} index={message.index} />
              <div>
                <div className="mb-u3 text-u9 text-cream/40">{message.name}</div>
                <div className="rounded-u16 rounded-bl-u4 bg-cream/[0.08] px-u12 py-u9 text-u12 leading-[1.45] text-cream/85">
                  {message.body}
                </div>
              </div>
            </div>
          )
        )}

        <div className="flex items-end gap-u7">
          <Avatar initials="MD" size={22} index={0} />
          <div className="flex items-center gap-u4 rounded-u16 rounded-bl-u4 bg-cream/[0.08] px-u13 py-u11">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="h-u5 w-u5 rounded-full bg-cream/45" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto shrink-0 px-u14 pb-u14 pt-u9">
        <div className="flex items-center gap-u8 rounded-full border border-cream/15 bg-cream/[0.06] px-u14 py-u9">
          <span className="flex-1 text-u11 text-cream/40">Message exec board</span>
          <Icon path={ICONS.send} className="h-u15 w-u15 text-cream/60" />
        </div>
      </div>
    </Screen>
  );
}
