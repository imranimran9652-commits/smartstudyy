import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useSubjects } from "@/lib/storage";
import { ProgressCircle } from "@/components/ProgressCircle";
import { BookOpen, Target, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Study Companion" },
      { name: "description", content: "Your study overview, today's tasks, and overall progress." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { subjects, loaded } = useSubjects();
  const [greet, setGreet] = useState("Hello");
  useEffect(() => setGreet(greeting()), []);

  const stats = useMemo(() => {
    const all = subjects.flatMap((s) => s.topics);
    const total = all.length || 1;
    const done = all.filter((t) => t.status === "completed").length;
    const weak = all.filter((t) => t.status === "weak").length;
    const revise = all.filter((t) => t.status === "revision").length;
    return {
      total: all.length,
      done,
      weak,
      revise,
      pct: (done / total) * 100,
    };
  }, [subjects]);

  const todayTasks = useMemo(
    () =>
      subjects
        .flatMap((s) => s.topics.filter((t) => t.status !== "completed").map((t) => ({ s, t })))
        .slice(0, 5),
    [subjects]
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 shadow-3d">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground/70 uppercase tracking-widest">{greet} ✨</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
              Ready to learn something <span className="italic">amazing</span>?
            </h1>
            <p className="mt-3 text-foreground/80 max-w-xl">
              {stats.total === 0
                ? "Create your first subject to begin your journey."
                : `You have ${stats.total - stats.done} topics left. Keep the streak alive!`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/focus" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:scale-105 transition-transform shadow-soft">
                Start focusing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/subjects" className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-5 py-2.5 text-sm font-semibold hover:bg-white/80 transition-colors">
                Manage subjects
              </Link>
            </div>
          </div>
          <div className="shrink-0 flex justify-center">
            <div className="animate-float">
              <ProgressCircle value={stats.pct} size={180} label="completed" />
            </div>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Subjects", value: subjects.length, color: "bg-lavender", Icon: BookOpen },
          { label: "Completed", value: stats.done, color: "bg-mint", Icon: Target },
          { label: "Revise", value: stats.revise, color: "bg-lemon", Icon: Zap },
          { label: "Weak", value: stats.weak, color: "bg-pink", Icon: Target },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-card border border-border p-5 card-3d shadow-soft">
            <div className={`h-10 w-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
              <c.Icon className="h-5 w-5 text-foreground/80" />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</div>
          </div>
        ))}
      </section>

      {/* Today's tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's focus list</h2>
          <Link to="/timeline" className="text-sm text-primary font-semibold hover:underline">
            See timeline →
          </Link>
        </div>

        {!loaded ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : todayTasks.length === 0 ? (
          <div className="rounded-2xl bg-card border border-dashed border-border p-10 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-2 font-semibold">Everything's done!</p>
            <p className="text-sm text-muted-foreground">Add more topics in Subjects.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {todayTasks.map(({ s, t }) => (
              <div key={t.id} className="flex items-center gap-4 rounded-2xl bg-card border border-border p-4 card-3d shadow-soft">
                <div className={`h-12 w-12 rounded-xl bg-${s.color} flex items-center justify-center font-bold text-foreground/80`}>
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{s.name}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${t.status === "weak" ? "bg-destructive/15 text-destructive" : "bg-warning/25"}`}>
                  {t.status === "weak" ? "Weak" : "Revise"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
