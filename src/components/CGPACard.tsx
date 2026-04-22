import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Target, Sparkles, Pencil, Check } from "lucide-react";

const STORAGE_KEY = "ssc:cgpa";

type CGPAData = { current: number; goal: number };

const QUOTES = [
  "Small steps every day lead to giant leaps. ✨",
  "Your future is created by what you do today. 🚀",
  "Discipline is choosing what you want most over what you want now. 💜",
  "Don't watch the clock; do what it does — keep going. ⏳",
  "Dream big. Study hard. Stay humble. 🌟",
  "Success is the sum of small efforts repeated daily. 🔁",
  "Believe you can, and you're halfway there. 💪",
];

function readCGPA(): CGPAData {
  if (typeof window === "undefined") return { current: 0, goal: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { current: 0, goal: 0 };
}

export function CGPACard() {
  const [data, setData] = useState<CGPAData>({ current: 0, goal: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ current: string; goal: string }>({ current: "", goal: "" });
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const d = readCGPA();
    setData(d);
    setDraft({ current: d.current ? String(d.current) : "", goal: d.goal ? String(d.goal) : "" });
    setEditing(d.current === 0 && d.goal === 0);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const progress = useMemo(() => {
    if (!data.goal) return 0;
    return Math.min(100, Math.max(0, (data.current / data.goal) * 100));
  }, [data]);

  const gap = useMemo(() => Math.max(0, +(data.goal - data.current).toFixed(2)), [data]);

  const save = () => {
    const c = Math.min(10, Math.max(0, parseFloat(draft.current) || 0));
    const g = Math.min(10, Math.max(0, parseFloat(draft.goal) || 0));
    const next = { current: +c.toFixed(2), goal: +g.toFixed(2) };
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setEditing(false);
  };

  return (
    <section
      className="rise-in relative"
      style={{ animationDelay: "300ms", perspective: "1200px" }}
    >
      <div className="cgpa-3d relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-3d">
        {/* Glowing blobs */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-lavender/50 blur-3xl mix-blend-screen animate-blob" />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-mint/50 blur-3xl mix-blend-screen animate-blob"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-pink/40 blur-3xl mix-blend-screen animate-blob"
          style={{ animationDelay: "5s" }}
        />

        <div className="relative z-10 grid gap-8 md:grid-cols-[1.1fr_1fr] items-center">
          {/* Left: numbers + edit */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-soft">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">CGPA Goal Tracker</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-muted hover:bg-muted/70 px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                  aria-label="Edit CGPA"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={draft.current}
                    onChange={(e) => setDraft((d) => ({ ...d, current: e.target.value }))}
                    placeholder="7.85"
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 backdrop-blur px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Goal</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={draft.goal}
                    onChange={(e) => setDraft((d) => ({ ...d, goal: e.target.value }))}
                    placeholder="9.00"
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 backdrop-blur px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </label>
                <button
                  onClick={save}
                  className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:scale-[1.02] hover:-translate-y-0.5 transition-all"
                >
                  <Check className="h-4 w-4" /> Save
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="cgpa-stat rounded-2xl bg-gradient-to-br from-mint/40 to-sky/30 border border-border p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current</div>
                  <div className="mt-1 text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {data.current.toFixed(2)}
                  </div>
                </div>
                <div className="cgpa-stat rounded-2xl bg-gradient-to-br from-lavender/50 to-pink/40 border border-border p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" /> Goal
                  </div>
                  <div className="mt-1 text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {data.goal.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {!editing && data.goal > 0 && (
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-muted-foreground">Progress to goal</span>
                  <span className="text-primary">{progress.toFixed(0)}%</span>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-pink to-lavender shadow-[0_0_18px_var(--primary)] transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {gap > 0 ? (
                    <>You're <span className="font-bold text-foreground">{gap.toFixed(2)}</span> points away. Keep grinding!</>
                  ) : data.goal > 0 ? (
                    <>🎉 Goal reached! Time to set a higher one.</>
                  ) : null}
                </p>
              </div>
            )}
          </div>

          {/* Right: 3D ring + quote */}
          <div className="flex flex-col items-center gap-5">
            <div className="cgpa-orb relative h-44 w-44" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-pink to-lavender blur-2xl opacity-60 animate-pulse" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/40 animate-spin-slow" />
              <div
                className="absolute inset-5 rounded-full border-2 border-dashed border-pink/50 animate-spin-slow"
                style={{ animationDirection: "reverse", animationDuration: "22s" }}
              />
              <div className="absolute inset-8 rounded-full bg-card border border-border shadow-3d flex flex-col items-center justify-center backdrop-blur">
                <Sparkles className="h-5 w-5 text-primary mb-1" />
                <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-pink bg-clip-text text-transparent">
                  {data.goal > 0 ? `${progress.toFixed(0)}%` : "—"}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  to goal
                </div>
              </div>
            </div>

            <blockquote className="relative max-w-xs rounded-2xl bg-gradient-to-br from-lemon/30 via-pink/20 to-lavender/30 border border-border px-4 py-3 text-center text-sm font-medium italic text-foreground/85 shadow-soft">
              <span className="absolute -top-2 -left-2 text-2xl">"</span>
              {quote}
              <span className="absolute -bottom-4 -right-1 text-2xl">"</span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
