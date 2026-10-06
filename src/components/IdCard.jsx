export default function IdCard() {

  return (
    <div className="origin-center scale-70 sm:scale-85 md:scale-100 xl:scale-110 2xl:scale-125 rotate-10">
      <div className="hover-3d">
        <div className="card relative h-112 w-96 overflow-hidden rounded-4xl bg-paper font-sans text-night ring-1 ring-black/10 shadow-[0_2px_2px_rgba(0,0,0,0.5),0_18px_30px_-10px_rgba(0,0,0,0.7),0_50px_90px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative flex h-full w-full">
            {/* LEFT panel */}
            <div className="flex flex-1 flex-col items-center bg-[repeating-linear-gradient(45deg,#00000007_0_1px,transparent_1px_4px)] px-4 pt-5">
              <img
                src="/picture/photo.webp"
                alt="Lionel Juis Gerardo"
                className="h-44 w-full rounded-3xl bg-paper-line object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
              />

              <h2 className="mt-4 whitespace-nowrap font-display text-lg font-extrabold tracking-tight">
                Lionel Juis Gerardo
              </h2>

              {/* divider */}
              <div className="my-3 h-px w-full bg-paper-line shadow-[0_1px_0] shadow-paper-2" />

              <div className="w-full space-y-1 text-[13px]">
                <p>
                  <span className="font-bold">Date of Birth:</span>{" "}
                  <span className="font-mono text-xs">Sep 21st 2001</span>
                </p>
                <p>
                  <span className="font-bold">Email:</span>{" "}
                  <span className="font-mono text-xs">PadcoTrial@gmail.com</span>
                </p>
              </div>

              {/* barcode */}
              <div className="mt-auto mb-4 flex flex-col items-center gap-1">
                <div className="h-12 w-36 bg-[repeating-linear-gradient(90deg,var(--color-night)_0_2px,transparent_2px_3px,var(--color-night)_3px_4px,transparent_4px_7px,var(--color-night)_7px_10px,transparent_10px_11px,var(--color-night)_11px_12px,transparent_12px_14px,var(--color-night)_14px_16px,transparent_16px_17px)]" />
                <span className="font-mono text-[6px] font-bold tracking-widest">ID CARD</span>
              </div>
            </div>

            {/* RIGHT strip */}
            <div className="relative z-10 flex w-[27%] items-center justify-center border-l border-night-line bg-linear-to-b from-night-2 to-night shadow-[-8px_0_14px_-6px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,#ffffff0a_0_1px,transparent_1px_3px)]" />
              <span className="relative whitespace-nowrap font-display text-2xl font-extrabold text-lime [writing-mode:vertical-rl]">
                Work card
              </span>
            </div>
          </div>

          {/* TEXTURE 1: grain */}
          <div className="pointer-events-none absolute inset-0 bg-(image:--noise) opacity-30 mix-blend-multiply" />

          {/* TEXTURE 2: glossy sheen */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-black/15" />

          {/* TEXTURE 3: beveled edge */}
          <div className="pointer-events-none absolute inset-0 rounded-4xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]" />
        </div>

        <div/><div/><div/><div/>
        <div/><div/><div/><div/>
      </div>
    </div>
  );
}