import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function Roadmap() {
  const [userData, setUserData] = useState<any>(null);
  const [taskStates, setTaskStates] = useState<any>({});

  // 🔥 Fetch user
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };

    fetchData();
  }, []);

  // 🔥 Init tasks
  useEffect(() => {
    if (!userData) return;

    const s = userData.skills || {};

    const auto = {
      d1: s.dsa >= 40,
      d2: s.dsa >= 60,
      d3: s.dsa >= 80,

      a1: s.problemSolving >= 50,
      a2: s.problemSolving >= 65,
      a3: s.problemSolving >= 80,

      p1: s.projects >= 40,
      p2: s.projects >= 60,
      p3: s.projects >= 80,

      sd1: s.systemDesign >= 40,
      sd2: s.systemDesign >= 60,
      sd3: s.systemDesign >= 75,
    };

    const saved = JSON.parse(localStorage.getItem("roadmap") || "{}");

    setTaskStates({ ...auto, ...saved });
  }, [userData]);

  // 🔥 toggle
  const toggle = (id: string) => {
    const updated = { ...taskStates, [id]: !taskStates[id] };
    setTaskStates(updated);
    localStorage.setItem("roadmap", JSON.stringify(updated));
  };

  if (!userData) return <p>Loading...</p>;

  // 🔥 sections
  const sections = [
    {
      title: "DSA Fundamentals",
      tasks: [
        { label: "Arrays & Strings", id: "d1" },
        { label: "Linked Lists", id: "d2" },
        { label: "Stacks & Queues", id: "d3" },
      ],
    },
    {
      title: "Intermediate Algorithms",
      tasks: [
        { label: "Binary Search", id: "a1" },
        { label: "Two Pointers", id: "a2" },
        { label: "Sliding Window", id: "a3" },
      ],
    },
    {
      title: "Projects",
      tasks: [
        { label: "Basic Project", id: "p1" },
        { label: "Full Stack Project", id: "p2" },
        { label: "Advanced Project", id: "p3" },
      ],
    },
    {
      title: "System Design",
      tasks: [
        { label: "Basics", id: "sd1" },
        { label: "Scalability", id: "sd2" },
        { label: "Advanced Concepts", id: "sd3" },
      ],
    },
  ];

  // 🔥 section status
  const getStatus = (tasks: any[]) => {
    const done = tasks.filter((t) => taskStates[t.id]).length;
    if (done === tasks.length) return "completed";
    if (done > 0) return "progress";
    return "pending";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Roadmap</h1>
        <p className="text-muted-foreground text-sm">
          Your personalized learning path.
        </p>
      </div>

      <div className="relative">
        {/* 🔥 vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-border" />

        <div className="space-y-10">
          {sections.map((sec, i) => {
            const status = getStatus(sec.tasks);

            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative pl-14"
              >
                {/* 🔥 NODE */}
                <div
                  className={`absolute left-2 top-2 w-6 h-6 rounded-full flex items-center justify-center border-2
                  ${
                    status === "completed"
                      ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/40"
                      : status === "progress"
                      ? "border-green-500 bg-green-500/10"
                      : "bg-muted border-border"
                  }`}
                >
                  {status === "completed" && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* 🔥 CARD */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {sec.title}
                  </h3>

                  <div className="space-y-2">
                    {sec.tasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => toggle(t.id)}
                        className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-muted/40"
                      >
                        {taskStates[t.id] ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}

                        <span
                          className={
                            taskStates[t.id]
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}