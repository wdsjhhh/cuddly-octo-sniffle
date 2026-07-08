import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X, ChevronDown, ChevronUp, Eraser, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module5;

export default function Module5Section() {
  const { addAnswer, setProgress, progress } = useCourse();

  // Basic level
  const [basicQuizAns, setBasicQuizAns] = useState<Record<string, string>>({});
  const [basicFillAns, setBasicFillAns] = useState<Record<string, string>>({});
  const [basicSubmitted, setBasicSubmitted] = useState(false);

  // Advanced level - proof fill
  const [proofAns, setProofAns] = useState<Record<string, string>>({});
  const [proofSubmitted, setProofSubmitted] = useState(false);

  // Hand draw
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawSubmitted, setDrawSubmitted] = useState(false);
  const [drawResult, setDrawResult] = useState<"pass" | "fail" | null>(null);
  const [drawFeedback, setDrawFeedback] = useState<string[]>([]);
  const strokesRef = useRef<{ x: number; y: number }[][]>([]);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Extension level
  const [hintIdx, setHintIdx] = useState(0);

  // Wrong questions
  const [wrongList, setWrongList] = useState<string[]>([]);
  const [showWrong, setShowWrong] = useState(false);

  const handleBasicQuiz = (qid: string, key: string) => {
    if (basicSubmitted) return;
    setBasicQuizAns((prev) => ({ ...prev, [qid]: key }));
  };

  const handleBasicFill = (qid: string, key: string, val: string) => {
    if (basicSubmitted) return;
    setBasicFillAns((prev) => ({ ...prev, [`${qid}_${key}`]: val }));
  };

  const submitBasic = () => {
    const allQuizAnswered = data.basicLevel.quizzes.every((q) => basicQuizAns[q.id]);
    const allFillAnswered = data.basicLevel.fillBlanks.every((fb) =>
      fb.blanks.every((b) => basicFillAns[`${fb.id}_${b.key}`]),
    );
    if (!allQuizAnswered || !allFillAnswered) {
      toast.warning("请完成所有题目");
      return;
    }
    setBasicSubmitted(true);
    const wrongs: string[] = [];
    data.basicLevel.quizzes.forEach((q) => {
      const correct = basicQuizAns[q.id] === q.answer;
      if (!correct) wrongs.push(q.question);
      addAnswer({
        moduleId: 5,
        questionId: q.id,
        userAnswer: basicQuizAns[q.id],
        correct,
        timestamp: Date.now(),
      });
    });
    data.basicLevel.fillBlanks.forEach((fb) => {
      const allCorrect = fb.blanks.every(
        (b) => basicFillAns[`${fb.id}_${b.key}`]?.trim() === b.answer,
      );
      if (!allCorrect) wrongs.push(fb.question);
      addAnswer({
        moduleId: 5,
        questionId: fb.id,
        userAnswer: JSON.stringify(basicFillAns),
        correct: allCorrect,
        timestamp: Date.now(),
      });
    });
    setWrongList(wrongs);
    toast.success(`基础层完成！错题 ${wrongs.length} 道`);
    setProgress(Math.max(progress, 75));
  };

  const handleProofAns = (key: string, val: string) => {
    if (proofSubmitted) return;
    setProofAns((prev) => ({ ...prev, [key]: val }));
  };

  const submitProof = () => {
    const steps = data.advancedLevel.proofFillBlanks.steps.filter((s) => s.blankKey && s.options);
    const allFilled = steps.every((s) => proofAns[s.blankKey!]);
    if (!allFilled) {
      toast.warning("请完成所有填空");
      return;
    }
    setProofSubmitted(true);
    const allCorrect = steps.every((s) => proofAns[s.blankKey!] === s.answer);
    addAnswer({
      moduleId: 5,
      questionId: "advanced-proof",
      userAnswer: JSON.stringify(proofAns),
      correct: allCorrect,
      timestamp: Date.now(),
    });
    if (allCorrect) {
      toast.success("证明全部正确！");
    } else {
      toast.error("有错误，再检查一下");
    }
  };

  const isProofCorrect = (key: string) => {
    const step = data.advancedLevel.proofFillBlanks.steps.find((s) => s.blankKey === key);
    return step && proofAns[key] === step.answer;
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background dihedral angle
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Bottom plane α
    ctx.fillStyle = "rgba(22, 93, 255, 0.08)";
    ctx.strokeStyle = "#165DFF";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, h - 30);
    ctx.lineTo(w - 30, h - 30);
    ctx.lineTo(w - 60, h - 60);
    ctx.lineTo(60, h - 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top plane β (at 60 deg)
    ctx.fillStyle = "rgba(255, 125, 0, 0.08)";
    ctx.strokeStyle = "#FF7D00";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h - 30);
    ctx.lineTo(w / 2 + 80, h - 30);
    ctx.lineTo(w / 2 + 40, h - 130);
    ctx.lineTo(w / 2 - 40, h - 130);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Edge l
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h - 30);
    ctx.lineTo(w / 2 + 80, h - 30);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#165DFF";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("α", w - 50, h - 35);
    ctx.fillStyle = "#FF7D00";
    ctx.fillText("β", w / 2 + 50, h - 120);
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText("棱 l", w / 2 + 85, h - 25);
  }, []);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    x *= canvas.width / rect.width;
    y *= canvas.height / rect.height;
    return { x, y };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (drawSubmitted) return;
    setIsDrawing(true);
    const p = getCanvasPoint(e);
    currentStrokeRef.current = [p];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#F53F3F";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
  };

  const stopDraw = () => {
    if (isDrawing && currentStrokeRef.current.length > 1) {
      strokesRef.current.push([...currentStrokeRef.current]);
    }
    currentStrokeRef.current = [];
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const p = getCanvasPoint(e);
    currentStrokeRef.current.push(p);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const clearCanvas = () => {
    setDrawSubmitted(false);
    setDrawResult(null);
    setDrawFeedback([]);
    strokesRef.current = [];
    currentStrokeRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Redraw background
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgba(22, 93, 255, 0.08)";
    ctx.strokeStyle = "#165DFF";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, h - 30);
    ctx.lineTo(w - 30, h - 30);
    ctx.lineTo(w - 60, h - 60);
    ctx.lineTo(60, h - 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 125, 0, 0.08)";
    ctx.strokeStyle = "#FF7D00";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h - 30);
    ctx.lineTo(w / 2 + 80, h - 30);
    ctx.lineTo(w / 2 + 40, h - 130);
    ctx.lineTo(w / 2 - 40, h - 130);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h - 30);
    ctx.lineTo(w / 2 + 80, h - 30);
    ctx.stroke();

    ctx.fillStyle = "#165DFF";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("α", w - 50, h - 35);
    ctx.fillStyle = "#FF7D00";
    ctx.fillText("β", w / 2 + 50, h - 120);
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText("棱 l", w / 2 + 85, h - 25);
  };

  const analyzeDrawing = (): { pass: boolean; feedback: string[] } => {
    const canvas = canvasRef.current;
    if (!canvas) return { pass: false, feedback: ["无法获取画布信息"] };
    const w = canvas.width;
    const h = canvas.height;
    const edgeY = h - 30; // 棱 l 的 y 坐标
    const edgeLeft = w / 2 - 80;
    const edgeRight = w / 2 + 80;
    const tolerance = 15; // 像素容差

    const strokes = strokesRef.current;
    const feedback: string[] = [];

    if (strokes.length < 2) {
      feedback.push("❌ 请画出两条射线（从棱出发分别在两个面内）");
      return { pass: false, feedback };
    }

    // 分析每条笔画：起点、终点、方向
    const strokeInfos = strokes.map((stroke, idx) => {
      const start = stroke[0];
      const end = stroke[stroke.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      // 判断哪一端在棱上（更接近 edgeY）
      const startOnEdge = Math.abs(start.y - edgeY) < tolerance && start.x >= edgeLeft - tolerance && start.x <= edgeRight + tolerance;
      const endOnEdge = Math.abs(end.y - edgeY) < tolerance && end.x >= edgeLeft - tolerance && end.x <= edgeRight + tolerance;
      const vertex = startOnEdge ? start : endOnEdge ? end : null;
      const otherEnd = startOnEdge ? end : endOnEdge ? start : null;
      return { idx, start, end, dx, dy, length, angle, startOnEdge, endOnEdge, vertex, otherEnd, hasVertexOnEdge: startOnEdge || endOnEdge };
    });

    // 1. 检查是否有两条线的端点在棱上
    const edgeStrokes = strokeInfos.filter((s) => s.hasVertexOnEdge);
    if (edgeStrokes.length < 2) {
      feedback.push("❌ 顶点应在棱 l 上，请确保两条线的端点都落在棱上");
    } else {
      feedback.push("✅ 顶点在棱 l 上");
    }

    // 2. 找顶点（两条线在棱上的公共点附近）
    let vertexOnEdge = false;
    let hasDownwardInAlpha = false;
    let hasUpwardInBeta = false;
    let angleValid = false;

    if (edgeStrokes.length >= 2) {
      // 取前两条在棱上有端点的线
      const s1 = edgeStrokes[0];
      const s2 = edgeStrokes[1];
      const v1 = s1.vertex!;
      const v2 = s2.vertex!;

      // 两个顶点是否接近（同一个顶点）
      const vertexDist = Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
      if (vertexDist < 50) {
        vertexOnEdge = true;
      } else {
        feedback.push("❌ 两条射线应从棱上同一点出发");
      }

      // 判断方向：一条向下（α面，垂直于棱=竖直向下），一条向上（β面）
      const dirs = [s1, s2].map((s) => {
        const v = s.vertex!;
        const o = s.otherEnd!;
        return { dx: o.x - v.x, dy: o.y - v.y, angle: Math.atan2(o.y - v.y, o.x - v.x) * (180 / Math.PI) };
      });

      // 向下的线：dy > 0，且接近竖直（角度约 90°±30°）
      const downward = dirs.filter((d) => d.dy > 20 && Math.abs(d.angle - 90) < 40);
      // 向上的线：dy < 0，且向左上方或右上方
      const upward = dirs.filter((d) => d.dy < -20);

      if (downward.length >= 1) {
        hasDownwardInAlpha = true;
        feedback.push("✅ 一条边在 α 面内且垂直于棱");
      } else {
        feedback.push("❌ 缺少在 α 面内垂直于棱的边（应竖直向下）");
      }

      if (upward.length >= 1) {
        hasUpwardInBeta = true;
        feedback.push("✅ 一条边在 β 面内");
      } else {
        feedback.push("❌ 缺少在 β 面内的边（应向上延伸）");
      }

      // 检查角度是否合理（30°~150°之间）
      if (dirs.length >= 2) {
        let angleDiff = Math.abs(dirs[0].angle - dirs[1].angle);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        if (angleDiff > 20 && angleDiff < 170) {
          angleValid = true;
        }
      }
    }

    const pass = vertexOnEdge && hasDownwardInAlpha && hasUpwardInBeta && angleValid;

    if (pass) {
      feedback.push("🎉 平面角绘制正确！顶点在棱上，两边分别在两个面内且垂直于棱");
    } else if (strokes.length >= 2) {
      feedback.push("💡 提示：平面角需要从棱上同一点出发，在两个面内分别作垂直于棱的射线");
    }

    return { pass, feedback };
  };

  const submitDrawing = () => {
    if (strokesRef.current.length === 0) {
      toast.warning("请先在图上绘制平面角");
      return;
    }
    setDrawSubmitted(true);
    const result = analyzeDrawing();
    setDrawResult(result.pass ? "pass" : "fail");
    setDrawFeedback(result.feedback);
    if (result.pass) {
      toast.success("平面角绘制正确！");
    } else {
      toast.error("绘制有误，请查看反馈");
    }
  };

  return (
    <section id="module5" className="w-full py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            模块 5 · 练习
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">分层随堂练习</h2>
          <p className="mt-2 text-muted-foreground">基础 → 提升 → 拓展，层层递进巩固知识</p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="basic">基础层</TabsTrigger>
            <TabsTrigger value="advanced">提升层</TabsTrigger>
            <TabsTrigger value="extension">拓展层</TabsTrigger>
          </TabsList>

          {/* Basic Level */}
          <TabsContent value="basic">
            <div className="space-y-6">
              {data.basicLevel.quizzes.map((q, idx) => {
                const userAns = basicQuizAns[q.id];
                const isCorrect = userAns === q.answer;
                return (
                  <div key={q.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="mb-4 font-medium">
                      <span className="mr-2 text-primary">{idx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const selected = userAns === opt.key;
                        const showResult = basicSubmitted;
                        const isRightOpt = opt.key === q.answer;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleBasicQuiz(q.id, opt.key)}
                            disabled={basicSubmitted}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all",
                              !basicSubmitted && selected && "border-primary bg-primary/5",
                              !basicSubmitted && !selected && "border-border hover:border-primary/50",
                              showResult && isRightOpt && "border-success bg-success/10 text-success",
                              showResult && selected && !isRightOpt && "border-destructive bg-destructive/10 text-destructive",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                showResult && isRightOpt && "bg-success text-success-foreground",
                                showResult && selected && !isRightOpt && "bg-destructive text-destructive-foreground",
                              )}
                            >
                              {opt.key}
                            </span>
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                    {basicSubmitted && (
                      <div
                        className={cn(
                          "mt-3 rounded-lg p-3 text-sm",
                          isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                        )}
                      >
                        <span className="font-semibold">{isCorrect ? "正确 ✓" : "错误 ✗"}</span>
                        <p className="mt-1 opacity-90">{q.analysis}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Fill blanks */}
              {data.basicLevel.fillBlanks.map((fb) => (
                <div key={fb.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <p className="mb-4 font-medium">填空题：{fb.question}</p>
                  <div className="space-y-3">
                    {fb.blanks.map((b, i) => {
                      const val = basicFillAns[`${fb.id}_${b.key}`] || "";
                      const correct = val.trim() === b.answer;
                      return (
                        <div key={b.key} className="flex items-center gap-3">
                          <span className="w-16 shrink-0 text-sm">空{i + 1}：</span>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleBasicFill(fb.id, b.key, e.target.value)}
                            disabled={basicSubmitted}
                            className={cn(
                              "flex-1 rounded-lg border px-3 py-2 text-sm outline-none",
                              basicSubmitted
                                ? correct
                                  ? "border-success bg-success/10 text-success"
                                  : "border-destructive bg-destructive/10 text-destructive"
                                : "border-input focus:border-primary",
                            )}
                            placeholder="请输入"
                          />
                          {basicSubmitted && (
                            correct ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {basicSubmitted && (
                    <p className="mt-3 text-sm text-muted-foreground">解析：{fb.analysis}</p>
                  )}
                </div>
              ))}

              {!basicSubmitted && (
                <Button onClick={submitBasic}>提交基础层练习</Button>
              )}
            </div>
          </TabsContent>

          {/* Advanced Level */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              {/* Hand draw */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h4 className="mb-2 font-semibold">手绘平面角</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  {data.advancedLevel.handDraw.instruction}
                </p>
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  {data.advancedLevel.handDraw.criteria.map((c, i) => (
                    <span key={i} className="rounded-full bg-muted px-3 py-1">
                      ✓ {c}
                    </span>
                  ))}
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={250}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={clearCanvas}>
                    <Eraser className="mr-1 h-4 w-4" /> 清除重画
                  </Button>
                  <Button size="sm" onClick={submitDrawing} disabled={drawSubmitted}>
                    提交手绘
                  </Button>
                </div>
                {drawSubmitted && drawFeedback.length > 0 && (
                  <div
                    className={cn(
                      "mt-3 rounded-lg p-3 text-sm",
                      drawResult === "pass" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                    )}
                  >
                    <Lightbulb className="mr-1 inline h-4 w-4" />
                    <div className="mt-1 space-y-1">
                      {drawFeedback.map((f, i) => (
                        <p key={i}>{f}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Proof fill blanks */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h4 className="mb-2 font-semibold">
                  {data.advancedLevel.proofFillBlanks.title}
                </h4>
                <div className="mb-4 rounded-lg bg-muted/30 p-3 text-sm">
                  <strong>已知：</strong>
                  {data.advancedLevel.proofFillBlanks.problem}
                </div>
                <div className="space-y-2">
                  {data.advancedLevel.proofFillBlanks.steps.map((step, i) => (
                    <div
                      key={step.id}
                      className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span className="font-bold text-primary">{i + 1}.</span>
                      {step.blankKey && step.options ? (
                        <select
                          value={proofAns[step.blankKey] || ""}
                          onChange={(e) => handleProofAns(step.blankKey, e.target.value)}
                          disabled={proofSubmitted}
                          className={cn(
                            "rounded border px-2 py-1 text-sm outline-none",
                            proofSubmitted
                              ? isProofCorrect(step.blankKey)
                                ? "border-success bg-success/10 text-success"
                                : "border-destructive bg-destructive/10 text-destructive"
                              : "border-input focus:border-primary",
                          )}
                        >
                          <option value="">请选择</option>
                          {step.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <span className="flex-1">{step.text.replace("______", "")}</span>
                      {proofSubmitted && step.blankKey && step.options && (
                        isProofCorrect(step.blankKey) ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {!proofSubmitted && <Button onClick={submitProof}>提交证明</Button>}
                  {proofSubmitted && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setProofSubmitted(false);
                        setProofAns({});
                      }}
                    >
                      重做
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Extension Level */}
          <TabsContent value="extension">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h4 className="mb-2 font-semibold">{data.extensionLevel.title}</h4>
              <div className="mb-4 rounded-lg bg-muted/30 p-3 text-sm">
                <p className="font-medium">{data.extensionLevel.problem}</p>
              </div>

              <div className="space-y-2">
                {data.extensionLevel.hints.slice(0, hintIdx).map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-primary/5 p-3 text-sm text-primary"
                  >
                    💡 {hint}
                  </motion.div>
                ))}
              </div>

              {hintIdx < data.extensionLevel.hints.length && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setHintIdx(hintIdx + 1)}
                >
                  <Lightbulb className="mr-1 h-4 w-4" /> 查看提示 {hintIdx + 1}
                </Button>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                拓展题供学有余力的同学自行完成，不强制提交。
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Wrong questions summary */}
        {basicSubmitted && wrongList.length > 0 && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <button
              onClick={() => setShowWrong(!showWrong)}
              className="flex w-full items-center justify-between text-sm font-semibold text-destructive"
            >
              <span>本次错题 {wrongList.length} 道</span>
              {showWrong ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showWrong && (
              <ul className="mt-3 space-y-1 text-sm text-destructive/90">
                {wrongList.map((q, i) => (
                  <li key={i}>• {q}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
