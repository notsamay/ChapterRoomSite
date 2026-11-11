import type { CSSProperties } from "react";
import Phone from "./Phone";
import Title from "./Title";
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
    line: "Tickets, merch and membership fees in one list, with what’s overdue up top.",
    caption: "Membership fees, tickets and merch, with what’s overdue up top. Pay in full or on a plan.",
    clip: CLIPS.vouchers,
    alt: "The Vouchers list: a membership fee overdue, Chapter Hoodie due next, then the Formal Ticket",
    ms: 9700,
  },
  {
    title: "Feeds",
    line: "Announcements from a few, read by everyone. Comments on, reactions only or broadcast only.",
    caption: "Announcements from a few, read by everyone.",
    clip: CLIPS.feed,
    alt: "Posting to Announcements as reactions come in",
    ms: 8566,
  },
];

const EVENTS: ShowcaseTab[] = [
  { title: "The officer sets the rules", line: "Required, a 100 m radius, late after 10 minutes.", clip: CLIPS.rules, alt: "Setting the check-in radius and when late starts", ms: 7633 },
  { title: "Check in when you get there", line: "Too far, and it says so. Inside the radius, one tap and you’re counted.", clip: CLIPS.geo, alt: "You’re 1.2 km away, then checked in at Memorial Union", ms: 8633 },
  { title: "Attendance fills itself", line: "On time, late or excused, with the time and device for each.", clip: CLIPS.attend, alt: "The attendance roster with check-in times", ms: 6300 },
];

const MONEY: ShowcaseTab[] = [
  { title: "One screen, one button", line: "The amount, the fee and how you pay. Then Paid.", clip: CLIPS.pay, alt: "Buying a Formal Ticket on the Pay screen", ms: 6766 },
  { title: "Pay in full or in parts", line: "Pick a plan. Pay the rest when it’s due, and see what’s left.", clip: CLIPS.duesPlan, alt: "Paying the rest of a membership fee payment plan", ms: 8600 },
  { title: "Merch and tickets", line: "Sizes and quantities. Fees shown before you pay.", clip: CLIPS.merch, alt: "Buying two Chapter Hoodies in size M", ms: 9300 },
  { title: "Payouts to the chapter", line: "Officers see what is held, what is clearing, and when the next deposit lands.", clip: CLIPS.payouts, alt: "The Payouts screen: $4,180 held by Stripe and the next deposit", ms: 6933 },
];

export function Features() {
  return (
    <Showcase
      id="features"
      title="everything your org / runs on."
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
      title="show up. / you’re checked in."
      subtitle="Officers set a radius and a window. Members check in when they’re actually there, and spoofed locations get rejected."
      tabs={EVENTS}
      flip
      hideOnPhone
      ground="ivory"
    />
  );
}

export function Money() {
  return (
    <Showcase
      id="money"
      title="membership fees, / without the chase."
      subtitle="Members pay in the app or split membership fees into a payment plan. Payments run through Stripe, and the money goes to your chapter’s own account."
      tabs={MONEY}
      hideOnPhone
      ground="ivory"
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
    <section id="talk" className="cr-section cr-g-emerald cr-hide-phone">
      <div className="cr-wrap">
        <div className="cr-head" data-reveal>
          <Title text="every conversation, / in one place." />
          <p className="cr-sub">Chats are for talking. Feeds are for what everyone needs to see.</p>
        </div>
        <div className="cr-cf">
          {card(CLIPS.chat, "Chats", "One for the whole org, one for every group in it, and chats with other orgs on campus.", "A chapter chat with typing, new messages and a double-tap heart", 0)}
          {card(CLIPS.feed, "Feeds", "Announcements that don’t get buried. You pick who posts and who reads, with replies on or broadcast only.", "Posting to Announcements as reactions come in", 1)}
        </div>
      </div>
    </section>
  );
}
