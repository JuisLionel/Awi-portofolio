import { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
    SiHtml5,
    SiCss,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiTailwindcss,
    SiVite,
    SiNodedotjs,
    SiExpress,
    SiPostgresql,
    SiSupabase,
    SiGit,
    SiFigma,
    SiNextdotjs
} from "react-icons/si";
import { FaArrowRight, FaCode, FaDownload } from "react-icons/fa6";

import Section from "@/components/Section";
import AnimatedContent from "@/components/AnimatedContent";
import DecryptedText from "@/components/DecryptedText";
import GlassSurface from "@/components/GlassSurface";
import GlassPill from "@/components/GlassPill";
import Magnet from "@/components/Magnet";
import { sections } from "@/config/sections";
import { useProjects } from "@/data/projects";
import { startPixelTransition } from "@/lib/pixelTransition";

gsap.registerPlugin(ScrollToPlugin);


const NAME = "Lionel Juis Gerardo";
const MAX_WORK = 3;

const FEATURED_ORDER = ["pt-central-invoicing", "fashion-shop"];

const GROUP_OF = {
    HTML: "Frontend",
    CSS: "Frontend",
    JavaScript: "Frontend",
    TypeScript: "Frontend",
    React: "Frontend",
    "Tailwind CSS": "Frontend",
    Vite: "Frontend",
    DaisyUI: "Frontend",
    "Ant Design": "Frontend",
    "Node.js": "Backend & data",
    Express: "Backend & data",
    PostgreSQL: "Backend & data",
    Supabase: "Backend & data",
    Git: "Workflow",
    Figma: "Workflow",
    "Next.js": "Frontend"
};

const ICON_OF = {
    HTML: SiHtml5,
    CSS: SiCss,
    JavaScript: SiJavascript,
    TypeScript: SiTypescript,
    React: SiReact,
    "Tailwind CSS": SiTailwindcss,
    Vite: SiVite,
    "Node.js": SiNodedotjs,
    Express: SiExpress,
    PostgreSQL: SiPostgresql,
    Supabase: SiSupabase,
    Git: SiGit,
    Figma: SiFigma,
    "Next.js": SiNextdotjs,
};

const EXTRA_TOOLS = ["Git", "Figma"];

