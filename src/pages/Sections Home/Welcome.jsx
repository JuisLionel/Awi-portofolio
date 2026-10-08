import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

import Section from "../../components/sections";
import IdCard from "../../components/IdCard";
import GlassPill from "../../components/GlassPill";
import Magnetic from "../../components/Magnetic";
import { useProfile } from "../../../Data/profile";

gsap.registerPlugin(useGSAP, ScrollToPlugin);

const techs = ["Typescript", "React.js", "Tailwind"];

// Design size of the desktop layout. Everything inside is built for this.
const STAGE_W = 1440;
const STAGE_H = 810;

// Neon glow layers for "Developer" (strong -> soft pulse)
const NEON_ON =
  "0 0 6px rgba(198,244,50,0.9), 0 0 20px rgba(198,244,50,0.6), 0 0 44px rgba(198,244,50,0.4)";
const NEON_SOFT =
  "0 0 4px rgba(198,244,50,0.7), 0 0 14px rgba(198,244,50,0.4), 0 0 30px rgba(198,244,50,0.25)";


function HoverWord({ word, hoverClass }) {
  return (
    <span className="block whitespace-nowrap" aria-hidden="true">
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className={`inline-block cursor-default transition-[transform,color] duration-300 ease-out hover:-translate-y-2 ${hoverClass}`}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Welcome({ show }) {
  const welcomeRef = useRef(null);
  const { available, labels } = useProfile();

  const scrollToAbout = () => {
    const target = document.getElementById("about");
    gsap.to(window, {
      scrollTo: {
        y: target ?? `+=${window.innerHeight}`,
        autoKill: true, 
      },
      duration: 1.8,
      ease: "power2.inOut",
    });
  };

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

  // Fade in/out + entrance animation
  useGSAP(
    () => {
      gsap.to(welcomeRef.current, {
        opacity: show ? 1 : 0,
        duration: 1,
      });

      if (show) {
        gsap.fromTo(
          ".welcome-item",
          { y: 24, scale: 0.96, opacity: 0 },
          {
            y: 0,
            scale: 1,
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

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".neon-text",
        { textShadow: NEON_ON },
        {
          textShadow: NEON_SOFT,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    },
    { scope: welcomeRef }
  );

  return (
    <Section id="welcome">
      <div
        ref={welcomeRef}
        className="relative min-h-screen w-full overflow-hidden text-paper opacity-0 lg:h-screen"
      >
        <div className="flex w-full flex-col items-center justify-center gap-16 px-6 pt-32 pb-24 lg:absolute lg:top-1/2 lg:left-1/2 lg:h-202.5 lg:w-360 lg:origin-center lg:flex-row lg:justify-between lg:gap-0 lg:px-20 lg:pt-14 lg:pb-0 lg:[transform:translate(-50%,-50%)_scale(var(--s,1))]">
          {/* Left: text */}
          <div className="flex w-full min-w-0 max-w-xl flex-col items-center text-center lg:w-160 lg:max-w-none lg:items-start lg:text-left">
            {/* Availability badge */}
            <div className="welcome-item">
              <Magnetic>
                <GlassPill textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2">
                  <span
                    className={`inline-block ${
                      available
                        ? "animate-[spin_6s_linear_infinite] text-lime"
                        : "text-paper/40"
                    }`}
                  >
                    ✦
                  </span>
                  {available ? labels.badge.on : labels.badge.off}
                </GlassPill>
              </Magnetic>
            </div>

            <h1
              aria-label="Frontend Developer"
              className="welcome-item mt-6 w-full text-center font-display text-[10.5vw] leading-[1.05] font-extrabold whitespace-nowrap sm:text-6xl lg:mt-10 lg:text-left lg:text-[92px] lg:leading-[1]"
            >
              <HoverWord word="Frontend" hoverClass="hover:text-lime" />
              {/* Neon glow on Developer */}
              <span className="neon-text block text-lime [text-shadow:0_0_6px_rgba(198,244,50,0.9),0_0_20px_rgba(198,244,50,0.6),0_0_44px_rgba(198,244,50,0.4)]">
                <HoverWord word="Developer" hoverClass="hover:text-paper" />
              </span>
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
                <Magnetic key={tech}>
                  <GlassPill textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2">
                    {tech}
                  </GlassPill>
                </Magnetic>
              ))}
            </div>

            <div className="welcome-item mt-8 flex flex-col items-center gap-2 text-center font-mono text-xs text-paper/50 sm:flex-row sm:gap-6 lg:mt-12 lg:text-[11px]">
              <span>↓ explore my work below</span>
              <span>↗ open to full-time &amp; freelance opportunities</span>
            </div>
          </div>

          {/* Right: ID card */}
          <div className="welcome-item flex items-center justify-center py-8 lg:scale-90 lg:py-0">
            <IdCard />
          </div>

          {/* Scroll cue: click to go to About */}
          <button
            type="button"
            onClick={scrollToAbout}
            aria-label="Scroll to About section"
            className="welcome-item group absolute bottom-6 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-1 font-mono text-xs text-paper/50 transition-colors duration-300 hover:text-lime focus-visible:text-lime focus-visible:outline-none lg:bottom-8 lg:flex"
          >
            <span className="transition-all duration-300 group-hover:tracking-[0.3em] group-hover:[text-shadow:0_0_12px_rgba(198,244,50,0.8)]">
              Scroll
            </span>
            <span className="animate-bounce text-base leading-none transition-[text-shadow,scale] duration-300 group-hover:scale-125 group-hover:[text-shadow:0_0_12px_rgba(198,244,50,0.8)] group-active:scale-95">
              ↓
            </span>
          </button>
        </div>
      </div>
    </Section>
  );
}