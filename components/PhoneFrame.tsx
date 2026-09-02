import type { CSSProperties, ReactNode } from "react";
import { frameHeight, screenWidth, SHOT_WIDTH, VARIANT_SCALES } from "./phone-geometry.mjs";

type PhoneFrameProps = {
  /** Rendered width at full size, in pixels. The frame shrinks below this on narrow screens. */
  width: number;
  /**
   * Height at that width, in pixels. Defaults to whatever gives the screen inside the bezel
   * exactly the screenshot's aspect ratio; only `crop="top"` cards need to set it.
   */
  height?: number;
  /** Colour showing behind the screen content. */
  screen: string;
  /** Bezel colour. The notch inherits it. */
  bezel?: string;
  boxShadow?: string;
  /** `top` keeps the top of the device and runs it off the bottom of its container. */
  crop?: "top";
  float?: boolean;
  /** A real screenshot. When present it replaces the built-in mock. */
  src?: string | null;
  alt?: string;
  /** Load the screenshot eagerly, for the phone that is in view on first paint. */
  priority?: boolean;
  /** The mock screen shown until a real screenshot exists. */
  children?: ReactNode;
  className?: string;
  /** Applied to the bezel, e.g. the hairline edge on the privacy phone. */
  frameStyle?: CSSProperties;
};

/**
 * srcset for a shot in public/screens/: one pre-scaled file per device pixel ratio, rendered by
 * scripts/build-screens.mjs at exactly this screen's pixel width, plus the 1206px original.
 */
function variants(src: string, screenPx: number) {
  const base = src.replace(/\.png$/, "");
  const scaled = VARIANT_SCALES.map((s) => Math.round(screenPx * s)).filter((w) => w < SHOT_WIDTH);
  return [...scaled.map((w) => `${base}-${w}.png ${w}w`), `${src} ${SHOT_WIDTH}w`].join(", ");
}

export default function PhoneFrame({
  width,
  height = frameHeight(width),
  screen,
  bezel = "#0B120E",
  boxShadow,
  crop,
  float = false,
  src,
  alt = "",
  priority = false,
  children,
  className = "",
  frameStyle,
}: PhoneFrameProps) {
  // The screen is the frame minus its whole-pixel bezel; the image is drawn at exactly this
  // width at full size, so the matching srcset variant maps 1:1 onto device pixels.
  const screenPx = screenWidth(width, crop === "top");

  return (
    <div className={`phone ${className}`} style={{ maxWidth: width }}>
      <div
        className={[
          "phone-frame",
          crop === "top" && "phone-frame-crop-top",
          float && "animate-float",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          aspectRatio: `${width} / ${height}`,
          background: bezel,
          boxShadow,
          ...frameStyle,
        }}
      >
        <div className="phone-screen" style={{ background: screen }}>
          {src ? (
            // Screenshots are served straight from `public/screens/` as lossless PNG at a
            // handful of pre-scaled widths (see scripts/build-screens.mjs). next/image would
            // recompress them to lossy WebP and blur the UI text.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              srcSet={variants(src, screenPx)}
              sizes={`${screenPx}px`}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: crop === "top" ? "top" : "center",
              }}
            />
          ) : (
            children
          )}
        </div>
        <div className="phone-notch" aria-hidden="true" />
      </div>
    </div>
  );
}
