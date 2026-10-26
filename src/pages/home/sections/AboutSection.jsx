import { useMemo } from "react";
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
import Magnet from "@/components/Magnet";
import WorkCard from "@/pages/home/components/WorkCard";
import { sections } from "@/config/sections";
import { useProjects } from "@/data/projects";

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
            className="group relative w-full border border-white/25 bg-night-2 p-2.5 lg:w-[min(100%,max(15rem,calc((100vh_-_26rem)_*_0.8_+_1.5rem)))] lg:p-3"
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

export default function About() {
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
                <div className="mx-auto w-full max-w-7xl overflow-x-clip px-5 pb-24 pt-28 text-white sm:px-8 lg:pt-36 2xl:max-w-[1600px] 2xl:px-8">
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
                        <aside className="mx-auto w-full min-w-0 max-w-none sm:max-w-md lg:sticky lg:top-24 lg:col-span-4 lg:mx-0 lg:max-w-none lg:self-start">
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

                        <div className="min-w-0 lg:col-span-8">
                            <Label>ABOUT ME</Label>

                            <h2 className="mt-6 wrap-break-word font-display text-3xl font-extrabold leading-none min-[400px]:text-4xl sm:text-5xl lg:mt-8 lg:text-6xl 2xl:text-7xl">
                                I build web apps
                                <br />
                                <span className="text-lime transition-[text-shadow] duration-500 [text-shadow:0_0_24px_rgba(198,244,50,0.55),0_0_70px_rgba(198,244,50,0.3)] hover:[text-shadow:0_0_30px_rgba(198,244,50,0.8),0_0_90px_rgba(198,244,50,0.5)]">
                                    for real organizations.
                                </span>
                            </h2>
                            <span className="mt-6 block h-1.5 w-16 bg-lime lg:h-2 lg:w-20" />

                            <div className="mt-7 max-w-[62ch] space-y-5 wrap-break-word font-mono text-base leading-7 text-white/80 lg:text-lg lg:leading-8">
                                <p>
                                    I&apos;m Lionel, a student developer in Pekanbaru. I build web apps
                                    with React and TypeScript. One of my projects is used by
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
                                            className="grid grid-cols-1 gap-3 border-t border-white/10 py-5 last:border-b sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
                                        >
                                            <dt className="font-mono text-sm text-white/70 lg:text-base">
                                                {group}
                                            </dt>
                                            <dd className="flex min-w-0 flex-wrap gap-3">
                                                {items.map((item) => (
                                                    <SkillPill key={item.name} {...item} />
                                                ))}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="mt-20">
                                <Label>CURRENT FOCUS</Label>
                                <div className="mt-6 flex gap-4">
                                    <span className="relative mt-2 flex h-2.5 w-2.5 shrink-0 lg:h-3 lg:w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                                        <span className="relative inline-flex h-full w-full rounded-full bg-lime" />
                                    </span>
                                    <p className="min-w-0 max-w-[62ch] wrap-break-word font-mono text-base leading-7 text-white/80 lg:text-lg lg:leading-8">
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