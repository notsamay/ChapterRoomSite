import Phone from "./Phone";
import Title from "./Title";
import { CLIPS } from "./media";

// Chats and feeds: the headline and the two lines on the left, as the section first had it; on the
// right one faint panel holding both phones, a little offset. Desktop only (on phones the Messages
// tab in Features already covers this).

export default function Talk() {
  return (
    <section id="talk" className="cr-section cr-page cr-g-emerald cr-on-dark cr-hide-phone cr-talk">
      <div className="cr-wrap cr-split">
        <div className="cr-head cr-split-l" data-reveal>
          <Title text="every conversation, / in one place." />
          <p className="cr-sub">Chats are for talking. Feeds are for what everyone needs to see.</p>
          <dl className="cr-talk-lines">
            <div>
              <dt>Chats</dt>
              <dd>One for the whole org, one for every group in it, and chats with other orgs on campus.</dd>
            </div>
            <div>
              <dt>Feeds</dt>
              <dd>Announcements that don’t get buried. You pick who posts and who reads, with replies on or broadcast only.</dd>
            </div>
          </dl>
        </div>

        <div className="cr-talk-gfx cr-split-r" data-reveal>
          <div className="cr-talk-phone" data-side="chat">
            <Phone clip={CLIPS.chat} alt="A chapter chat with typing, new messages and a double-tap heart" width={240} />
          </div>
          <div className="cr-talk-phone" data-side="feed">
            <Phone clip={CLIPS.feed} alt="Posting to Announcements as reactions come in" width={240} />
          </div>
        </div>
      </div>
    </section>
  );
}
