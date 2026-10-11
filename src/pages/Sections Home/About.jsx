import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
    SiHtml5,
    SiCss,
    SiJavascript,
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiNodedotjs,
    SiExpress,
    SiPostgresql,
    SiGit,
    SiDocker,
    SiLinux,
    SiFigma,
} from "react-icons/si";
import { FaArrowRight } from "react-icons/fa6";

import Section from "../../components/sections";
import AnimatedContent from "../../components/AnimatedContent";
import DecryptedText from "../../components/DecryptedText";
import Magnet from "../../components/Magnet";
import { sections } from "../../section";

gsap.registerPlugin(ScrollToPlugin);

const DESIGN_W = 1920;
const DESIGN_H = 1080;

const INFO = [
    { label: "Full Name", value: "Lionel Juis Geraldo" },
    { label: "Date of Birth", value: "21 / 09 / 08" },
    { label: "Gender", value: "Male" },
    { label: "Religion", value: "Christian" },
    { label: "Marital Status", value: "Not Married" },
    { label: "Hometown", value: "Pekanbaru, Indonesia" },
];

const SKILLS = [
    { name: "HTML", icon: SiHtml5, group: "Frontend" },
    { name: "CSS", icon: SiCss, group: "Frontend" },
    { name: "JavaScript", icon: SiJavascript, group: "Frontend" },
    { name: "React", icon: SiReact, group: "Frontend" },
    { name: "Next.js", icon: SiNextdotjs, group: "Frontend" },
    { name: "Tailwind CSS", icon: SiTailwindcss, group: "Frontend" },
    { name: "Node.js", icon: SiNodedotjs, group: "Backend" },
    { name: "Express", icon: SiExpress, group: "Backend" },
    { name: "PostgreSQL", icon: SiPostgresql, group: "Backend" },
    { name: "Git", icon: SiGit, group: "Tools" },
    { name: "Docker", icon: SiDocker, group: "Tools" },
    { name: "Linux", icon: SiLinux, group: "Tools" },
    { name: "Figma", icon: SiFigma, group: "Tools" },
];

const GROUPS = ["All", "Frontend", "Backend", "Tools"];

function useIsDesktop() {
    const query = "(min-width: 1024px)";
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mq = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);
        setMatches(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return matches;
}

