import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Section from "../../components/sections";
import IdCard from "../../components/IdCard";
import GlassSurface from "../../components/GlassSurface";

gsap.registerPlugin(useGSAP);

const techs = ["Typescript", "React.js", "Tailwind"];

// Design size of the desktop layout. Everything inside is built for this.
const STAGE_W = 1440;
const STAGE_H = 810;

// Liquid glass pill: GlassSurface is the layer behind, content sits on top
function GlassPill({ children, className = "", textClassName = "" }) {
  return (
    <span
      className={`relative inline-flex items-center rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.4)] ${className}`}
    >
      <GlassSurface
        className="absolute inset-0 rounded-full border border-white/20 bg-linear-to-b from-white/15 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_12px_rgba(255,255,255,0.06)]"
        radius={999}
        edge={14}
        strength={50}
        aberration={6}
        blur={3}
        saturate={1.8}
        brightness={1.25}
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap font-mono text-paper ${textClassName}`}
      >
        {children}
      </span>
    </span>
  );
}

export default function Welcome({ show }) {
  const welcomeRef = useRef(null);

  // Scale the fixed stage to fit any desktop screen
  useEffect(() => {
    const update = () => {
      const s = Math.min(
        window.innerWidth / STAGE_W,
        window.innerHeight / STAGE_H
      );
      welcomeRef.current?.style.setProperty("--s", s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useGSAP(
    () => {
      gsap.to(welcomeRef.current, {
        opacity: show ? 1 : 0,
        duration: 1,
      });

      if (show) {
        gsap.fromTo(
          ".welcome-item",
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }
    },
    { dependencies: [show], scope: welcomeRef }
  );

  return (
    <Section id="welcome">
      <div
        ref={welcomeRef}
        className="relative min-h-screen w-full overflow-hidden text-paper opacity-0 lg:h-screen"
      >
        {/* Stage: fluid below lg, fixed 1440x810 and scaled at lg+ */}
        <div className="flex w-full flex-col items-center justify-center gap-16 px-6 pt-32 pb-24 lg:absolute lg:top-1/2 lg:left-1/2 lg:h-[810px] lg:w-[1440px] lg:origin-center lg:flex-row lg:justify-between lg:gap-0 lg:px-20 lg:py-0 lg:[transform:translate(-50%,-50%)_scale(var(--s,1))]">
          {/* Left: text */}
          <div className="flex w-full min-w-0 max-w-xl flex-col items-center text-center lg:w-[640px] lg:max-w-none lg:items-start lg:text-left">
            {/* Badge with liquid glass */}
            <GlassPill
              className="welcome-item"
              textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2"
            >
              <span className="text-lime">✦</span>
              Available for work
            </GlassPill>

            <h1 className="welcome-item mt-6 w-full text-center font-display text-[10.5vw] leading-[1.05] font-extrabold sm:text-6xl lg:mt-10 lg:text-left lg:text-[100px] lg:leading-[1]">
              <span className="block">Frontend</span>
              <span className="block text-lime">Developer</span>
            </h1>

            <div className="welcome-item mt-6 h-1.5 w-16 bg-lime lg:mt-10 lg:h-2 lg:w-20" />

            <p className="welcome-item mt-6 max-w-[21rem] text-center font-mono text-sm leading-relaxed text-paper/70 sm:max-w-md lg:mt-10 lg:text-left">
              Menciptakan website modern dengan tampilan clean, responsif, dan
              elegan. Mengubah ide dan desain menjadi pengalaman digital yang
              menarik dan mudah digunakan.
            </p>

            {/* Tech chips with liquid glass */}
            <div className="welcome-item mt-6 flex flex-wrap justify-center gap-3 lg:mt-10 lg:justify-start">
              {techs.map((tech) => (
                <GlassPill
                  key={tech}
                  textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2"
                >
                  {tech}
                </GlassPill>
              ))}
            </div>

            <div className="welcome-item mt-8 flex flex-col items-center gap-2 text-center font-mono text-xs text-paper/50 sm:flex-row sm:gap-6 lg:mt-12 lg:text-[11px]">
              <span>↓ explore my work below</span>
              <span>↗ open to full-time &amp; freelance opportunities</span>
            </div>
          </div>

          {/* Right: ID card (kept) */}
          <div className="welcome-item flex items-center justify-center py-8 lg:scale-90 lg:py-0">
            <IdCard />
          </div>

          {/* Scroll cue */}
          <div className="welcome-item absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-xs text-paper/50 lg:bottom-8 lg:flex">
            <span>Scroll</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </div>
    </Section>
  );
}