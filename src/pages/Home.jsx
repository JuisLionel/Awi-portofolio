import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { sections } from "../section";

import Navbar from "../components/navbar";
import Footer from "../components/Footers";

import Welcome from "./Sections Home/Welcome";
import About from "./Sections Home/About";
import Projects from "./Sections Home/projects";
import Contact from "./Sections Home/Contact";

export default function Home({ show }) {
  const [active, setActive] = useState(sections[0].id);
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const scrollTo = location.state?.scrollTo;
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
  }, [location.key, location.state]);

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

      <div className="portfolio-background relative z-0">
        <main>
          <Welcome show={show} />
          <About />
          <Projects />
          <Contact />
        </main>
      </div>

      <Footer />
    </>
  );
}