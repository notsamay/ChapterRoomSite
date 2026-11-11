import type { CSSProperties } from "react";
import { STILLS } from "./media";
import Title from "./Title";

const ROLES = ["President", "Executive", "Chairman", "Officer", "Active", "New Member"];
const GROUPS = ["Recruitment", "Social Committee", "Philanthropy", "Intramurals", "Class of 2027", "Alumni Relations"];

export default function Hierarchy() {
  return (
    <section id="hierarchy" className="cr-hier cr-g-emerald cr-on-dark">
      <div className="cr-glow cr-hier-glow" aria-hidden="true" />
      <div className="cr-hier-in">
        <div className="cr-head" data-reveal>
          <Title text="roles decide / who sees what." />
          <p className="cr-sub">Set them up to match how your chapter already runs.</p>
        </div>
        <div className="cr-hier-cols">
          <div className="cr-hier-col" data-reveal>
            <div className="cr-hier-title">
              <b>Roles</b>
              <span>What you can do. Everyone has one.</span>
            </div>
            <div className="cr-ladder">
              <div className="cr-ladder-rail" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F6F2E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 14V2M3 7l5-5 5 5" />
                </svg>
                <div />
              </div>
              <ol>
                {ROLES.map((r, i) => (
                  <li key={r} className="cr-rung">
                    <i>{i + 1}</i>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="cr-hier-note">
              Each role gets its own powers plus everything the roles below it can do. Rename, add or reorder them, and
              every role has its own invite code.
            </p>
          </div>
          <div className="cr-hier-col" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <div className="cr-hier-title">
              <b>Groups</b>
              <span>What you’re part of. Join as many as you like.</span>
            </div>
            <ul className="cr-chips">
              {GROUPS.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cr-hier-img cr-hide-phone"
              src={STILLS.mentionRush}
              alt="Typing @Rush in a chat shows Rush Chair, a role, and Rush Committee, a group"
              loading="lazy"
            />
            <p className="cr-hier-note">
              Use a group to pick who sees a feed, an album or an event. Type @ and its name to reach everyone in it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
