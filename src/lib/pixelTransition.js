export function startPixelTransition(onCovered, targetPath) {
  window.dispatchEvent(
    new CustomEvent("portfolio:pixel-transition", {
      detail: { onCovered, targetPath },
    })
  );
}
