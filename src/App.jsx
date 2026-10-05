import { useEffect, useState } from "react";
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
      <Home show={done} />
    </>
  );
}