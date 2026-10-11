import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Check, ChevronLeft, ChevronRight, Link2, Maximize2, X } from "lucide-react";

import GlassSurface from "../components/GlassSurface";
import GlassPill from "../components/GlassPill";
import AnimatedContent from "../components/AnimatedContent";
import NotFound from "./NotFound";
import { useProjects } from "../../Data/projects";
import { startPixelTransition } from "../lib/pixelTransition";

/* ------------------------------------------------------------------ */
/* Small interactive helpers                                           */
/* ------------------------------------------------------------------ */

// Soft lime light that follows the cursor inside a card.
function SpotlightCard({ as: Tag = "div", className = "", children }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(190,242,100,0.14), transparent 70%)",
        }}
      />
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Preview, lightbox, pager                                            */
/* ------------------------------------------------------------------ */

function getProjectImages(project) {
  const images = [
    project.image,
    ...(Array.isArray(project.images) ? project.images : []),
  ].filter((image) => typeof image === "string" && image.trim());

  return [...new Set(images)];
}

function ProjectPreview({ project, images, onOpen }) {
  const tiltRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // 3D tilt + glare that follow the pointer (skipped for touch / reduced motion).
  const handleMouseMove = (event) => {
    const el = tiltRef.current;
    if (!el || event.pointerType === "touch") return;
    if (event.target instanceof Element && event.target.closest("button")) {
      el.style.transform = "";
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  const moveImage = (offset) => {
    setSelectedImage((current) => (current + offset + images.length) % images.length);
  };

  const content = images.length > 0 ? (
    <img
      src={images[selectedImage]}
      alt={`${project.title} preview ${selectedImage + 1}`}
      className="h-full w-full rounded-3xl object-cover transition-[scale] duration-300 group-hover:scale-[1.025]"
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
      className="group relative aspect-video overflow-hidden rounded-3xl border border-white/25 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.48)] ring-1 ring-white/10 transition-transform duration-200 ease-out will-change-transform"
    >
      {content}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.45), transparent 55%)",
        }}
      />

      {images.length > 0 && (
        <button
          type="button"
          onClick={() => onOpen(selectedImage)}
          aria-label={`Open image ${selectedImage + 1} fullscreen`}
          className="absolute inset-0 flex cursor-zoom-in items-center justify-center rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lime"
        >
          <span className="grid size-12 place-items-center rounded-full border border-lime bg-lime text-night opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-[opacity,scale] duration-200 group-hover:scale-110 group-hover:opacity-100 group-focus-within:opacity-100">
            <Maximize2 aria-hidden="true" className="size-5" />
          </span>
        </button>
      )}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              moveImage(-1);
            }}
            aria-label="Previous project image"
            className="absolute left-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-paper shadow-lg backdrop-blur-sm transition-[scale,color,border-color] hover:scale-110 hover:border-lime hover:text-lime active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              moveImage(1);
            }}
            aria-label="Next project image"
            className="absolute right-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-paper shadow-lg backdrop-blur-sm transition-[scale,color,border-color] hover:scale-110 hover:border-lime hover:text-lime active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <div className="absolute inset-x-3 bottom-3 z-10 flex justify-center gap-2 rounded-full bg-black/45 px-3 py-2 backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedImage(index);
                }}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={selectedImage === index}
                className={`grid place-items-center rounded-full p-1 transition-[scale,background-color] ${
                  selectedImage === index ? "scale-110" : "hover:scale-110"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-[width,height,background-color,box-shadow] ${
                    selectedImage === index
                      ? "size-3 bg-lime shadow-[0_0_10px_rgba(190,242,100,0.8)]"
                      : "size-2.5 bg-white/55"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Lightbox({ project, images, initialImage = 0, onClose }) {
  const closeRef = useRef(null);
  const imgRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [activeImage, setActiveImage] = useState(initialImage);

  const showImage = (index) => {
    setActiveImage((index + images.length) % images.length);
    setZoomed(false);
  };

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setZoomed(false);
        setActiveImage((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setZoomed(false);
        setActiveImage((current) => (current + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  // When zoomed, the zoom origin follows the cursor so you can pan around.
  const pan = (event) => {
    const el = imgRef.current;
    if (!el || !zoomed) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.transformOrigin = `${x}% ${y}%`;
  };

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
        className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/70 text-paper shadow-lg transition-[scale,color,border-color] duration-200 hover:scale-110 hover:border-lime hover:text-lime active:scale-95 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
      <img
        ref={imgRef}
        src={images[activeImage]}
        alt={`${project.title} preview ${activeImage + 1}`}
        onClick={(event) => {
          event.stopPropagation();
          setZoomed((value) => !value);
        }}
        onMouseMove={pan}
        className={`max-h-full max-w-full animate-lightbox-in rounded-2xl border border-white/15 object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-[scale] duration-300 ease-out ${
          zoomed ? "scale-[1.8] cursor-zoom-out" : "scale-100 cursor-zoom-in"
        }`}
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showImage(activeImage - 1);
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-lime/70 bg-lime text-night shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-[scale,box-shadow] hover:scale-110 hover:shadow-[0_0_20px_rgba(190,242,100,0.35)] active:scale-95"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showImage(activeImage + 1);
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-lime/70 bg-lime text-night shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-[scale,box-shadow] hover:scale-110 hover:shadow-[0_0_20px_rgba(190,242,100,0.35)] active:scale-95"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-paper/80">
            {activeImage + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}

function PagerButton({ direction, project, onClick }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl transition-[border-color,translate,scale] duration-200 hover:-translate-y-0.5 hover:border-lime/50 active:scale-[0.98] ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      {isNext ? (
        <ChevronRight
          aria-hidden="true"
          className="size-5 shrink-0 text-lime transition-[translate] duration-200 group-hover:translate-x-1"
        />
      ) : (
        <ChevronLeft
          aria-hidden="true"
          className="size-5 shrink-0 text-lime transition-[translate] duration-200 group-hover:-translate-x-1"
        />
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const { projects: projectList, loading } = useProjects();

  const index = projectList.findIndex((item) => item.slug === slug);
  const project = index === -1 ? null : projectList[index];
  const projectImages = project ? getProjectImages(project) : [];
  const canNavigateProjects = project !== null && projectList.length > 1;
  const previousProject = canNavigateProjects
    ? projectList[(index - 1 + projectList.length) % projectList.length]
    : null;
  const nextProject = canNavigateProjects
    ? projectList[(index + 1) % projectList.length]
    : null;

  // Other projects ranked by how many technologies they share with this one.
  const relatedProjects = project
    ? projectList
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
    startPixelTransition(
      () => {
        navigate(path, state ? { state } : undefined);
        return path;
      },
      path
    );
  };

  const returnToProjects = () => {
    startPixelTransition(() => {
      navigate("/", { state: { scrollTo: "projects" } });
      return "/";
    }, "/");
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

  if (loading) {
    return (
      <main className="portfolio-background grid min-h-screen place-items-center px-4 text-paper">
        <p role="status" className="font-mono text-sm text-paper/60">
          Loading project…
        </p>
      </main>
    );
  }

  if (!project) return <NotFound />;

  return (
    <main className="portfolio-background min-h-screen px-4 py-8 text-paper sm:px-8 sm:py-12">
      {/* Reading progress */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-1 bg-white/5">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_rgba(190,242,100,0.6)]"
        />
      </div>

      {lightboxOpen && projectImages.length > 0 && (
        <Lightbox
          project={project}
          images={projectImages}
          initialImage={lightboxImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={returnToProjects}
            className="group rounded-full transition-[translate,scale] duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <GlassPill textClassName="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs text-paper/80 transition-colors duration-200 group-hover:text-lime">
              <span aria-hidden="true">←</span> Back to projects
            </GlassPill>
          </button>

          <button
            type="button"
            onClick={copyLink}
            aria-live="polite"
            className="group rounded-full transition-[translate,scale] duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <GlassPill textClassName="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs text-paper/80 transition-colors duration-200 group-hover:text-lime">
              {copied ? (
                <>
                  <Check aria-hidden="true" className="size-4 text-lime" /> Link copied
                </>
              ) : (
                <>
                  <Link2 aria-hidden="true" className="size-4" /> Copy link
                </>
              )}
            </GlassPill>
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
                key={project.slug}
                project={project}
                images={projectImages}
                onOpen={(imageIndex) => {
                  setLightboxImage(imageIndex);
                  setLightboxOpen(true);
                }}
              />
            </AnimatedContent>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {project.challenge && (
                <AnimatedContent distance={16} duration={0.55}>
                  <SpotlightCard className="alert block h-full rounded-3xl border border-white/10 bg-white/6 p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-lime/40">
                    <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                    <div className="relative z-10">
                      <h2 className="font-display text-lg">The challenge</h2>
                      <p className="mt-2 text-sm leading-relaxed text-paper/65">
                        {project.challenge}
                      </p>
                    </div>
                  </SpotlightCard>
                </AnimatedContent>
              )}

              {project.highlights?.length > 0 && (
                <AnimatedContent distance={16} duration={0.55} delay={0.08}>
                  <SpotlightCard className="alert block h-full rounded-3xl border border-white/10 bg-white/6 p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-lime/40">
                    <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                    <div className="relative z-10">
                      <h2 className="font-display text-lg">What I built</h2>
                      <ul className="mt-2 space-y-2 text-sm text-paper/70 [&:hover>li:not(:hover)]:opacity-40">
                        {project.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="group/item flex gap-2 transition-[opacity,translate,color] duration-300 hover:translate-x-1 hover:text-paper"
                          >
                            <span
                              className="inline-block text-lime transition-[scale] duration-300 group-hover/item:scale-125"
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </AnimatedContent>
              )}
            </div>

          </section>

          <AnimatedContent className="lg:sticky lg:top-8" distance={18} duration={0.65} delay={0.1}>
            <SpotlightCard as="aside" className="rounded-3xl p-6">
              <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.25)]" />
              <div className="relative z-10">
                <h2 className="font-display text-xl">At a glance</h2>
                {project.status && (
                  <p className="mt-2 text-sm text-paper/55">
                    Status: <span className="text-lime">{project.status}</span>
                  </p>
                )}

                {/* Tools & technologies (static labels) */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                    Tools &amp; technologies
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {project.stack.map((item) => (
                      <li key={item} className="cursor-default select-none">
                        <GlassPill textClassName="px-4 py-1.5 text-xs text-paper/80 lg:px-5 lg:py-2">
                          {item}
                        </GlassPill>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links (unchanged) */}
                <div className="mt-8 flex flex-col gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary group relative w-full rounded-full border-lime bg-lime text-night
                        shadow-[0_0_0_0_rgba(190,242,100,0)]
                        transition-[translate,scale,box-shadow,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:-translate-y-1 hover:scale-[1.03] hover:border-lime hover:bg-lime
                          hover:shadow-[0_10px_40px_-4px_rgba(190,242,100,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime
                          active:translate-y-0 active:scale-[0.97] active:shadow-[0_4px_16px_-2px_rgba(190,242,100,0.35)] active:duration-150
                          motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                      >
                        {/* Clipping layer for the shine, so the glow on the <a> isn't cut off */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full motion-reduce:hidden"
                        >
                          <span
                            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/50 blur-sm
                            transition-transform duration-0
                            group-hover:translate-x-[450%] group-hover:duration-700 group-hover:ease-out"
                          />
                        </span>

                        <span className="relative z-10 inline-flex items-center gap-1.5">
                          Visit site
                          <span
                            aria-hidden="true"
                            className="inline-block transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125
                            group-active:translate-x-0 group-active:translate-y-0 group-active:scale-100
                            motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100"
                          >
                            ↗
                          </span>
                        </span>
                    </a>
                  )}

                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline group relative w-full rounded-full border-white/20 bg-white/4 text-paper backdrop-blur-md
                        shadow-[0_0_0_0_rgba(190,242,100,0)]
                        transition-[translate,scale,box-shadow,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:-translate-y-1 hover:scale-[1.03] hover:border-lime/40 hover:bg-white/10
                          hover:shadow-[0_10px_40px_-4px_rgba(190,242,100,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime
                          active:translate-y-0 active:scale-[0.97] active:bg-white/15 active:shadow-[0_4px_16px_-2px_rgba(190,242,100,0.2)] active:duration-150
                          motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                    >
                      {/* Border-only shine: gradient strip masked down to a 1px ring */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px overflow-hidden rounded-full p-px motion-reduce:hidden
                          [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                          [-webkit-mask-composite:xor] mask-exclude"
                      >
                        <span
                          className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12
                            bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95)_45%,rgba(190,242,100,0.95)_55%,transparent)]
                            transition-transform duration-0
                            group-hover:translate-x-[350%] group-hover:duration-900 group-hover:ease-out"
                        />
                      </span>

                      <span className="relative z-10 inline-flex items-center gap-1.5">
                        Source code
                        <span
                          aria-hidden="true"
                          className="inline-block transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125
                            group-active:translate-x-0 group-active:translate-y-0 group-active:scale-100
                            motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100"
                        >
                          ↗
                        </span>
                      </span>
                    </a>
                  )}
                </div>

                {/* Related projects */}
                {relatedProjects.length > 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                      Related projects
                    </h3>
                    <div className="mt-4 flex flex-col gap-2.5">
                      {relatedProjects.map(({ item, shared }) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => goTo(`/projects/${item.slug}`)}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left backdrop-blur-xl transition-[border-color,translate,scale] duration-200 hover:-translate-y-0.5 hover:border-lime/50 active:scale-[0.98]"
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate font-display text-base text-paper transition-colors duration-200 group-hover:text-lime">
                              {item.title}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="size-4 shrink-0 text-lime opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-paper/45">
                            {shared} shared {shared === 1 ? "tech" : "techs"}
                          </span>
                          <span className="mt-2.5 flex flex-wrap gap-1.5">
                            {item.stack.slice(0, 3).map((tech) => {
                              const isShared = project.stack.includes(tech);
                              return (
                                <span
                                  key={tech}
                                  className={`rounded-full ${
                                    isShared ? "ring-1 ring-lime/50" : ""
                                  }`}
                                >
                                  <GlassPill
                                    textClassName={`px-3 py-1 text-[11px] ${
                                      isShared ? "text-lime" : "text-paper/60"
                                    }`}
                                  >
                                    {tech}
                                  </GlassPill>
                                </span>
                              );
                            })}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </AnimatedContent>
        </div>

        {/* Keep project navigation below both columns so it stays visible on every detail page. */}
        {previousProject && nextProject && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <AnimatedContent distance={16} duration={0.55}>
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
          </div>
        )}
      </div>
    </main>
  );
}