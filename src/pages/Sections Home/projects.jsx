import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";

import GlassSurface from "../../components/GlassSurface";
import { projects } from "../../../Data/projects";
import { startPixelTransition } from "../../lib/pixelTransition";

function ProjectCard({ project }) {
  const navigate = useNavigate();
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

  return (
    <Link
      to={destination}
      onClick={handleClick}
      className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-lime/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:p-6 2xl:rounded-[2rem] 2xl:p-9"
    >
      <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
      <div className="relative flex h-full flex-col gap-5 2xl:gap-7">
        <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-black/40 font-display text-6xl text-lime/80 2xl:rounded-3xl 2xl:text-8xl">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            project.title.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 2xl:gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl text-paper 2xl:text-3xl">{project.title}</h3>
            {project.status && (
              <span className="badge badge-outline shrink-0 rounded-full border-white/20 text-paper/60">
                {project.status}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-paper/65 2xl:text-base">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="badge badge-ghost rounded-full border border-white/10 bg-white/5 text-paper/75"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <span className="btn btn-sm w-full rounded-full border-white/20 bg-white/10 text-paper backdrop-blur-xl group-hover:border-lime group-hover:bg-lime group-hover:text-night 2xl:btn-md">
          View project details <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [selectedStack, setSelectedStack] = useState("All");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const stacks = useMemo(
    () => ["All", ...new Set(projects.flatMap((project) => project.stack))],
    []
  );

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStack =
        selectedStack === "All" || project.stack.includes(selectedStack);
      const searchableText =
        `${project.title} ${project.description} ${project.stack.join(" ")}`.toLowerCase();
      return matchesStack && searchableText.includes(normalizedQuery);
    });
  }, [query, selectedStack]);

  const displayedProjects = showAllProjects
    ? visibleProjects
    : visibleProjects.slice(0, 6);

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
          <h2 className="mt-2 font-display text-4xl text-paper 2xl:text-6xl">Projects</h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-paper/60 2xl:max-w-xl 2xl:text-base">
          A closer look at the work, decisions, and tools behind each project.
        </p>
      </div>

      <div className="relative mt-7 rounded-3xl p-4 sm:rounded-full sm:p-3 2xl:mt-10 2xl:p-4">
        <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl border border-white/15 bg-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.2)] sm:rounded-full" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 2xl:gap-7">
          <div className="flex flex-wrap gap-2" aria-label="Filter projects by technology">
            {stacks.map((stack) => (
              <button
                key={stack}
                type="button"
                aria-pressed={selectedStack === stack}
                onClick={() => {
                  setSelectedStack(stack);
                  setShowAllProjects(false);
                }}
                className={`btn btn-sm rounded-full border backdrop-blur-md 2xl:btn-md ${
                  selectedStack === stack
                    ? "border-lime bg-lime text-night hover:border-lime hover:bg-lime"
                    : "border-white/15 bg-white/5 text-paper hover:border-lime/60 hover:bg-white/10"
                }`}
              >
                {stack}
              </button>
            ))}
          </div>
          <label className="relative block w-full sm:w-64 2xl:w-80">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-paper/45"
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
              className="input w-full rounded-full border-white/15 bg-white/[0.08] pl-11 text-paper shadow-inner shadow-black/10 backdrop-blur-xl placeholder:text-paper/45 focus:border-lime 2xl:input-lg"
            />
          </label>
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <div className="mt-8 flex flex-1 items-center justify-center 2xl:mt-10">
          <div className="flex flex-col items-center gap-4 text-center text-paper/55">
            <svg
              aria-hidden="true"
              viewBox="0 0 256 256"
              className="h-40 w-40 drop-shadow-[0_16px_32px_rgba(59,130,246,0.12)]"
            >
              <defs>
                <linearGradient id="empty-box-light" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e7f2ff" />
                  <stop offset="1" stopColor="#c4d9f1" />
                </linearGradient>
                <linearGradient id="empty-box-dark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#b5cae4" />
                  <stop offset="1" stopColor="#8ea9ca" />
                </linearGradient>
              </defs>
              <path
                d="M36 119 104 96q5-2 8 2l16 24-83 27-10-20q-3-7 1-10Zm184 0-68-23q-5-2-8 2l-16 24 83 27 10-20q3-7-1-10Z"
                fill="url(#empty-box-light)"
              />
              <path
                d="m45 149 83-27 83 27-82 28-84-28Z"
                fill="#a9bfdc"
              />
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
        </div>
      ) : (
        <>
          <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:mt-10 2xl:gap-8">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={`${project.slug}-${index}`} project={project} />
            ))}
          </div>
          {visibleProjects.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllProjects((expanded) => !expanded)}
              aria-expanded={showAllProjects}
              className="btn btn-outline mx-auto mt-8 rounded-full border-white/20 bg-white/[0.06] px-8 text-paper backdrop-blur-xl hover:border-lime hover:bg-lime hover:text-night 2xl:mt-10"
            >
              {showAllProjects ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
