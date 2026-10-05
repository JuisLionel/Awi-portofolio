import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { sections } from "../section";

gsap.registerPlugin(ScrollToPlugin);

export default function Navbar({ show, active }) {
  const nav = useRef();
  const lens = useRef();
  const tabs = useRef({});
  const hovering = useRef(false);
  const scrolling = useRef(false);
  const HOVER_DURATION = 0.95;
  const [open, setOpen] = useState(false);

  const moveLens = (id, scale = 1, duration = 0.45) => {
    const el = tabs.current[id];
    if (!el) return;
    gsap.to(lens.current, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      scale,
      duration,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  useGSAP(
    () => {
      if (!show) {
        gsap.set(nav.current, { y: -200 });
        return;
      }
      gsap.fromTo(nav.current, { y: -200 }, { y: 0, duration: 1.1, ease: "power4.out" });
    },
    { scope: nav, dependencies: [show] }
  );

  useEffect(() => {
    if (hovering.current || scrolling.current) return;
    moveLens(active, 1.12);
    gsap.to(lens.current, { scale: 1, duration: 0.35, delay: 0.2 });
  }, [active]);

  useEffect(() => {
    const onResize = () => {
      const el = tabs.current[active];
      if (el) gsap.set(lens.current, { x: el.offsetLeft, width: el.offsetWidth });
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const go = (id) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // bubble jumps to the clicked tab right away and stays there during the scroll
    moveLens(id, 1);

    gsap.to(window, {
      duration: reduced ? 0 : 0.9,
      scrollTo: {
        y: target,
        autoKill: true,
        // user scrolled manually mid-animation: hand control back
        onAutoKill: () => {
          scrolling.current = false;
          moveLens(active, 1);
        },
      },
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => {
        scrolling.current = false;
        moveLens(id, 1);
      },
    });

    // set after creating the tween, because overwrite may kill a previous scroll
    scrolling.current = true;
  };

  return (
    <nav ref={nav} className="fixed inset-x-3 top-3 z-50 text-white md:inset-x-6 md:top-4">
      {/* main bar */}
      <div className="relative flex items-center justify-between rounded-full px-5 py-2 md:px-6">
        {/* glass bar (plain div: no refraction, background stays untouched) */}
        <div
          className="absolute inset-0 rounded-full border border-white/25 bg-white/[0.07] backdrop-blur-[3px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_18px_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.3)]"
        />
        {/* sheen: diagonal light streak, no distortion */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_30%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.14)_100%)]"
        />

        {/* logo */}
        <button
          onClick={() => go(sections[0].id)}
          className="relative z-10 cursor-pointer text-lg font-semibold tracking-tight"
        >
          Awi<span className="opacity-60">.dev</span>
        </button>

        {/* desktop links */}
        <ul
          className="relative hidden text-sm font-medium md:flex"
          onMouseLeave={() => {
            hovering.current = false;
            if (scrolling.current) return;
            moveLens(active, 1, HOVER_DURATION);
          }}
        >
          {/* glass lens: plain div, no refraction, background stays untouched */}
          <div
            ref={lens}
            className="pointer-events-none absolute left-0 top-0 h-full w-24 rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.16)_100%)] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.75),inset_-2px_-2px_4px_rgba(255,255,255,0.35),inset_0_0_12px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.3)]"
          />

          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                ref={(el) => (tabs.current[id] = el)}
                onClick={() => go(id)}
                onMouseEnter={() => {
                  hovering.current = true;
                  if (scrolling.current) return; // keep the bubble on the clicked tab while scrolling
                  moveLens(id, 1.08, HOVER_DURATION);
                }}
                className="relative z-10 block cursor-pointer px-5 py-2.5"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* hamburger (phone) */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="relative z-10 flex h-9 w-9 cursor-pointer items-center justify-center md:hidden"
        >
          <span className={`absolute h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      {/* phone menu */}
      <div
        className={`absolute inset-x-0 top-full mt-2 rounded-3xl transition-all duration-300 md:hidden ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
      >
        {/* plain div: no refraction */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/25 bg-white/[0.08] backdrop-blur-[3px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_0_18px_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.3)]"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_30%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.14)_100%)]"
        />
        <ul className="relative flex flex-col p-2 text-base font-medium">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-left transition-colors ${active === id ? "bg-white/15" : ""
                  }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
