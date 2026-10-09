import { useId } from "react";

// Plain frosted-glass surface using CSS backdrop-filter only.
// The previous SVG feDisplacementMap filter (Chromium-only) caused visible
// edge aberration/glare that looked inconsistent across browsers. Removed in
// favour of the clean blur fallback that all browsers support natively.
export default function GlassSurface({
  className = "",
  innerRef,
  blur = 2,        // blur strength (px)
  saturate = 1.8,  // vibrancy boost
  brightness = 1.1,
  // Legacy props kept for API compatibility — no longer used.
  radius,
  edge,
  strength,
  aberration,
  observe,
}) {
  useId(); // keep hook call count stable if any parent relied on it

  const style = {
    backdropFilter: `blur(${blur + 8}px) saturate(${saturate}) brightness(${brightness})`,
    WebkitBackdropFilter: `blur(${blur + 8}px) saturate(${saturate}) brightness(${brightness})`,
  };

  return (
    <div
      ref={innerRef}
      className={className}
      style={style}
    />
  );
}