import type { CSSProperties } from "react";
import Phone from "./Phone";
import Showcase, { type ShowcaseTab } from "./Showcase";
import { CLIPS } from "./media";

const FEATURES: ShowcaseTab[] = [
  {
    title: "Messages",
    short: "Chats",
    line: "Your chapter and committee chats, with replies, reactions and @mentions.",
    caption: "Chapter and committee chats, with replies, reactions and @mentions.",
    clip: CLIPS.chat,
    alt: "A chapter chat with typing, new messages and a double-tap heart",
    ms: 7100,
  },
  {
    title: "Cross-chapter chats",
    short: "Cross-chapter",
    line: "Chats with other chapters at your school.",
    clip: CLIPS.cross,
    alt: "Accepting an invite to a chat with Sigma Chi",
    ms: 6133,
  },
  {
    title: "Albums",
    line: "Photos from every event, for members only.",
    clip: CLIPS.albums,
    alt: "Opening the Fall Retreat album",
    ms: 7633,
  },
  {
    title: "Events",
    line: "RSVP, then check in when you’re actually there.",
    caption: "RSVP, then check in when you’re actually there. Spoofed locations get rejected.",
    clip: CLIPS.checkin,
    alt: "Checking in to Founders Day Dinner",
    ms: 7700,
  },
  {
    title: "Vouchers",
    line: "Tickets, merch and dues in one list, with what’s overdue up top.",
    caption: "Dues, tickets and merch, with what’s overdue up top. Pay in full or on a plan.",
    clip: CLIPS.vouchers,
    alt: "The Vouchers list: Fall Dues overdue, Chapter Hoodie due next, then the Formal Ticket",
    ms: 9700,
  },
  {
    title: "Polls",
    line: "Vote in a tap. Results live.",
    clip: CLIPS.poll,
    alt: "Voting in a poll and seeing the results",
    ms: 7233,
  },
];

const EVENTS: ShowcaseTab[] = [
  { title: "The officer sets the rules", line: "Required, a 100 m radius, late after 10 minutes.", clip: CLIPS.rules, alt: "Setting the check-in radius and when late starts", ms: 7633 },
  { title: "Check in when you get there", line: "Too far, and it says so. Inside the radius, one tap and you’re counted.", clip: CLIPS.geo, alt: "You’re 1.2 km away, then checked in at Memorial Union", ms: 8633 },
  { title: "Attendance fills itself", line: "On time, late or excused, with the time and device for each.", clip: CLIPS.attend, alt: "The attendance roster with check-in times", ms: 6300 },
];

const MONEY: ShowcaseTab[] = [
  { title: "One screen, one button", line: "The amount, the fee and how you pay. Then Paid.", clip: CLIPS.pay, alt: "Buying a Formal Ticket on the Pay screen", ms: 6766 },
  { title: "Pay in full or in parts", line: "Pick a plan. Pay the rest when it’s due, and see what’s left.", clip: CLIPS.duesPlan, alt: "Paying the rest of a dues payment plan", ms: 8600 },
  { title: "Merch and tickets", line: "Sizes and quantities. Fees shown before you pay.", clip: CLIPS.merch, alt: "Buying two Chapter Hoodies in size M", ms: 9300 },
  { title: "Payouts to the chapter", line: "Officers see what is held, what is clearing, and when the next deposit lands.", clip: CLIPS.payouts, alt: "The Payouts screen: $4,180 held by Stripe and the next deposit", ms: 6933 },
];

export function Features() {
  return (
    <Showcase
      id="features"
      title="everything your chapter does, in one place."
      subtitle="Real recordings of the app, running on a sample chapter. Pick one, or let it play."
      tabs={FEATURES}
      phoneGrid
    />
  );
}

export function Events() {
  return (
    <Showcase
      id="events"
      title="show up. you’re checked in."
      subtitle="Officers set a radius and a window. Members check in when they’re actually there, and spoofed locations get rejected."
      tabs={EVENTS}
      flip
      hideOnPhone
    />
  );
}

export function Money() {
  return (
    <Showcase
      id="money"
      title="dues, without the venmo chase."
      subtitle="Members pay in the app or split dues into a payment plan. Payments run through Stripe, and the money goes to your chapter’s own account."
      tabs={MONEY}
      hideOnPhone
    />
  );
}

/** Desktop only: on phones the Messages tab already covers this. */
export function ChatsAndFeeds() {
  const card = (clip: typeof CLIPS.chat, title: string, line: string, alt: string, i: number) => (
    <figure data-reveal style={{ "--i": i } as CSSProperties}>
      <div className="cr-cf-media">
        <Phone clip={clip} alt={alt} width={270} />
      </div>
      <figcaption className="cr-cap">
        <b>{title}</b>
        <span>{line}</span>
      </figcaption>
    </figure>
  );
  return (
    <section id="talk" className="cr-section cr-hide-phone" style={{ background: "#FFFFFF" }}>
      <div className="cr-wrap">
        <div className="cr-head" data-reveal>
          <h2 className="cr-h2">chats and feeds.</h2>
          <p className="cr-sub">Talk in chats. Officers post to feeds.</p>
        </div>
        <div className="cr-cf">
          {card(CLIPS.chat, "Chats", "Your chapter, your committees, and chats with other chapters at your school.", "A chapter chat with typing, new messages and a double-tap heart", 0)}
          {card(CLIPS.feed, "Feeds", "Announcements everyone sees. Everyone can react and reply.", "Posting to Announcements as reactions come in", 1)}
        </div>
      </div>
    </section>
  );
}
