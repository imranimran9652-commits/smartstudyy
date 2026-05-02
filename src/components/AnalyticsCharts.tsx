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

type SubjectMinutes = { name: string; minutes: number };
type Completion = { name: string; value: number; fill: string };
type Weak = { name: string; value: number };

interface Props {
  timePerSubject: SubjectMinutes[];
  completion: Completion[];
  weakDist: Weak[];
  colors: string[];
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
};

export default function AnalyticsCharts({ timePerSubject, completion, weakDist, colors }: Props) {
  return (
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
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="minutes" radius={[10, 10, 0, 0]} isAnimationActive={false}>
                {timePerSubject.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
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
              <RadialBar background dataKey="value" cornerRadius={8} isAnimationActive={false} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
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
              <Pie
                data={weakDist}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                isAnimationActive={false}
              >
                {weakDist.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
