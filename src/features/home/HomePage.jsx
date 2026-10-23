import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router";
import { sections } from "@/config/sections";

import Navbar from "@/components/Navbar";
import ClickSpark from "@/components/ClickSpark";

import WelcomeSection from "./sections/WelcomeSection";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";

export default function Home({ show, scrollTo }) {
  const [active, setActive] = useState(sections[0].id);
  const location = useLocation();

  useLayoutEffect(() => {
    if (scrollTo) {
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(scrollTo);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [location.key, scrollTo]);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const marker = window.innerHeight / 2;
      const currentSection = sections.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });

      if (currentSection) setActive(currentSection.id);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <>
      <Navbar show={show} active={active} />
      <ClickSpark
        sparkColor="#bef264"  
        sparkSize={10}        
        sparkRadius={18}     
        sparkCount={8}      
        duration={400}       
      >

        <div className="portfolio-background relative z-0">
          <main>
            <WelcomeSection show={show} />
            <AboutSection />
            <ProjectsSection />
            <ContactSection />
          </main>
        </div>
      </ClickSpark>
    </>
  );
}