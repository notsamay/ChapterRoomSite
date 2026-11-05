import DocShell from "@/components/DocShell";
import { LEGAL_DOCS, readLegalDoc, type LegalSlug } from "@/lib/legal";

const slugify = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const decode = (text: string) =>
  text
    .replace(/&#39;/g, "’")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Gives every section heading an id, and returns the list for the table of contents. */
function withAnchors(html: string) {
  const sections: { id: string; label: string }[] = [];
  const out = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const id = slugify(inner);
    sections.push({ id, label: decode(inner.replace(/<[^>]+>/g, "")).replace(/^\d+\.\s*/, "") });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, sections };
}

/** A legal document (legal/*.md) in the site's style, with a table of contents beside it. */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = readLegalDoc(slug);
  const { html, sections } = withAnchors(doc.html);

  return (
    <DocShell
      path={LEGAL_DOCS[slug].path}
      title={`${doc.title.toLowerCase()}.`}
      meta={doc.updated ? `Last updated ${doc.updated}` : undefined}
    >
      <div className="cr-doc-body">
        {sections.length > 2 && (
          <aside className="cr-toc" aria-label="On this page">
            <span>On this page</span>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
        <article
          className="cr-prose"
          // Author-controlled Markdown from `legal/`, converted at build time. No user input.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </DocShell>
  );
}
