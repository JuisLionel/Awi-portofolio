import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigationType } from 'react-router'


import Intro from "./components/Intro";
import PixelTransition from "./components/PixelTransition";

import Home from "./pages/Home";
import Secrets from "./pages/Secret";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";


export default function App() {
  const [done, setDone] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();
  const [initialLocationKey] = useState(location.key);
  const [isDocumentReload] = useState(
    () =>
      typeof window !== "undefined" &&
      window.performance.getEntriesByType("navigation")[0]?.type === "reload"
  );
  const isHome = location.pathname === "/";
  const isInitialReloadedLocation =
    isDocumentReload && location.key === initialLocationKey;
  const scrollTo =
    !isInitialReloadedLocation && navigationType === "PUSH"
      ? location.state?.scrollTo
      : null;
  const isReturningToSection = Boolean(scrollTo);
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
        <Route path="/" element={<Home show={done || isReturningToSection} scrollTo={scrollTo} />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/secret" element={<Secrets />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}