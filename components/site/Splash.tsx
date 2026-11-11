"use client";

import { useEffect, useState } from "react";

// Set after the first play, so moving around the site and coming back home doesn't replay it.
// A fresh load of the page starts a new script, so the splash plays again then.
let played = false;

// Runs before the first paint. Skips the splash when you arrive from another page of the site
// (Support, Privacy, a "/#join" link), but not on a refresh or a visit from anywhere else.
const SKIP = `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type!=="reload"&&document.referrer&&new URL(document.referrer).origin===location.origin)document.documentElement.setAttribute("data-splash","skip")}catch(e){}`;

/**
 * The opening screen: the logo writes itself on in the middle of an emerald screen, then flies
 * up into the nav's logo as the page appears. It is all CSS (see "Splash" in site.css), so it runs
 * from the first paint without waiting for JavaScript. The page underneath is in the HTML the whole
 * time, so search engines and screen readers get it as normal. Skipped for reduced motion.
 */
export default function Splash() {
  const [show] = useState(() => !played);
  useEffect(() => {
    played = true;
  }, []);
  if (!show) return null;
  return (
    <>
      {/* Static, author-controlled script; no user input reaches it. */}
      <script dangerouslySetInnerHTML={{ __html: SKIP }} />
      <div className="cr-splash" aria-hidden="true">
        <div className="cr-splash-ground" />
        {/* The write-on is animated inside the SVG itself, plays once and ends on the static logo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cr-splash-logo" src="/kit/logo-draw.svg" alt="" width={600} height={92} />
      </div>
    </>
  );
}
