import GlassSurface from "./GlassSurface";

// Liquid glass pill: GlassSurface is the layer behind, content sits on top
export default function GlassPill({
  children,
  className = "",
  textClassName = "",
}) {
  return (
    <span
      className={`relative inline-flex items-center rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.24)] ${className}`}
    >
      <GlassSurface
        className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-linear-to-b from-white/[0.08] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.04),inset_0_0_10px_rgba(255,255,255,0.035)]"
        radius={999}
        edge={14}
        strength={50}
        aberration={6}
        blur={3}
        saturate={1.8}
        brightness={1.25}
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap font-mono ${textClassName}`}
      >
        {children}
      </span>
    </span>
  );
}