import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const PIXEL_COUNT = 16 * 9;
const STAGGER_STEP = 0.0025;
const PHASE_DURATION = (PIXEL_COUNT - 1) * STAGGER_STEP * 1000 + 120;

export default function PixelTransition() {
  const location = useLocation();
  const onCoveredRef = useRef(null);
  const targetPathRef = useRef(null);
  const phaseRef = useRef("idle");
  const isAnimatingRef = useRef(false);
  const coverTimerRef = useRef(null);
  const revealTimerRef = useRef(null);
  const routeFallbackRef = useRef(null);
  const [phase, setPhase] = useState("idle");

  const changePhase = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const finishReveal = useCallback(() => {
    if (phaseRef.current !== "reveal") return;

    changePhase("idle");
    onCoveredRef.current = null;
    targetPathRef.current = null;
    isAnimatingRef.current = false;
  }, [changePhase]);

  const startReveal = useCallback(() => {
    if (phaseRef.current !== "waiting") return;

    window.clearTimeout(routeFallbackRef.current);
    changePhase("reveal");
    revealTimerRef.current = window.setTimeout(
      finishReveal,
      PHASE_DURATION + 100
    );
  }, [changePhase, finishReveal]);

  const finishCover = useCallback(() => {
    if (phaseRef.current !== "cover") return;

    window.clearTimeout(coverTimerRef.current);
    targetPathRef.current = onCoveredRef.current?.() ?? null;
    onCoveredRef.current = null;
    changePhase("waiting");
    routeFallbackRef.current = window.setTimeout(() => {
      startReveal();
    }, 1200);
  }, [changePhase, startReveal]);

  useEffect(() => {
    const handleTransition = (event) => {
      const onCovered = event.detail?.onCovered;
      if (typeof onCovered !== "function" || isAnimatingRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onCovered();
        return;
      }

      isAnimatingRef.current = true;
      onCoveredRef.current = onCovered;
      changePhase("cover");
      coverTimerRef.current = window.setTimeout(
        finishCover,
        PHASE_DURATION + 100
      );
    };

    window.addEventListener("portfolio:pixel-transition", handleTransition);
    return () => {
      window.removeEventListener("portfolio:pixel-transition", handleTransition);
      window.clearTimeout(coverTimerRef.current);
      window.clearTimeout(revealTimerRef.current);
      window.clearTimeout(routeFallbackRef.current);
    };
  }, [changePhase, finishCover]);

  useEffect(() => {
    if (
      phase !== "waiting" ||
      !targetPathRef.current ||
      location.pathname !== targetPathRef.current
    ) {
      return;
    }

    startReveal();
  }, [location.pathname, phase, startReveal]);

  useEffect(() => {
    if (phase !== "cover") return;
    coverTimerRef.current = window.setTimeout(finishCover, PHASE_DURATION + 50);
    return () => window.clearTimeout(coverTimerRef.current);
  }, [finishCover, phase]);

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className={`pixel-transition pointer-events-none fixed inset-0 z-[100] grid grid-cols-16 grid-rows-9 ${
        phase === "idle" ? "invisible" : "visible"
      }`}
    >
      {Array.from({ length: PIXEL_COUNT }, (_, index) => (
        <span
          key={index}
          style={{
            "--pixel-delay": `${((index * 37) % PIXEL_COUNT) * STAGGER_STEP}s`,
          }}
          className={`border border-white/[0.035] ${
            index % 19 === 0 ? "bg-lime" : "bg-night"
          } ${
            phase === "cover"
              ? "pixel-transition-cover"
              : phase === "reveal"
                ? "pixel-transition-reveal"
                : ""
          }`}
        />
      ))}
    </div>
  );
}
