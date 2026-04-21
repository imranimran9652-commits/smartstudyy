import { useEffect, useState, useCallback } from "react";

export type TopicStatus = "completed" | "revision" | "weak";

export type Topic = {
  id: string;
  name: string;
  status: TopicStatus;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
};

export type FocusSession = {
  id: string;
  topic: string;
  minutes: number;
  date: string;
  subjectId?: string;
};

const SUBJECTS_KEY = "ssc:subjects";
const SESSIONS_KEY = "ssc:sessions";

export { useTheme } from "./theme";

const PALETTE = ["pink", "mint", "lemon", "sky", "lavender", "peach"];

const seedSubjects = (): Subject[] => [
  {
    id: crypto.randomUUID(),
    name: "Mathematics",
    color: "lavender",
    topics: [
      { id: crypto.randomUUID(), name: "Calculus Basics", status: "completed" },
      { id: crypto.randomUUID(), name: "Linear Algebra", status: "revision" },
      { id: crypto.randomUUID(), name: "Probability", status: "weak" },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Physics",
    color: "sky",
    topics: [
      { id: crypto.randomUUID(), name: "Kinematics", status: "completed" },
      { id: crypto.randomUUID(), name: "Thermodynamics", status: "weak" },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Computer Science",
    color: "mint",
    topics: [
      { id: crypto.randomUUID(), name: "Data Structures", status: "completed" },
      { id: crypto.randomUUID(), name: "Algorithms", status: "revision" },
      { id: crypto.randomUUID(), name: "Operating Systems", status: "weak" },
    ],
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = read<Subject[] | null>(SUBJECTS_KEY, null);
    if (!existing) {
      const seed = seedSubjects();
      write(SUBJECTS_KEY, seed);
      setSubjects(seed);
    } else {
      setSubjects(existing);
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: Subject[]) => {
    setSubjects(next);
    write(SUBJECTS_KEY, next);
  }, []);

  const addSubject = useCallback(
    (name: string) => {
      const color = PALETTE[subjects.length % PALETTE.length];
      const next: Subject[] = [
        ...subjects,
        { id: crypto.randomUUID(), name, color, topics: [] },
      ];
      persist(next);
    },
    [subjects, persist]
  );

  const deleteSubject = useCallback(
    (id: string) => persist(subjects.filter((s) => s.id !== id)),
    [subjects, persist]
  );

  const addTopic = useCallback(
    (subjectId: string, name: string) =>
      persist(
        subjects.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                topics: [
                  ...s.topics,
                  { id: crypto.randomUUID(), name, status: "weak" as TopicStatus },
                ],
              }
            : s
        )
      ),
    [subjects, persist]
  );

  const deleteTopic = useCallback(
    (subjectId: string, topicId: string) =>
      persist(
        subjects.map((s) =>
          s.id === subjectId
            ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
            : s
        )
      ),
    [subjects, persist]
  );

  const updateTopicStatus = useCallback(
    (subjectId: string, topicId: string, status: TopicStatus) =>
      persist(
        subjects.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                topics: s.topics.map((t) => (t.id === topicId ? { ...t, status } : t)),
              }
            : s
        )
      ),
    [subjects, persist]
  );

  const reorderTopics = useCallback(
    (subjectId: string, topics: Topic[]) =>
      persist(
        subjects.map((s) => (s.id === subjectId ? { ...s, topics } : s))
      ),
    [subjects, persist]
  );

  return {
    subjects,
    loaded,
    addSubject,
    deleteSubject,
    addTopic,
    deleteTopic,
    updateTopicStatus,
    reorderTopics,
  };
}

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    setSessions(read<FocusSession[]>(SESSIONS_KEY, []));
  }, []);

  const addSession = useCallback((session: Omit<FocusSession, "id" | "date">) => {
    setSessions((prev) => {
      const next = [
        ...prev,
        { ...session, id: crypto.randomUUID(), date: new Date().toISOString() },
      ];
      write(SESSIONS_KEY, next);
      return next;
    });
  }, []);

  return { sessions, addSession };
}

