import HeroParallax from "./HeroParallax";
import Phone from "./Phone";
import Title from "./Title";
import { CLIPS } from "./media";

/**
 * The hero is the cover, kept simple: the headline and the buttons centred at the top, and three
 * phones playing real recordings rising from the bottom edge. It sits on a deeper ground than any
 * other page (emerald into black), so it reads as the front page.
 */
export default function Hero() {
  return (
    <section id="top" className="cr-hero cr-cover cr-g-emerald">
      <div className="cr-cover-in">
        <Title as="h1" className="cr-hero-title" text="run your whole org / from one place." />
        <p className="cr-hero-lead">
          Chats, events with location check-in, membership fees with payment plans, excuses, feeds and albums. Built for
          every student org.
        </p>
        <div className="cr-hero-actions">
          <a href="#join" className="cr-btn">
            <span className="cr-only-desk">Get the app</span>
            <span className="cr-only-phone">Join the waiting room</span>
          </a>
          <a href="#features" className="cr-link">
            See how it works
          </a>
        </div>
        <p className="cr-hero-note">Free for student orgs. Officers set it up in minutes.</p>
      </div>

      {/* Three phones rising from the bottom edge: a feed, a chat in the middle, albums. */}
      <div className="cr-cover-phones">
        <div className="cr-cover-phone" data-side="l">
          <Phone clip={CLIPS.feed} alt="Posting to Announcements as reactions come in" width={276} />
        </div>
        <div className="cr-cover-phone" data-side="c">
          <Phone clip={CLIPS.chat} alt="A chapter chat with typing, new messages and a double-tap heart" width={326} keep />
        </div>
        <div className="cr-cover-phone" data-side="r">
          <Phone clip={CLIPS.albums} alt="Opening the Fall Retreat album" width={276} />
        </div>
      </div>

      <HeroParallax />
    </section>
  );
}
