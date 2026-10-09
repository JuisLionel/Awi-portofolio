/**
 * BlurText – AOS-animated heading with a fade-up reveal.
 *
 * Props:
 *   text        string  – heading content
 *   className   string  – applied to the <h2>
 *   delay       number  – base delay in ms between each character group (default: 90)
 *   animateBy   "letters" | "words"  – granularity of stagger (default: "words")
 *   direction   "top" | "bottom"    – slide direction (default: "top" = fade-up)
 */
export default function BlurText({
  text = "",
  className = "",
  delay = 90,
  animateBy = "words",
  direction = "top",
}) {
  const aosAnim = direction === "bottom" ? "fade-down" : "fade-up";
  const tokens = animateBy === "letters" ? text.split("") : text.split(" ");

  return (
    <h2 className={className} aria-label={text}>
      {tokens.map((token, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block"
          data-aos={aosAnim}
          data-aos-duration="500"
          data-aos-delay={i * delay}
        >
          {token}
          {animateBy === "words" && i < tokens.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </h2>
  );
}
