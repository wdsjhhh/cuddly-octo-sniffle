const STORAGE_KEYS = {
  PROGRESS: "course_progress",
  BADGES: "course_badges",
  NOTES: "course_notes",
  THEME: "course_theme",
  ANSWERS: "course_answers",
};

export interface IBadge {
  id: string;
  name: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface INote {
  moduleId: number;
  content: string;
  updatedAt: number;
}

export interface IAnswerRecord {
  moduleId: number;
  questionId: string;
  userAnswer: string;
  correct: boolean;
  timestamp: number;
}

const DEFAULT_BADGES: IBadge[] = [
  { id: "master-drawer", name: "作图大师", unlocked: false },
  { id: "master-prover", name: "证明能手", unlocked: false },
];

export function getProgress(): number {
  const v = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return v ? Number(v) || 0 : 0;
}

export function setProgress(pct: number) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, String(Math.min(100, Math.max(0, pct))));
}

export function getBadges(): IBadge[] {
  const v = localStorage.getItem(STORAGE_KEYS.BADGES);
  if (!v) return [...DEFAULT_BADGES];
  try {
    return JSON.parse(v);
  } catch {
    return [...DEFAULT_BADGES];
  }
}

export function unlockBadge(id: string): IBadge[] {
  const badges = getBadges();
  const idx = badges.findIndex((b) => b.id === id);
  if (idx >= 0 && !badges[idx].unlocked) {
    badges[idx] = { ...badges[idx], unlocked: true, unlockedAt: Date.now() };
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  }
  return badges;
}

export function getNotes(): INote[] {
  const v = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (!v) return [];
  try {
    return JSON.parse(v);
  } catch {
    return [];
  }
}

export function saveNote(moduleId: number, content: string) {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.moduleId === moduleId);
  if (idx >= 0) {
    notes[idx] = { moduleId, content, updatedAt: Date.now() };
  } else {
    notes.push({ moduleId, content, updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  return notes;
}

export function getTheme(): "light" | "dark" {
  const v = localStorage.getItem(STORAGE_KEYS.THEME);
  return (v === "dark" ? "dark" : "light") as "light" | "dark";
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getAnswers(): IAnswerRecord[] {
  const v = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  if (!v) return [];
  try {
    return JSON.parse(v);
  } catch {
    return [];
  }
}

export function addAnswer(record: IAnswerRecord) {
  const answers = getAnswers();
  const filtered = answers.filter(
    (a) => !(a.moduleId === record.moduleId && a.questionId === record.questionId),
  );
  filtered.push(record);
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(filtered));
  return filtered;
}

export function resetAll() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}