import { useEffect, useState } from "react";
import mascotImg from "@/assets/mascot.png";
import { cn } from "@/lib/utils";

type Props = {
  message?: string;
  size?: number;
  className?: string;
  bubble?: boolean;
};

const TIPS = [
  "Tiny steps beat big leaps. Let's go! 🌱",
  "One topic at a time — you've got this!",
  "Hydrate, then conquer. 💧",
  "Weak today, strong tomorrow. 💪",
  "Focus = superpower. Try a 25-min sprint!",
  "Done is better than perfect. ✨",
];

export function Mascot({ message, size = 96, className, bubble = true }: Props) {
  const [tip, setTip] = useState(message ?? TIPS[0]);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (message) return;
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, [message]);

  const handlePoke = () => {
    setBounce(true);
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    setTimeout(() => setBounce(false), 600);
  };

  return (
    <div className={cn("flex items-end gap-3", className)}>
      <button
        type="button"
        onClick={handlePoke}
        aria-label="Poke the study buddy"
        className={cn(
          "relative shrink-0 transition-transform animate-float hover:scale-110 active:scale-95 cursor-pointer",
          bounce && "animate-pop-in"
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={mascotImg}
          alt="Study buddy mascot"
          width={size}
          height={size}
          loading="lazy"
          className="drop-shadow-[0_10px_20px_rgba(124,58,237,0.35)] select-none pointer-events-none"
        />
      </button>
      {bubble && (
        <div className="relative mb-3 max-w-[200px] rounded-2xl rounded-bl-sm bg-card border border-border px-3 py-2 text-xs font-medium shadow-soft animate-fade-in">
          {tip}
          <span className="absolute -left-1.5 bottom-2 h-3 w-3 rotate-45 bg-card border-l border-b border-border" />
        </div>
      )}
    </div>
  );
}
