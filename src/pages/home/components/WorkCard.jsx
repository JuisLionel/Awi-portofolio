import { useRef } from "react";
import { Link, useNavigate } from "react-router";

import GlassPill from "@/components/GlassPill";
import GlassSurface from "@/components/GlassSurface";
import { startPixelTransition } from "@/lib/pixelTransition";

export default function WorkCard({ project }) {
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
            className="group block min-w-0 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
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

                <div className="relative grid grid-cols-1 gap-5 p-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:p-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
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
                            <h4 className="min-w-0 wrap-break-word font-display text-xl text-white lg:text-2xl">
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
