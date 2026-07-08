import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Medal, Check, X, RefreshCw, BookOpen, Camera, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module6;

export default function Module6Section() {
  const { unlockBadge, badges, setProgress, progress, resetAll } = useCourse();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root", "n1", "n2", "n3"]));
  const [gameIdx, setGameIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [homeworkDone, setHomeworkDone] = useState<Set<string>>(new Set());
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const hasMasterProver = badges.find((b) => b.id === "master-prover")?.unlocked;

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setGameIdx(0);
    setGameScore(0);
    setShowAnalysis(false);
  };

  const answerGame = (ans: boolean) => {
    const q = data.challengeGame.questions[gameIdx];
    const correct = ans === q.answer;
    if (correct) setGameScore((s) => s + 1);
    setShowAnalysis(true);

    setTimeout(() => {
      if (gameIdx < data.challengeGame.questions.length - 1) {
        setGameIdx((i) => i + 1);
        setShowAnalysis(false);
      } else {
        setGameFinished(true);
        const finalScore = correct ? gameScore + 1 : gameScore;
        if (finalScore === data.challengeGame.questions.length && !hasMasterProver) {
          unlockBadge("master-prover");
          setShowBadgeModal(true);
          setProgress(Math.max(progress, 100));
        }
      }
    }, 1500);
  };

  const toggleHomework = (id: string) => {
    setHomeworkDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success("任务已标记完成");
      }
      return next;
    });
  };

  const handleRestart = () => {
    if (confirm("确定要重新学习吗？所有进度和勋章将被重置。")) {
      resetAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("已重置，重新开始学习！");
    }
  };

  const renderMindMapNode = (node: any, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className={cn(level > 0 && "ml-6")}>
        <button
          onClick={() => hasChildren && toggleNode(node.id)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
            level === 0
              ? "w-full bg-primary/10 font-semibold text-primary"
              : level === 1
                ? "w-full bg-muted/50 font-medium text-foreground hover:bg-muted"
                : "text-sm text-muted-foreground hover:text-foreground",
          )}
        >
          {hasChildren && (
            <ChevronDown
              className={cn("h-4 w-4 shrink-0 transition-transform", !isExpanded && "-rotate-90")}
            />
          )}
          {!hasChildren && <span className="w-4" />}
          <span>{node.label}</span>
        </button>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-1 space-y-1 border-l-2 border-border pl-2"
          >
            {node.children.map((child: any) => renderMindMapNode(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <section id="module6" className="w-full bg-muted/30 py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            模块 6 · 总结
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">课堂小结与课后任务</h2>
          <p className="mt-2 text-muted-foreground">梳理知识体系，检验学习成果</p>
        </div>

        {/* Mind Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">一、知识思维导图</h3>
          <p className="mb-4 text-sm text-muted-foreground">点击节点展开/收起子内容</p>

          <div className="space-y-2">
            {data.mindMap.map((node) => renderMindMapNode(node))}
          </div>
        </motion.div>

        {/* Challenge Game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">二、闯关小游戏</h3>
            <div className="flex items-center gap-2">
              <Medal className={cn("h-5 w-5", hasMasterProver ? "text-amber-500" : "text-muted-foreground grayscale")} />
              <span className="text-sm text-muted-foreground">
                「{data.challengeGame.badgeName}」勋章
              </span>
            </div>
          </div>

          {!gameStarted && !gameFinished && (
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 p-8 text-center">
              <div className="mb-4 text-5xl">🎯</div>
              <h4 className="mb-2 text-xl font-bold">判断题闯关</h4>
              <p className="mb-6 text-sm text-muted-foreground">
                共 {data.challengeGame.questions.length} 道判断题，全部答对解锁「证明能手」勋章！
              </p>
              <Button onClick={startGame} size="lg">
                开始挑战
              </Button>
            </div>
          )}

          {gameStarted && !gameFinished && (
            <div className="rounded-xl bg-muted/30 p-6">
              {/* Progress */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  第 {gameIdx + 1} / {data.challengeGame.questions.length} 题
                </span>
                <span className="font-semibold text-primary">得分：{gameScore}</span>
              </div>
              <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${((gameIdx) / data.challengeGame.questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <motion.div
                key={gameIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 rounded-lg bg-background p-5"
              >
                <p className="text-base font-medium leading-relaxed">
                  {data.challengeGame.questions[gameIdx].statement}
                </p>
              </motion.div>

              {/* Answer buttons */}
              {!showAnalysis ? (
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => answerGame(true)}
                  >
                    <Check className="mr-2 h-5 w-5" /> 正确
                  </Button>
                  <Button
                    className="flex-1 bg-destructive hover:bg-destructive/90"
                    onClick={() => answerGame(false)}
                  >
                    <X className="mr-2 h-5 w-5" /> 错误
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg p-4",
                    data.challengeGame.questions[gameIdx].answer
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  <p className="font-semibold">
                    {data.challengeGame.questions[gameIdx].answer ? "✓ 正确" : "✗ 错误"}
                  </p>
                  <p className="mt-1 text-sm opacity-90">
                    {data.challengeGame.questions[gameIdx].analysis}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {gameFinished && (
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 p-8 text-center">
              <div className="mb-4 text-5xl">
                {gameScore === data.challengeGame.questions.length ? "🏆" : "📚"}
              </div>
              <h4 className="mb-2 text-xl font-bold">
                {gameScore === data.challengeGame.questions.length
                  ? "全部答对！太厉害了！"
                  : `答对 ${gameScore} / ${data.challengeGame.questions.length} 题`}
              </h4>
              <p className="mb-6 text-sm text-muted-foreground">
                {gameScore === data.challengeGame.questions.length
                  ? "恭喜你解锁了「证明能手」勋章！"
                  : "再接再厉，多复习一下知识点吧！"}
              </p>
              <Button onClick={startGame} variant="secondary">
                <RefreshCw className="mr-2 h-4 w-4" /> 再玩一次
              </Button>
            </div>
          )}
        </motion.div>

        {/* Homework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">三、分层课后任务（三选一）</h3>

          <div className="space-y-3">
            {data.homework.map((hw) => {
              const done = homeworkDone.has(hw.id);
              const Icon =
                hw.level === "basic" ? BookOpen : hw.level === "practice1" ? PenTool : Camera;
              return (
                <button
                  key={hw.id}
                  onClick={() => toggleHomework(hw.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    done
                      ? "border-success bg-success/5"
                      : "border-border bg-background hover:border-primary/50 hover:shadow-sm",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                      done ? "bg-success text-success-foreground" : "bg-primary/10 text-primary",
                    )}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">{hw.title}</div>
                    <div className="text-sm text-muted-foreground">{hw.description}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Ending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground md:p-12"
        >
          <div className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h3 className="mb-3 text-2xl font-bold md:text-3xl">{data.ending.congratulation}</h3>
            <p className="mx-auto mb-6 max-w-xl text-sm text-primary-foreground/80 md:text-base">
              {data.ending.summary}
            </p>

            {/* Badge display */}
            <div className="mb-6 flex justify-center gap-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-3",
                    b.unlocked
                      ? "bg-white/20 backdrop-blur-sm"
                      : "bg-white/5 opacity-50 grayscale",
                  )}
                >
                  <Medal className={cn("h-8 w-8", b.unlocked ? "text-amber-300" : "text-white/50")} />
                  <span className="text-xs font-medium">{b.name}</span>
                </div>
              ))}
            </div>

            <Button variant="secondary" size="lg" onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> 重新学习
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Badge unlock modal */}
      <AnimatePresence>
        {showBadgeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full max-w-sm rounded-2xl bg-card p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto mb-4"
              >
                <Medal className="mx-auto h-20 w-20 text-amber-500" />
              </motion.div>
              <h3 className="mb-2 text-2xl font-bold">恭喜解锁！</h3>
              <p className="mb-1 text-xl font-bold text-amber-500">
                「{data.challengeGame.badgeName}」勋章
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                你已经掌握了面面垂直的判定，太棒了！
              </p>
              <Button onClick={() => setShowBadgeModal(false)} className="w-full">
                太棒了
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
