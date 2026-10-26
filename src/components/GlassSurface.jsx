import { useId } from "react";

export default function GlassSurface({
  className = "",
  innerRef,
  blur = 2,        
  saturate = 1.8,  
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