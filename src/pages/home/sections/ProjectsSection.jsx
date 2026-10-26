import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import GlassSurface from "@/components/GlassSurface";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";
import GlassPill from "@/components/GlassPill";
import Magnet from "@/components/Magnet";
import ProjectCard from "@/pages/home/components/ProjectCard";
import { useProjects } from "@/data/projects";

const MAX_VISIBLE_PROJECTS = 3;
const CHIPS_PER_PAGE = 6;
const EDGE_FADE = 32;

const FADE_STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => [
  t,
  t * t * (3 - 2 * t),
]);
const FADE_LEFT = FADE_STEPS.map(
  ([t, a]) => `rgba(0,0,0,${a.toFixed(3)}) ${(t * EDGE_FADE).toFixed(1)}px`,
).join(", ");
const FADE_RIGHT = [...FADE_STEPS]
  .reverse()
  .map(
    ([t, a]) =>
      `rgba(0,0,0,${a.toFixed(3)}) calc(100% - ${(t * EDGE_FADE).toFixed(1)}px)`,
  )
  .join(", ");
const EDGE_MASK = `linear-gradient(to right, ${FADE_LEFT}, ${FADE_RIGHT})`;

const FEATURED_ORDER = ["pt-central-invoicing", "lazismu-muda", "fashion-shop"];

export default function Projects() {
  const { projects: projectList } = useProjects();
  const [query, setQuery] = useState("");
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [chipPage, setChipPage] = useState(0);
  const [baseX, setBaseX] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(undefined);
  const filterViewportRef = useRef(null);
  const filterTrackRef = useRef(null);
  const chipRefs = useRef([]);
  const layoutRef = useRef({ baseX: 0, maxX: 0 });
  const filterDragRef = useRef({ pointerId: null, startX: 0, moved: false });
  const suppressFilterClickRef = useRef(false);

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

  const lastPage = Math.max(Math.ceil(stacks.length / CHIPS_PER_PAGE) - 1, 0);

  useLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const chips = chipRefs.current;
      const start = chipPage * CHIPS_PER_PAGE;
      const end = Math.min(start + CHIPS_PER_PAGE, stacks.length) - 1;
      const first = chips[start];
      const last = chips[end];
      const lastPageFirst = chips[lastPage * CHIPS_PER_PAGE];
      if (!first || !last || !lastPageFirst) return;

      const nextBase = first.offsetLeft;
      const width = last.offsetLeft + last.offsetWidth - first.offsetLeft;

      layoutRef.current = { baseX: nextBase, maxX: lastPageFirst.offsetLeft };
      setBaseX(nextBase);
      setViewportWidth(width + EDGE_FADE * 2);
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [chipPage, stacks, lastPage]);

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
      if (!drag.moved && Math.abs(distance) > 4) {
        drag.moved = true;
        setIsDragging(true);
      }
      if (!drag.moved) return;

      const { baseX: base, maxX } = layoutRef.current;
      const raw = -base + distance;
      let next = raw;
      if (raw > 0) next = raw * 0.3;
      else if (raw < -maxX) next = -maxX + (raw + maxX) * 0.3;
      setDragX(next + base);
    };

    const handlePointerEnd = (event) => {
      const drag = filterDragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const distance = event.clientX - drag.startX;
      const width = filterViewportRef.current?.offsetWidth ?? 300;
      const threshold = Math.min(60, width * 0.15);

      if (drag.moved) {
        if (distance < -threshold) {
          setChipPage((page) => Math.min(page + 1, lastPage));
        } else if (distance > threshold) {
          setChipPage((page) => Math.max(page - 1, 0));
        }
      }

      suppressFilterClickRef.current = drag.moved;
      drag.pointerId = null;
      drag.moved = false;
      setDragX(0);
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [lastPage]);

  const handleFilterPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    suppressFilterClickRef.current = false;
    filterDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
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
        {/* sm:pl-0 because the chip viewport already has its own fade padding */}
        <div className="relative rounded-[2rem] p-3 sm:rounded-full sm:p-2.5 sm:pl-0 2xl:p-3 2xl:pl-0">
          {/* Rounding + faint white fill come from className because
              GlassSurface only reads blur / saturate / brightness. */}
          <GlassSurface
            saturate={1.2}
            className="pointer-events-none absolute! inset-0! rounded-[2rem] border border-white/10 bg-white/4 shadow-[0_10px_32px_rgba(0,0,0,0.16)] sm:rounded-full"
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 2xl:gap-7">
            <div className="relative min-w-0 flex-1">
              {/* Viewport is exactly as wide as the current page of chips plus
                  the fade zones, so the next page stays hidden until you drag.
                  The eased mask fades chips out at both edges, so there is no
                  visible cut line. */}
              <div
                ref={filterViewportRef}
                role="group"
                aria-label="Filter projects by technology"
                onPointerDown={handleFilterPointerDown}
                onClickCapture={handleFilterClickCapture}
                className="max-w-full cursor-grab touch-pan-y select-none overflow-hidden py-1 active:cursor-grabbing"
                style={{
                  width: viewportWidth,
                  paddingLeft: EDGE_FADE,
                  paddingRight: EDGE_FADE,
                  WebkitMaskImage: EDGE_MASK,
                  maskImage: EDGE_MASK,
                  transition: isDragging
                    ? "none"
                    : "width 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                title="Drag to see more filter options"
              >
                <div
                  ref={filterTrackRef}
                  className="relative flex w-max gap-2"
                  style={{
                    transform: `translateX(${-baseX + dragX}px)`,
                    transition: isDragging
                      ? "none"
                      : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {stacks.map((stack, index) => {
                    const isActive =
                      stack === "All"
                        ? selectedStacks.length === 0
                        : selectedStacks.includes(stack);
                    const onCurrentPage =
                      Math.floor(index / CHIPS_PER_PAGE) === chipPage;
                    const hidden = !isDragging && !onCurrentPage;

                    return (
                      <div
                        key={stack}
                        ref={(node) => {
                          chipRefs.current[index] = node;
                        }}
                        className="shrink-0"
                        style={{
                          opacity: hidden ? 0 : 1,
                          transform: hidden ? "scale(0.85)" : "scale(1)",
                          filter: hidden ? "blur(4px)" : "blur(0px)",
                          pointerEvents: hidden ? "none" : "auto",
                          transition:
                            "opacity 350ms ease, transform 350ms ease, filter 350ms ease",
                        }}
                      >
                        <AnimatedContent
                          distance={8}
                          direction="horizontal"
                          duration={0.35}
                          ease="power2.out"
                          threshold={0.1}
                          delay={Math.min(index, 5) * 0.04}
                        >
                          <button
                            type="button"
                            tabIndex={onCurrentPage ? 0 : -1}
                            aria-pressed={isActive}
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
                              className={`justify-center transition-colors duration-200 ${isActive
                                  ? "border border-lime bg-lime shadow-[0_0_8px_rgba(190,242,100,0.16)]"
                                  : "border border-white/15 bg-transparent hover:border-lime/60"
                                }`}
                              textClassName={`whitespace-nowrap px-4 py-1.5 text-sm transition-colors duration-200 ${isActive ? "text-night" : "text-paper/85"
                                }`}
                            >
                              {stack}
                            </GlassPill>
                          </button>
                        </AnimatedContent>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <label className="relative block w-full shrink-0 rounded-full sm:w-64 2xl:w-80">
              <GlassSurface
                saturate={1.2}
                className="pointer-events-none absolute! inset-0! rounded-full border border-white/10 bg-white/4"
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