import { useState } from "react";
import Intro from "./components/Intro";
import Home from "./pages/Home";

export default function App() {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <Intro onDone={() => setDone(true)} />}
      <Home show={done} />
    </>
  );
}