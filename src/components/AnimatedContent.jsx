/**
 * AnimatedContent – scroll-triggered reveal wrapper powered by AOS.
 *
 * Props:
 *   direction   "vertical" | "horizontal"  – axis of the slide (default: "vertical")
 *   distance    number  – slide distance in px (default: 30)
 *   duration    number  – animation duration in seconds (default: 0.7)
 *   delay       number  – animation delay in seconds (default: 0)
 *   ease        string  – ignored (AOS uses CSS easings; kept for API compatibility)
 *   threshold   number  – fraction of element visible before triggering (default: 0.1)
 *   initialOpacity number – ignored; AOS always fades from 0 (kept for API compat)
 *   className   string
 */
export default function AnimatedContent({
  children,
  className = "",
  direction = "vertical",
  distance = 30,
  duration = 0.7,
  delay = 0,
  threshold = 0.1,
  // kept for API compatibility, unused by AOS
  ease,
  initialOpacity,
}) {
  const aosName = direction === "horizontal" ? "fade-right" : "fade-up";

  return (
    <div
      className={className}
      data-aos={aosName}
      data-aos-offset={Math.round(distance)}
      data-aos-duration={Math.round(duration * 1000)}
      data-aos-delay={Math.round(delay * 1000)}
      data-aos-anchor-placement={threshold >= 0.5 ? "center-bottom" : "top-bottom"}
    >
      {children}
    </div>
  );
}
