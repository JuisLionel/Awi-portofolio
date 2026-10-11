import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const PIXEL_COUNT = 16 * 9;
const STAGGER_STEP = 0.0025;
const PHASE_DURATION = (PIXEL_COUNT - 1) * STAGGER_STEP * 1000 + 120;
const TITLE_FADE_DURATION = 280;

export default function PixelTransition() {
  const location = useLocation();
  const onCoveredRef = useRef(null);
  const targetPathRef = useRef(null);
  const routeReadyPathRef = useRef(null);
  const phaseRef = useRef("idle");
  const isAnimatingRef = useRef(false);
  const coverTimerRef = useRef(null);
  const titleTimerRef = useRef(null);
  const revealTimerRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [transitionTitle, setTransitionTitle] = useState("");

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
    setTransitionTitle("");
  }, [changePhase]);

  const startReveal = useCallback(() => {
    if (phaseRef.current !== "waiting") return;

    const revealPixels = () => {
      if (phaseRef.current !== "title-out") return;

      changePhase("reveal");
      revealTimerRef.current = window.setTimeout(
        finishReveal,
        PHASE_DURATION + 100
      );
    };

    changePhase("title-out");
    if (!transitionTitle) {
      revealPixels();
      return;
    }

    titleTimerRef.current = window.setTimeout(
      revealPixels,
      TITLE_FADE_DURATION
    );
  }, [changePhase, finishReveal, transitionTitle]);

  const finishCover = useCallback(() => {
    if (phaseRef.current !== "cover") return;

    window.clearTimeout(coverTimerRef.current);
    targetPathRef.current =
      onCoveredRef.current?.() ?? targetPathRef.current;
    onCoveredRef.current = null;
    changePhase("waiting");
  }, [changePhase]);

  useEffect(() => {
    const handleTransition = (event) => {
      const onCovered = event.detail?.onCovered;
      if (typeof onCovered !== "function" || isAnimatingRef.current) return;

      const requestedPath = event.detail?.targetPath;
      const routePath =
        typeof requestedPath === "string" ? requestedPath : null;
      const slug = routePath
        ?.split("/")
        .filter(Boolean)
        .at(-1);
      setTransitionTitle(
        slug
          ? decodeURIComponent(slug)
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : ""
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onCovered();
        setTransitionTitle("");
        return;
      }

      isAnimatingRef.current = true;
      routeReadyPathRef.current = null;
      targetPathRef.current = routePath;
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
      window.clearTimeout(titleTimerRef.current);
      window.clearTimeout(revealTimerRef.current);
    };
  }, [changePhase, finishCover]);

  useEffect(() => {
    const handleRouteReady = (event) => {
      const readyPath = event.detail?.path;
      routeReadyPathRef.current = readyPath ?? null;
      if (
        phaseRef.current === "waiting" &&
        targetPathRef.current &&
        location.pathname === targetPathRef.current &&
        readyPath === targetPathRef.current
      ) {
        startReveal();
      }
    };

    window.addEventListener("portfolio:route-ready", handleRouteReady);
    return () => {
      window.removeEventListener("portfolio:route-ready", handleRouteReady);
    };
  }, [location.pathname, startReveal]);

  useEffect(() => {
    if (
      phase === "waiting" &&
      targetPathRef.current &&
      location.pathname === targetPathRef.current &&
      routeReadyPathRef.current === targetPathRef.current
    ) {
      startReveal();
    }
  }, [location.pathname, phase, startReveal]);

  useEffect(() => {
    if (phase !== "cover") return;
    coverTimerRef.current = window.setTimeout(finishCover, PHASE_DURATION + 50);
    return () => window.clearTimeout(coverTimerRef.current);
  }, [finishCover, phase]);

  // Fully covered: fill any gaps with a solid backdrop.
  const isFullyCovered = phase === "waiting" || phase === "title-out";
  // Once the title starts leaving, keep it hidden for the rest of the transition.
  const titleIsLeaving = phase === "title-out" || phase === "reveal";

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className={`pointer-events-none fixed inset-0 z-100 ${
        phase === "idle" ? "invisible" : "visible"
      }`}
    >
      {isFullyCovered && <div className="absolute inset-0 bg-night" />}

      <div className="pixel-transition absolute inset-0 grid grid-cols-16 grid-rows-9">
        {Array.from({ length: PIXEL_COUNT }, (_, index) => {
          const isLime = index % 19 === 0;

          return (
            <span
              key={index}
              style={{
                "--pixel-delay": `${((index * 37) % PIXEL_COUNT) * STAGGER_STEP}s`,
                // Bleed 1px past the cell so neighbors overlap and no seam shows.
                boxShadow: `0 0 0 1px var(${
                  isLime ? "--color-lime" : "--color-night"
                })`,
              }}
              className={`border border-white/[0.035] ${
                isLime ? "bg-lime" : "bg-night"
              } ${
                phase === "cover"
                  ? "pixel-transition-cover"
                  : phase === "reveal"
                    ? "pixel-transition-reveal"
                    : ""
              }`}
            />
          );
        })}
      </div>

      {transitionTitle && (
        <div className="absolute inset-0 z-10 grid place-items-center px-6">
          <p
            className={`pixel-transition-title max-w-full wrap-break-word text-center font-display text-3xl font-bold text-paper drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] sm:text-5xl ${
              titleIsLeaving ? "pixel-transition-title-out" : ""
            }`}
          >
            {transitionTitle}
          </p>
        </div>
      )}
    </div>
  );
}