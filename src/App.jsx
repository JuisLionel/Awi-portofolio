import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router'


import Intro from "./components/Intro";
import Home from "./pages/Home";


export default function App() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [done]);

  return (
    <>
      {!done && <Intro onDone={() => setDone(true)} />}

      <Routes>
        <Route path="/" element={<Home show={done} />} />
        <Route path="/projects" element={<h1>Projects page</h1>} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  );
}