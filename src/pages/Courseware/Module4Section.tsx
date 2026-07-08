import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_COURSE_CONTENT } from "@/data/coursecontent";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Medal, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCourse } from "@/context/CourseContext";

const data = MOCK_COURSE_CONTENT.module4;

export default function Module4Section() {
  const { unlockBadge, badges, setProgress, progress } = useCourse();
  const [angle, setAngle] = useState(120);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasMasterDrawer = badges.find((b) => b.id === "master-drawer")?.unlocked;

  // Check task completion on angle change
  useEffect(() => {
    data.origamiTask.tasks.forEach((task, idx) => {
      if (!completedTasks.has(idx)) {
        if (Math.abs(angle - task.angle) <= task.tolerance) {
          setCompletedTasks((prev) => {
            const next = new Set(prev);
            next.add(idx);
            return next;
          });
          toast.success(`精准！折出了 ${task.angle}°`);
        }
      }
    });
  }, [angle, completedTasks]);

  // Unlock badge when all tasks done
  useEffect(() => {
    if (
      completedTasks.size === data.origamiTask.tasks.length &&
      !hasMasterDrawer
    ) {
      unlockBadge("master-drawer");
      setShowBadgeModal(true);
      setProgress(Math.max(progress, 65));
    }
  }, [completedTasks, hasMasterDrawer, unlockBadge, setProgress, progress]);

  // Draw paper on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.6;
    const paperW = w * 0.7;
    const paperH = paperW * 0.6;

    const rad = (angle * Math.PI) / 180;

    // Draw shadow
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + paperH * 0.3 + 5, paperW * 0.45, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bottom half (fixed, flat)
    ctx.save();
    const gradBottom = ctx.createLinearGradient(cx - paperW / 2, cy, cx + paperW / 2, cy + paperH / 2);
    gradBottom.addColorStop(0, "#FFF3E0");
    gradBottom.addColorStop(1, "#FFE0B2");
    ctx.fillStyle = gradBottom;
    ctx.strokeStyle = "#FF7D00";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(cx - paperW / 2, cy);
    ctx.lineTo(cx + paperW / 2, cy);
    ctx.lineTo(cx + paperW / 2 - 10, cy + paperH / 2);
    ctx.lineTo(cx - paperW / 2 + 10, cy + paperH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Paper texture lines
    ctx.strokeStyle = "rgba(255,125,0,0.2)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 5; i++) {
      const y = cy + (paperH / 2 / 5) * i;
      ctx.beginPath();
      ctx.moveTo(cx - paperW / 2 + (paperW / 10) * i, cy);
      ctx.lineTo(cx - paperW / 2 + 10 + (paperW / 10) * i, cy + paperH / 2);
      ctx.stroke();
    }
    ctx.restore();

    // Top half (folding) - drawn with perspective
    ctx.save();
    const gradTop = ctx.createLinearGradient(cx - paperW / 2, cy - paperH / 2, cx + paperW / 2, cy);
    gradTop.addColorStop(0, "#E3F2FD");
    gradTop.addColorStop(1, "#BBDEFB");
    ctx.fillStyle = gradTop;
    ctx.strokeStyle = "#165DFF";
    ctx.lineWidth = 1.5;

    // The fold angle: top paper rotates around the crease (cx line)
    // We simulate with vertical compression
    const compressRatio = Math.cos(rad);
    const topHeight = (paperH / 2) * Math.abs(compressRatio);
    const depth = (paperW / 2) * (1 - Math.abs(compressRatio)) * 0.3;

    ctx.beginPath();
    if (compressRatio >= 0) {
      // Folding forward (toward viewer)
      ctx.moveTo(cx - paperW / 2, cy);
      ctx.lineTo(cx - paperW / 2 + depth, cy - topHeight);
      ctx.lineTo(cx + paperW / 2 - depth, cy - topHeight);
      ctx.lineTo(cx + paperW / 2, cy);
    } else {
      // Folding backward
      ctx.moveTo(cx - paperW / 2, cy);
      ctx.lineTo(cx - paperW / 2 + depth, cy + topHeight * 0.3);
      ctx.lineTo(cx + paperW / 2 - depth, cy + topHeight * 0.3);
      ctx.lineTo(cx + paperW / 2, cy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Texture on top
    ctx.strokeStyle = "rgba(22,93,255,0.15)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 5; i++) {
      const t = i / 5;
      const y = cy - topHeight * t;
      const leftX = cx - paperW / 2 + depth * t;
      const rightX = cx + paperW / 2 - depth * t;
      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
    ctx.restore();

    // Crease line (棱)
    ctx.save();
    ctx.strokeStyle = "#F53F3F";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - paperW / 2, cy);
    ctx.lineTo(cx + paperW / 2, cy);
    ctx.stroke();
    ctx.restore();

    // Angle indicator
    ctx.save();
    ctx.strokeStyle = "#00B42A";
    ctx.fillStyle = "#00B42A";
    ctx.lineWidth = 2;
    const arcR = 40;
    ctx.beginPath();
    if (compressRatio >= 0) {
      ctx.arc(cx, cy, arcR, Math.PI, Math.PI + rad, false);
    } else {
      ctx.arc(cx, cy, arcR, 0, Math.PI - rad, false);
    }
    ctx.stroke();
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`${angle}°`, cx + arcR + 5, cy - 10);
    ctx.restore();

    // Label: 棱
    ctx.fillStyle = "#F53F3F";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("棱", cx + 5, cy + 18);
  }, [angle]);

  const nextSlide = () => {
    setCarouselIdx((prev) => (prev + 1) % data.realSceneCarousel.length);
  };

  const prevSlide = () => {
    setCarouselIdx((prev) => (prev - 1 + data.realSceneCarousel.length) % data.realSceneCarousel.length);
  };

  return (
    <section id="module4" className="w-full bg-muted/30 py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            模块 4 · 实操
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">虚拟折纸实操</h2>
          <p className="mt-2 text-muted-foreground">动手折一折，直观感受二面角的变化</p>
        </div>

        {/* Origami Task */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-2 text-lg font-bold">折纸任务</h3>
          <p className="mb-4 text-muted-foreground">{data.origamiTask.instruction}</p>

          {/* Task list */}
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {data.origamiTask.tasks.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3",
                  completedTasks.has(i)
                    ? "border-success bg-success/10"
                    : "border-border bg-muted/30",
                )}
              >
                <Target className={cn("h-5 w-5", completedTasks.has(i) ? "text-success" : "text-muted-foreground")} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{task.tip}</div>
                  <div className="text-xs text-muted-foreground">
                    目标 {task.angle}°（误差 ±{task.tolerance}°）
                  </div>
                </div>
                {completedTasks.has(i) && <Check className="h-5 w-5 text-success" />}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div className="mb-4 rounded-xl bg-gradient-to-b from-background to-muted/30 p-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={350}
              className="mx-auto w-full max-w-md"
            />
          </div>

          {/* Slider */}
          <div className="mb-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">折叠角度</span>
              <span className="text-xl font-bold text-primary">{angle}°</span>
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
              <span>0° 平展</span>
              <span className="text-success font-semibold">90° 垂直</span>
              <span>180° 对折</span>
            </div>
          </div>

          {/* Badge progress */}
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-amber-950/20">
            <div className="flex items-center gap-3">
              <Medal className={cn("h-8 w-8", hasMasterDrawer ? "text-amber-500" : "text-muted-foreground grayscale")} />
              <div>
                <div className="font-semibold text-foreground">
                  「{data.origamiTask.badgeName}」勋章
                </div>
                <div className="text-xs text-muted-foreground">
                  完成 {completedTasks.size}/{data.origamiTask.tasks.length} 个任务解锁
                </div>
              </div>
              {hasMasterDrawer && (
                <span className="ml-auto rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
                  已获得
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Real Scene Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="mb-4 text-lg font-bold">生活中的二面角</h3>

          <div className="relative overflow-hidden rounded-xl bg-muted/30">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
            >
              {data.realSceneCarousel.map((scene) => (
                <div key={scene.id} className="w-full shrink-0 p-6">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-4 flex h-40 w-full items-center justify-center rounded-lg bg-background">
                      <SceneIcon name={scene.id} />
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-foreground">{scene.name}</h4>
                    <p className="text-center text-sm text-muted-foreground">{scene.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {data.realSceneCarousel.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  carouselIdx === i ? "w-6 bg-primary" : "w-2 bg-muted",
                )}
              />
            ))}
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
              <h3 className="mb-2 text-2xl font-bold text-foreground">恭喜解锁！</h3>
              <p className="mb-1 text-xl font-bold text-amber-500">
                「{data.origamiTask.badgeName}」勋章
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                你已经掌握了二面角的折纸操作，继续加油！
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

function SceneIcon({ name }: { name: string }) {
  switch (name) {
    case "r1": // 屋顶
      return (
        <svg viewBox="0 0 160 120" className="h-28 w-full">
          {/* Roof */}
          <polygon points="20,60 80,20 140,60" fill="rgba(255,125,0,0.3)" stroke="#FF7D00" strokeWidth="2" />
          {/* House body */}
          <rect x="30" y="60" width="100" height="50" fill="rgba(22,93,255,0.1)" stroke="#165DFF" strokeWidth="2" />
          {/* Door */}
          <rect x="70" y="80" width="20" height="30" fill="rgba(22,93,255,0.2)" stroke="#165DFF" strokeWidth="1" />
          {/* Angle indicator */}
          <path d="M 80 45 L 80 60 L 100 60" fill="none" stroke="#00B42A" strokeWidth="2" strokeDasharray="3 2" />
          <text x="85" y="55" fontSize="10" fill="#00B42A" fontWeight="bold">二面角</text>
        </svg>
      );
    case "r2": // 文件夹
      return (
        <svg viewBox="0 0 160 120" className="h-28 w-full">
          {/* Back cover */}
          <rect x="20" y="20" width="120" height="80" rx="4" fill="rgba(22,93,255,0.2)" stroke="#165DFF" strokeWidth="2" />
          {/* Front cover (open) */}
          <polygon points="20,20 70,10 70,90 20,100" fill="rgba(255,125,0,0.3)" stroke="#FF7D00" strokeWidth="2" />
          {/* Spine */}
          <rect x="15" y="18" width="10" height="84" rx="2" fill="#165DFF" />
          {/* Angle arc */}
          <path d="M 40 60 A 20 20 0 0 1 55 45" fill="none" stroke="#F53F3F" strokeWidth="2" />
          <text x="55" y="55" fontSize="10" fill="#F53F3F" fontWeight="bold">θ</text>
        </svg>
      );
    case "r3": // 阶梯水坝
      return (
        <svg viewBox="0 0 160 120" className="h-28 w-full">
          {/* Dam body */}
          <polygon points="20,100 140,100 120,40 40,40" fill="rgba(22,93,255,0.2)" stroke="#165DFF" strokeWidth="2" />
          {/* Steps */}
          <line x1="50" y1="55" x2="110" y2="55" stroke="#165DFF" strokeWidth="1.5" />
          <line x1="60" y1="70" x2="100" y2="70" stroke="#165DFF" strokeWidth="1.5" />
          <line x1="70" y1="85" x2="90" y2="85" stroke="#165DFF" strokeWidth="1.5" />
          {/* Water */}
          <path d="M 20 45 Q 50 40 80 45 Q 110 50 140 45" fill="rgba(0,180,42,0.2)" stroke="#00B42A" strokeWidth="1.5" />
          {/* Angle */}
          <path d="M 120 70 L 130 70 L 125 55" fill="none" stroke="#FF7D00" strokeWidth="2" strokeDasharray="3 2" />
          <text x="125" y="65" fontSize="9" fill="#FF7D00">坡面角</text>
        </svg>
      );
    default:
      return null;
  }
}
