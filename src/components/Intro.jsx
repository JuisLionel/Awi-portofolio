import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const imgs = [
  "https://picsum.photos/id/1031/500/620?grayscale",
  "https://picsum.photos/id/1048/500/620?grayscale",
  "https://picsum.photos/id/1067/500/620?grayscale",
  "https://picsum.photos/id/1076/500/620?grayscale",
];

const lines = ["Lionel", "Portofolio"];

export default function Intro({ onDone }) {
  const root = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onDone });

    tl.from(".img", {
      yPercent: 100,
      duration: 0.45,
      stagger: 0.14,
      ease: "power3.out",
    }, "+=0.3")
      .set(".box", { backgroundColor: "rgba(255,255,255,0)" })
      .to(".stack", { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "+=0.25")
      .from(".name-line", { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.3")
      .to(".name-line", { opacity: 0, duration: 0.3 }, "+=0.5")
      .to(".box", {
        width: "100vw",
        height: "100vh",
        duration: 1.1,
        ease: "power4.inOut",
      });
  }, { scope: root });

  return (
    <div
      ref={root}
      className="fixed inset-0 z-999 grid place-items-center overflow-hidden pointer-events-none intro-stack"
    >
      <div className="box relative h-77.5 w-62.5 overflow-hidden bg-white shadow-[0_0_0_200vmax_#fff]">
        <div className="stack absolute inset-0">
          {imgs.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="img absolute inset-0 h-full w-full object-cover"
            />
          ))}
        </div>

        <h1 className="absolute bottom-6 left-6 text-4xl font-light leading-[0.95] tracking-tight text-white mix-blend-difference">
          {lines.map((l) => (
            <span key={l} className="block overflow-hidden">
              <span className="name-line block">{l}</span>
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}