import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";

import GlassSurface from "../../components/GlassSurface";
import BlurText from "../../components/BlurText";
import AnimatedContent from "../../components/AnimatedContent";
import GlassPill from "../../components/GlassPill";
import Magnet from "../../components/Magnet";
import ShinyText from "../../components/ShinyText";
import { projects } from "../../../Data/projects";
import { startPixelTransition } from "../../lib/pixelTransition";

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const linkRef = useRef(null);
  const destination = `/projects/${project.slug}`;

  const handleClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    startPixelTransition(() => {
      navigate(destination);
      return destination;
    });
  };

  // Ref is on the Link because it never tilts, so the coordinates stay stable.
  const handleMouseMove = (event) => {
    const el = linkRef.current;
    if (!el || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Link
      ref={linkRef}
      to={destination}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className="block h-full w-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime 2xl:rounded-[2rem]"
    >
      <div className="hover-3d group h-full w-full">
        {/* 1st child: no transition-* class, so DaisyUI's tilt easing is untouched */}
        <div className="card relative h-full w-full overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl 2xl:rounded-[2rem]">
          <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />

          {/* Hover border lives on its own layer so it can have its own transition */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl border border-lime/0 transition-[border-color] duration-300 ease-out group-hover:border-lime/50 2xl:rounded-[2rem]"
          />

          {/* Spotlight that follows the cursor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(190, 242, 100, 0.16), transparent 60%)",
            }}
          />

          <div className="card-body relative flex h-full flex-col gap-5 p-5 sm:p-6 2xl:gap-7 2xl:p-9">
            <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-black/40 font-display text-6xl text-lime/80 2xl:rounded-3xl 2xl:text-8xl">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              ) : (
                project.title.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 2xl:gap-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-paper 2xl:text-3xl">
                  {/* Shine sweeps across the title only while the card is hovered */}
                  <span className="relative inline-block">
                    <span className="transition-opacity duration-200 group-hover:opacity-0">
                      {project.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <ShinyText text={project.title} speed={2.5} />
                    </span>
                  </span>
                </h3>
                {project.status && (
                  <GlassPill
                    className="shrink-0"
                    textClassName="px-3 py-1 text-xs text-paper/75"
                  >
                    {project.status}
                  </GlassPill>
                )}
              </div>
              <p className="text-sm leading-relaxed text-paper/65 2xl:text-base">
                {project.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
                {project.stack.map((item) => (
                  <GlassPill
                    key={item}
                    className="transition-colors duration-200 group-hover:border-lime/30"
                    textClassName="px-4 py-1.5 text-sm text-paper/75 2xl:px-5 2xl:py-2 2xl:text-base"
                  >
                    {item}
                  </GlassPill>
                ))}
              </div>
            </div>

            <GlassPill
              className="w-full border border-white/20 bg-white/10 transition-colors duration-200 group-hover:border-lime group-hover:bg-lime 2xl:py-1"
              textClassName="w-full justify-center px-4 py-2 text-sm text-paper transition-colors duration-200 group-hover:text-night 2xl:text-base"
            >
              View project details
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </GlassPill>
          </div>
        </div>

        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </Link>
  );
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const filterTrackRef = useRef(null);
  const filterDragRef = useRef({
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressFilterClickRef = useRef(false);
  const stacks = useMemo(
    () => {
      const stackCounts = new Map();
      projects.forEach((project) => {
        project.stack.forEach((stack) => {
          stackCounts.set(stack, (stackCounts.get(stack) ?? 0) + 1);
        });
      });
      const mostUsedStacks = [...stackCounts]
        .sort((first, second) => second[1] - first[1])
        .map(([stack]) => stack);

      return ["All", ...mostUsedStacks];
    },
    []
  );

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStack =
        selectedStacks.length === 0 ||
        selectedStacks.some((stack) => project.stack.includes(stack));
      const searchableText =
        `${project.title} ${project.description} ${project.stack.join(" ")}`.toLowerCase();
      return matchesStack && searchableText.includes(normalizedQuery);
    });
  }, [query, selectedStacks]);

  const displayedProjects = showAllProjects
    ? visibleProjects
    : visibleProjects.slice(0, 6);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = filterDragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const distance = event.clientX - drag.startX;
      if (Math.abs(distance) > 4) drag.moved = true;
      if (drag.moved && filterTrackRef.current) {
        filterTrackRef.current.scrollLeft = drag.startScrollLeft - distance;
      }
    };

    const handlePointerEnd = (event) => {
      const drag = filterDragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      suppressFilterClickRef.current = drag.moved;
      drag.pointerId = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, []);

  const handleFilterPointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = filterTrackRef.current;
    if (!track) return;

    suppressFilterClickRef.current = false;
    filterDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };
  };

  const handleFilterClickCapture = (event) => {
    if (!suppressFilterClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressFilterClickRef.current = false;
  };

  return (
    <section
      id="projects"
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-20 2xl:max-w-[1600px] 2xl:px-8 2xl:py-28"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-lime">
            Selected work
          </p>
          <BlurText
            text="Projects"
            delay={90}
            animateBy="letters"
            direction="top"
            className="mt-2 font-display text-4xl text-paper 2xl:text-6xl"
          />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-paper/60 2xl:max-w-xl 2xl:text-base">
          A closer look at the work, decisions, and tools behind each project.
        </p>
      </div>

      <AnimatedContent
        className="mt-2 2xl:mt-2"
        distance={24}
        duration={0.7}
        ease="power3.out"
        threshold={0.15}
      >
        <div className="relative rounded-[2rem] p-3 sm:rounded-full sm:p-2.5 2xl:p-3">
          <GlassSurface className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_10px_32px_rgba(0,0,0,0.16)] sm:rounded-full" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 2xl:gap-7">
            <div className="relative min-w-0 flex-1">
              <div
                ref={filterTrackRef}
                role="group"
                aria-label="Filter projects by technology"
                onPointerDown={handleFilterPointerDown}
                onClickCapture={handleFilterClickCapture}
                className="flex w-full cursor-grab touch-pan-x flex-nowrap gap-2 overflow-x-auto px-1 py-1 active:cursor-grabbing sm:w-[36rem] sm:flex-none [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
                title="Drag or scroll horizontally to browse filter options"
              >
                {stacks.map((stack, index) => (
                  <AnimatedContent
                    key={stack}
                    className="min-w-0 shrink-0 sm:basis-[calc((100%-2.5rem)/6)]"
                    distance={8}
                    direction="horizontal"
                    duration={0.35}
                    ease="power2.out"
                    threshold={0.1}
                    delay={Math.min(index, 5) * 0.04}
                  >
                    <button
                      type="button"
                      aria-pressed={
                        stack === "All"
                          ? selectedStacks.length === 0
                          : selectedStacks.includes(stack)
                      }
                      onClick={() => {
                        setSelectedStacks((currentStacks) => {
                          if (stack === "All") return [];
                          return currentStacks.includes(stack)
                            ? currentStacks.filter((item) => item !== stack)
                            : [...currentStacks, stack];
                        });
                        setShowAllProjects(false);
                      }}
                      className="block w-full rounded-full transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                    >
                      <GlassPill
                        className={`w-full justify-center transition-colors duration-200 ${
                          (stack === "All" && selectedStacks.length === 0) ||
                          selectedStacks.includes(stack)
                            ? "border border-lime bg-lime shadow-[0_0_8px_rgba(190,242,100,0.16)]"
                            : "border border-white/15 bg-transparent hover:border-lime/60"
                        }`}
                        textClassName={`max-w-full px-3 py-1 text-xs transition-colors duration-200 sm:px-2 ${
                          (stack === "All" && selectedStacks.length === 0) ||
                          selectedStacks.includes(stack)
                            ? "text-night"
                            : "text-paper/75"
                        }`}
                      >
                        <span className="truncate">{stack}</span>
                      </GlassPill>
                    </button>
                  </AnimatedContent>
                ))}
              </div>
            </div>

            <label className="relative block w-full shrink-0 rounded-full sm:w-64 2xl:w-80">
              <GlassSurface className="pointer-events-none absolute inset-0 rounded-full border border-white/10 bg-white/[0.04]" />
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 z-20 size-4 -translate-y-1/2 text-paper/45"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowAllProjects(false);
                }}
                placeholder="Search projects"
                aria-label="Search projects"
                className="input input-sm relative z-10 h-10 min-h-0 w-full rounded-full border-transparent bg-transparent pl-11 text-paper shadow-none transition-shadow duration-300 placeholder:text-paper/45 focus:border-lime focus:bg-transparent focus:shadow-[0_0_0_4px_rgba(190,242,100,0.12)] 2xl:h-11"
              />
            </label>
          </div>
        </div>
      </AnimatedContent>

      {visibleProjects.length === 0 ? (
        <div className="mt-8 flex flex-1 items-center justify-center 2xl:mt-10">
          <AnimatedContent distance={30} duration={0.7} ease="power3.out">
            <div className="flex flex-col items-center gap-4 text-center text-paper/55">
              <svg
                aria-hidden="true"
                viewBox="0 0 256 256"
                className="h-40 w-40 drop-shadow-[0_16px_32px_rgba(59,130,246,0.12)]"
              >
                <defs>
                  <linearGradient
                    id="empty-box-light"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#e7f2ff" />
                    <stop offset="1" stopColor="#c4d9f1" />
                  </linearGradient>
                  <linearGradient
                    id="empty-box-dark"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#b5cae4" />
                    <stop offset="1" stopColor="#8ea9ca" />
                  </linearGradient>
                </defs>
                <path
                  d="M36 119 104 96q5-2 8 2l16 24-83 27-10-20q-3-7 1-10Zm184 0-68-23q-5-2-8 2l-16 24 83 27 10-20q3-7-1-10Z"
                  fill="url(#empty-box-light)"
                />
                <path d="m45 149 83-27 83 27-82 28-84-28Z" fill="#a9bfdc" />
                <path
                  d="m45 149 83 28v55l-74-23q-9-3-9-12v-48Zm166 0-83 28v55l74-23q9-3 9-12v-48Z"
                  fill="url(#empty-box-dark)"
                />
                <path
                  d="M75 130c-18-13-19-27-7-38 12-11 28-14 46-15 21-1 33-6 38-18 5-12-2-24-13-31"
                  fill="none"
                  stroke="#3b82f6"
                  strokeDasharray="10 12"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                <path
                  d="M139 25c-3-12 5-22 17-22s19 10 16 20c-2 8-10 15-17 19-8-4-14-10-16-17Z"
                  fill="url(#empty-box-light)"
                />
                <path
                  d="M132 25h34"
                  fill="none"
                  stroke="#3b82f6"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <p className="text-sm">There are no projects.</p>
            </div>
          </AnimatedContent>
        </div>
      ) : (
        <>
          <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:mt-10 2xl:gap-8">
            {displayedProjects.map((project, index) => (
              <AnimatedContent
                key={`${project.slug}-${index}`}
                className="h-full"
                distance={60}
                direction="vertical"
                duration={0.8}
                ease="power3.out"
                initialOpacity={0}
                threshold={0.1}
                delay={(index % 3) * 0.1}
              >
                <ProjectCard project={project} />
              </AnimatedContent>
            ))}
          </div>
          {visibleProjects.length > 6 && (
            <Magnet
              padding={60}
              magnetStrength={3}
              wrapperClassName="mx-auto mt-8 2xl:mt-10"
            >
              <button
                type="button"
                onClick={() => setShowAllProjects((expanded) => !expanded)}
                aria-expanded={showAllProjects}
                className="rounded-full transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                <GlassPill
                  className="border border-white/20 bg-white/[0.06] transition-colors duration-200 hover:border-lime hover:bg-lime"
                  textClassName="px-8 py-2 text-paper transition-colors duration-200 hover:text-night"
                >
                  {showAllProjects ? "Show less" : "Show more"}
                </GlassPill>
              </button>
            </Magnet>
          )}
        </>
      )}
    </section>
  );
}