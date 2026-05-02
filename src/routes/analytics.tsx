import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSubjects, useFocusSessions } from "@/lib/storage";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Smart Study Companion" },
      { name: "description", content: "Visualize your study time, completion rates, and weak spots." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = [
  "oklch(0.82 0.13 350)",
  "oklch(0.85 0.1 230)",
  "oklch(0.88 0.1 165)",
  "oklch(0.93 0.13 100)",
  "oklch(0.82 0.1 300)",
  "oklch(0.85 0.12 50)",
];

// Lazy load the heavy charts module so the page renders instantly.
const Charts = lazy(() => import("@/components/AnalyticsCharts"));

function AnalyticsPage() {
  const { subjects } = useSubjects();
  const { sessions } = useFocusSessions();
  const [readyCharts, setReadyCharts] = useState(false);

  // Defer chart mounting one frame after paint — keeps the page feeling instant.
  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReadyCharts(true))
      : window.setTimeout(() => setReadyCharts(true), 60);
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") {
        try { window.cancelIdleCallback(id); } catch { /* noop */ }
      } else {
        clearTimeout(id as number);
      }
    };
  }, []);

  const timePerSubject = useMemo(() => {
    const byId: Record<string, number> = {};
    for (const s of sessions) {
      if (s.subjectId) byId[s.subjectId] = (byId[s.subjectId] ?? 0) + s.minutes;
    }
    return subjects.map((s) => ({ name: s.name, minutes: byId[s.id] ?? 0 }));
  }, [subjects, sessions]);

  const completion = useMemo(
    () =>
      subjects.map((s, i) => {
        const done = s.topics.filter((t) => t.status === "completed").length;
        const pct = s.topics.length ? (done / s.topics.length) * 100 : 0;
        return { name: s.name, value: Math.round(pct), fill: COLORS[i % COLORS.length] };
      }),
    [subjects],
  );

  const weakDist = useMemo(
    () =>
      subjects
        .map((s) => ({ name: s.name, value: s.topics.filter((t) => t.status === "weak").length }))
        .filter((x) => x.value > 0),
    [subjects],
  );

  const totalMinutes = sessions.reduce((a, b) => a + b.minutes, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Patterns, progress, and places to improve.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total focus time", value: `${totalMinutes}m`, color: "bg-lavender" },
          { label: "Sessions", value: sessions.length, color: "bg-mint" },
          { label: "Subjects tracked", value: subjects.length, color: "bg-peach" },
        ].map((c, i) => (
          <div
            key={c.label}
            className={`rise-in rounded-2xl p-6 ${c.color} shadow-soft`}
            style={{ animationDelay: `${100 + i * 90}ms` }}
          >
            <div className="text-xs uppercase tracking-wider text-foreground/70">{c.label}</div>
            <div className="mt-1 text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </section>

      {readyCharts ? (
        <Suspense fallback={<ChartsSkeleton />}>
          <Charts
            timePerSubject={timePerSubject}
            completion={completion}
            weakDist={weakDist}
            colors={COLORS}
          />
        </Suspense>
      ) : (
        <ChartsSkeleton />
      )}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-[320px] animate-pulse" />
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-[320px] animate-pulse" />
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-[340px] md:col-span-2 animate-pulse" />
    </section>
  );
}
