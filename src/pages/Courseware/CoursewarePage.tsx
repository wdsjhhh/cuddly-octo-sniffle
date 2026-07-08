import { useEffect, useRef } from "react";
import { CourseProvider, useCourse } from "@/context/CourseContext";
import FloatingSidebar from "@/components/FloatingSidebar";
import Module1Section from "./Module1Section";
import Module2Section from "./Module2Section";
import Module3Section from "./Module3Section";
import Module4Section from "./Module4Section";
import Module5Section from "./Module5Section";
import Module6Section from "./Module6Section";
import { MOCK_SPA_MODULES } from "@/data/spa";
import { Toaster } from "@/components/ui/sonner";

function CoursewareContent() {
  const { setActiveModule, setProgress, progress } = useCourse();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Track active module via scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-module"));
            if (!isNaN(idx)) {
              setActiveModule(idx);
              // Update progress based on module viewed
              const newProgress = Math.max(progress, (idx / 6) * 100);
              if (newProgress > progress) {
                setProgress(newProgress);
              }
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" },
    );

    const sections = document.querySelectorAll("[data-module]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [setActiveModule, setProgress, progress]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingSidebar />
      <Toaster position="top-center" />
      <main>
        <div data-module="1">
          <Module1Section />
        </div>
        <div data-module="2">
          <Module2Section />
        </div>
        <div data-module="3">
          <Module3Section />
        </div>
        <div data-module="4">
          <Module4Section />
        </div>
        <div data-module="5">
          <Module5Section />
        </div>
        <div data-module="6">
          <Module6Section />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground md:px-6">
          <p>高中数学必修第二册 · 8.6.3 平面与平面垂直（第一课时）</p>
          <p className="mt-1 text-xs">交互式 H5 微课课件</p>
        </div>
      </footer>
    </div>
  );
}

export default function CoursewarePage() {
  return (
    <CourseProvider>
      <CoursewareContent />
    </CourseProvider>
  );
}
