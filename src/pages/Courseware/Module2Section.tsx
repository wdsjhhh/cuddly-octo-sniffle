import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module2;

export default function Module2Section() {
  const { addAnswer, setProgress, progress } = useCourse();

  // Dihedral angle slider
  const [angle, setAngle] = useState(60);
  const [showNotations, setShowNotations] = useState(false);

  // Plane angle steps
  const [planeStep, setPlaneStep] = useState(0);
  const [vertexPos, setVertexPos] = useState(50); // percentage along edge

  // Fill blank
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [fillSubmitted, setFillSubmitted] = useState(false);

  // Example active
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);
  const [activeSubQ, setActiveSubQ] = useState(0);

  // Mnemonic card index
  const [mnemonicIdx, setMnemonicIdx] = useState(0);

  const angleClassification = useMemo(() => {
    if (angle < 90) return { name: "锐二面角", color: "text-blue-500" };
    if (angle === 90) return { name: "直二面角", color: "text-success" };
    if (angle < 180) return { name: "钝二面角", color: "text-orange-500" };
    return { name: "平二面角", color: "text-purple-500" };
  }, [angle]);

  const handleFillChange = (key: string, val: string) => {
    if (fillSubmitted) return;
    setFillAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const submitFill = () => {
    const blanks = data.classroomFillBlank.blanks;
    const allFilled = blanks.every((b) => fillAnswers[b.key]);
    if (!allFilled) {
      toast.warning("请填写所有空");
      return;
    }
    setFillSubmitted(true);
    const allCorrect = blanks.every(
      (b) => fillAnswers[b.key].trim() === b.answer,
    );
    addAnswer({
      moduleId: 2,
      questionId: data.classroomFillBlank.id,
      userAnswer: JSON.stringify(fillAnswers),
      correct: allCorrect,
      timestamp: Date.now(),
    });
    if (allCorrect) {
      toast.success("全部正确！");
      setProgress(Math.max(progress, 30));
    } else {
      toast.error("有错误，再想想");
    }
  };

  const isFillCorrect = (key: string) => {
    const b = data.classroomFillBlank.blanks.find((x) => x.key === key);
    return b && fillAnswers[key]?.trim() === b.answer;
  };

  return (
    <section id="module2" className="w-full bg-muted/30 py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            模块 2 · 新知 1
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">二面角核心概念</h2>
          <p className="mt-2 text-muted-foreground">从定义到平面角，一步步掌握二面角</p>
        </div>

        {/* Dihedral Angle Definition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">一、二面角的定义</h3>
          <p className="mb-6 text-muted-foreground">{data.dihedralAngleDef.description}</p>

          {/* SVG dihedral angle */}
          <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-background p-4">
            <DihedralAngleSVG angle={angle} showNotations={showNotations} />
          </div>

          {/* Angle slider */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">开合角度</span>
              <span className={cn("text-lg font-bold", angleClassification.color)}>
                {angle}° · {angleClassification.name}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0°</span>
              <span className="text-success font-semibold">90° 直二面角</span>
              <span>180°</span>
            </div>
          </div>

          {angle === 90 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success"
            >
              <Lightbulb className="mr-2 inline h-4 w-4" />
              <strong>直二面角</strong>：平面角是直角的二面角叫做直二面角，此时两个平面互相垂直！
            </motion.div>
          )}

          <Button variant="secondary" onClick={() => setShowNotations(!showNotations)}>
            {showNotations ? "隐藏" : "查看"}三种记法
          </Button>

          {showNotations && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              {data.dihedralAngleDef.notations.map((n) => (
                <div key={n.label} className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                  <div className="text-xs text-muted-foreground">{n.label}</div>
                  <div className="mt-1 font-serif text-xl font-bold text-primary">{n.formula}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Plane Angle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">二、二面角的平面角（重难点）</h3>
          <p className="mb-6 text-muted-foreground">{data.planeAngle.description}</p>

          <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-background p-4">
            <PlaneAngleSVG step={planeStep} vertexPos={vertexPos} />
          </div>

          {/* Step controls */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPlaneStep(Math.max(0, planeStep - 1))}
              disabled={planeStep === 0}
            >
              <ChevronLeft className="h-4 w-4" /> 上一步
            </Button>
            <span className="text-sm text-muted-foreground">
              步骤 {planeStep}/{data.planeAngle.steps.length}
            </span>
            <Button
              size="sm"
              onClick={() => setPlaneStep(Math.min(data.planeAngle.steps.length, planeStep + 1))}
              disabled={planeStep >= data.planeAngle.steps.length}
            >
              下一步 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Step description */}
          {planeStep > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 rounded-lg bg-primary/5 p-3 text-sm text-primary"
            >
              <strong>第 {planeStep} 步：</strong>
              {data.planeAngle.steps[planeStep - 1]}
            </motion.div>
          )}

          {/* Vertex position slider (only when step >= 1) */}
          {planeStep >= 4 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">拖动顶点 O 沿棱移动</span>
                <span className="text-sm text-success">
                  ∠AOB = {angle}°（不变！）
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={vertexPos}
                onChange={(e) => setVertexPos(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <p className="mt-2 rounded-lg bg-success/10 p-2 text-center text-sm text-success">
                {data.planeAngle.conclusion}
              </p>
            </div>
          )}

          {/* Classifications */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.planeAngle.classifications.map((c) => (
              <div key={c.name} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <div className="text-xs text-muted-foreground">{c.range}</div>
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
              </div>
            ))}
          </div>

          {/* 易错点 */}
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <X className="h-4 w-4" /> 易错点提示
            </div>
            <p className="mt-1 text-sm text-destructive/90">{(data.planeAngle as any).易错点}</p>
          </div>
        </motion.div>

        {/* Classroom Fill Blank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">三、实景填空</h3>
          <p className="mb-4 text-muted-foreground">{data.classroomFillBlank.question}</p>

          <div className="mb-6 flex items-center justify-center rounded-xl bg-muted/30 p-4">
            <ClassroomCornerSVG />
          </div>

          <div className="space-y-3">
            {data.classroomFillBlank.blanks.map((b, i) => (
              <div key={b.key} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm font-medium">空{i + 1}：</span>
                <input
                  type="text"
                  value={fillAnswers[b.key] || ""}
                  onChange={(e) => handleFillChange(b.key, e.target.value)}
                  disabled={fillSubmitted}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 outline-none transition-colors",
                    fillSubmitted
                      ? isFillCorrect(b.key)
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                  placeholder="请输入答案"
                />
                {fillSubmitted && (
                  isFillCorrect(b.key) ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            {!fillSubmitted && <Button onClick={submitFill}>提交答案</Button>}
            {fillSubmitted && (
              <p className="text-sm text-muted-foreground">
                正确答案：{data.classroomFillBlank.blanks.map((b) => b.answer).join("、")}
              </p>
            )}
          </div>
          {fillSubmitted && (
            <p className="mt-2 text-sm text-muted-foreground">{data.classroomFillBlank.analysis}</p>
          )}
        </motion.div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">四、例题交互</h3>

          <div className="mb-4 flex flex-wrap gap-2">
            {data.examples.map((ex) => (
              <Button
                key={ex.id}
                variant={activeExample === ex.id ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  setActiveExample(activeExample === ex.id ? null : ex.id);
                  setExampleStep(0);
                  setActiveSubQ(0);
                }}
              >
                {ex.title}
              </Button>
            ))}
          </div>

          {activeExample && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              {(() => {
                const ex = data.examples.find((e) => e.id === activeExample);
                if (!ex) return null;
                const subQ = ex.subQuestions[activeSubQ];
                return (
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 font-medium text-foreground">{ex.description}</p>

                    {/* Sub-question tabs */}
                    {ex.subQuestions.length > 1 && (
                      <div className="mb-3 flex gap-2">
                        {ex.subQuestions.map((sq, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setActiveSubQ(i);
                              setExampleStep(0);
                            }}
                            className={cn(
                              "rounded-md px-3 py-1 text-sm transition-colors",
                              activeSubQ === i
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80",
                            )}
                          >
                            第{i + 1}问
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="mb-3 text-sm font-medium text-primary">问题：{subQ.question}</p>

                    <div className="mb-4 flex items-center justify-center rounded-lg bg-background p-3">
                      {ex.id === "ex1" ? (
                        <CubeExampleSVG step={exampleStep} />
                      ) : (
                        <PyramidExampleSVG step={exampleStep} subQ={activeSubQ} />
                      )}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setExampleStep(Math.max(0, exampleStep - 1))}
                        disabled={exampleStep === 0}
                      >
                        <ChevronLeft className="h-4 w-4" /> 上一步
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {exampleStep}/{subQ.steps.length}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setExampleStep(Math.min(subQ.steps.length, exampleStep + 1))}
                        disabled={exampleStep >= subQ.steps.length}
                      >
                        下一步 <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {subQ.steps.slice(0, exampleStep).map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-md bg-primary/5 px-3 py-2 text-sm"
                        >
                          <span className="mr-2 font-bold text-primary">{i + 1}.</span>
                          {s}
                        </motion.div>
                      ))}
                    </div>

                    {exampleStep >= subQ.steps.length && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 rounded-lg bg-success/10 p-3 text-center font-bold text-success"
                      >
                        答案：{subQ.answer}
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </motion.div>

        {/* Mnemonic Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">五、解题口诀</h3>
          <p className="mb-4 text-muted-foreground">记住这三步，二面角求解不再难</p>

          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${mnemonicIdx * 100}%)` }}
              >
                {data.mnemonicCards.map((card, i) => (
                  <div key={i} className="w-full shrink-0 p-6">
                    <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 p-8 text-center">
                      <div className="mb-3 text-5xl font-black text-primary">{card.title}</div>
                      <p className="text-base text-foreground/80">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setMnemonicIdx(Math.max(0, mnemonicIdx - 1))}
                disabled={mnemonicIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {data.mnemonicCards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMnemonicIdx(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      mnemonicIdx === i ? "w-6 bg-primary" : "w-2 bg-muted",
                    )}
                  />
                ))}
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setMnemonicIdx(Math.min(data.mnemonicCards.length - 1, mnemonicIdx + 1))}
                disabled={mnemonicIdx === data.mnemonicCards.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ========== SVG Components ==========

function DihedralAngleSVG({ angle, showNotations }: { angle: number; showNotations: boolean }) {
  const w = 400;
  const h = 250;
  const cx = w / 2;
  const cy = h * 0.6;
  const halfLen = 120;
  const rad = (angle * Math.PI) / 180;

  // Bottom plane (alpha) - flat
  const alphaLeft = { x: cx - halfLen, y: cy };
  const alphaRight = { x: cx + halfLen, y: cy };
  const alphaBack = { x: cx, y: cy - 40 };

  // Top plane (beta) - rotated by angle from the edge
  // Edge goes from front to back (z-axis), we see it from the side
  const betaTipY = cy - halfLen * Math.sin(rad);
  const betaTipX = cx + halfLen * Math.cos(rad);
  const betaBackY = cy - 40 * Math.cos(rad);
  const betaBackX = cx + 40 * Math.sin(rad);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full max-w-lg md:h-64">
      {/* Bottom plane α - parallelogram */}
      <polygon
        points={`${alphaLeft.x},${alphaLeft.y} ${cx},${alphaBack.y} ${alphaRight.x},${alphaRight.y} ${cx},${cy + 30}`}
        fill="rgba(22, 93, 255, 0.15)"
        stroke="#165DFF"
        strokeWidth="1.5"
      />

      {/* Top plane β - rotated */}
      <polygon
        points={`${cx},${cy} ${betaBackX},${betaBackY} ${betaTipX},${betaTipY} ${cx + 40},${cy + 30 * Math.sin(rad)}`}
        fill="rgba(255, 125, 0, 0.15)"
        stroke="#FF7D00"
        strokeWidth="1.5"
      />

      {/* Edge l - the line where planes meet */}
      <line
        x1={cx}
        y1={cy - 60}
        x2={cx}
        y2={cy + 50}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Angle arc */}
      <path
        d={`M ${cx + 30} ${cy} A 30 30 0 0 0 ${cx + 30 * Math.cos(rad)} ${cy - 30 * Math.sin(rad)}`}
        fill="none"
        stroke="#00B42A"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <text x={cx + 35} y={cy - 10} fill="#00B42A" fontSize="12" fontWeight="bold">
        {angle}°
      </text>

      {/* Labels */}
      {showNotations && (
        <>
          <text x={cx - 80} y={cy + 20} fill="#165DFF" fontSize="14" fontWeight="bold">
            α
          </text>
          <text x={cx + 60} y={betaTipY - 5} fill="#FF7D00" fontSize="14" fontWeight="bold">
            β
          </text>
          <text x={cx - 20} y={cy - 65} fill="#333" fontSize="12" fontWeight="bold">
            棱 l
          </text>
        </>
      )}
    </svg>
  );
}

function PlaneAngleSVG({ step, vertexPos }: { step: number; vertexPos: number }) {
  const w = 400;
  const h = 220;
  const edgeY = h * 0.65;
  const ox = (vertexPos / 100) * w * 0.6 + w * 0.2; // position along edge

  // Plane alpha (bottom)
  const alphaLeft = { x: 40, y: edgeY + 20 };
  const alphaRight = { x: 360, y: edgeY + 20 };
  const alphaBackL = { x: 80, y: edgeY - 20 };
  const alphaBackR = { x: 320, y: edgeY - 20 };

  // Plane beta (top, at 60 degrees)
  const angle = 60;
  const rad = (angle * Math.PI) / 180;
  const betaLen = 100;
  const betaTipY = edgeY - betaLen * Math.sin(rad);
  const betaTipX = ox + betaLen * Math.cos(rad);

  // OA in bottom plane (perpendicular to edge)
  const oaLen = 60;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-52 w-full max-w-lg">
      {/* Bottom plane α */}
      <polygon
        points={`${alphaLeft.x},${alphaLeft.y} ${alphaBackL.x},${alphaBackL.y} ${alphaBackR.x},${alphaBackR.y} ${alphaRight.x},${alphaRight.y}`}
        fill="rgba(22, 93, 255, 0.1)"
        stroke="#165DFF"
        strokeWidth="1"
        strokeDasharray={step >= 1 ? "none" : "3 2"}
      />

      {/* Edge l */}
      <line x1="60" y1={edgeY} x2="340" y2={edgeY} stroke="#333" strokeWidth="2" />
      <text x="345" y={edgeY + 5} fontSize="12" fill="#333">
        l
      </text>

      {/* Step 1: Point O on edge */}
      {step >= 1 && (
        <>
          <circle cx={ox} cy={edgeY} r="4" fill="#FF7D00" />
          <text x={ox - 15} y={edgeY + 20} fontSize="12" fill="#FF7D00" fontWeight="bold">
            O
          </text>
        </>
      )}

      {/* Step 2: OA in α, perpendicular to l */}
      {step >= 2 && (
        <>
          <line
            x1={ox}
            y1={edgeY}
            x2={ox}
            y2={edgeY + oaLen}
            stroke="#165DFF"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          {/* Right angle mark */}
          <path
            d={`M ${ox + 8} ${edgeY} L ${ox + 8} ${edgeY + 8} L ${ox} ${edgeY + 8}`}
            fill="none"
            stroke="#165DFF"
            strokeWidth="1"
          />
          <text x={ox + 10} y={edgeY + oaLen - 5} fontSize="12" fill="#165DFF" fontWeight="bold">
            A
          </text>
        </>
      )}

      {/* Step 3: OB in β, perpendicular to l */}
      {step >= 3 && (
        <>
          <line
            x1={ox}
            y1={edgeY}
            x2={betaTipX}
            y2={betaTipY}
            stroke="#FF7D00"
            strokeWidth="2"
          />
          <text x={betaTipX + 5} y={betaTipY} fontSize="12" fill="#FF7D00" fontWeight="bold">
            B
          </text>
          {/* Right angle mark on beta side */}
          <circle cx={ox + 8 * Math.cos(rad / 2)} cy={edgeY - 8 * Math.sin(rad / 2)} r="1.5" fill="#FF7D00" />
        </>
      )}

      {/* Step 4: Angle AOB highlighted */}
      {step >= 4 && (
        <>
          <path
            d={`M ${ox + 20} ${edgeY + 0} A 20 20 0 0 0 ${ox + 20 * Math.cos(rad)} ${edgeY - 20 * Math.sin(rad)}`}
            fill="none"
            stroke="#00B42A"
            strokeWidth="2.5"
          />
          <text x={ox + 25} y={edgeY - 5} fontSize="11" fill="#00B42A" fontWeight="bold">
            ∠AOB
          </text>
          {/* Beta plane top surface */}
          <polygon
            points={`${ox},${edgeY} ${ox - 80},${edgeY - 30} ${betaTipX - 80},${betaTipY - 30} ${betaTipX},${betaTipY}`}
            fill="rgba(255, 125, 0, 0.1)"
            stroke="#FF7D00"
            strokeWidth="1"
          />
        </>
      )}
    </svg>
  );
}

function ClassroomCornerSVG() {
  return (
    <svg viewBox="0 0 300 200" className="h-40 w-full max-w-xs">
      {/* Floor */}
      <polygon points="20,180 150,150 280,180 150,210" fill="rgba(22,93,255,0.1)" stroke="#165DFF" strokeWidth="1.5" />
      {/* Left wall */}
      <polygon points="20,180 150,150 150,30 20,60" fill="rgba(255,125,0,0.1)" stroke="#FF7D00" strokeWidth="1.5" />
      {/* Right wall */}
      <polygon points="280,180 150,150 150,30 280,60" fill="rgba(0,180,42,0.1)" stroke="#00B42A" strokeWidth="1.5" />
      {/* Corner edge (棱) */}
      <line x1="150" y1="30" x2="150" y2="150" stroke="#F53F3F" strokeWidth="3" />
      <text x="155" y="90" fill="#F53F3F" fontSize="12" fontWeight="bold">
        棱
      </text>
      {/* Right angle indicator */}
      <path d="M 150 155 L 160 155 L 160 145" fill="none" stroke="#F53F3F" strokeWidth="1.5" />
      <text x="165" y="170" fill="#F53F3F" fontSize="11">
        90°
      </text>
    </svg>
  );
}

function CubeExampleSVG({ step }: { step: number }) {
  // Cube ABCD-A1B1C1D1, looking for dihedral angle A-BC-A1
  // BC is the edge (front right vertical edge)
  // ABA1 is the plane angle
  return (
    <svg viewBox="0 0 280 220" className="h-44 w-full max-w-xs">
      {/* Bottom face ABCD */}
      <polygon
        points="60,180 180,180 220,150 100,150"
        fill="rgba(22,93,255,0.1)"
        stroke="#165DFF"
        strokeWidth="1"
      />
      {/* Top face A1B1C1D1 */}
      <polygon
        points="60,80 180,80 220,50 100,50"
        fill="rgba(255,125,0,0.1)"
        stroke="#FF7D00"
        strokeWidth="1"
      />
      {/* Vertical edges */}
      <line x1="60" y1="80" x2="60" y2="180" stroke="#333" strokeWidth="1" />
      <line x1="100" y1="50" x2="100" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="220" y1="50" x2="220" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />
      {/* Edge BC - highlighted when step >= 1 */}
      <line
        x1="180"
        y1="80"
        x2="180"
        y2="180"
        stroke={step >= 1 ? "#F53F3F" : "#333"}
        strokeWidth={step >= 1 ? "3" : "1.5"}
      />

      {/* Front face ABB1A1 (plane ABA1) */}
      {step >= 2 && (
        <polygon
          points="60,80 180,80 180,180 60,180"
          fill="rgba(0,180,42,0.15)"
          stroke="#00B42A"
          strokeWidth="1.5"
        />
      )}

      {/* Angle ABA1 */}
      {step >= 3 && (
        <>
          <path
            d="M 180 160 Q 160 160 160 140"
            fill="none"
            stroke="#F53F3F"
            strokeWidth="2"
          />
          <text x="145" y="155" fill="#F53F3F" fontSize="11" fontWeight="bold">
            45°
          </text>
        </>
      )}

      {/* Labels */}
      <text x="50" y="195" fontSize="11" fill="#333">A</text>
      <text x="185" y="195" fontSize="11" fill="#333">B</text>
      <text x="225" y="155" fontSize="11" fill="#333">C</text>
      <text x="90" y="45" fontSize="11" fill="#333">A₁</text>
      <text x="175" y="75" fontSize="11" fill="#333">B₁</text>
    </svg>
  );
}

function PyramidExampleSVG({ step, subQ }: { step: number; subQ: number }) {
  // Square ABCD with PA perpendicular to plane ABCD
  return (
    <svg viewBox="0 0 280 220" className="h-44 w-full max-w-xs">
      {/* Base square ABCD */}
      <polygon
        points="60,180 200,180 230,150 90,150"
        fill="rgba(22,93,255,0.1)"
        stroke="#165DFF"
        strokeWidth="1.5"
      />
      {/* Point P */}
      <circle cx="60" cy="80" r="3" fill="#FF7D00" />
      <text x="45" y="75" fontSize="11" fill="#FF7D00" fontWeight="bold">P</text>

      {/* PA - perpendicular */}
      <line
        x1="60"
        y1="80"
        x2="60"
        y2="180"
        stroke="#FF7D00"
        strokeWidth="2"
        strokeDasharray={subQ === 1 && step >= 2 ? "5 3" : "solid"}
      />

      {/* PB */}
      <line x1="60" y1="80" x2="200" y2="180" stroke="#333" strokeWidth="1" />
      {/* PC */}
      <line x1="60" y1="80" x2="230" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />
      {/* PD */}
      <line x1="60" y1="80" x2="90" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />

      {/* Highlight plane PAB for subQ 0 */}
      {subQ === 0 && step >= 1 && (
        <polygon
          points="60,80 200,180 60,180"
          fill="rgba(0,180,42,0.15)"
          stroke="#00B42A"
          strokeWidth="1.5"
        />
      )}

      {/* Highlight plane PBC for subQ 1 */}
      {subQ === 1 && step >= 1 && (
        <polygon
          points="60,80 200,180 230,150"
          fill="rgba(255,125,0,0.15)"
          stroke="#FF7D00"
          strokeWidth="1.5"
        />
      )}

      {/* Right angle mark at A for subQ 0 */}
      {subQ === 0 && step >= 2 && (
        <path d="M 70 180 L 70 170 L 60 170" fill="none" stroke="#00B42A" strokeWidth="2" />
      )}

      {/* Labels */}
      <text x="50" y="195" fontSize="11" fill="#333">A</text>
      <text x="205" y="195" fontSize="11" fill="#333">B</text>
      <text x="235" y="155" fontSize="11" fill="#333">C</text>
      <text x="80" y="145" fontSize="11" fill="#333">D</text>
    </svg>
  );
}
