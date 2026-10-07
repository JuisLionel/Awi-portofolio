export function startPixelTransition(onCovered) {
  window.dispatchEvent(
    new CustomEvent("portfolio:pixel-transition", {
      detail: { onCovered },
    })
  );
}
