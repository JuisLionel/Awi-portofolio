import { useEffect, useId, useRef } from "react";

// the SVG backdrop filter only works in Chromium (Chrome, Edge, Brave)
const isChromium =
  typeof navigator !== "undefined" && /Chrome|Chromium|Edg/.test(navigator.userAgent);

export default function GlassSurface({
  className = "",
  innerRef,
  radius = 999,    // corner radius
  edge = 14,       // width of the bending edge (px)
  strength = 40,   // how much the edge bends the background
  aberration = 6,  // color split at the edge (0 = none)
  blur = 2,        // blur of the background (px)
  saturate = 1.8,  // color boost, like iOS vibrancy
  brightness = 1.1,
  observe = true,  // rebuild the lens map when the size changes
}) {
  const id = "glass" + useId().replace(/:/g, "");
  const box = useRef(null);
  const img = useRef(null);
  const red = useRef(null);
  const green = useRef(null);
  const blue = useRef(null);

  // build the displacement map (what makes the edges bend)
  useEffect(() => {
    const el = box.current;

    const build = () => {
      const w = el.offsetWidth || 96;
      const h = el.offsetHeight || 44;
      const r = Math.min(radius, h / 2);
      const e = Math.max(1, Math.min(edge, h / 2 - 1));

      const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="black"/>
        <rect width="${w}" height="${h}" rx="${r}" fill="url(#r)"/>
        <rect width="${w}" height="${h}" rx="${r}" fill="url(#b)" style="mix-blend-mode:difference"/>
        <rect x="${e}" y="${e}" width="${Math.max(1, w - 2 * e)}" height="${Math.max(1, h - 2 * e)}" rx="${r}" fill="hsl(0 0% 50% / 0.93)" style="filter:blur(${e * 0.8}px)"/>
      </svg>`;

      img.current?.setAttribute("href", `data:image/svg+xml,${encodeURIComponent(svg)}`);
    };

    build();
    if (!observe) return;

    let raf;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [radius, edge, observe]);

  // each color channel bends a different amount = chromatic aberration
  useEffect(() => {
    red.current?.setAttribute("scale", strength + aberration);
    green.current?.setAttribute("scale", strength);
    blue.current?.setAttribute("scale", strength - aberration);
  }, [strength, aberration]);

  const style = isChromium
    ? {
        backdropFilter: `url(#${id}) blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
        WebkitBackdropFilter: `url(#${id}) blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
      }
    : {
        // fallback for Safari and Firefox: plain frosted glass
        backdropFilter: `blur(${blur + 8}px) saturate(${saturate})`,
        WebkitBackdropFilter: `blur(${blur + 8}px) saturate(${saturate})`,
      };

  return (
    <div
      ref={(el) => {
        box.current = el;
        if (innerRef) innerRef.current = el;
      }}
      className={className}
      style={style}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id={id} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={img} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={red} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="dr" />
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />

            <feDisplacementMap ref={green} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="dg" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />

            <feDisplacementMap ref={blue} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="db" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />

            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}