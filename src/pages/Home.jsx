import { useEffect, useState } from "react";
import { sections } from "../section";

import Navbar from "../components/navbar";
import Footer from "../components/Footers";

import Welcome from "./Sections Home/Welcome";
import About from "./Sections Home/About";
import Projects from "./Sections Home/projects";
import Contact from "./Sections Home/Contact";

export default function Home({ show }) {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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