/* Scale factor that fits the 1920x1080 design into the viewport */
function useStageScale() {
    const calc = () =>
        typeof window === "undefined"
            ? 1
            : Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);

    const [scale, setScale] = useState(calc);

    useEffect(() => {
        const update = () => setScale(calc());
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return scale;
}

/* Same scroll as the Navbar's go(id), using your sections list */
function goToContact() {
    const contact = sections.find(({ label }) => label.toLowerCase() === "contact");
    const target = contact && document.getElementById(contact.id);
    if (!target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.to(window, {
        duration: reduced ? 0 : 0.9,
        scrollTo: { y: target, autoKill: true },
        ease: "power2.inOut",
        overwrite: "auto",
    });
}

/* Cursor position in the element's own (unscaled) coordinates */
function setSpotlight(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const s = r.width / el.offsetWidth || 1;
    el.style.setProperty("--x", `${(e.clientX - r.left) / s}px`);
    el.style.setProperty("--y", `${(e.clientY - r.top) / s}px`);
}

/* Section label with a trailing line */
function Label({ children }) {
    return (
        <div className="flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-lime sm:text-sm lg:gap-5 lg:text-lg lg:tracking-[0.25em]">
            <span className="whitespace-nowrap">{children}</span>
            <span className="h-px flex-1 bg-white/30" />
        </div>
    );
}

/* Photo: daisyUI hover-3d + grayscale base + color revealed only around the cursor */
function RevealPhoto({ src, alt }) {
    // cursor position as a percentage of the (untilted) hover-3d wrapper;
    // the CSS vars are inherited by the color layer below
    const move = (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    const mask =
        "[mask-image:radial-gradient(circle_150px_at_var(--px,50%)_var(--py,50%),black_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_150px_at_var(--px,50%)_var(--py,50%),black_35%,transparent_100%)]";

    return (
        // w-full is required: hover-3d is inline-block and would shrink to 0 width
        <div className="hover-3d group w-full" onMouseMove={move}>
            <figure className="relative border border-white/25 bg-night-2 p-2.5 lg:p-3">
                <span className="absolute left-0 top-5 z-10 h-20 w-0.5 bg-lime lg:top-6 lg:h-32" />
                <span className="absolute bottom-2.5 right-2.5 z-10 h-4 w-4 border-b-2 border-r-2 border-lime lg:bottom-3 lg:right-3 lg:h-5 lg:w-5" />

                <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* grayscale base */}
                    <img
                        src={src}
                        alt={alt}
                        className="absolute inset-0 h-full w-full object-cover object-top grayscale"
                    />
                    {/* color layer, only visible inside the mask around the cursor */}
                    <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className={`absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${mask}`}
                    />
                </div>
            </figure>
            {/* hover-3d needs exactly 8 empty divs */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div
            onMouseMove={setSpotlight}
            className="group relative flex items-start gap-4 overflow-hidden border-b border-white/10 px-2 py-4 transition-colors duration-300 hover:border-lime/50 lg:gap-6 lg:px-4 lg:py-5
            before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300
            before:bg-[radial-gradient(240px_circle_at_var(--x)_var(--y),rgba(198,244,50,0.12),transparent_70%)] hover:before:opacity-100"
        >
            <span className="mt-2.5 h-0.5 w-5 shrink-0 bg-lime transition-all duration-300 group-hover:w-9 lg:mt-3 lg:w-6 lg:group-hover:w-12" />
            <div className="font-mono">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 lg:text-sm lg:tracking-[0.25em]">
                    {label}
                </p>
                <p className="mt-1 text-base text-white/90 lg:mt-1.5 lg:text-2xl">
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

function GlassPill({ name, icon: Icon, active }) {
    return (
        <button
            type="button"
            className={`group relative inline-flex cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 font-mono text-sm text-white
            transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 lg:gap-3 lg:px-6 lg:py-3 lg:text-lg
            ${active ? "opacity-100" : "pointer-events-none scale-90 opacity-20 blur-[1px]"}`}
        >
            {/* glass bar */}
            <span className="absolute inset-0 rounded-full border border-white/25 bg-white/[0.07] backdrop-blur-[3px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_18px_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.3)]" />
            {/* sheen */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_30%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.14)_100%)]" />
            {/* lens (fades in on hover) */}
            <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.16)_100%)] opacity-0 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.75),inset_-2px_-2px_4px_rgba(255,255,255,0.35),inset_0_0_12px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.3)] transition-opacity duration-300 group-hover:opacity-100" />

            <Icon className="relative z-10 text-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 lg:text-2xl" />
            <span className="relative z-10">{name}</span>
        </button>
    );
}

