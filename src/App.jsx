import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from 'react-router'


import Intro from "./components/Intro";
import PixelTransition from "./components/PixelTransition";

import Home from "./pages/Home";
import Secrets from "./pages/Secret";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";


export default function App() {
  const [done, setDone] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isReturningToSection = Boolean(location.state?.scrollTo);
  const showIntro = isHome && !done && !isReturningToSection;

  useEffect(() => {
    if (!showIntro) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [showIntro]);

  return (
    <>
      {showIntro && <Intro onDone={() => setDone(true)} />}
      <PixelTransition />

      <Routes>
        <Route path="/" element={<Home show={done || isReturningToSection} />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/secret" element={<Secrets />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}