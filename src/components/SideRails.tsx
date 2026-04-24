import { Sparkles, BookOpen, Brain, Coffee, Trophy, Flame, BookPlus, ListPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSubjects, useFocusSessions } from "@/lib/storage";

const TIPS = [
  { icon: Brain, text: "Active recall beats re-reading.", color: "bg-lavender" },
  { icon: Coffee, text: "Take a 5-min break every 25 min.", color: "bg-peach" },
  { icon: BookOpen, text: "Teach it to learn it deeper.", color: "bg-mint" },
  { icon: Flame, text: "Consistency > intensity.", color: "bg-pink" },
];

export function SideRails() {
  const { subjects, loaded } = useSubjects();
  const { sessions } = useFocusSessions();

  const hasSubjects = subjects.length > 0;
  const hasTopics = subjects.some((s) => s.topics.length > 0);
  const hasSessions = sessions.length > 0;

  return (
    <>
      {/* Left rail */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 w-44"
      >
        <div
          className="rise-in rounded-2xl border border-border bg-card/70 backdrop-blur p-4 shadow-soft bounce-hover"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-pink flex items-center justify-center shadow-soft">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Study Tips</h3>
          </div>
          <ul className="space-y-2">
            {TIPS.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground rise-in"
                style={{ animationDelay: `${230 + i * 80}ms` }}
              >
                <span className={`mt-0.5 h-5 w-5 shrink-0 rounded-md ${t.color} flex items-center justify-center`}>
                  <t.icon className="h-3 w-3 text-foreground/80" />
                </span>
                <span className="leading-snug">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Empty-state: no subjects yet */}
        {loaded && !hasSubjects && (
          <Link
            to="/subjects"
            className="rise-in rounded-2xl border border-dashed border-primary/40 bg-gradient-to-br from-lavender/30 to-sky/20 backdrop-blur p-4 shadow-soft bounce-hover text-left block"
            style={{ animationDelay: "670ms" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <BookPlus className="h-4 w-4 text-primary" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-widest">No subjects</h3>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Add your first subject to start tracking progress.
            </p>
            <span className="mt-2 inline-block text-[11px] font-semibold text-primary">+ Add subject →</span>
          </Link>
        )}
      </aside>

      {/* Right rail */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 w-44"
      >
        <div
          className="rise-in rounded-2xl border border-border bg-card/70 backdrop-blur p-4 shadow-soft bounce-hover"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-mint to-sky flex items-center justify-center shadow-soft">
              <Trophy className="h-4 w-4 text-foreground/80" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Daily Goal</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-pink bg-clip-text text-transparent">
              4<span className="text-muted-foreground/50">/5</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
              focus blocks
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-primary to-pink shadow-[0_0_12px_var(--primary)]" />
            </div>
          </div>
        </div>

        <div
          className="rise-in rounded-2xl border border-border bg-gradient-to-br from-lemon/30 via-pink/20 to-lavender/30 backdrop-blur p-4 shadow-soft bounce-hover text-center"
          style={{ animationDelay: "230ms" }}
        >
          <Flame className="h-5 w-5 text-primary mx-auto mb-1" />
          <div className="text-2xl font-extrabold">7</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            day streak
          </div>
        </div>

        {/* Empty-state: no topics/tasks yet */}
        {loaded && hasSubjects && !hasTopics && (
          <Link
            to="/subjects"
            className="rise-in rounded-2xl border border-dashed border-primary/40 bg-gradient-to-br from-mint/30 to-lemon/20 backdrop-blur p-4 shadow-soft bounce-hover text-left block"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <ListPlus className="h-4 w-4 text-primary" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-widest">No tasks</h3>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Add topics to your subjects to plan your study.
            </p>
            <span className="mt-2 inline-block text-[11px] font-semibold text-primary">+ Add topic →</span>
          </Link>
        )}

        {/* Empty-state: no focus sessions yet */}
        {loaded && !hasSessions && (
          <Link
            to="/focus"
            className="rise-in rounded-2xl border border-dashed border-primary/40 bg-gradient-to-br from-peach/30 to-pink/20 backdrop-blur p-4 shadow-soft bounce-hover text-left block"
            style={{ animationDelay: "500ms" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Coffee className="h-4 w-4 text-primary" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-widest">No sessions</h3>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Start a focus session to build your streak.
            </p>
            <span className="mt-2 inline-block text-[11px] font-semibold text-primary">Start focus →</span>
          </Link>
        )}
      </aside>
    </>
  );
}
