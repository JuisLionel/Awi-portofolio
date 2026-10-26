import { useRef } from "react";
import { Link, useNavigate } from "react-router";

import GlassPill from "@/components/GlassPill";
import GlassSurface from "@/components/GlassSurface";
import ShinyText from "@/components/ShinyText";
import { startPixelTransition } from "@/lib/pixelTransition";

export default function ProjectCard({ project }) {
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
