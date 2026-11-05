import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="cr-footer">
      <div className="cr-footer-in">
        <span className="cr-footer-brand">
          <b>chapter room</b>
          <span>for student orgs, by student orgs.</span>
        </span>
        <nav aria-label="Footer">
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:support@joinchapterroom.com">support@joinchapterroom.com</a>
        </nav>
        <span>Chapter Room LLC · Madison, WI</span>
      </div>
    </footer>
  );
}
