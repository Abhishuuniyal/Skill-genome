import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, AlertTriangle, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };

    fetchData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  const skillsObj = userData.skills || {};

  // 🔥 Radar data
  const radarData = [
    { skill: "DSA", value: skillsObj.dsa || 0 },
    { skill: "Dev", value: skillsObj.dev || 0 },
    { skill: "Projects", value: skillsObj.projects || 0 },
    { skill: "Design", value: skillsObj.systemDesign || 0 },
    { skill: "Solving", value: skillsObj.problemSolving || 0 },
    { skill: "Comm", value: skillsObj.communication || 0 },
  ];

  // 🔥 Score (TS SAFE)
  const values = Object.values(skillsObj).map((v) => Number(v)) as number[];

  const score =
    values.length > 0
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;

  // 🔥 Convert to array
  const skillArray = Object.entries(skillsObj).map(([key, value]) => ({
    name: key,
    value: Number(value),
  }));

  // 🔥 Sort
  const sorted = [...skillArray].sort((a, b) => b.value - a.value);

  // ✅ Top 3 strengths
  const strengths = sorted.slice(0, 3);

  // ✅ Weak skills (<50)
  const weak = skillArray.filter((s) => s.value < 50);

  // 🔥 Name mapping
  const nameMap: Record<string, string> = {
    dsa: "DSA",
    dev: "Development",
    projects: "Projects",
    systemDesign: "System Design",
    problemSolving: "Problem Solving",
    communication: "Communication",
  };

  // 🚀 Roadmap suggestions
  const roadmap: Record<string, string> = {
    dsa: "Practice LeetCode daily (Arrays + DP)",
    dev: "Build full-stack projects (React + Node)",
    projects: "Add 2 strong resume projects",
    systemDesign: "Learn HLD basics (Scalability, APIs)",
    problemSolving: "Do timed contests weekly",
    communication: "Practice mock interviews",
  };

  // 🤖 AI suggestion
  const aiSuggestion =
    score > 75
      ? "You're almost placement ready 🚀 Start applying to product companies."
      : score > 60
      ? "Good progress 👍 Focus on weak areas to reach top tier."
      : "You need improvement ⚡ Focus on fundamentals & consistency.";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Your Skill Genome overview.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* SCORE */}
        <motion.div className="bg-card border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-5xl font-bold text-primary mb-2">{score}</p>
          <p className="text-sm text-muted-foreground">Genome Score</p>
          <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
        </motion.div>

        {/* TOP 3 STRENGTHS */}
        <motion.div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Top Strengths</h3>
          </div>

          <ul className="space-y-2 text-sm">
            {strengths.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {nameMap[s.name] || s.name} ({s.value}%)
              </li>
            ))}
          </ul>
        </motion.div>

        {/* WEAK + ROADMAP */}
        <motion.div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold">Weak Areas</h3>
          </div>

          <ul className="space-y-3 text-sm">
            {weak.length > 0 ? (
              weak.map((s) => (
                <li key={s.name}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    {nameMap[s.name] || s.name} ({s.value}%)
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    👉 {roadmap[s.name]}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-muted-foreground">No weak areas 🎉</p>
            )}
          </ul>
        </motion.div>
      </div>

      {/* AI RECOMMENDATION */}
      <motion.div className="bg-card border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">AI Recommendation</h3>
        </div>
        <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
      </motion.div>

      {/* RADAR */}
      <motion.div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Full Skill Genome</h3>

        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />

            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />

            <Radar
              dataKey="value"
              stroke="#22C55E"
              fill="#22C55E"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}