// src/pages/About.jsx
import Section from "../../components/sections";
import AnimatedContent from "../../components/AnimatedContent";

export default function About() {
    return (
        <Section id="about">
            <AnimatedContent className="h-screen" distance={18} duration={0.65}>
                <div className="flex h-full w-full flex-col items-center justify-center text-white">
                    <h2>About</h2>
                    <p>This is the About section.</p>
                </div>
            </AnimatedContent>
        </Section>
    );
}