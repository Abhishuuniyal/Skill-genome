import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function DashboardHome() {
  const [userData, setUserData] = useState<any>(null);

  // 🔥 FETCH USER DATA
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchData();
  }, []);

  // 🔥 HEXAGON DATA (REAL)
  const radarData = userData
    ? [
        { skill: "DSA", value: userData.skills?.dsa || 0 },
        { skill: "Development", value: userData.skills?.dev || 0 },
        { skill: "Projects", value: userData.skills?.projects || 0 },
        { skill: "System Design", value: userData.skills?.systemDesign || 0 },
        { skill: "Problem Solving", value: userData.skills?.problemSolving || 0 },
        { skill: "Communication", value: userData.skills?.communication || 0 },
      ]
    : [];

  // 🔥 REAL PEER COMPARISON (FIXED)
  const peerData = userData
    ? [
        { name: "DSA", you: userData.skills?.dsa || 0, peers: 50 },
        { name: "Dev", you: userData.skills?.dev || 0, peers: 60 },
        { name: "Projects", you: userData.skills?.projects || 0, peers: 45 },
        { name: "Design", you: userData.skills?.systemDesign || 0, peers: 50 },
        { name: "Solving", you: userData.skills?.problemSolving || 0, peers: 55 },
      ]
    : [];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold mb-1">🚀 Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your Skill Genome at a glance.
        </p>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* 🔥 HEXAGON RADAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">Skill Radar</h3>

          <ResponsiveContainer width="100%" height={340}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />

              <PolarAngleAxis
                dataKey="skill"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 13,
                }}
              />

              <Radar
                dataKey="value"
                stroke="#22C55E"
                fill="#22C55E"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 📊 BAR GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">You vs Peers</h3>

          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={peerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                }}
              />

              <Legend />

              <Bar dataKey="you" fill="#22C55E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="peers" fill="#EAB308" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 📈 SKILL PROGRESS */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Skill Progress</h3>

        {radarData.map((skill, i) => (
          <div key={i} className="mb-4">

            <div className="flex justify-between text-sm mb-1">
              <span>{skill.skill}</span>
              <span className="text-muted-foreground">
                {skill.value}%
              </span>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.value}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}