import Phone from "./Phone";
import { CLIPS } from "./media";

export default function Hero() {
  return (
    <section id="top" className="cr-hero">
      <div className="cr-hero-glow" aria-hidden="true" />
      <div className="cr-hero-in">
        <div className="cr-hero-copy">
          <h1>the whole chapter, in one app.</h1>
          <p className="cr-hero-lead">
            Chats, events with location check-in, dues with payment plans, excuses, polls and albums. Built for every
            student org.
          </p>
          <div className="cr-hero-actions">
            <a href="#join" className="cr-btn">
              <span className="cr-only-desk">Get the app</span>
              <span className="cr-only-phone">Join the waiting room</span>
            </a>
            <a href="#features" className="cr-link">
              See how it works ↓
            </a>
          </div>
          <p className="cr-hero-note">Free for members. Officers set it up in minutes.</p>
        </div>
        <div className="cr-hero-media">
          <div className="cr-hero-phone">
            <div className="cr-hero-halo" aria-hidden="true" />
            <div className="cr-hero-phone-in">
              <Phone clip={CLIPS.tour} alt="A quick tour of Home and Activities in the app" width={340} keep />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
