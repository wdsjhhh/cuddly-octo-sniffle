import { useCourse } from "@/context/CourseContext";
import { MOCK_SPA_MODULES } from "@/data/spa";
import {
  BookOpen,
  Triangle,
  Square,
  Origami,
  PenTool,
  Award,
  X,
  StickyNote,
  RotateCcw,
  Sun,
  Moon,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "sonner";

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Triangle,
  Square,
  Origami,
  PenTool,
  Award,
};

export default function FloatingSidebar() {
  const {
    progress,
    badges,
    theme,
    toggleTheme,
    resetAll,
    sidebarOpen,
    setSidebarOpen,
    notesOpen,
    setNotesOpen,
  } = useCourse();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
      toast.success("已重置所有学习数据");
    } else {
      setConfirmReset(true);
      toast.warning("再次点击确认重置");
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <>
      {/* Floating button group - right side */}
      <div className="fixed right-3 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-2 md:right-5">
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="目录"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg relative"
          onClick={() => setNotesOpen(true)}
          aria-label="笔记"
        >
          <StickyNote className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg relative"
          onClick={handleReset}
          aria-label="重置"
        >
          <RotateCcw className={cn("h-5 w-5", confirmReset && "text-destructive")} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg"
          onClick={toggleTheme}
          aria-label="主题切换"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <div className="relative mt-1 flex justify-center">
          <Button
            size="icon"
            variant="secondary"
            className="h-11 w-11 rounded-full shadow-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="勋章"
          >
            <Medal className="h-5 w-5 text-amber-500" />
          </Button>
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unlockedCount}
          </span>
        </div>
      </div>

      {/* Progress bar - top */}
      <div className="fixed left-0 top-0 z-30 h-1 w-full bg-muted/50">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sidebar sheet (目录) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px]">
          <SheetHeader>
            <SheetTitle className="text-left">课程目录</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {MOCK_SPA_MODULES.map((m) => {
              const Icon = iconMap[m.icon] || BookOpen;
              return (
                <a
                  key={m.id}
                  href={m.anchor}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors text-foreground hover:bg-muted",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">模块{m.moduleNumber}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {m.title} · {m.subtitle}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold text-foreground">我的勋章</h3>
            <div className="flex gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-2 text-center",
                    b.unlocked
                      ? "border-amber-300 bg-amber-50 dark:bg-amber-950/30"
                      : "border-border opacity-50 grayscale",
                  )}
                >
                  <Medal className={cn("h-6 w-6", b.unlocked ? "text-amber-500" : "text-muted-foreground")} />
                  <span className="text-[10px] font-medium">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>学习进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Notes sheet */}
      <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
        <SheetContent side="right" className="w-[320px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-left">学习笔记</SheetTitle>
          </SheetHeader>
          <NotesPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}

function NotesPanel() {
  const { notes, saveNote, activeModule } = useCourse();
  const [currentModule, setCurrentModule] = useState(activeModule);
  const currentNote = notes.find((n) => n.moduleId === currentModule)?.content || "";
  const [text, setText] = useState(currentNote);

  const handleSave = () => {
    saveNote(currentModule, text);
    toast.success("笔记已保存");
  };

  return (
    <div className="mt-4 flex h-[calc(100vh-120px)] flex-col">
      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map((m) => (
          <button
            key={m}
            onClick={() => {
              setCurrentModule(m);
              setText(notes.find((n) => n.moduleId === m)?.content || "");
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-colors",
              currentModule === m
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            模块{m}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在这里记录你的学习笔记..."
        className="flex-1 resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
      />
      <Button onClick={handleSave} className="mt-3 w-full">
        保存笔记
      </Button>
    </div>
  );
}
