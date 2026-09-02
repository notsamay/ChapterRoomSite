import { Avatar, Icon, ICONS, Screen, StatusBar } from "./kit";

export default function SecurityAlertScreen() {
  return (
    <Screen>
      <StatusBar />

      <div className="flex min-h-0 flex-1 flex-col px-u18 pt-u4">
        <div className="flex items-center gap-u8 pb-u12">
          <Icon path={ICONS.chevron} className="h-u16 w-u16 rotate-180 text-cream/70" strokeWidth={2.4} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-u15 font-semibold leading-tight">New member class</div>
            <div className="flex items-center gap-u4 text-u10 text-brick">
              <Icon path={ICONS.lock} className="h-u10 w-u10" strokeWidth={2.2} />
              Heightened security
            </div>
          </div>
        </div>

        {/* The alert is posted into the thread, not hidden in a settings screen. */}
        <div className="rounded-u20 border border-brick/45 bg-brick/[0.14] p-u16">
          <div className="flex items-center gap-u9">
            <span className="flex h-u32 w-u32 items-center justify-center rounded-full bg-brick/25 text-brick">
              <Icon path={ICONS.camera} className="h-u17 w-u17" />
            </span>
            <div>
              <div className="text-u13 font-semibold">Screenshot detected</div>
              <div className="text-u10 text-cream/50">Today, 11:42 PM</div>
            </div>
          </div>

          <p className="mt-u12 text-u12 leading-[1.45] text-cream/75">
            <span className="font-semibold text-cream">Aiden C.</span> captured this thread. The screen has been saved to
            the security log.
          </p>

          <div className="mt-u12 flex items-center gap-u8 rounded-u14 bg-ink/35 px-u12 py-u10">
            <Avatar initials="AC" size={26} index={1} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-u11 font-semibold">Aiden C.</div>
              <div className="truncate text-u10 text-cream/45">New member · joined Aug 2025</div>
            </div>
          </div>

          <div className="mt-u12 flex gap-u7">
            <span className="flex flex-1 items-center justify-center gap-u5 rounded-full bg-cream py-u9 text-u11 font-semibold text-plum">
              <Icon path={ICONS.shield} className="h-u12 w-u12" strokeWidth={2.2} />
              Open the log
            </span>
            <span className="flex items-center justify-center rounded-full border border-cream/25 px-u14 py-u9 text-u11 font-semibold text-cream/70">
              Dismiss
            </span>
          </div>
        </div>

        <div className="mt-u14 flex items-center gap-u7 rounded-u16 border border-cream/10 bg-cream/[0.05] px-u13 py-u11">
          <Icon path={ICONS.lock} className="h-u14 w-u14 shrink-0 text-sage" />
          <span className="text-u10 leading-[1.4] text-cream/55">
            Only the officers you name can open the security log. Nobody else in the chapter sees it.
          </span>
        </div>

        {/* The thread carries on underneath, dimmed so the alert stays the subject. */}
        <div className="mt-u14 space-y-u9 opacity-40">
          <div className="max-w-[80%] rounded-u16 rounded-bl-u4 bg-cream/[0.08] px-u12 py-u9 text-u11 leading-[1.4]">
            Study hours list for the week is up.
          </div>
          <div className="ml-auto max-w-[70%] rounded-u16 rounded-br-u4 bg-plum-light px-u12 py-u9 text-u11 leading-[1.4]">
            Got it, thanks.
          </div>
          <div className="max-w-[84%] rounded-u16 rounded-bl-u4 bg-cream/[0.08] px-u12 py-u9 text-u11 leading-[1.4]">
            Reminder: big-little reveal is Thursday, keep it off your stories.
          </div>
          <div className="ml-auto max-w-[60%] rounded-u16 rounded-br-u4 bg-plum-light px-u12 py-u9 text-u11 leading-[1.4]">
            Lips sealed.
          </div>
        </div>
      </div>

      <div className="mt-auto shrink-0 px-u18 pb-u14 pt-u10">
        <div className="flex items-center gap-u8 rounded-full border border-cream/15 bg-cream/[0.06] px-u14 py-u9">
          <span className="flex-1 text-u11 text-cream/40">Message the class</span>
          <Icon path={ICONS.send} className="h-u15 w-u15 text-cream/60" />
        </div>
      </div>
    </Screen>
  );
}
