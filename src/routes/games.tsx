import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { celebrate } from "@/lib/confetti";
import { Brain, Zap, RotateCcw, Trophy, Timer } from "lucide-react";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Brain Games — Smart Study Companion" },
      { name: "description", content: "Take a refreshing break with quick brain games to recharge your focus." },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  const [tab, setTab] = useState<"memory" | "reaction">("memory");

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-warm p-8 md:p-10 shadow-3d">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-primary/30 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative z-10 flex items-center gap-6 flex-col md:flex-row">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground/70 uppercase tracking-widest">Refresh break 🎮</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Brain games to recharge</h1>
            <p className="mt-3 text-foreground/80 max-w-xl">A quick 2-minute game keeps your mind sharp. Pick one and play!</p>
          </div>
          <Mascot size={96} message="Let's play! 🎲" />
        </div>
      </section>

      <div className="flex gap-2">
        <TabBtn active={tab === "memory"} onClick={() => setTab("memory")} icon={<Brain className="h-4 w-4" />} label="Memory Match" />
        <TabBtn active={tab === "reaction"} onClick={() => setTab("reaction")} icon={<Zap className="h-4 w-4" />} label="Reaction Tap" />
      </div>

      {tab === "memory" ? <MemoryMatch /> : <ReactionTap />}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
        active ? "bg-primary text-primary-foreground shadow-soft scale-105" : "bg-card border border-border hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------------- Memory Match ---------------- */
const EMOJIS = ["🚀", "🌟", "🎨", "🧠", "🎵", "🍀", "🔥", "🌈"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const reset = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
    setCards(deck);
    setPicked([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { reset(); }, []);

  useEffect(() => {
    if (picked.length === 2) {
      const [a, b] = picked;
      setMoves((m) => m + 1);
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards((c) => c.map((card, i) => (i === a || i === b ? { ...card, matched: true } : card)));
          setPicked([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((c) => c.map((card, i) => (i === a || i === b ? { ...card, flipped: false } : card)));
          setPicked([]);
        }, 800);
      }
    }
  }, [picked, cards]);

  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched) && !won) {
      setWon(true);
      celebrate();
    }
  }, [cards, won]);

  const flip = (i: number) => {
    if (picked.length === 2 || cards[i].flipped || cards[i].matched) return;
    setCards((c) => c.map((card, idx) => (idx === i ? { ...card, flipped: true } : card)));
    setPicked((p) => [...p, i]);
  };

  return (
    <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-3d">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Memory Match</h2>
          <p className="text-sm text-muted-foreground">Find all matching pairs.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold rounded-full bg-muted px-3 py-1.5">Moves: {moves}</span>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold hover:scale-105 transition-transform">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4" style={{ perspective: "1000px" }}>
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => flip(i)}
            className="aspect-square relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-primary shadow-soft flex items-center justify-center text-2xl font-bold text-primary-foreground"
                style={{ backfaceVisibility: "hidden" }}
              >
                ?
              </div>
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-3d ${card.matched ? "bg-mint" : "bg-card border border-border"}`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {card.emoji}
              </div>
            </div>
          </button>
        ))}
      </div>

      {won && (
        <div className="mt-6 rounded-2xl bg-gradient-warm p-5 text-center animate-pop-in">
          <p className="text-3xl">🏆</p>
          <p className="font-bold mt-1">You won in {moves} moves!</p>
        </div>
      )}
    </section>
  );
}

/* ---------------- Reaction Tap ---------------- */
function ReactionTap() {
  const [state, setState] = useState<"idle" | "waiting" | "go" | "result" | "tooSoon">("idle");
  const [time, setTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const b = localStorage.getItem("ssc:reaction-best");
    if (b) setBest(Number(b));
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const start = () => {
    setState("waiting");
    setTime(null);
    const delay = 1000 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setState("go");
    }, delay);
  };

  const handleClick = () => {
    if (state === "idle" || state === "result" || state === "tooSoon") {
      start();
    } else if (state === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("tooSoon");
    } else if (state === "go") {
      const t = Math.round(performance.now() - startRef.current);
      setTime(t);
      setState("result");
      if (best === null || t < best) {
        setBest(t);
        localStorage.setItem("ssc:reaction-best", String(t));
        celebrate();
      }
    }
  };

  const bg = useMemo(() => {
    switch (state) {
      case "waiting": return "bg-destructive/80";
      case "go": return "bg-mint";
      case "tooSoon": return "bg-warning";
      case "result": return "bg-gradient-primary";
      default: return "bg-card";
    }
  }, [state]);

  const label = useMemo(() => {
    switch (state) {
      case "idle": return "Tap to start";
      case "waiting": return "Wait for green…";
      case "go": return "TAP NOW!";
      case "tooSoon": return "Too soon! Tap to retry";
      case "result": return `${time} ms — tap to play again`;
    }
  }, [state, time]);

  return (
    <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-3d">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Reaction Tap</h2>
          <p className="text-sm text-muted-foreground">Tap as fast as you can when the box turns green.</p>
        </div>
        {best !== null && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-lemon text-foreground px-3 py-1.5">
            <Trophy className="h-3.5 w-3.5" /> Best: {best} ms
          </span>
        )}
      </div>

      <button
        onClick={handleClick}
        className={`w-full h-72 rounded-3xl ${bg} text-foreground font-bold text-2xl md:text-3xl flex flex-col items-center justify-center gap-2 shadow-3d transition-all hover:scale-[1.01] active:scale-[0.99]`}
      >
        {state === "go" ? <Zap className="h-12 w-12 animate-pop-in" /> : <Timer className="h-10 w-10 opacity-70" />}
        <span>{label}</span>
      </button>
    </section>
  );
}
