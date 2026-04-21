import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSubjects } from "@/lib/storage";
import { TopicCard } from "@/components/TopicCard";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — Smart Study Companion" },
      { name: "description", content: "Add, organize, and manage your subjects and topics." },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { subjects, loaded, addSubject, deleteSubject, addTopic, deleteTopic, updateTopicStatus } = useSubjects();
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState<Record<string, string>>({});

  const handleAddSubject = () => {
    const name = newSubject.trim();
    if (!name) return;
    addSubject(name);
    setNewSubject("");
    toast.success(`Added "${name}"`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Subjects</h1>
        <p className="text-muted-foreground mt-1">Build your curriculum, one topic at a time.</p>
      </header>

      <div className="rounded-2xl bg-gradient-warm p-1 shadow-soft">
        <div className="rounded-xl bg-card p-4 flex gap-2">
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
            placeholder="New subject name (e.g. Biology)"
            className="flex-1 bg-transparent outline-none px-2 text-sm"
          />
          <button
            onClick={handleAddSubject}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {!loaded ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center">
          <p className="text-4xl">📚</p>
          <p className="mt-2 font-semibold">No subjects yet</p>
          <p className="text-sm text-muted-foreground">Add one above to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {subjects.map((s) => (
            <div key={s.id} className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl bg-${s.color} flex items-center justify-center font-bold text-lg`}>
                    {s.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{s.name}</h2>
                    <p className="text-xs text-muted-foreground">{s.topics.length} topics</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    deleteSubject(s.id);
                    toast.success(`Deleted "${s.name}"`);
                  }}
                  className="h-9 w-9 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  value={newTopic[s.id] ?? ""}
                  onChange={(e) => setNewTopic({ ...newTopic, [s.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (newTopic[s.id] ?? "").trim()) {
                      addTopic(s.id, newTopic[s.id].trim());
                      setNewTopic({ ...newTopic, [s.id]: "" });
                      toast.success("Topic added");
                    }
                  }}
                  placeholder="Add a topic and press Enter..."
                  className="flex-1 rounded-xl bg-muted border border-border px-3 py-2 text-sm outline-none focus:border-primary transition"
                />
              </div>

              {s.topics.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No topics yet — add your first one above.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {s.topics.map((t) => (
                    <TopicCard
                      key={t.id}
                      topic={t}
                      onStatusChange={(status) => updateTopicStatus(s.id, t.id, status)}
                      onDelete={() => {
                        deleteTopic(s.id, t.id);
                        toast.success("Topic removed");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
