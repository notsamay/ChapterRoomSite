"use client";

import type { CSSProperties, ReactNode } from "react";
import Title from "./Title";
import { useAutoTabs, useInView } from "./useAutoTabs";

// Roles and powers, as the app does it: roles are ranked, each one is switched on for the powers it
// should have, and powers flow up (a role can do what it's given plus everything the roles under it
// can do). Who sees a chat or feed is set on the chat or feed, by role and group. Groups never grant
// powers.
//
// The two phones are real captures of the app's Roles and powers pages (a generic sample org, light
// theme, 390 × 844 points): the list on the left, and the picked role's own page on the right. The
// ring on the list sits on the role's row at the positions measured from the capture.
const ROLES: { id: string; name: string; file: string; y: number }[] = [
  { id: "rush", name: "Events Chair", file: "role-events-chair", y: 493 },
  { id: "treas", name: "Treasurer", file: "role-treasurer", y: 417 },
  { id: "vp", name: "Vice President", file: "role-vp", y: 341 },
  { id: "active", name: "Member", file: "role-member", y: 569 },
  { id: "pledge", name: "New Member", file: "role-new-member", y: 645 },
  { id: "pres", name: "President", file: "role-president", y: 265 },
];
const ROW_H = 76;
const DURATIONS = ROLES.map(() => 3000);

const GROUPS: { name: string; only?: string }[] = [
  { name: "Recruitment" },
  { name: "Social Committee" },
  { name: "Philanthropy" },
  { name: "Intramurals" },
  { name: "Class of 2027" },
  { name: "Exec Board", only: "President only" },
  { name: "New Member Class", only: "New Member only" },
];

const py = (y: number) => `${(y / 844) * 100}%`;

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="cr-rp-frame" role="img" aria-label={label}>
      <span className="cr-phone-btn" data-side="l" data-b="action" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="l" data-b="up" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="l" data-b="down" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="r" data-b="side" aria-hidden="true" />
      <div className="cr-rp-glass">
        {children}
        <span className="cr-rp-island" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Hierarchy() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const { current, pick } = useAutoTabs(DURATIONS, inView);
  const on = ROLES[current];

  return (
    <section id="hierarchy" className="cr-hier cr-page cr-g-emerald cr-on-dark">
      <div className="cr-hier-in cr-split">
        <div className="cr-split-l">
          <div className="cr-head" data-reveal>
            <Title text="roles decide / who can do what." />
            <p className="cr-sub">
              Rank your roles, then switch on what each one can do. Powers flow up: a role can do what it’s given, plus
              everything the roles under it can do.
            </p>
          </div>
          <div className="cr-hier-notes" data-reveal>
            <p>
              <b>Every chat and feed picks its own audience.</b> Choose the roles and groups that can see it, and the ones
              that can post.
            </p>
            <p>
              <b>Groups never grant powers.</b> A group is open to everyone or belongs to one role. Type @ and its name to
              reach everyone in it.
            </p>
            <ul className="cr-chips cr-hier-chips">
              {GROUPS.map((g) => (
                <li key={g.name}>
                  {g.name}
                  {g.only && <em>{g.only}</em>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={ref} className="cr-rp cr-split-r" data-reveal>
          {/* The list: hover or tap a role to open it on the right. */}
          <div className="cr-rp-col">
            <Frame label="Roles and powers: President, Vice President, Treasurer, Events Chair, Member and New Member, highest first, each with its powers">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cr-rp-shot" src="/kit/roles-powers.webp" alt="" width={780} height={1688} loading="lazy" />
              {/* The picked row stays clear; the rest of the list fades back a little. */}
              <span className="cr-rp-ring" style={{ top: py(on.y + 4), height: py(ROW_H - 8) }} aria-hidden="true" />
              <div className="cr-rp-rows" role="tablist" aria-label="Roles">
                {ROLES.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={i === current}
                    aria-label={r.name}
                    style={{ top: py(r.y), height: py(ROW_H) }}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                  />
                ))}
              </div>
            </Frame>
          </div>

          {/* The picked role's own page. */}
          <div className="cr-rp-col" data-second>
            <Frame label={`${on.name}: its powers, which ones it has, and which it gets from the roles under it`}>
              {ROLES.map((r, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={r.id}
                  className="cr-rp-shot"
                  data-on={i === current}
                  src={`/kit/${r.file}.webp`}
                  alt=""
                  width={780}
                  height={1688}
                  loading="lazy"
                  style={{ "--k": i } as CSSProperties}
                />
              ))}
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
}
