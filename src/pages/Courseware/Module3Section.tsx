import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module3;

type LangMode = "text" | "graphic" | "symbol";

export default function Module3Section() {
  const { addAnswer, setProgress, progress } = useCourse();

  const [langMode, setLangMode] = useState<LangMode>("text");
  const [proofStep, setProofStep] = useState(0);
  const [showAuxLines, setShowAuxLines] = useState(false);
  const [proofAnswers, setProofAnswers] = useState<Record<string, string>>({});
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [activeFlowStep, setActiveFlowStep] = useState<number | null>(null);

  const handleProofAnswer = (key: string, val: string) => {
    if (proofSubmitted) return;
    setProofAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const submitProof = () => {
    const steps = data.tetrahedronExample.proofSteps.filter((s) => s.blankKey);
    const allFilled = steps.every((s) => proofAnswers[s.blankKey!]);
    if (!allFilled) {
      toast.warning("请完成所有填空");
      return;
    }
    setProofSubmitted(true);
    const allCorrect = steps.every((s) => proofAnswers[s.blankKey!] === s.answer);
    addAnswer({
      moduleId: 3,
      questionId: "tetrahedron-proof",
      userAnswer: JSON.stringify(proofAnswers),
      correct: allCorrect,
      timestamp: Date.now(),
    });
    if (allCorrect) {
      toast.success("证明全部正确！");
      setProgress(Math.max(progress, 50));
    } else {
      toast.error("有错误，再检查一下");
    }
  };

  const isProofCorrect = (key: string) => {
    const step = data.tetrahedronExample.proofSteps.find((s) => s.blankKey === key);
    return step && proofAnswers[key] === step.answer;
  };

  return (
    <section id="module3" className="w-full py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            模块 3 · 新知 2
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">面面垂直判定定理</h2>
          <p className="mt-2 text-muted-foreground">从长方体探究到定理证明，掌握"线面垂直 ⇒ 面面垂直"</p>
        </div>

        {/* Cuboid Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">一、长方体探究模型</h3>
          <p className="mb-6 text-muted-foreground">{data.cuboidModel.description}</p>

          <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-background p-6">
            <CuboidSVG />
          </div>

          <div className="rounded-lg bg-accent/10 p-4 text-accent-foreground">
            <Lightbulb className="mr-2 inline h-4 w-4" />
            <strong>探究结论：</strong>
            {data.cuboidModel.conclusion}
          </div>
        </motion.div>

        {/* Three Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">二、定理的三种语言</h3>

          <div className="mb-4 flex flex-wrap gap-2">
            {(["text", "graphic", "symbol"] as LangMode[]).map((mode) => (
              <Button
                key={mode}
                variant={langMode === mode ? "default" : "secondary"}
                size="sm"
                onClick={() => setLangMode(mode)}
              >
                {mode === "text" ? "文字语言" : mode === "graphic" ? "图形语言" : "符号语言"}
              </Button>
            ))}
          </div>

          <div className="min-h-[200px] rounded-xl bg-muted/30 p-6">
            {langMode === "text" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg leading-relaxed text-foreground"
              >
                <p className="font-medium">{data.threeLanguages.text}</p>
              </motion.div>
            )}
            {langMode === "graphic" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center"
              >
                <TheoremGraphicSVG />
              </motion.div>
            )}
            {langMode === "symbol" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center font-serif text-xl leading-loose text-foreground"
              >
                <p>a ⊥ α</p>
                <p>a ⊂ β</p>
                <p className="text-primary">⇒ α ⊥ β</p>
              </motion.div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              简记：{data.threeLanguages.shorthand}
            </span>
          </div>
        </motion.div>

        {/* Theorem Proof Step by Step */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">三、定理分步证明</h3>

          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setProofStep(Math.max(0, proofStep - 1))}
              disabled={proofStep === 0}
            >
              <ChevronLeft className="h-4 w-4" /> 上一步
            </Button>
            <span className="text-sm text-muted-foreground">
              {proofStep}/{data.theoremProof.length}
            </span>
            <Button
              size="sm"
              onClick={() => setProofStep(Math.min(data.theoremProof.length, proofStep + 1))}
              disabled={proofStep >= data.theoremProof.length}
            >
              下一步 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {data.theoremProof.slice(0, proofStep).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm",
                  i === proofStep - 1
                    ? "bg-primary/10 font-medium text-primary"
                    : "bg-muted/50 text-foreground",
                )}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tetrahedron Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-2 text-lg font-bold">四、例题：四面体</h3>
          <p className="mb-4 text-muted-foreground">{data.tetrahedronExample.title}</p>
          <div className="mb-4 rounded-lg bg-muted/30 p-3 text-sm">
            <strong>题目：</strong>
            {data.tetrahedronExample.problem}
          </div>

          <div className="mb-4 flex items-center justify-center rounded-xl bg-muted/20 p-4">
            <TetrahedronSVG showAux={showAuxLines} />
          </div>

          <Button variant="secondary" size="sm" onClick={() => setShowAuxLines(!showAuxLines)}>
            {showAuxLines ? "隐藏" : "作"}辅助线
          </Button>
          {showAuxLines && (
            <p className="mt-2 text-sm text-primary">
              辅助线：{data.tetrahedronExample.auxiliaryLines.join("、")}
            </p>
          )}

          {/* Proof fill in blanks */}
          <div className="mt-6">
            <h4 className="mb-3 font-semibold">证明步骤填空：</h4>
            <div className="space-y-2">
              {data.tetrahedronExample.proofSteps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm"
                >
                  <span className="font-bold text-primary">{i + 1}.</span>
                  {step.blankKey && step.options ? (
                    <select
                      value={proofAnswers[step.blankKey] || ""}
                      onChange={(e) => handleProofAnswer(step.blankKey, e.target.value)}
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

            <div className="mt-4 flex items-center gap-3">
              {!proofSubmitted && <Button onClick={submitProof}>提交证明</Button>}
              {proofSubmitted && (
                <Button variant="secondary" onClick={() => {
                  setProofSubmitted(false);
                  setProofAnswers({});
                }}>
                  重做
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Proof Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-6 text-lg font-bold">五、证明思路流程图</h3>

          <div className="flex flex-col items-center gap-2 md:flex-row md:items-stretch md:justify-center">
            {data.proofFlowchart.map((item, i) => (
              <div key={i} className="flex items-center gap-2 md:flex-col">
                <button
                  onClick={() => setActiveFlowStep(activeFlowStep === i ? null : i)}
                  className={cn(
                    "flex w-40 flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all",
                    activeFlowStep === i
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-background hover:border-primary/50",
                  )}
                >
                  <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="text-sm font-semibold">{item.step}</div>
                </button>
                {i < data.proofFlowchart.length - 1 && (
                  <ChevronRight className="hidden text-muted-foreground md:block" />
                )}
                {i < data.proofFlowchart.length - 1 && (
                  <ChevronRight className="rotate-90 text-muted-foreground md:hidden" />
                )}
              </div>
            ))}
          </div>

          {activeFlowStep !== null && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg bg-primary/5 p-4 text-center text-sm text-primary"
            >
              <strong>{data.proofFlowchart[activeFlowStep].step}：</strong>
              {data.proofFlowchart[activeFlowStep].description}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ========== SVG Components ==========

function CuboidSVG() {
  return (
    <svg viewBox="0 0 300 220" className="h-52 w-full max-w-sm">
      {/* Bottom face */}
      <polygon points="50,180 220,180 260,150 90,150" fill="rgba(22,93,255,0.1)" stroke="#165DFF" strokeWidth="1.5" />
      {/* Top face */}
      <polygon points="50,70 220,70 260,40 90,40" fill="rgba(255,125,0,0.1)" stroke="#FF7D00" strokeWidth="1.5" />
      {/* Left face ABB1A1 - highlighted */}
      <polygon
        points="50,70 50,180 90,150 90,40"
        fill="rgba(0,180,42,0.2)"
        stroke="#00B42A"
        strokeWidth="2"
      />
      {/* Right face */}
      <polygon points="220,70 220,180 260,150 260,40" fill="rgba(22,93,255,0.05)" stroke="#165DFF" strokeWidth="1" />
      {/* Front face */}
      <polygon points="50,180 220,180 220,70 50,70" fill="none" stroke="#165DFF" strokeWidth="1.5" />

      {/* AA1 - the perpendicular edge, highlighted */}
      <line x1="50" y1="70" x2="50" y2="180" stroke="#F53F3F" strokeWidth="3" />
      <text x="30" y="130" fill="#F53F3F" fontSize="11" fontWeight="bold">
        AA₁⊥底
      </text>

      {/* Labels */}
      <text x="40" y="195" fontSize="10" fill="#333">A</text>
      <text x="220" y="195" fontSize="10" fill="#333">B</text>
      <text x="265" y="155" fontSize="10" fill="#333">C</text>
      <text x="85" y="35" fontSize="10" fill="#333">A₁</text>
      <text x="215" y="65" fontSize="10" fill="#333">B₁</text>
    </svg>
  );
}

function TheoremGraphicSVG() {
  return (
    <svg viewBox="0 0 280 200" className="h-44 w-full max-w-xs">
      {/* Plane α (bottom, horizontal) */}
      <polygon
        points="30,160 250,160 220,130 60,130"
        fill="rgba(22,93,255,0.15)"
        stroke="#165DFF"
        strokeWidth="1.5"
      />
      <text x="240" y="155" fill="#165DFF" fontSize="14" fontWeight="bold">α</text>

      {/* Plane β (vertical, perpendicular) */}
      <polygon
        points="120,30 120,160 150,150 150,20"
        fill="rgba(255,125,0,0.15)"
        stroke="#FF7D00"
        strokeWidth="1.5"
      />
      <text x="155" y="30" fill="#FF7D00" fontSize="14" fontWeight="bold">β</text>

      {/* Line a (perpendicular to α, inside β) */}
      <line x1="135" y1="50" x2="135" y2="160" stroke="#F53F3F" strokeWidth="2.5" />
      <text x="140" y="100" fill="#F53F3F" fontSize="12" fontWeight="bold">a</text>

      {/* Right angle marks */}
      <path d="M 128 160 L 128 152 L 136 152" fill="none" stroke="#333" strokeWidth="1.5" />
      <path d="M 142 160 L 142 152 L 150 152" fill="none" stroke="#333" strokeWidth="1.5" />

      {/* Intersection line l */}
      <line x1="80" y1="145" x2="190" y2="145" stroke="#333" strokeWidth="1" strokeDasharray="4 3" />
      <text x="195" y="148" fontSize="11" fill="#333">l</text>
    </svg>
  );
}

function TetrahedronSVG({ showAux }: { showAux: boolean }) {
  // Tetrahedron ABSC with equilateral triangle faces
  // Base triangle ABC, apex S
  return (
    <svg viewBox="0 0 280 220" className="h-48 w-full max-w-xs">
      {/* Base triangle ABC */}
      <polygon
        points="60,180 220,180 140,100"
        fill="rgba(22,93,255,0.1)"
        stroke="#165DFF"
        strokeWidth="1.5"
      />

      {/* Apex S */}
      <circle cx="140" cy="40" r="3" fill="#FF7D00" />
      <text x="145" y="38" fontSize="11" fill="#FF7D00" fontWeight="bold">S</text>

      {/* Edges SA, SB, SC */}
      <line x1="140" y1="40" x2="60" y2="180" stroke="#333" strokeWidth="1.5" />
      <line x1="140" y1="40" x2="220" y2="180" stroke="#333" strokeWidth="1.5" />
      <line x1="140" y1="40" x2="140" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />

      {/* Auxiliary lines SD, AD */}
      {showAux && (
        <>
          {/* D is midpoint of BC */}
          <circle cx="140" cy="180" r="3" fill="#00B42A" />
          <text x="145" y="198" fontSize="11" fill="#00B42A" fontWeight="bold">D</text>

          {/* SD */}
          <line x1="140" y1="40" x2="140" y2="180" stroke="#00B42A" strokeWidth="2" strokeDasharray="5 3" />
          {/* AD */}
          <line x1="140" y1="100" x2="140" y2="180" stroke="#F53F3F" strokeWidth="2" />

          {/* Highlight plane SDA */}
          <polygon
            points="140,40 140,180 140,100"
            fill="rgba(0,180,42,0.1)"
            stroke="none"
          />
        </>
      )}

      {/* Labels */}
      <text x="45" y="195" fontSize="11" fill="#333">B</text>
      <text x="225" y="195" fontSize="11" fill="#333">C</text>
      <text x="130" y="95" fontSize="11" fill="#333">A</text>
    </svg>
  );
}
