import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSubjects, type Subject, type Topic, type TopicStatus } from "@/lib/storage";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Study Timeline — Smart Study Companion" },
      { name: "description", content: "Your study roadmap — drag to reorder topics and track progress visually." },
    ],
  }),
  component: TimelinePage,
});

const statusStyles: Record<TopicStatus, string> = {
  completed: "bg-success/20 border-success/40 text-foreground",
  revision: "bg-warning/25 border-warning/50 text-foreground",
  weak: "bg-destructive/15 border-destructive/40 text-foreground",
};

const dotStyles: Record<TopicStatus, string> = {
  completed: "bg-success",
  revision: "bg-warning",
  weak: "bg-destructive",
};

function SortableTopic({ topic, onCycle }: { topic: Topic; onCycle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative pl-10">
      <span className={cn("absolute left-2 top-5 h-4 w-4 rounded-full ring-4 ring-background", dotStyles[topic.status])} />
      <div className={cn("rounded-2xl border-2 p-4 card-3d shadow-soft", statusStyles[topic.status])}>
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Drag"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{topic.name}</div>
            <div className="text-xs uppercase tracking-wider opacity-70">{topic.status}</div>
          </div>
          <button
            onClick={onCycle}
            className="text-xs font-semibold rounded-full bg-background/60 px-3 py-1.5 hover:bg-background transition"
          >
            Cycle status
          </button>
        </div>
      </div>
    </div>
  );
}

function SubjectTimeline({ subject }: { subject: Subject }) {
  const { reorderTopics, updateTopicStatus } = useSubjects();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = subject.topics.findIndex((t) => t.id === active.id);
    const newIdx = subject.topics.findIndex((t) => t.id === over.id);
    reorderTopics(subject.id, arrayMove(subject.topics, oldIdx, newIdx));
  };

  const cycle = (t: Topic) => {
    const order: TopicStatus[] = ["weak", "revision", "completed"];
    const next = order[(order.indexOf(t.status) + 1) % order.length];
    updateTopicStatus(subject.id, t.id, next);
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className={`h-10 w-10 rounded-xl bg-${subject.color} flex items-center justify-center font-bold`}>
          {subject.name[0]}
        </div>
        <h2 className="text-lg font-bold">{subject.name}</h2>
      </div>

      {subject.topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">No topics yet.</p>
      ) : (
        <div className="relative">
          <span className="absolute left-[1rem] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent" />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={subject.topics.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {subject.topics.map((t) => (
                  <SortableTopic key={t.id} topic={t} onCycle={() => cycle(t)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

function TimelinePage() {
  const { subjects, loaded } = useSubjects();
  const [filter, setFilter] = useState<"all" | TopicStatus>("all");

  const filtered = subjects.map((s) => ({
    ...s,
    topics: filter === "all" ? s.topics : s.topics.filter((t) => t.status === filter),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Your study roadmap</h1>
        <p className="text-muted-foreground mt-1">Drag topics to reorder • Click <em>Cycle status</em> to update.</p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {(["all", "completed", "revision", "weak"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
            )}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {!loaded ? (
        <div className="h-40 rounded-3xl bg-muted animate-pulse" />
      ) : subjects.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center">
          <p className="text-4xl">🗺️</p>
          <p className="mt-2 font-semibold">No roadmap yet</p>
          <p className="text-sm text-muted-foreground">Add subjects to build your timeline.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((s) => (
            <SubjectTimeline key={s.id} subject={s} />
          ))}
        </div>
      )}
    </div>
  );
}
