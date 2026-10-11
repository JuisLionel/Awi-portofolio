import { useId } from "react";

export default function GlassSurface({
  className = "",
  innerRef,
  blur = 2,        // blur strength (px)
  saturate = 1.8,  // vibrancy boost
  brightness = 1.1,
}) {
  useId(); 

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