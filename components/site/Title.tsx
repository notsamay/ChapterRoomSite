import type { ElementType } from "react";

/**
 * The two-part headline from the brand graphics: "every photo, / in one album." Line one in the
 * ground's ink, line two in its accent. Write the split as " / " in the text.
 */
export default function Title({ text, as: Tag = "h2", className = "cr-h2" }: { text: string; as?: ElementType; className?: string }) {
  const [a, b] = text.split(" / ");
  return (
    <Tag className={className}>
      <span className="cr-l1">{b ? `${a} ` : a}</span>
      {b && <span className="cr-l2">{b}</span>}
    </Tag>
  );
}
