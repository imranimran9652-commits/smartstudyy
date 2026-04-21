import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
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

const COLORS = ["oklch(0.82 0.13 350)", "oklch(0.85 0.1 230)", "oklch(0.88 0.1 165)", "oklch(0.93 0.13 100)", "oklch(0.82 0.1 300)", "oklch(0.85 0.12 50)"];

function AnalyticsPage() {
  const { subjects } = useSubjects();
  const { sessions } = useFocusSessions();

  const timePerSubject = useMemo(() => {
    const byId: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.subjectId) byId[s.subjectId] = (byId[s.subjectId] ?? 0) + s.minutes;
    });
    return subjects.map((s) => ({ name: s.name, minutes: byId[s.id] ?? 0 }));
  }, [subjects, sessions]);

  const completion = useMemo(
    () =>
      subjects.map((s) => {
        const done = s.topics.filter((t) => t.status === "completed").length;
        const pct = s.topics.length ? (done / s.topics.length) * 100 : 0;
        return { name: s.name, value: Math.round(pct), fill: COLORS[subjects.indexOf(s) % COLORS.length] };
      }),
    [subjects]
  );

  const weakDist = useMemo(() => {
    const weakBySubject = subjects
      .map((s) => ({ name: s.name, value: s.topics.filter((t) => t.status === "weak").length }))
      .filter((x) => x.value > 0);
    return weakBySubject;
  }, [subjects]);

  const totalMinutes = sessions.reduce((a, b) => a + b.minutes, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Patterns, progress, and places to improve.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total focus time", value: `${totalMinutes}m`, color: "bg-lavender" },
          { label: "Sessions", value: sessions.length, color: "bg-mint" },
          { label: "Subjects tracked", value: subjects.length, color: "bg-peach" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl p-6 ${c.color} card-3d shadow-soft`}>
            <div className="text-xs uppercase tracking-wider text-foreground/70">{c.label}</div>
            <div className="mt-1 text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-4">Time per subject (minutes)</h3>
          {timePerSubject.every((t) => t.minutes === 0) ? (
            <p className="text-sm text-muted-foreground">Start a Pomodoro in Focus Mode to log time.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timePerSubject}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="minutes" radius={[10, 10, 0, 0]}>
                  {timePerSubject.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-4">Completion %</h3>
          {completion.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add subjects to see progress.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart innerRadius="25%" outerRadius="95%" data={completion} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft md:col-span-2">
          <h3 className="font-bold mb-4">Weak topics distribution</h3>
          {weakDist.length === 0 ? (
            <p className="text-sm text-muted-foreground">No weak topics — amazing work! 💪</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={weakDist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {weakDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
