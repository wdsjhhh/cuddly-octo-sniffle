import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module1;

export default function Module1Section() {
  const { addAnswer, setProgress, progress } = useCourse();

  // Drag sort state
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [sortResult, setSortResult] = useState<"idle" | "correct" | "wrong">("idle");

  // Scene analogy
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [tableOpen, setTableOpen] = useState(false);

  // Pre quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const availableItems = data.dragSort.items.filter(
    (item) => !slots.includes(item),
  );

  const handleDragStart = (item: string) => {
    setDraggingItem(item);
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggingItem) return;
    const newSlots = [...slots];
    // If item was in another slot, clear it
    const existingIdx = newSlots.indexOf(draggingItem);
    if (existingIdx !== -1) newSlots[existingIdx] = null;
    newSlots[slotIndex] = draggingItem;
    setSlots(newSlots);
    setDraggingItem(null);
    setSortResult("idle");
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setSortResult("idle");
  };

  const checkSort = () => {
    const filled = slots.every((s) => s !== null);
    if (!filled) {
      toast.warning("请先将所有卡片拖入框中");
      return;
    }
    const correct = slots.every((s, i) => s === data.dragSort.correctOrder[i]);
    setSortResult(correct ? "correct" : "wrong");
    if (correct) {
      toast.success("排序正确！");
      setProgress(Math.max(progress, 10));
    } else {
      toast.error(data.dragSort.errorTip);
    }
  };

  const handleQuizAnswer = (qid: string, key: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qid]: key }));
  };

  const submitQuiz = () => {
    const allAnswered = data.preQuiz.every((q) => quizAnswers[q.id]);
    if (!allAnswered) {
      toast.warning("请完成所有题目");
      return;
    }
    setQuizSubmitted(true);
    let correctCount = 0;
    data.preQuiz.forEach((q) => {
      const correct = quizAnswers[q.id] === q.answer;
      if (correct) correctCount++;
      addAnswer({
        moduleId: 1,
        questionId: q.id,
        userAnswer: quizAnswers[q.id],
        correct,
        timestamp: Date.now(),
      });
    });
    toast.success(`答对 ${correctCount}/${data.preQuiz.length} 题`);
    setProgress(Math.max(progress, 15));
  };

  const scrollToNext = () => {
    document.getElementById("module2")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="module1" className="w-full py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-8 text-primary-foreground md:p-16"
        >
          {/* Decorative geometry */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent/30 blur-2xl" />
          <svg
            className="pointer-events-none absolute right-10 top-10 h-32 w-32 opacity-20 md:h-48 md:w-48"
            viewBox="0 0 100 100"
          >
            <polygon points="10,90 90,90 50,20" fill="none" stroke="white" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="90" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" />
            <rect x="20" y="60" width="60" height="30" fill="none" stroke="white" strokeWidth="1.5" transform="rotate(-10 50 75)" />
          </svg>

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-sm">
              高中数学必修第二册
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
              {data.cover.title}
            </h1>
            <p className="mb-2 text-xl font-medium text-primary-foreground/90 md:text-2xl">
              {data.cover.subtitle}
            </p>
            <p className="mb-8 text-base text-primary-foreground/80 md:text-lg">
              {data.cover.description}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={scrollToNext}
              className="group"
            >
              开始学习
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        {/* Drag Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </span>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">垂直关系排序</h2>
          </div>
          <p className="mb-6 text-muted-foreground">{data.dragSort.instruction}</p>

          {/* Draggable items pool */}
          <div className="mb-6 flex flex-wrap gap-3">
            {availableItems.map((item) => (
              <div
                key={item}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="cursor-grab rounded-lg bg-primary/10 px-5 py-3 font-medium text-primary shadow-sm transition-all hover:bg-primary/20 hover:shadow-md active:cursor-grabbing"
              >
                {item}
              </div>
            ))}
            {availableItems.length === 0 && (
              <p className="text-sm text-muted-foreground">所有卡片已放置</p>
            )}
          </div>

          {/* Drop slots */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {slots.map((slot, i) => (
              <div
                key={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className={cn(
                  "flex min-h-[80px] items-center justify-center rounded-xl border-2 border-dashed p-3 text-center transition-all",
                  slot
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                  sortResult === "correct" && slot && "border-success bg-success/10",
                  sortResult === "wrong" && slot && "border-destructive bg-destructive/10",
                )}
              >
                {slot ? (
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium md:text-base">{slot}</span>
                    <button
                      onClick={() => handleRemoveFromSlot(i)}
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">第 {i + 1} 位</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button onClick={checkSort}>检查排序</Button>
            {sortResult === "correct" && (
              <span className="flex items-center gap-2 text-success">
                <Check className="h-5 w-5" /> {data.dragSort.successTip}
              </span>
            )}
            {sortResult === "wrong" && (
              <span className="flex items-center gap-2 text-destructive">
                <X className="h-5 w-5" /> {data.dragSort.errorTip}
              </span>
            )}
          </div>
        </motion.div>

        {/* Real Scene Analogies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </span>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">实景类比导入</h2>
          </div>
          <p className="mb-6 text-muted-foreground">点击下方示意图，观察二面角在生活中的体现</p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.realSceneAnalogies.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(activeScene === scene.id ? null : scene.id)}
                className={cn(
                  "group flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition-all",
                  activeScene === scene.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-background hover:border-primary/50 hover:shadow-sm",
                )}
              >
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-muted/50">
                  <SceneIcon name={scene.id} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{scene.name}</div>
                  {activeScene === scene.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-1 text-xs text-muted-foreground"
                    >
                      {scene.description}
                    </motion.p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-6">
            <button
              onClick={() => setTableOpen(!tableOpen)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              {tableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {data.comparisonTable.title}对比
            </button>
            {tableOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 overflow-hidden rounded-lg border"
              >
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">概念</th>
                      <th className="px-4 py-2 text-left font-medium">平面角</th>
                      <th className="px-4 py-2 text-left font-medium">二面角</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.comparisonTable.rows.map((row) => (
                      <tr key={row.concept} className="border-t border-border">
                        <td className="px-4 py-2 font-medium">{row.concept}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.planeAngle}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.dihedralAngle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Pre Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </span>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">课前小测</h2>
          </div>
          <p className="mb-6 text-muted-foreground">检验一下你的预备知识掌握情况</p>

          <div className="space-y-6">
            {data.preQuiz.map((q, idx) => {
              const userAns = quizAnswers[q.id];
              const isCorrect = userAns === q.answer;
              return (
                <div key={q.id} className="rounded-xl border border-border bg-background p-4 md:p-5">
                  <p className="mb-4 font-medium text-foreground">
                    <span className="mr-2 text-primary">{idx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = userAns === opt.key;
                      const showResult = quizSubmitted;
                      const isRightOpt = opt.key === q.answer;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer(q.id, opt.key)}
                          disabled={quizSubmitted}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                            !quizSubmitted && selected && "border-primary bg-primary/5",
                            !quizSubmitted && !selected && "border-border hover:border-primary/50 hover:bg-muted/30",
                            showResult && isRightOpt && "border-success bg-success/10 text-success",
                            showResult && selected && !isRightOpt && "border-destructive bg-destructive/10 text-destructive",
                            showResult && !selected && !isRightOpt && "border-border opacity-60",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                              showResult && isRightOpt && "bg-success text-success-foreground",
                              showResult && selected && !isRightOpt && "bg-destructive text-destructive-foreground",
                            )}
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={cn(
                        "mt-3 rounded-lg p-3 text-sm",
                        isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                      )}
                    >
                      <span className="font-semibold">{isCorrect ? "回答正确 ✓" : "回答错误 ✗"}</span>
                      <p className="mt-1 opacity-90">{q.analysis}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && (
            <Button onClick={submitQuiz} className="mt-6">
              提交答案
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function SceneIcon({ name }: { name: string }) {
  switch (name) {
    case "s1": // 水坝
      return (
        <svg viewBox="0 0 80 60" className="h-14 w-full">
          <polygon points="5,55 75,55 65,25 15,25" fill="#165DFF" opacity="0.3" stroke="#165DFF" strokeWidth="1.5" />
          <line x1="40" y1="25" x2="40" y2="55" stroke="#165DFF" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M 15 25 Q 25 15 40 20 Q 55 25 65 25" fill="none" stroke="#FF7D00" strokeWidth="1.5" />
        </svg>
      );
    case "s2": // 教室墙角
      return (
        <svg viewBox="0 0 80 60" className="h-14 w-full">
          <polygon points="10,50 40,40 70,50 70,10 40,5 10,15" fill="none" stroke="#165DFF" strokeWidth="1.5" />
          <line x1="40" y1="5" x2="40" y2="40" stroke="#FF7D00" strokeWidth="2" />
          <circle cx="40" cy="22" r="2" fill="#FF7D00" />
        </svg>
      );
    case "s3": // 书本
      return (
        <svg viewBox="0 0 80 60" className="h-14 w-full">
          <polygon points="10,50 35,10 40,12 40,52" fill="#165DFF" opacity="0.3" stroke="#165DFF" strokeWidth="1.5" />
          <polygon points="70,50 45,10 40,12 40,52" fill="#FF7D00" opacity="0.3" stroke="#FF7D00" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="40" y2="52" stroke="#333" strokeWidth="1.5" />
        </svg>
      );
    case "s4": // 长方体
      return (
        <svg viewBox="0 0 80 60" className="h-14 w-full">
          <polygon points="15,45 45,55 65,40 65,15 35,5 15,20" fill="none" stroke="#165DFF" strokeWidth="1.5" />
          <line x1="35" y1="5" x2="35" y2="30" stroke="#165DFF" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="15" y1="20" x2="35" y2="30" stroke="#165DFF" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="35" y1="30" x2="65" y2="15" stroke="#165DFF" strokeWidth="1" />
          <line x1="35" y1="30" x2="45" y2="55" stroke="#FF7D00" strokeWidth="1.5" />
          <rect x="0" y="0" width="0" height="0" />
        </svg>
      );
    default:
      return null;
  }
}