const GROUP_ORDER = ["Frontend", "Backend & data", "Workflow", "Other"];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function goTo(label) {
    const match = sections.find((s) => s.label.toLowerCase() === label);
    const target = match && document.getElementById(match.id);
    if (!target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.to(window, {
        duration: reduced ? 0 : 0.9,
        scrollTo: { y: target, autoKill: true },
        ease: "power2.inOut",
        overwrite: "auto",
    });
}

function Label({ children }) {
    return (
        <div className="flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-lime sm:text-sm lg:gap-5 lg:tracking-[0.25em]">
            <span className="whitespace-nowrap">{children}</span>
            <span className="h-px flex-1 bg-white/30" />
        </div>
    );
}

function RevealPhoto({ src, alt }) {
    const move = (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    const mask =
        "[mask-image:radial-gradient(circle_150px_at_var(--px,50%)_var(--py,50%),black_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_150px_at_var(--px,50%)_var(--py,50%),black_35%,transparent_100%)]";

    return (
        <figure
            onMouseMove={move}
            style={{ width: "min(100%, max(15rem, calc((100vh - 26rem) * 0.8 + 1.5rem)))" }}
            className="group relative border border-white/25 bg-night-2 p-2.5 lg:p-3"
        >
            <span className="absolute left-0 top-5 z-10 h-20 w-0.5 bg-lime lg:top-6 lg:h-32" />
            <span className="absolute bottom-2.5 right-2.5 z-10 h-4 w-4 border-b-2 border-r-2 border-lime lg:bottom-3 lg:right-3 lg:h-5 lg:w-5" />

            <div className="relative aspect-4/5 w-full overflow-hidden">
                <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 h-full w-full object-cover object-top grayscale pointer-coarse:grayscale-0"
                />
                <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:hidden ${mask}`}
                />
            </div>
        </figure>
    );
}

function setSpotlight(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

function InfoRow({ label, value }) {
    return (
        <div
            onMouseMove={setSpotlight}
            className="group relative flex items-start gap-4 overflow-hidden border-b border-white/10 px-2 py-2.5 transition-colors duration-300 hover:border-lime/50 lg:gap-5 lg:px-3
            before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300
            before:bg-[radial-gradient(240px_circle_at_var(--x)_var(--y),rgba(198,244,50,0.12),transparent_70%)] hover:before:opacity-100"
        >
            <span className="mt-2.5 h-0.5 w-5 shrink-0 bg-lime transition-all duration-300 group-hover:w-9" />
            <div className="min-w-0 font-mono">
                <p className="text-xs tracking-[0.2em] text-white/65 lg:text-sm">{label}</p>
                <p className="mt-1 wrap-break-word text-base text-white/90 xl:text-lg">
                    <DecryptedText
                        text={value}
                        speed={40}
                        className="text-white"
                        encryptedClassName="text-lime"
                    />
                </p>
            </div>
        </div>
    );
}

function WorkCard({ project }) {
    const navigate = useNavigate();
    const linkRef = useRef(null);
    const destination = `/projects/${project.slug}`;
    const stack = project.stack ?? [];

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
        }, destination);
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
            className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
            <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <GlassSurface
                    width="100%"
                    height="100%"
                    borderRadius={24}
                    backgroundOpacity={0.08}
                    className="pointer-events-none absolute! inset-0!"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl border border-lime/0 transition-[border-color] duration-300 ease-out group-hover:border-lime/50"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        background:
                            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(190, 242, 100, 0.16), transparent 60%)",
                    }}
                />

                <div className="relative grid gap-5 p-5 sm:grid-cols-[13rem_1fr] sm:p-6 lg:grid-cols-[15rem_1fr]">
                    <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-black/40 font-display text-5xl text-lime/80 sm:aspect-auto sm:min-h-32">
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

                    <div className="flex min-w-0 flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                            <h4 className="font-display text-xl text-white lg:text-2xl">
                                {project.title}
                            </h4>
                            {project.role && (
                                <GlassPill
                                    className="shrink-0"
                                    textClassName="whitespace-nowrap px-3 py-1 text-xs text-paper/85"
                                >
                                    {project.role}
                                </GlassPill>
                            )}
                        </div>

                        <p className="line-clamp-3 text-sm leading-relaxed text-paper/80 lg:text-base">
                            {project.description}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-2 pt-1">
                            {stack.slice(0, 4).map((item) => (
                                <GlassPill
                                    key={item}
                                    textClassName="px-3 py-1 text-xs text-paper/85 lg:text-sm"
                                >
                                    {item}
                                </GlassPill>
                            ))}
                            {stack.length > 4 && (
                                <GlassPill
                                    className="border border-lime/30"
                                    textClassName="px-3 py-1 text-xs text-lime lg:text-sm"
                                >
                                    +{stack.length - 4} more
                                </GlassPill>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SkillPill({ name, count }) {
    const Icon = ICON_OF[name] ?? FaCode;
    return (
        <span
            title={count > 0 ? `Used in ${count} project${count > 1 ? "s" : ""}` : undefined}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-4 py-2 font-mono text-sm text-white transition-transform duration-300 hover:-translate-y-1 lg:px-5 lg:py-2.5 lg:text-base"
        >
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={9999}
                backgroundOpacity={0.08}
                className="pointer-events-none absolute! inset-0!"
            />
            <Icon
                aria-hidden="true"
                className="relative z-10 text-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 lg:text-xl"
            />
            <span className="relative z-10">{name}</span>
        </span>
    );
}

/* ------------------------------------------------------------------ */

export default function About() {
    // Same hook the Projects page uses, so both pages always agree.
    const { projects = [] } = useProjects();

    const featured = useMemo(() => {
        const rank = (slug) => {
            const i = FEATURED_ORDER.indexOf(slug);
            return i === -1 ? FEATURED_ORDER.length : i;
        };
        return [...projects]
            .sort((a, b) => rank(a.slug) - rank(b.slug))
            .slice(0, MAX_WORK);
    }, [projects]);

    // Tools are counted from every project's stack, so adding a project in
    // Supabase updates this list automatically.
    const toolGroups = useMemo(() => {
        const counts = new Map();
        projects.forEach((p) =>
            (p.stack ?? []).forEach((name) =>
                counts.set(name, (counts.get(name) ?? 0) + 1)
            )
        );
        EXTRA_TOOLS.forEach((name) => {
            if (!counts.has(name)) counts.set(name, 0);
        });

        const groups = Object.fromEntries(GROUP_ORDER.map((g) => [g, []]));
        counts.forEach((count, name) => {
            groups[GROUP_OF[name] ?? "Other"].push({ name, count });
        });
        Object.values(groups).forEach((list) =>
            list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        );

        return GROUP_ORDER.filter((g) => groups[g].length).map((g) => [g, groups[g]]);
    }, [projects]);

    const info = [
        { label: "BASED IN", value: "Pekanbaru, Indonesia" },
        { label: "OPEN TO", value: "Full-time and freelance" },
        ...(projects.length
            ? [{ label: "PROJECTS", value: `${projects.length} built so far` }]
            : []),
    ];

    return (
        <Section id="about">
            <AnimatedContent className="w-full" distance={18} duration={0.65}>
                <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-28 text-white sm:px-8 lg:pt-36 2xl:max-w-[1600px] 2xl:px-8">
                    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                        <aside className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:col-span-4 lg:mx-0 lg:max-w-none lg:self-start">
                            <RevealPhoto src="/picture/img.webp" alt={NAME} />
                            <p className="mt-4 text-lg font-semibold">{NAME}</p>
                            <p className="mt-1 font-mono text-xs tracking-[0.25em] text-white/65 lg:text-sm">
                                STUDENT / DEVELOPER
                            </p>

                            <div className="mt-6">
                                {info.map((item) => (
                                    <InfoRow key={item.label} {...item} />
                                ))}
                            </div>
                        </aside>

                        {/* Right: story, work, tools, focus */}
                        <div className="lg:col-span-8">
                            <Label>ABOUT ME</Label>

                            <h2 className="mt-6 font-display text-4xl font-extrabold leading-none sm:text-5xl lg:mt-8 lg:text-6xl 2xl:text-7xl">
                                I build web apps
                                <br />
                                <span className="text-lime transition-[text-shadow] duration-500 [text-shadow:0_0_24px_rgba(198,244,50,0.55),0_0_70px_rgba(198,244,50,0.3)] hover:[text-shadow:0_0_30px_rgba(198,244,50,0.8),0_0_90px_rgba(198,244,50,0.5)]">
                                    for real organizations.
                                </span>
                            </h2>
                            <span className="mt-6 block h-1.5 w-16 bg-lime lg:h-2 lg:w-20" />

                            <div className="mt-7 max-w-[62ch] space-y-5 font-mono text-base leading-7 text-white/80 lg:text-lg lg:leading-8">
                                <p>
                                    I&apos;m Lionel, a student developer in Pekanbaru. I build web apps
                                    with React, TypeScript. One of my projects are used by
                                    real organizations: an invoicing system for PT Central.
                                </p>
                                <p>
                                    I&apos;m looking for a full-time role or freelance projects where I
                                    can keep building useful products.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                                <Magnet
                                    padding={70}
                                    magnetStrength={4}
                                    wrapperClassName="inline-block"
                                >
                                    <button
                                        type="button"
                                        onClick={() => goTo("contact")}
                                        className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-lime px-6 py-3 font-mono text-sm tracking-widest text-night transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime lg:text-base"
                                    >
                                        LET&apos;S CONNECT
                                        <FaArrowRight
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:translate-x-1.5"
                                        />
                                    </button>
                                </Magnet>

                                <a
                                    href="/assets/cv.pdf"
                                    download="Lionel-Juis-Gerardo-CV.pdf"
                                    className="group inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3 font-mono text-sm tracking-widest text-white transition-colors duration-200 hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime lg:text-base"
                                >
                                    DOWNLOAD CV
                                    <FaDownload
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:translate-y-1"
                                    />
                                </a>
                            </div>

                            {/* Work (from Supabase) */}
                            <div className="mt-20">
                                <Label>SELECTED WORK</Label>
                                <div className="mt-6 flex flex-col gap-5">
                                    {featured.map((project) => (
                                        <WorkCard key={project.slug} project={project} />
                                    ))}
                                </div>

                                {projects.length > MAX_WORK && (
                                    <button
                                        type="button"
                                        onClick={() => goTo("projects")}
                                        className="group mt-6 inline-flex cursor-pointer items-center gap-3 font-mono text-sm tracking-widest text-lime lg:text-base"
                                    >
                                        SEE ALL {projects.length} PROJECTS
                                        <FaArrowRight
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:translate-x-2"
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="mt-20">
                                <Label>SKILLS &amp; TECHNOLOGIES</Label>
                                <dl className="mt-6">
                                    {toolGroups.map(([group, items]) => (
                                        <div
                                            key={group}
                                            className="grid gap-3 border-t border-white/10 py-5 last:border-b sm:grid-cols-[10rem_1fr] sm:gap-8"
                                        >
                                            <dt className="font-mono text-sm text-white/70 lg:text-base">
                                                {group}
                                            </dt>
                                            <dd className="flex flex-wrap gap-3">
                                                {items.map((item) => (
                                                    <SkillPill key={item.name} {...item} />
                                                ))}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* Focus */}
                            <div className="mt-20">
                                <Label>CURRENT FOCUS</Label>
                                <div className="mt-6 flex gap-4">
                                    <span className="relative mt-2 flex h-2.5 w-2.5 shrink-0 lg:h-3 lg:w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                                        <span className="relative inline-flex h-full w-full rounded-full bg-lime" />
                                    </span>
                                    <p className="max-w-[62ch] font-mono text-base leading-7 text-white/80 lg:text-lg lg:leading-8">
                                        Getting stronger at TypeScript and backend work, and building
                                        projects that people actually use.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </Section>
    );
}