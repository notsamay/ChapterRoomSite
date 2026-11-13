import PortalTour from "./PortalTour";
import { PORTAL_SHOTS } from "./portal-shots";
import Title from "./Title";

// The web portal, on the home page: the headline centred on top, the portal in a browser window
// under it stepping through four of its pages, and the way in (on a computer; phones get a note).

const SHOTS = [PORTAL_SHOTS.home, PORTAL_SHOTS.events, PORTAL_SHOTS.vouchers, PORTAL_SHOTS.security];

export default function WebPortal() {
  return (
    <section id="portal" className="cr-section cr-page cr-g-ivory cr-webportal">
      <div className="cr-wrap">
        <div className="cr-head cr-wp-head" data-reveal>
          <Title text="the web portal, / for officers." />
          <p className="cr-sub">Run the org from your laptop, with the same powers your role has in the app.</p>
        </div>
        <div data-reveal>
          <PortalTour shots={SHOTS}>
            <a href="/portal" className="cr-btn cr-only-desk">
              Open the web portal
            </a>
            <span className="cr-only-phone cr-pt-note">Open it on a computer.</span>
          </PortalTour>
        </div>
      </div>
    </section>
  );
}
