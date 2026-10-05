import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Section from "../../components/sections";
import IdCard from "../../components/IdCard";

gsap.registerPlugin(useGSAP);

export default function Welcome({ show }) {
  const welcomeRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(welcomeRef.current, {
        opacity: show ? 1 : 0,
        duration: 1,
      });
    },
    { dependencies: [show], scope: welcomeRef }
  );

  return (
    <Section id="welcome">
      <div
        ref={welcomeRef}
        className="flex h-screen w-full flex-col items-center justify-center text-white opacity-0"
      >
        <IdCard />
      </div>
    </Section>
  );
}