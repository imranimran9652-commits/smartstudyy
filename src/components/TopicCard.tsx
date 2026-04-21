import type { Topic, TopicStatus } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { CheckCircle2, RotateCw, AlertTriangle, X } from "lucide-react";

const statusMap: Record<TopicStatus, { label: string; icon: typeof CheckCircle2; bg: string; text: string }> = {
  completed: { label: "Completed", icon: CheckCircle2, bg: "bg-success/20", text: "text-success" },
  revision: { label: "Revise", icon: RotateCw, bg: "bg-warning/25", text: "text-foreground" },
  weak: { label: "Weak", icon: AlertTriangle, bg: "bg-destructive/15", text: "text-destructive" },
};

type Props = {
  topic: Topic;
  onStatusChange?: (status: TopicStatus) => void;
  onDelete?: () => void;
  draggable?: boolean;
};

export function TopicCard({ topic, onStatusChange, onDelete }: Props) {
  const meta = statusMap[topic.status];
  const Icon = meta.icon;

  return (
    <div className="group relative rounded-2xl bg-card border border-border p-4 card-3d shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", meta.bg, meta.text)}>
            <Icon className="h-3 w-3" />
            {meta.label}
          </div>
          <h4 className="mt-2 font-semibold truncate">{topic.name}</h4>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            aria-label="Delete topic"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {onStatusChange && (
        <div className="mt-3 flex gap-1.5">
          {(Object.keys(statusMap) as TopicStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={cn(
                "flex-1 text-[11px] font-medium rounded-lg py-1.5 border transition-all",
                topic.status === s
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {statusMap[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
