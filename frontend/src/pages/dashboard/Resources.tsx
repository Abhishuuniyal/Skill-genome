import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from "lucide-react";
import { useState } from "react";

const categories = ["All", "DSA Practice", "System Design", "Project Ideas", "Interview Prep"];

const resources = [
  { title: "LeetCode 150", category: "DSA Practice", difficulty: "Medium", time: "40 hrs", desc: "Curated list of LeetCode problems." },
  { title: "System Design Primer", category: "System Design", difficulty: "Hard", time: "20 hrs", desc: "Learn scalable system design." },
  { title: "Full Stack Open", category: "Project Ideas", difficulty: "Medium", time: "60 hrs", desc: "Build modern full-stack apps." },
  { title: "Grokking the Interview", category: "Interview Prep", difficulty: "Medium", time: "30 hrs", desc: "Pattern-based problem solving." },
  { title: "LeetCode Patterns", category: "DSA Practice", difficulty: "Easy", time: "25 hrs", desc: "Common algorithm patterns." },
  { title: "Build a REST API", category: "Project Ideas", difficulty: "Easy", time: "15 hrs", desc: "End-to-end API project." },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-primary/10 text-primary",
  Medium: "bg-secondary/10 text-secondary",
  Hard: "bg-destructive/10 text-destructive",
};

export default function Resources() {
  const [previewMode, setPreviewMode] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="relative space-y-6">

      {/* 🔥 CONTENT (BLUR IF NOT PREVIEW) */}
      <div className={`${previewMode ? "" : "opacity-30 blur-sm"}`}>

        <div>
          <h1 className="text-2xl font-bold mb-1">Resources</h1>
          <p className="text-muted-foreground text-sm">
            Curated learning materials for your path.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} className="px-3 py-1.5 rounded-lg text-sm border border-border hover:border-primary/30 transition-colors">
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[r.difficulty]}`}>
                  {r.difficulty}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {r.time}
                </span>
              </div>

              <h3 className="font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{r.desc}</p>

              {/* 🔥 Only clickable in preview mode */}
              {previewMode && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelected(r)}
                >
                  <BookOpen className="w-4 h-4 mr-1" /> Preview
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔥 COMING SOON OVERLAY */}
      {!previewMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/5 backdrop-blur-md border border-border rounded-2xl px-8 py-6 text-center">

            <h2 className="text-2xl font-semibold mb-2">
              🚧 Coming Soon
            </h2>

            <p className="text-muted-foreground text-sm mb-4">
              Full feature will be available soon
            </p>

            {/* 🔥 PREVIEW BUTTON */}
            <Button onClick={() => setPreviewMode(true)}>
              👁 Preview
            </Button>

          </div>
        </div>
      )}

      {/* 🔥 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-card border border-border rounded-xl p-6 w-[90%] max-w-md">

            <h2 className="text-xl font-semibold mb-2">
              {selected.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              {selected.desc}
            </p>

            <p className="text-xs text-muted-foreground mb-4">
              ⏱ {selected.time} • {selected.difficulty}
            </p>

            <Button
              className="w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>

          </div>

        </div>
      )}

    </div>
  );
}