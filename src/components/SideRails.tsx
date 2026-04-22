import { Sparkles, BookOpen, Brain, Coffee, Trophy, Flame } from "lucide-react";

const TIPS = [
  { icon: Brain, text: "Active recall beats re-reading.", color: "bg-lavender" },
  { icon: Coffee, text: "Take a 5-min break every 25 min.", color: "bg-peach" },
  { icon: BookOpen, text: "Teach it to learn it deeper.", color: "bg-mint" },
  { icon: Flame, text: "Consistency > intensity.", color: "bg-pink" },
];

export function SideRails() {
  return (
    <>
      {/* Left rail */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 w-44"
      >
        <div className="rise-in rounded-2xl border border-border bg-card/70 backdrop-blur p-4 shadow-soft bounce-hover">
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
                style={{ animationDelay: `${200 + i * 90}ms` }}
              >
                <span className={`mt-0.5 h-5 w-5 shrink-0 rounded-md ${t.color} flex items-center justify-center`}>
                  <t.icon className="h-3 w-3 text-foreground/80" />
                </span>
                <span className="leading-snug">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right rail */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 w-44"
      >
        <div className="rise-in rounded-2xl border border-border bg-card/70 backdrop-blur p-4 shadow-soft bounce-hover">
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
          style={{ animationDelay: "300ms" }}
        >
          <Flame className="h-5 w-5 text-primary mx-auto mb-1" />
          <div className="text-2xl font-extrabold">7</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            day streak
          </div>
        </div>
      </aside>
    </>
  );
}
