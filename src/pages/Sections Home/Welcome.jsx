import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Section from "../../components/sections";

export default function Welcome({ show }) {

    useGSAP(() => {
        if (show) {
            gsap.fromTo("#welcome", { opacity: 0 }, { opacity: 1, duration: 1 });
        }
    }, [show]);

  return (
        <Section id="welcome">
            <div className="flex h-screen w-screen flex-col items-center justify-center text-white">
                <h2>Welcome</h2>
                <p>This is the Welcome section.</p>
            </div>
        </Section>
  );
}