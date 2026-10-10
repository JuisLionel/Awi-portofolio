export default function GlassPill({
  children,
  className = "",
  textClassName = "",
}) {
  const glassStyle = {
    backdropFilter: "blur(11px) saturate(1.8) brightness(1.25)",
    WebkitBackdropFilter: "blur(11px) saturate(1.8) brightness(1.25)",
  };

  return (
    <span
      className={`relative isolate inline-flex items-center overflow-hidden rounded-full border border-white/15 bg-linear-to-b from-white/[0.08] to-white/[0.02] shadow-[0_4px_14px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.04),inset_0_0_10px_rgba(255,255,255,0.035)] ${className}`}
      style={glassStyle}
    >
      <span
        className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap font-mono ${textClassName}`}
      >
        {children}
      </span>
    </span>
  );
}