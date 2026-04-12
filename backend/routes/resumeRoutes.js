import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// ✅ SIMPLE MULTER (NO FILE FILTER BUG)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 Upload request received");
    console.log("FILE:", req.file); // 🔥 DEBUG

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // read file
    const buffer = fs.readFileSync(req.file.path);
    const data = await pdf(buffer);

    let text = data.text.toLowerCase();

    let score = 50;
    let strengths = [];
    let missingSkills = [];
    let improvements = [];

    // ==========================
    // SKILLS LIST
    // ==========================
    const skills = [
      "javascript", "react", "node", "mongodb",
      "java", "python", "c++", "sql",
      "docker", "aws", "git"
    ];

    const foundSkills = skills.filter(skill => text.includes(skill));
    score += foundSkills.length * 4;

    // ==========================
    // STRENGTHS
    // ==========================
    if (text.includes("project")) {
      strengths.push("You have mentioned projects.");
    }

    if (text.includes("intern")) {
      strengths.push("Internship experience found.");
    }

    if (text.includes("github")) {
      strengths.push("GitHub profile detected.");
    }

    if (foundSkills.length > 5) {
      strengths.push("Strong technical skillset.");
    }

    // ==========================
    // MISSING SKILLS
    // ==========================
    if (!text.includes("docker")) {
      missingSkills.push("Docker missing");
    }

    if (!text.includes("aws")) {
      missingSkills.push("AWS missing");
    }

    if (!text.includes("system design")) {
      missingSkills.push("System Design missing");
    }

    if (!text.includes("ci/cd")) {
      missingSkills.push("CI/CD missing");
    }

    if (!text.includes("testing")) {
      missingSkills.push("Testing missing");
    }

    // ==========================
    // IMPROVEMENTS
    // ==========================
    if (!text.includes("summary")) {
      improvements.push("Add professional summary");
    }

    if (!text.includes("achievement")) {
      improvements.push("Add achievements");
    }

    if (!text.includes("experience")) {
      improvements.push("Add experience");
    }

    if (text.length < 2000) {
      improvements.push("Add more detailed content");
    }

    // max cap
    if (score > 95) score = 95;

    // delete uploaded file
    fs.unlinkSync(req.file.path);

    // response
    res.json({
      score,
      strengths,
      missingSkills,
      improvements,
      foundSkills
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      error: "Resume analysis failed",
      details: error.message
    });
  }
});

export default router;