export default function About() {
    const [group, setGroup] = useState("All");
    const isDesktop = useIsDesktop();
    const scale = useStageScale();

    return (
        <Section id="about">
            <AnimatedContent className="min-h-screen w-full lg:h-screen" distance={18} duration={0.65}>
                <div
                    className={
                        isDesktop
                            ? "relative h-screen w-full overflow-hidden text-white"
                            : "relative w-full text-white"
                    }
                >
                    <div
                        className={
                            isDesktop
                                ? "absolute left-1/2 top-1/2 flex flex-col justify-center gap-12 px-16 pb-10 pt-[100px]"
                                : "flex flex-col gap-14 px-5 pb-16 pt-28 sm:px-8"
                        }
                        style={
                            isDesktop
                                ? {
                                      width: DESIGN_W,
                                      height: DESIGN_H,
                                      transform: `translate(-50%, -50%) scale(${scale})`,
                                  }
                                : undefined
                        }
                    >
                        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.85fr_1fr] lg:gap-16">
                            {/* Intro */}
                            <div>
                                <Label>ABOUT ME</Label>

                                <h2 className="mt-6 font-display text-6xl font-bold leading-[0.95] sm:text-7xl lg:mt-8 lg:text-[112px]">
                                    Hi, I&apos;m
                                    <br />
                                    <span className="text-lime transition-[text-shadow] duration-500 [text-shadow:0_0_24px_rgba(198,244,50,0.55),0_0_70px_rgba(198,244,50,0.3)] hover:[text-shadow:0_0_30px_rgba(198,244,50,0.8),0_0_90px_rgba(198,244,50,0.5)]">
                                        Lionel.
                                    </span>
                                </h2>
                                <span className="mt-5 block h-1.5 w-16 bg-lime lg:mt-6 lg:h-2 lg:w-20" />

                                <p className="mt-6 max-w-xl font-mono text-sm leading-7 text-white/70 lg:mt-7 lg:max-w-160 lg:text-lg lg:leading-[30px]">
                                    I&apos;m a high school graduate with a passion for technology
                                    and software development. I enjoy building websites, solving
                                    problems, and learning new things every day. I&apos;m always
                                    looking for opportunities to grow, contribute, and be part of
                                    something meaningful.
                                </p>

                                <Magnet
                                    padding={70}
                                    magnetStrength={4}
                                    wrapperClassName="mt-8 inline-block lg:mt-9"
                                >
                                    <button
                                        type="button"
                                        onClick={goToContact}
                                        className="group inline-flex cursor-pointer items-center gap-3 font-mono text-sm tracking-widest text-lime lg:gap-4 lg:text-lg"
                                    >
                                        LET&apos;S CONNECT
                                        <FaArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-2 lg:text-xl" />
                                    </button>
                                </Magnet>
                            </div>

                            {/* Photo */}
                            <div className="mx-auto w-full max-w-[320px] lg:w-110 lg:max-w-none">
                                <RevealPhoto src="/picture/photo.webp" alt="Lionel Juis Geraldo" />

                                <p className="font-mono text-[11px] tracking-[0.25em] text-white/50 lg:text-sm">
                                    STUDENT / DEVELOPER
                                </p>
                            </div>

                            {/* Info list */}
                            <div>
                                {INFO.map((item) => (
                                    <InfoRow key={item.label} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* BOTTOM: skills + focus */}
                        <div className="grid gap-10 pt-8 lg:grid-cols-[2fr_1fr] lg:gap-16">
                            <div>
                                <Label>SKILLS &amp; TECHNOLOGIES</Label>

                                <div role="tablist" className="tabs tabs-border mt-4 font-mono">
                                    {GROUPS.map((g) => (
                                        <button
                                            key={g}
                                            role="tab"
                                            onClick={() => setGroup(g)}
                                            className={`tab text-sm lg:text-base ${
                                                group === g
                                                    ? "tab-active !text-lime"
                                                    : "text-white/50 hover:text-white"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3 lg:gap-4">
                                    {SKILLS.map((s) => (
                                        <GlassPill
                                            key={s.name}
                                            {...s}
                                            active={group === "All" || s.group === group}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="lg:border-l lg:border-white/10 lg:pl-12">
                                <Label>CURRENT FOCUS</Label>
                                <div className="mt-5 flex gap-4 lg:mt-6">
                                    <span className="relative mt-2 flex h-2.5 w-2.5 shrink-0 lg:h-3 lg:w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                                        <span className="relative inline-flex h-full w-full rounded-full bg-lime" />
                                    </span>
                                    <p className="font-mono text-sm leading-7 text-white/60 lg:text-lg lg:leading-8">
                                        Improving my skills in web development, exploring new
                                        technologies, and building projects that make a real
                                        impact.
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