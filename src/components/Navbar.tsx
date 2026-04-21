import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/storage";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/timeline", label: "Timeline" },
  { to: "/subjects", label: "Subjects" },
  { to: "/focus", label: "Focus" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-soft group-hover:rotate-12 group-hover:scale-110 transition-transform group-active:scale-95">
            <Sparkles className="h-5 w-5 text-primary-foreground group-hover:animate-pop-in" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Smart<span className="text-primary group-hover:italic transition-all">Study</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border hover:scale-110 transition-transform shadow-soft"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
