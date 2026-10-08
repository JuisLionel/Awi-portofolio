import { Link } from "react-router";
import AnimatedContent from "../components/AnimatedContent";

const glow =
  "[text-shadow:0_0_12px_rgba(255,255,255,0.95),0_0_40px_rgba(255,255,255,0.55),0_0_90px_rgba(255,255,255,0.3)]";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-12
      bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]
      bg-size-[3.2vw_3.2vw] md:flex-row md:gap-[4vw] md:px-[3vw] md:py-0"
    >
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />

      {/* TV */}
      <AnimatedContent
        className="relative order-2 mt-10 w-[90%] max-w-xl md:mt-0 md:w-[44vw] md:max-w-none"
        direction="horizontal"
        reverse
        distance={24}
        duration={0.65}
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-18%] bg-[radial-gradient(ellipse_at_center,rgba(87,180,46,0.24),transparent_68%)]"
          />
          <img
            src="/picture/tv.png"
            alt=""
            draggable={false}
            className="relative z-10 w-full opacity-90"
          />
        </div>
      </AnimatedContent>

      {/* Text column */}
      <AnimatedContent
        className="relative z-10 w-full md:w-[42vw] md:shrink-0"
        distance={24}
        duration={0.65}
      >
      <section className="flex flex-col items-center text-center">
        <h1
          className={`font-title font-extrabold text-[22vw] leading-none tracking-[0.12em] text-white md:text-[11.5vw] ${glow}`}
        >
          404
        </h1>

        <h2
          className={`font-title font-extrabold mt-[1vw] whitespace-nowrap text-[7vw] leading-none tracking-[0.08em] text-white md:text-[4vw] ${glow}`}
        >
          Page not found
        </h2>

        <p className="mt-[3vw] max-w-[30ch] font-sans text-[3.6vw] leading-snug text-neutral-400 md:mt-[2vw] md:text-[1.5vw]">
          Oh, no! The page you were looking for doesn&apos;t exist
        </p>

        <Link
          to="/"
          className="mt-[8vw] w-[50vw] cursor-pointer rounded-2xl bg-[#57b42e] py-[2vw] font-title font-extrabold text-[4.2vw] tracking-[0.12em] text-black
          shadow-[0_0_40px_rgba(87,180,46,0.45)] transition hover:brightness-110 hover:shadow-[0_0_60px_rgba(87,180,46,0.7)] active:scale-95
          md:mt-[4vw] md:w-[16vw] md:py-[0.6vw] md:text-[1.5vw]"
        >
          Back to home
        </Link>
      </section>
      </AnimatedContent>
    </main>
  );
}