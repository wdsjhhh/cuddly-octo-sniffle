import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  getProgress,
  setProgress as saveProgress,
  getBadges,
  unlockBadge as doUnlockBadge,
  getNotes,
  saveNote as doSaveNote,
  getTheme,
  setTheme as doSetTheme,
  getAnswers,
  addAnswer as doAddAnswer,
  resetAll as doResetAll,
  type IBadge,
  type INote,
  type IAnswerRecord,
} from "@/lib/course-store";

interface CourseContextValue {
  progress: number;
  setProgress: (p: number) => void;
  badges: IBadge[];
  unlockBadge: (id: string) => void;
  notes: INote[];
  saveNote: (moduleId: number, content: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  answers: IAnswerRecord[];
  addAnswer: (record: IAnswerRecord) => void;
  resetAll: () => void;
  activeModule: number;
  setActiveModule: (m: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  notesOpen: boolean;
  setNotesOpen: (v: boolean) => void;
}

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState(0);
  const [badges, setBadges] = useState<IBadge[]>([]);
  const [notes, setNotes] = useState<INote[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [answers, setAnswers] = useState<IAnswerRecord[]>([]);
  const [activeModule, setActiveModule] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    setProgressState(getProgress());
    setBadges(getBadges());
    setNotes(getNotes());
    const t = getTheme();
    setThemeState(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    }
    setAnswers(getAnswers());
  }, []);

  const setProgress = useCallback((p: number) => {
    setProgressState(p);
    saveProgress(p);
  }, []);

  const unlockBadge = useCallback((id: string) => {
    const updated = doUnlockBadge(id);
    setBadges(updated);
  }, []);

  const saveNote = useCallback((moduleId: number, content: string) => {
    const updated = doSaveNote(moduleId, content);
    setNotes(updated);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    doSetTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const addAnswer = useCallback((record: IAnswerRecord) => {
    const updated = doAddAnswer(record);
    setAnswers(updated);
  }, []);

  const resetAll = useCallback(() => {
    doResetAll();
    setProgressState(0);
    setBadges(getBadges());
    setNotes([]);
    setAnswers([]);
  }, []);

  return (
    <CourseContext.Provider
      value={{
        progress,
        setProgress,
        badges,
        unlockBadge,
        notes,
        saveNote,
        theme,
        toggleTheme,
        answers,
        addAnswer,
        resetAll,
        activeModule,
        setActiveModule,
        sidebarOpen,
        setSidebarOpen,
        notesOpen,
        setNotesOpen,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
}
