import type { CSSProperties } from "react";
import AutoVideo from "./AutoVideo";
import type { Clip } from "./media";

/**
 * A black phone with a real recording on its screen: Dynamic Island, action button and
 * volume keys on the left, side button on the right. On phones only the hero keeps the
 * frame (`keep`); everywhere else the recording shows on its own with rounded corners.
 */
export default function Phone({
  clip,
  alt,
  width = 300,
  keep = false,
  animate = false,
}: {
  clip: Clip;
  alt: string;
  width?: number;
  keep?: boolean;
  animate?: boolean;
}) {
  return (
    <div className="cr-phone" data-keep={keep ? "" : undefined} style={{ "--w": `${width}px` } as CSSProperties}>
      <span className="cr-phone-btn" data-side="l" data-b="action" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="l" data-b="up" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="l" data-b="down" aria-hidden="true" />
      <span className="cr-phone-btn" data-side="r" data-b="side" aria-hidden="true" />
      <div className="cr-phone-screen">
        <AutoVideo clip={clip} alt={alt} className={animate ? "cr-anim" : undefined} />
        <span className="cr-phone-island" aria-hidden="true" />
      </div>
    </div>
  );
}
