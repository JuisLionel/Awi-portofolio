import { useProfile } from "../../Data/profile";

const rows = [
  ["ID Number", "AWI-DEV-001"],
  ["Specialty", "Web / UI"],
  ["Base", "Pekanbaru, ID"],
];

export default function IdCard() {
  const { available, labels } = useProfile();

  return (
    <div className="origin-center scale-70 rotate-10 transition-transform duration-500 sm:scale-85 md:scale-100 xl:scale-110 2xl:scale-125">
      <div className="hover-3d group">
        {/* 1st child: the card content */}
        <div className="card relative h-112 w-96 overflow-hidden rounded-4xl bg-paper font-sans text-night ring-1 ring-black/10 shadow-[0_2px_2px_rgba(0,0,0,0.5),0_18px_30px_-10px_rgba(0,0,0,0.7),0_50px_90px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative flex h-full w-full">
            {/* LEFT / MAIN PANEL (container: name size scales with its width) */}
            <div className="@container flex min-w-0 flex-1 flex-col bg-[repeating-linear-gradient(45deg,#00000007_0_1px,transparent_1px_4px)] px-4 pt-5 pb-4">
              {/* PHOTO */}
              <div className="relative w-full overflow-hidden rounded-3xl">
                <img
                  src="/picture/photo.webp"
                  alt="Lionel Juis Gerardo"
                  className="h-40 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/10" />

                {/* availability badge (text comes from profile.js) */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur-md">
                  <span
                    className={`size-2 rounded-full ${
                      available ? "bg-lime" : "bg-night/30"
                    }`}
                  />
                  <span className="font-mono text-[11px] font-bold tracking-wide whitespace-nowrap text-night uppercase">
                    {available ? labels.card.on : labels.card.off}
                  </span>
                </div>
              </div>

              {/* NAME + ROLE (one line each) */}
              <div className="mt-4 min-w-0">
                <h2 className="font-display text-[6.4cqw] leading-tight font-extrabold tracking-[-0.02em] whitespace-nowrap">
                  Lionel Juis Gerardo
                </h2>
                <p className="mt-1.5 font-mono text-[11px] font-bold tracking-[0.2em] whitespace-nowrap text-night/50 uppercase">
                  Frontend Developer
                </p>
              </div>

              {/* DIVIDER */}
              <div className="my-3 h-px w-full bg-black/10" />

              {/* INFORMATION */}
              <div className="w-full space-y-2.5">
                {rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="shrink-0 font-sans text-xs font-semibold whitespace-nowrap text-night/50">
                      {label}
                    </span>
                    <span className="font-mono text-[13px] font-bold tracking-wide whitespace-nowrap">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* BARCODE */}
              <div className="mt-auto flex flex-col items-center gap-1 pt-3">
                <div className="h-12 w-36 bg-[repeating-linear-gradient(90deg,var(--color-night)_0_2px,transparent_2px_3px,var(--color-night)_3px_4px,transparent_4px_7px,var(--color-night)_7px_10px,transparent_10px_11px,var(--color-night)_11px_12px,transparent_12px_14px,var(--color-night)_14px_16px,transparent_16px_17px)]" />
                <span className="font-mono text-[8px] font-bold tracking-[0.3em] whitespace-nowrap">
                  AWI-DEV-001
                </span>
              </div>
            </div>

            {/* RIGHT STRIP (no z-index, so it can't cover the hover zones) */}
            <div className="relative flex w-[22%] shrink-0 flex-col items-center overflow-hidden border-l border-night-line bg-linear-to-b from-night-2 to-night py-6 shadow-[-8px_0_14px_-6px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,#ffffff0a_0_1px,transparent_1px_3px)]" />

              <span className="relative font-display text-[20px] leading-none font-extrabold tracking-tight whitespace-nowrap text-lime [writing-mode:vertical-rl]">
                WEB • UI • CODE
              </span>

              {/* connecting line */}
              <span className="relative my-4 w-px flex-1 bg-linear-to-b from-lime/70 to-white/20" />

              <span className="relative font-mono text-[8px] font-bold tracking-[0.22em] whitespace-nowrap text-white/35 uppercase [writing-mode:vertical-rl]">
                Developer Access
              </span>
            </div>
          </div>

          {/* TEXTURE: grain */}
          <div className="pointer-events-none absolute inset-0 bg-(image:--noise) opacity-25 mix-blend-multiply" />

          {/* TEXTURE: glossy sheen */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-black/15" />

          {/* TEXTURE: beveled edge */}
          <div className="pointer-events-none absolute inset-0 rounded-4xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]" />
        </div>

        {/* 8 hover zones required by hover-3d. Keep them directly inside it. */}
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}