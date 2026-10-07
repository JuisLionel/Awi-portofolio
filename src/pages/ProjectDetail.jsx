import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import GlassSurface from "../components/GlassSurface";
import NotFound from "./NotFound";
import { projects } from "../../Data/projects";
import { startPixelTransition } from "../lib/pixelTransition";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ProjectPreview({ project }) {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="h-full w-full rounded-3xl object-cover transition-transform duration-300 group-hover:scale-[1.025]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-3xl bg-gradient-to-br from-white/[0.08] to-black/50 font-display text-8xl text-lime/80">
          {project.title.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const project = projects.find((item) => item.slug === slug);

  useGSAP(
    () => {
      if (reduceMotion() || !project) return;
      gsap.fromTo(
        "[data-detail-item]",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    },
    { scope: pageRef, dependencies: [slug] }
  );

  if (!project) return <NotFound />;

  const returnToProjects = () => {
    startPixelTransition(() => {
      navigate("/", { state: { scrollTo: "projects" } });
      return "/";
    });
  };

  return (
    <main
      ref={pageRef}
      className="portfolio-background min-h-screen px-4 py-8 text-paper sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={returnToProjects}
          className="btn btn-ghost btn-sm rounded-full border border-white/10 bg-white/[0.06] text-paper/75 backdrop-blur-xl hover:bg-white/10 hover:text-lime"
        >
          <span aria-hidden="true">←</span> Back to projects
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          <section data-detail-item className="min-w-0">
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

            <div className="mt-8">
              <ProjectPreview project={project} />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {project.challenge && (
                <div className="alert relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                  <div className="relative">
                    <h2 className="font-display text-lg">The challenge</h2>
                    <p className="mt-2 text-sm leading-relaxed text-paper/65">
                      {project.challenge}
                    </p>
                  </div>
                </div>
              )}
              {project.highlights?.length > 0 && (
                <div className="alert relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                  <div className="relative">
                    <h2 className="font-display text-lg">What I built</h2>
                    <ul className="mt-2 space-y-2 text-sm text-paper/70">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span className="text-lime" aria-hidden="true">✦</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside
            data-detail-item
            className="relative overflow-hidden rounded-3xl p-6"
          >
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
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="badge badge-outline h-auto rounded-full border-white/15 bg-white/[0.06] px-3 py-2 text-paper/80 backdrop-blur-md"
                    >
                      {item}
                    </span>
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
                onClick={returnToProjects}
                className="btn btn-ghost mt-5 w-full rounded-full border border-white/10 bg-white/[0.04] text-paper/75 backdrop-blur-md hover:bg-white/10 hover:text-lime"
              >
                Browse all projects
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
