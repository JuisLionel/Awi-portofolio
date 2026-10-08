// src/pages/Sections Home/Contact.jsx
import { useEffect, useState } from "react";
import { ArrowUp, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { FaDiscord, FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

import Section from "../../components/sections";
import GlassSurface from "../../components/GlassSurface";
import AnimatedContent from "../../components/AnimatedContent";
import GlassPill from "../../components/GlassPill";
import Magnetic from "../../components/Magnetic";
import { useProfile } from "../../../Data/profile";

import { Link } from "react-router";

// TODO: replace with your real details
const NAME = "Awi";
const EMAIL = "you@example.com";
const PHONE = "+62 800 0000 0000";
const LOCATION = "Indonesia";
const TIMEZONE = "Asia/Jakarta"; // used for the live local time
const SOCIALS = [
    { label: "GitHub", href: "https://github.com/your-username", Icon: FaGithub },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username", Icon: FaLinkedinIn },
    { label: "Instagram", href: "https://instagram.com/your-username", Icon: FaInstagram },
    { label: "Discord", href: "https://discord.com/users/your-id", Icon: FaDiscord },
];

function useLocalTime(timeZone) {
    const read = () =>
        new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone,
        }).format(new Date());

    const [time, setTime] = useState(read);

    useEffect(() => {
        const id = setInterval(() => setTime(read()), 15000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeZone]);

    return time;
}

// Heading word that lifts and tilts when hovered
function Word({ children, highlight = false }) {
    return (
        <span
            className={`mr-[0.22em] inline-block cursor-default transition-transform duration-300 ease-out hover:-translate-y-2 hover:-rotate-2 ${highlight ? "-rotate-1 rounded-[0.18em] bg-lime px-[0.12em] text-night" : ""
                }`}
        >
            {children}
        </span>
    );
}

// One row inside the glass panel: lime sweep on hover + optional copy button
function InfoRow({ Icon, children, href, copyValue, copied, onCopy, trailing }) {
    const content = (
        <span className="relative z-10 flex min-w-0 items-center gap-3">
            <Icon aria-hidden="true" className="size-4 shrink-0 text-lime" />
            <span className="truncate font-mono text-sm text-paper">{children}</span>
        </span>
    );

    return (
        <div className="group relative flex items-center justify-between gap-3 overflow-hidden border-b border-white/10 px-1 py-3 last:border-b-0">
            <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0 bg-lime/10 transition-[width] duration-500 ease-out group-hover:w-full"
            />
            {href ? (
                <a href={href} className="min-w-0 flex-1">
                    {content}
                </a>
            ) : (
                <div className="min-w-0 flex-1">{content}</div>
            )}

            {copyValue && (
                <button
                    type="button"
                    onClick={() => onCopy(copyValue)}
                    aria-label={`Copy ${copyValue}`}
                    aria-live="polite"
                    className="relative z-10 shrink-0 transition-[opacity,transform] duration-200 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                    <GlassPill textClassName="px-2.5 py-1 text-[10px] uppercase tracking-widest">
                        {copied ? (
                            <>
                                <Check aria-hidden="true" className="size-3 text-lime" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy aria-hidden="true" className="size-3" /> Copy
                            </>
                        )}
                    </GlassPill>
                </button>
            )}
            {trailing && (
                <span className="relative z-10 shrink-0 font-mono text-[10px] uppercase tracking-widest text-paper/50">
                    {trailing}
                </span>
            )}
        </div>
    );
}

export default function Contact() {
    const [copiedValue, setCopiedValue] = useState(null);
    const { available, labels } = useProfile();
    const localTime = useLocalTime(TIMEZONE);

    const copy = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedValue(value);
            setTimeout(() => setCopiedValue(null), 2000);
        } catch {
            setCopiedValue(null);
        }
    };

    return (
        <Section id="contact">
            <div className="relative min-h-screen w-full text-paper">
                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-20 2xl:max-w-[1600px] 2xl:px-8 2xl:py-28">
                    <AnimatedContent distance={18} duration={0.65}>
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-lime">
                            Contact
                        </p>
                    </AnimatedContent>

                    <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.25fr_0.75fr] 2xl:gap-20">
                        {/* Left: badge + heading + CTA */}
                        <div className="flex flex-col items-start gap-7 2xl:gap-10">
                            <AnimatedContent distance={18} duration={0.65} delay={0.05}>
                                <Magnetic>
                                    <GlassPill textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2">
                                        <span
                                            className={`inline-block ${available
                                                    ? "animate-[spin_6s_linear_infinite] text-lime"
                                                    : "text-paper/40"
                                                }`}
                                        >
                                            ✦
                                        </span>
                                        {available ? labels.badge.on : labels.badge.off}
                                    </GlassPill>
                                </Magnetic>
                            </AnimatedContent>

                            <AnimatedContent distance={40} duration={0.9} ease="power3.out" delay={0.1}>
                                <h2 className="font-display text-6xl font-extrabold leading-[0.98] tracking-tight text-paper sm:text-8xl 2xl:text-[10rem]">
                                    <span className="block">
                                        <Word>Let&apos;s</Word>
                                        <Word>work</Word>
                                    </span>
                                    <span className="mt-2 block">
                                        <Word highlight>together.</Word>
                                    </span>
                                </h2>
                            </AnimatedContent>

                            <AnimatedContent distance={18} duration={0.65} delay={0.2}>
                                <p className="max-w-lg text-base leading-relaxed text-paper/65 2xl:max-w-2xl 2xl:text-lg">
                                    Have a project in mind, a role to fill, or just want to say hi? Drop me
                                    a message and I&apos;ll get back to you as soon as I can.
                                </p>
                            </AnimatedContent>

                            <AnimatedContent distance={18} duration={0.65} delay={0.25}>
                                <Magnetic>
                                    <a
                                        href={`mailto:${EMAIL}`}
                                        className="inline-block rounded-full transition-transform duration-150 active:scale-95"
                                    >
                                        <GlassPill
                                            className="border border-lime bg-lime"
                                            textClassName="px-8 py-2 text-night"
                                        >
                                            Say hello <span aria-hidden="true">↗</span>
                                        </GlassPill>
                                    </a>
                                </Magnetic>
                            </AnimatedContent>
                        </div>

                        {/* Right: glass contact panel */}
                        <AnimatedContent distance={40} duration={0.9} ease="power3.out" delay={0.2}>
                            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6 2xl:rounded-[2rem] 2xl:p-8">
                                <GlassSurface className="pointer-events-none absolute inset-0 rounded-3xl" />
                                <div className="relative">
                                    <InfoRow
                                        Icon={Mail}
                                        href={`mailto:${EMAIL}`}
                                        copyValue={EMAIL}
                                        copied={copiedValue === EMAIL}
                                        onCopy={copy}
                                    >
                                        {EMAIL}
                                    </InfoRow>
                                    <InfoRow
                                        Icon={Phone}
                                        href={`tel:${PHONE.replace(/\s/g, "")}`}
                                        copyValue={PHONE}
                                        copied={copiedValue === PHONE}
                                        onCopy={copy}
                                    >
                                        {PHONE}
                                    </InfoRow>
                                    <InfoRow Icon={MapPin} trailing={localTime}>
                                        {LOCATION}
                                    </InfoRow>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {SOCIALS.map(({ label, href, Icon }) => (
                                            <Magnetic key={label}>
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block transition-transform duration-200 active:scale-95"
                                                >
                                                    <GlassPill textClassName="px-4 py-1.5 text-xs lg:px-5 lg:py-2">
                                                        <Icon aria-hidden="true" className="size-4" />
                                                        {label}
                                                    </GlassPill>
                                                </a>
                                            </Magnetic>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>

                    {/* Bottom bar */}
                    <AnimatedContent distance={18} duration={0.65} delay={0.3}>
                        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5 font-mono text-xs uppercase tracking-[0.2em] text-paper/45">
                            <span>
                                © {new Date().getFullYear()} {NAME} Reserved. All rights reserved.
                            </span>
                            <button
                                type="button"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="inline-flex items-center gap-1.5 uppercase tracking-[0.2em] text-lime/65 transition-colors duration-200 hover:text-lime"
                            >
                                Back to top
                                <ArrowUp aria-hidden="true" className="size-3.5" />
                            </button>
                        </div>
                    </AnimatedContent>
                </div>
                <Link to="/secret" className="absolute bottom-5 right-5 text-black hover:text-paper/20 transition-colors duration-200">
                    Secret page
                </Link>
            </div>
        </Section>
    );
}