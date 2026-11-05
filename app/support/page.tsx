import type { Metadata } from "next";
import DocShell from "@/components/DocShell";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Chapter Room: contact support, delete your account, make a privacy request, and answers to common questions.",
  alternates: { canonical: "/support" },
};

const EMAIL = "support@joinchapterroom.com";

const FAQ: { group: string; items: [string, string][] }[] = [
  {
    group: "General",
    items: [
      ["When does it launch?", "Spring 2027, on iOS and Android. Our first schools go first, then everyone on the waitlist."],
      ["Is it only for Greek life?", "No. Roles, groups and powers work for any student org: club teams, student government, honor societies."],
    ],
  },
  {
    group: "Dues and money",
    items: [
      ["Where does the dues money go?", "Straight to your chapter’s own Stripe account, then your chapter’s bank."],
      ["Can members pay in parts?", "Yes. Officers can offer a payment plan, and members pick pay in full or the plan."],
      ["What does it cost to pay?", "Any processing fee is shown before you pay."],
    ],
  },
  {
    group: "Privacy and security",
    items: [
      [
        "Can someone screenshot our chats?",
        "In Medium and Max spaces, a screenshot is logged in the chat and for officers (on Android, from Android 14). On iPhone, screen recordings blur and get logged too. Max watermarks every message with the viewer’s name, blocks saving for everyone, and on Android blocks screenshots outright.",
      ],
      [
        "Is my location tracked?",
        "Only while check-in is open for a required event, to confirm you’re inside its radius. Officers see when you checked in, how accurate the fix was, and the device. Spoofed locations are rejected.",
      ],
    ],
  },
  {
    group: "For officers",
    items: [
      ["How do members join?", "Each role has its own invite code, and it changes every day. Whoever joins with it lands in that role."],
      ["Can we set it up ourselves?", "Yes. Start a chapter, pick your roles and groups, and send each role its code."],
    ],
  },
];

export default function SupportPage() {
  return (
    <DocShell path="/support" title="support." lead="Questions, a problem in the app, or a request about your data. Here’s how to reach us.">
      <div className="cr-support">
        <div className="cr-support-cards">
          <section className="cr-card cr-card-cream">
            <h2>email us.</h2>
            <p>Write to us about anything: a bug, your chapter’s setup, payments or your account.</p>
            <a className="cr-card-btn" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </section>
          <section className="cr-card">
            <h2>delete your account.</h2>
            <p>
              You can delete your account yourself, from inside the app, under Settings. You don’t have to email anyone.
            </p>
            <a className="cr-card-link" href="/privacy#7-how-long-we-keep-information">
              What deleting removes
            </a>
          </section>
          <section className="cr-card">
            <h2>privacy requests.</h2>
            <p>
              To access, correct, delete or get a copy of your information, email us with the subject line “Privacy
              request”.
            </p>
            <a className="cr-card-link" href={`mailto:${EMAIL}?subject=Privacy%20request`}>
              Send a privacy request
            </a>
          </section>
        </div>

        <div className="cr-faq">
          <h2 className="cr-h2">common questions.</h2>
          {FAQ.map((g) => (
            <section key={g.group} className="cr-faq-group">
              <h3>{g.group}</h3>
              {g.items.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    <span>{q}</span>
                    <i aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
          ))}
        </div>
      </div>
    </DocShell>
  );
}
