import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubjects, useFocusSessions } from "@/lib/storage";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Mode — Smart Study Companion" },
      { name: "description", content: "Distraction-free Pomodoro focus mode for deep work." },
    ],
  }),
  component: FocusPage,
});

const DURATION = 25 * 60;

function FocusPage() {
  const { subjects } = useSubjects();
  const { addSession, sessions } = useFocusSessions();
  const allTopics = useMemo(
    () => subjects.flatMap((s) => s.topics.map((t) => ({ s, t }))),
    [subjects]
  );
  const [selected, setSelected] = useState<string>("");
  const [seconds, setSeconds] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = allTopics.find((x) => x.t.id === selected);

  useEffect(() => {
    if (!selected && allTopics[0]) setSelected(allTopics[0].t.id);
  }, [allTopics, selected]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            if (current) {
              addSession({ topic: current.t.name, minutes: 25, subjectId: current.s.id });
            }
            toast.success("🎉 Pomodoro complete! Great focus.");
            return DURATION;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, current, addSession]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const pct = ((DURATION - seconds) / DURATION) * 100;

  const reset = () => {
    setRunning(false);
    setSeconds(DURATION);
  };

  return (
    <div className="min-h-[80vh] -mx-4 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Focus Mode</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">
            {current ? current.t.name : "Pick a topic to focus on"}
          </h1>
          {current && <p className="text-muted-foreground text-sm mt-1">{current.s.name}</p>}
        </div>

        {/* 3D timer orb */}
        <div className="relative mx-auto" style={{ perspective: 1000 }}>
          <div
            className="relative mx-auto h-72 w-72 md:h-80 md:w-80 rounded-full flex items-center justify-center transition-transform"
            style={{
              background: "radial-gradient(circle at 30% 25%, oklch(0.95 0.07 300) 0%, oklch(0.7 0.2 295) 55%, oklch(0.4 0.15 270) 100%)",
              boxShadow: "inset -30px -30px 80px rgba(0,0,0,0.35), 0 30px 60px -20px oklch(0.4 0.15 295 / 0.55)",
              transform: running ? "rotateX(8deg) rotateY(-8deg)" : "rotateX(4deg) rotateY(-4deg)",
            }}
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="relative text-center text-white drop-shadow-lg">
              <div className="text-6xl md:text-7xl font-bold tabular-nums tracking-tight">
                {mins}:{secs}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.3em] text-white/80">
                {running ? "In flow" : "Paused"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={!current}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3 font-semibold shadow-soft hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-6 py-3 font-semibold hover:bg-muted transition"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        {/* Topic picker */}
        {allTopics.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Choose topic</p>
            <div className="flex flex-wrap gap-2">
              {allTopics.map(({ s, t }) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelected(t.id);
                    reset();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selected === t.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  {t.name} <span className="opacity-60">· {s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="rounded-2xl bg-card border border-border p-4 text-sm">
            <div className="font-semibold mb-2">Recent sessions</div>
            <ul className="space-y-1 text-muted-foreground">
              {sessions.slice(-5).reverse().map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.topic}</span>
                  <span>{s.minutes}m · {new Date(s.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
