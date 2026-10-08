// Text with a light sweep passing over it (React Bits style, pure CSS).
// The base text keeps the parent's color; a shine layer is clipped to the glyphs on top.
export default function ShinyText({
  text = "",
  speed = 3, // seconds per sweep
  disabled = false,
  className = "",
}) {
  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      <style>{`
        @keyframes shiny-text-sweep {
          0%   { background-position: 150% 0; }
          100% { background-position: -50% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shiny-text-shine { animation: none !important; }
        }
      `}</style>
      <span>{text}</span>
      {!disabled && (
        <span
          aria-hidden="true"
          className="shiny-text-shine"
          style={{
            position: "absolute",
            inset: 0,
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundImage:
              "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%)",
            backgroundSize: "200% 100%",
            backgroundRepeat: "no-repeat",
            animation: `shiny-text-sweep ${speed}s linear infinite`,
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
