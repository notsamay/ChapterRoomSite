import Link from "next/link";
import SiteFooter from "@/components/sections/SiteFooter";
import { LEGAL_DOCS, readLegalDoc, type LegalSlug } from "@/lib/legal";

/**
 * A legal document page. Gets its own compact header rather than `SiteNav`, whose links are
 * in-page anchors and whose scroll spy assumes the home page.
 */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = readLegalDoc(slug);
  const others = (Object.keys(LEGAL_DOCS) as LegalSlug[]).filter((s) => s !== slug);

  return (
    <>
      <header className="bg-pine text-cream">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex items-center gap-2" aria-label="Chapter Room home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/app-icon.png" alt="" width={30} height={30} className="rounded-[8px]" />
            <span className="font-wordmark text-[20px] font-bold">chapter room</span>
          </Link>
          <nav className="flex items-center gap-5 text-[14px] font-medium text-cream/70">
            {others.map((s) => (
              <Link key={s} href={LEGAL_DOCS[s].path} className="transition-colors hover:text-cream">
                {LEGAL_DOCS[s].title}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full border border-cream/30 px-4 py-2 text-cream transition-colors hover:bg-cream/10"
            >
              Back to site
            </Link>
          </nav>
        </div>
      </header>

      <main className="bg-bone text-ink">
        <article className="mx-auto max-w-[760px] px-6 pb-[clamp(72px,9vw,120px)] pt-[clamp(56px,7vw,96px)]">
          <h1 className="font-head text-[clamp(38px,5vw,60px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {doc.title}
          </h1>
          {doc.updated && <p className="mt-4 text-[15px] text-ink/55">Last updated {doc.updated}</p>}
          <div
            className="legal-prose mt-10"
            // Author-controlled Markdown from `legal/`, converted at build time. No user input.
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
