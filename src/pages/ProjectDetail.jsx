import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Check, ChevronLeft, ChevronRight, Link2, Maximize2, X } from "lucide-react";

import GlassSurface from "../components/GlassSurface";
import AnimatedContent from "../components/AnimatedContent";
import NotFound from "./NotFound";
import { projects } from "../../Data/projects";
import { startPixelTransition } from "../lib/pixelTransition";

function ProjectPreview({ project, onOpen }) {
  const tiltRef = useRef(null);

  // Subtle 3D tilt that follows the pointer (skipped for touch / reduced motion).
  const handleMouseMove = (event) => {
    const el = tiltRef.current;
    if (!el || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };

  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  const content = project.image ? (
    <img
      src={project.image}
      alt={`${project.title} preview`}
      className="h-full w-full rounded-3xl object-cover transition-transform duration-300 group-hover:scale-[1.025]"
    />
  ) : (
    <div className="grid h-full w-full place-items-center rounded-3xl bg-gradient-to-br from-white/[0.08] to-black/50 font-display text-8xl text-lime/80">
      {project.title.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="group relative aspect-video overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-out will-change-transform"
    >
      {content}
      {project.image && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open image fullscreen"
          className="absolute inset-0 flex cursor-zoom-in items-end justify-end rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lime"
        >
          <span className="btn btn-sm rounded-full border-white/20 bg-black/50 text-paper opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <Maximize2 aria-hidden="true" className="size-4" /> Expand
          </span>
        </button>
      )}
    </div>
  );
}

function Lightbox({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} preview`}
      onClick={onClose}
      className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/80 p-4 backdrop-blur-md sm:p-10"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="btn btn-circle btn-sm absolute right-4 top-4 border-white/20 bg-white/10 text-paper hover:border-lime hover:text-lime"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
      <img
        src={project.image}
        alt={`${project.title} preview`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full cursor-default rounded-2xl border border-white/15 object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}

function PagerButton({ direction, project, onClick }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-left backdrop-blur-xl transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-lime/50 active:scale-[0.98] ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      {isNext ? (
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-lime transition-transform duration-200 group-hover:translate-x-1" />
      ) : (
        <ChevronLeft aria-hidden="true" className="size-5 shrink-0 text-lime transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      <span className="min-w-0">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45">
          {isNext ? "Next project" : "Previous project"}
        </span>
        <span className="mt-1 block truncate font-display text-lg text-paper">
          {project.title}
        </span>
      </span>
    </button>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const index = projects.findIndex((item) => item.slug === slug);
  const project = index === -1 ? null : projects[index];
  const previousProject =
    projects.length > 1 ? projects[(index - 1 + projects.length) % projects.length] : null;
  const nextProject =
    projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  // Other projects ranked by how many technologies they share with this one.
  const relatedProjects = project
    ? projects
        .filter((item) => item.slug !== project.slug)
        .map((item) => ({
          item,
          shared: item.stack.filter((tech) => project.stack.includes(tech)).length,
        }))
        .filter(({ shared }) => shared > 0)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 3)
    : [];

  const goTo = (path, state) => {
    startPixelTransition(() => {
      navigate(path, state ? { state } : undefined);
      return path;
    });
  };

  const returnToProjects = (stack) => {
    startPixelTransition(() => {
      navigate("/", { state: { scrollTo: "projects", stack } });
      return "/";
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // Fresh start whenever the project changes (prev/next/related).
  useEffect(() => {
    window.scrollTo(0, 0);
    setLightboxOpen(false);
    setCopied(false);
  }, [slug]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  // Reading progress bar. Writes straight to the DOM to avoid re-rendering on scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [slug]);

  // Keyboard: Esc closes the lightbox, arrow keys move between projects.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (lightboxOpen || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight" && nextProject) {
        goTo(`/projects/${nextProject.slug}`);
      }
      if (event.key === "ArrowLeft" && previousProject) {
        goTo(`/projects/${previousProject.slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, nextProject?.slug, previousProject?.slug]);

  if (!project) return <NotFound />;

  return (
    <main
      className="portfolio-background min-h-screen px-4 py-8 text-paper sm:px-8 sm:py-12"
    >
      {/* Reading progress */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-1 bg-white/5"
      >
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_rgba(190,242,100,0.6)]"
        />
      </div>

      {lightboxOpen && project.image && (
        <Lightbox project={project} onClose={() => setLightboxOpen(false)} />
      )}

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => returnToProjects()}
            className="btn btn-ghost btn-sm rounded-full border border-white/10 bg-white/[0.06] text-paper/75 backdrop-blur-xl hover:bg-white/10 hover:text-lime"
          >
            <span aria-hidden="true">←</span> Back to projects
          </button>

          <button
            type="button"
            onClick={copyLink}
            aria-live="polite"
            className="btn btn-ghost btn-sm rounded-full border border-white/10 bg-white/[0.06] text-paper/75 backdrop-blur-xl hover:bg-white/10 hover:text-lime"
          >
            {copied ? (
              <>
                <Check aria-hidden="true" className="size-4 text-lime" /> Link copied
              </>
            ) : (
              <>
                <Link2 aria-hidden="true" className="size-4" /> Copy link
              </>
            )}
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          <section className="min-w-0">
            <AnimatedContent distance={18} duration={0.65}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-lime">
                Project details
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
                {project.title}
              </h1>
              {project.role && (
                <p className="mt-3 text-sm text-paper/55">{project.role}</p>
              )}
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/75 sm:text-lg">
                {project.description}
              </p>
            </AnimatedContent>

            <AnimatedContent className="mt-8" distance={18} duration={0.65} delay={0.08}>
              <ProjectPreview
                project={project}
                onOpen={() => setLightboxOpen(true)}
              />
            </AnimatedContent>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {project.challenge && (
                <AnimatedContent distance={16} duration={0.55}>
                  <div className="alert relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-lime/40">
                    <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                    <div className="relative">
                      <h2 className="font-display text-lg">The challenge</h2>
                      <p className="mt-2 text-sm leading-relaxed text-paper/65">
                        {project.challenge}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              )}
              {project.highlights?.length > 0 && (
                <AnimatedContent distance={16} duration={0.55} delay={0.08}>
                  <div className="alert relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-lime/40">
                    <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                    <div className="relative">
                      <h2 className="font-display text-lg">What I built</h2>
                      <ul className="mt-2 space-y-2 text-sm text-paper/70">
                        {project.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="group/item flex gap-2 transition-colors duration-200 hover:text-paper"
                          >
                            <span
                              className="inline-block text-lime transition-transform duration-300 group-hover/item:rotate-90 group-hover/item:scale-125"
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedContent>
              )}
            </div>

            {/* Previous / next project */}
            {previousProject && nextProject && (
              <AnimatedContent className="mt-10" distance={16} duration={0.55}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <PagerButton
                    direction="prev"
                    project={previousProject}
                    onClick={() => goTo(`/projects/${previousProject.slug}`)}
                  />
                  <PagerButton
                    direction="next"
                    project={nextProject}
                    onClick={() => goTo(`/projects/${nextProject.slug}`)}
                  />
                </div>
                <p className="mt-3 hidden text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35 sm:block">
                  Tip: use ← → arrow keys to switch projects
                </p>
              </AnimatedContent>
            )}

            {/* Related projects */}
            {relatedProjects.length > 0 && (
              <AnimatedContent className="mt-10" distance={16} duration={0.55}>
                <h2 className="font-display text-xl">Related projects</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {relatedProjects.map(({ item, shared }) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => goTo(`/projects/${item.slug}`)}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left backdrop-blur-xl transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-lime/50 active:scale-[0.98]"
                    >
                      <span className="block truncate font-display text-base text-paper transition-colors duration-200 group-hover:text-lime">
                        {item.title}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-paper/45">
                        {shared} shared {shared === 1 ? "tech" : "techs"}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {item.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className={`rounded-full border px-2 py-0.5 text-[11px] ${
                              project.stack.includes(tech)
                                ? "border-lime/40 text-lime"
                                : "border-white/10 text-paper/55"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </span>
                    </button>
                  ))}
                </div>
              </AnimatedContent>
            )}
          </section>

          <AnimatedContent className="lg:sticky lg:top-8" distance={18} duration={0.65} delay={0.1}>
            <aside className="relative overflow-hidden rounded-3xl p-6">
              <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.25)]" />
              <div className="relative">
              <h2 className="font-display text-xl">At a glance</h2>
              {project.status && (
                <p className="mt-2 text-sm text-paper/55">
                  Status: <span className="text-lime">{project.status}</span>
                </p>
              )}

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                  Tools &amp; technologies
                </h3>
                <p className="mt-2 text-xs text-paper/40">
                  Click one to see every project that uses it.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {project.stack.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => returnToProjects(item)}
                      title={`Show all projects using ${item}`}
                      className="badge badge-outline h-auto cursor-pointer rounded-full border-white/15 bg-white/[0.06] px-3 py-2 text-paper/80 backdrop-blur-md transition-[border-color,background-color,color,transform] duration-200 hover:border-lime hover:bg-lime hover:text-night active:scale-95"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary w-full rounded-full border-lime bg-lime text-night hover:border-lime hover:bg-lime"
                  >
                    Live demo <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline w-full rounded-full border-white/20 bg-white/[0.04] text-paper backdrop-blur-md hover:border-lime hover:bg-white/10"
                  >
                    Source code <span aria-hidden="true">↗</span>
                  </a>
                )}
                {!project.demo && !project.repo && (
                  <p className="text-sm text-paper/45">
                    Add a live demo or repository link in the project data.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => returnToProjects()}
                className="btn btn-ghost mt-5 w-full rounded-full border border-white/10 bg-white/[0.04] text-paper/75 backdrop-blur-md hover:bg-white/10 hover:text-lime"
              >
                Browse all projects
              </button>
              </div>
            </aside>
          </AnimatedContent>
        </div>
      </div>
    </main>
  );
}