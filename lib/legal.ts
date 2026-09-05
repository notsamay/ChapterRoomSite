import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Legal documents live as plain Markdown in `legal/` so they can be read, diffed and handed
 * to a lawyer without touching React. This reads one at build time and converts it to HTML.
 * Only ever called from Server Components.
 */

export const LEGAL_DOCS = {
  "privacy-policy": { title: "Privacy Policy", path: "/privacy" },
  "terms-of-service": { title: "Terms of Service", path: "/terms" },
} as const;

export type LegalSlug = keyof typeof LEGAL_DOCS;

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  /** The "Last updated" line, without the label. */
  updated: string | null;
  html: string;
};

export function readLegalDoc(slug: LegalSlug): LegalDoc {
  const source = readFileSync(path.join(process.cwd(), "legal", `${slug}.md`), "utf8");

  const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? LEGAL_DOCS[slug].title;
  const updated = source.match(/^\*\*Last updated:\s*(.+?)\*\*$/m)?.[1]?.trim() ?? null;

  // The H1 and date line are rendered by the page header, not the body.
  const body = source.replace(/^#\s+.+$/m, "").replace(/^\*\*Last updated:.+$/m, "").trim();

  // Author-controlled Markdown from this repo; nothing user-supplied reaches it.
  const html = marked.parse(body, { gfm: true, async: false }) as string;

  return { slug, title, updated, html };
}
