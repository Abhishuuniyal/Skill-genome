import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import {
  Dna,
  Sun,
  Moon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function CompanyDashboard() {
  const { theme, toggle } = useTheme();

  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Auth listener
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("Auth user:", user);
    });
  }, []);

  // ✅ FIXED API CALL (NO localhost)
  useEffect(() => {
    fetch("/api/auth/leaderboard")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  // 🎯 Tier logic
  const getTier = (score: number) => {
    if (score < 150) return "Beginner";
    if (score < 300) return "DSA Warrior";
    if (score < 500) return "Advanced";
    if (score < 800) return "Expert";
    return "Elite";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      case "Expert":
        return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "Advanced":
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case "DSA Warrior":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      default:
        return "text-green-400 bg-green-400/10 border-green-400/30";
    }
  };

  // 🎯 Convert backend → UI
  const candidates = users.map((u, index) => ({
    id: index,
    name: u.leetcodeId,
    role: "Software Engineer",
    score: u.score,
    tier: getTier(u.score),
    location: "India",
    projects: Math.floor(Math.random() * 10),
    verified: true,
    skills: {
      dsa: Math.min(u.score, 100),
      dev: Math.random() * 100,
      projects: Math.random() * 100,
      design: Math.random() * 100,
      solving: Math.random() * 100,
    },
  }));

  // 🔍 Search filter
  const filtered = candidates.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // 📊 Radar
  function CandidateRadar({ skills }: any) {
    const data = [
      { skill: "DSA", value: skills.dsa },
      { skill: "Dev", value: skills.dev },
      { skill: "Projects", value: skills.projects },
      { skill: "Design", value: skills.design },
      { skill: "Solving", value: skills.solving },
    ];

    return (
      <ResponsiveContainer width="100%" height={140}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <Radar
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* HEADER */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Dna className="w-6 h-6 text-primary" />
            Skill Genome
          </Link>

          <button onClick={toggle}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <div className="container py-8 space-y-6">
        
        {/* TITLE */}
        <h1 className="text-3xl font-bold">Talent Discovery</h1>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          className="p-2 rounded bg-muted w-full"
        />

        {/* CARDS */}
        <div className="grid lg:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              className="bg-card border p-5 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-bold">{c.name}</h3>
              <p className="text-sm">{c.role}</p>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-xl font-bold">{c.score}</span>
                <Badge className={getTierColor(c.tier)}>
                  {c.tier}
                </Badge>
              </div>

              <div className="mt-3">
                <CandidateRadar skills={c.skills} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}