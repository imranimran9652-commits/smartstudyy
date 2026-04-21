import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;
  const defaults = { spread: 70, ticks: 80, gravity: 0.9, decay: 0.94, startVelocity: 35, scalar: 0.9 };
  confetti({
    ...defaults,
    particleCount: 60,
    origin: { x: 0.5, y: 0.7 },
    colors: ["#c4b5fd", "#a7f3d0", "#fde68a", "#bae6fd", "#fbcfe8", "#fed7aa"],
  });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 40, angle: 60, origin: { x: 0, y: 0.8 } });
    confetti({ ...defaults, particleCount: 40, angle: 120, origin: { x: 1, y: 0.8 } });
  }, 150);
}
