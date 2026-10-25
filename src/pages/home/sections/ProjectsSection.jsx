import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";

import GlassSurface from "@/components/GlassSurface";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";
import GlassPill from "@/components/GlassPill";
import Magnet from "@/components/Magnet";
import ShinyText from "@/components/ShinyText";
import { useProjects } from "@/data/projects";
import { startPixelTransition } from "@/lib/pixelTransition";

const MAX_VISIBLE_PROJECTS = 3;

const FEATURED_ORDER = ["pt-central-invoicing", "lazismu-muda", "fashion-shop"];

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const linkRef = useRef(null);
  const destination = `/projects/${project.slug}`;

  const badge =
    project.role ||
    (project.status && project.status !== "completed" ? project.status : null);

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
    startPixelTransition(
      () => {
        navigate(destination);
        return destination;
      },
      destination
    );
  };

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
        <div className="card relative h-full w-full overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-white/[0.12] via-white/[0.04] to-white/[0.02] p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.15)] 2xl:rounded-[2rem]">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={24}
            backgroundOpacity={0.1}
            blur={16}
            saturation={1.4}
            className="pointer-events-none absolute! inset-0! 2xl:rounded-[2rem]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/9 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(190, 242, 100, 0.16), transparent 60%)",
            }}
          />

          <div className="card-body relative flex h-full flex-col gap-5 p-5 sm:p-6 2xl:gap-7 2xl:p-9">
            <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-black/40 font-display text-6xl text-lime/80 2xl:rounded-3xl 2xl:text-8xl">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                project.title.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 2xl:gap-4">
              <div className="flex items-start justify-between gap-3">
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
                {badge && (
                  <GlassPill
                    className="shrink-0"
                    textClassName="whitespace-nowrap px-3 py-1 text-xs text-paper/85"
                  >
                    {badge}
                  </GlassPill>
                )}
              </div>

              {/* line-clamp keeps card heights even when descriptions differ in length */}
              <p className="line-clamp-4 text-sm leading-relaxed text-paper/80 2xl:text-base">
                {project.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
                {project.stack
                  .slice(0, project.stack.length > 5 ? 4 : 5)
                  .map((item) => (
                    <GlassPill
                      key={item}
                      className="transition-colors duration-200 group-hover:border-lime/30"
                      textClassName="px-4 py-1.5 text-sm text-paper/85 2xl:px-5 2xl:py-2 2xl:text-base"
                    >
                      {item}
                    </GlassPill>
                  ))}
                {project.stack.length > 5 && (
                  <GlassPill
                    className="border border-lime/30"
                    textClassName="px-4 py-1.5 text-sm text-lime 2xl:px-5 2xl:py-2 2xl:text-base"
                  >
                    +{project.stack.length - 4} more
                  </GlassPill>
                )}
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
  const { projects: projectList } = useProjects();
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

  // Featured projects first; Array.sort is stable, so the rest keep their order.
  const sortedProjects = useMemo(() => {
    const rank = (slug) => {
      const index = FEATURED_ORDER.indexOf(slug);
      return index === -1 ? FEATURED_ORDER.length : index;
    };
    return [...projectList].sort((a, b) => rank(a.slug) - rank(b.slug));
  }, [projectList]);

  const stacks = useMemo(() => {
    const stackCounts = new Map();
    projectList.forEach((project) => {
      project.stack.forEach((stack) => {
        stackCounts.set(stack, (stackCounts.get(stack) ?? 0) + 1);
      });
    });
    const mostUsedStacks = [...stackCounts]
      .sort((first, second) => second[1] - first[1])
      .map(([stack]) => stack);

    return ["All", ...mostUsedStacks];
  }, [projectList]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedProjects.filter((project) => {
      const matchesStack =
        selectedStacks.length === 0 ||
        selectedStacks.some((stack) => project.stack.includes(stack));
      const searchableText =
        `${project.title} ${project.description} ${project.stack.join(" ")}`.toLowerCase();
      return matchesStack && searchableText.includes(normalizedQuery);
    });
  }, [sortedProjects, query, selectedStacks]);

  const displayedProjects = showAllProjects
    ? visibleProjects
    : visibleProjects.slice(0, MAX_VISIBLE_PROJECTS);

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
      className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-20 2xl:max-w-[1600px] 2xl:px-8 2xl:py-28"
    >
      {/* Soft colour behind the cards. Frosted glass only looks like glass when
          there is something behind it to blur; a flat black page gives it nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-[8%] top-[38%] h-72 w-72 rounded-full bg-lime/15 blur-3xl" />
        <div className="absolute right-[10%] top-[48%] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[8%] left-[42%] h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-lime">
            Selected work
          </p>
          <BlurText
            text="Projects"
            delay={0}
            animateBy="letters"
            direction="top"
            className="mt-2 font-display text-4xl text-paper 2xl:text-6xl"
          />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-paper/75 2xl:max-w-xl 2xl:text-base">
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
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={32}
            backgroundOpacity={0.05}
            className="pointer-events-none absolute! inset-0! rounded-[2rem] shadow-[0_10px_32px_rgba(0,0,0,0.16)] sm:rounded-full"
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 2xl:gap-7">
            <div className="relative min-w-0 flex-1">
              {/* Chips now size to their text (no fixed 1/6 width, no truncate),
                  so "Tailwind CSS" and "TypeScript" show in full. The row still
                  scrolls/drags horizontally when there are many stacks. */}
              <div
                ref={filterTrackRef}
                role="group"
                aria-label="Filter projects by technology"
                onPointerDown={handleFilterPointerDown}
                onClickCapture={handleFilterClickCapture}
                className="flex w-full cursor-grab touch-pan-x flex-nowrap gap-2 overflow-x-auto px-1 py-1 active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
                title="Drag or scroll horizontally to browse filter options"
              >
                {stacks.map((stack, index) => (
                  <AnimatedContent
                    key={stack}
                    className="shrink-0"
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
                      className="block rounded-full transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                    >
                      <GlassPill
                        className={`justify-center transition-colors duration-200 ${(stack === "All" && selectedStacks.length === 0) ||
                            selectedStacks.includes(stack)
                            ? "border border-lime bg-lime shadow-[0_0_8px_rgba(190,242,100,0.16)]"
                            : "border border-white/15 bg-transparent hover:border-lime/60"
                          }`}
                        textClassName={`whitespace-nowrap px-4 py-1.5 text-sm transition-colors duration-200 ${(stack === "All" && selectedStacks.length === 0) ||
                            selectedStacks.includes(stack)
                            ? "text-night"
                            : "text-paper/85"
                          }`}
                      >
                        {stack}
                      </GlassPill>
                    </button>
                  </AnimatedContent>
                ))}
              </div>
            </div>

            <label className="relative block w-full shrink-0 rounded-full sm:w-64 2xl:w-80">
              <GlassSurface
                width="100%"
                height="100%"
                borderRadius={9999}
                backgroundOpacity={0.05}
                className="pointer-events-none absolute! inset-0!"
              />
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 z-20 size-4 -translate-y-1/2 text-paper/65"
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
                className="input input-sm relative z-10 h-10 min-h-0 w-full rounded-full border-transparent bg-transparent pl-11 text-paper shadow-none transition-shadow duration-300 placeholder:text-paper/60 focus:border-lime focus:bg-transparent focus:shadow-[0_0_0_4px_rgba(190,242,100,0.12)] 2xl:h-11"
              />
            </label>
          </div>
        </div>
      </AnimatedContent>

      {visibleProjects.length === 0 ? (
        <div className="mt-8 flex flex-1 items-center justify-center 2xl:mt-10">
          <AnimatedContent distance={30} duration={0.7} ease="power3.out">
            <div className="flex flex-col items-center gap-4 text-center text-paper/70">
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
              <p className="text-sm">No projects match your filters.</p>
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
          {visibleProjects.length > MAX_VISIBLE_PROJECTS && (
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
                  className="border border-white/20 bg-white/6 transition-colors duration-200 hover:border-lime hover:bg-lime"
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