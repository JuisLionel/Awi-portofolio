import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Canvas spark burst on click (React Bits style, no extra dependencies).
export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400, // ms
  extraScale = 1.0,
  children,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef = useRef(null);

  // Keep the canvas viewport-sized instead of allocating a bitmap for the full page.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const draw = useCallback(
    (timestamp) => {
      function drawFrame(frameTimestamp) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) {
          rafRef.current = null;
          return;
        }

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        sparksRef.current = sparksRef.current.filter((spark) => {
          const elapsed = frameTimestamp - spark.startTime;
          if (elapsed >= duration) return false;

          const progress = elapsed / duration;
          const eased = progress * (2 - progress); // ease-out
          const distance = eased * sparkRadius * extraScale;
          const lineLength = sparkSize * (1 - eased);

          const x1 = spark.x + distance * Math.cos(spark.angle);
          const y1 = spark.y + distance * Math.sin(spark.angle);
          const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
          const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          return true;
        });

        if (sparksRef.current.length > 0) {
          rafRef.current = requestAnimationFrame(drawFrame);
        } else {
          rafRef.current = null;
        }
      }

      drawFrame(timestamp);
    },
    [duration, extraScale, sparkColor, sparkRadius, sparkSize]
  );

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      sparksRef.current = [];
    },
    []
  );

  const handleClick = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();

    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      });
    }

    if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
  };

  return (
    <div
      onClick={handleClick}
    >
      {children}
      {createPortal(
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />,
        document.body
      )}
    </div>
  );
}
