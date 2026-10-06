import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from 'react-router'


import Intro from "./components/Intro";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";


export default function App() {
  const [done, setDone] = useState(false);
  const isHome = useLocation().pathname === "/";

  useEffect(() => {
    if (done || !isHome) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [done, isHome]);

  return (
    <>
      {isHome && !done && <Intro onDone={() => setDone(true)} />}

      <Routes>
        <Route path="/" element={<Home show={done} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}