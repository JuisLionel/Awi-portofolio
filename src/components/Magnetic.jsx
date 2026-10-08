import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Leans toward the cursor while hovered, settles back on leave
export default function Magnetic({ children, strength = 0.35 }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      const xTo = gsap.quickTo(content, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(content, "y", { duration: 0.6, ease: "power3.out" });

      const move = (e) => {
        const r = wrapper.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      wrapper.addEventListener("pointermove", move);
      wrapper.addEventListener("pointerleave", leave);
      return () => {
        wrapper.removeEventListener("pointermove", move);
        wrapper.removeEventListener("pointerleave", leave);
      };
    },
    { scope: wrapperRef }
  );

  return (
    <span ref={wrapperRef} className="inline-block">
      <span ref={contentRef} className="inline-block">
        {children}
      </span>
    </span>
  );
}