import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// ✅ MULTER CONFIG (SAFE)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ MAIN ROUTE
router.post("/upload", upload.single("resume"), async (req, res) => {
  let filePath = "";

  try {
    console.log("📥 Resume upload request");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = req.file.path;

    // ✅ READ FILE
    const buffer = fs.readFileSync(filePath);

    // ✅ PARSE PDF
    let data;
    try {
      data = await pdf(buffer);
    } catch (err) {
      return res.status(400).json({
        error: "Invalid PDF file"
      });
    }

    const text = data.text.toLowerCase();

    // ==========================
    // SCORING LOGIC
    // ==========================

    let score = 50;
    let strengths = [];
    let missingSkills = [];
    let improvements = [];

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
      strengths.push("You have internship experience.");
    }

    if (text.includes("github")) {
      strengths.push("You showcase your work via GitHub.");
    }

    if (foundSkills.length > 5) {
      strengths.push("Strong technical skillset.");
    }

    // ==========================
    // MISSING SKILLS
    // ==========================

    if (!text.includes("docker")) {
      missingSkills.push("Learn Docker for deployment.");
    }

    if (!text.includes("aws")) {
      missingSkills.push("Learn AWS cloud.");
    }

    if (!text.includes("system design")) {
      missingSkills.push("Add System Design knowledge.");
    }

    if (!text.includes("ci/cd")) {
      missingSkills.push("CI/CD missing.");
    }

    if (!text.includes("testing")) {
      missingSkills.push("Add testing practices.");
    }

    // ==========================
    // IMPROVEMENTS
    // ==========================

    if (!text.includes("summary")) {
      improvements.push("Add professional summary.");
    }

    if (!text.includes("achievement")) {
      improvements.push("Add achievements.");
    }

    if (!text.includes("experience")) {
      improvements.push("Add experience section.");
    }

    if (text.length < 2000) {
      improvements.push("Increase content depth.");
    }

    if (score > 95) score = 95;

    // ==========================
    // DELETE FILE (SAFE)
    // ==========================

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ==========================
    // RESPONSE
    // ==========================

    res.json({
      score,
      strengths,
      missingSkills,
      improvements,
      foundSkills
    });

  } catch (error) {
    console.error("🔥 Resume ERROR:", error);

    // cleanup if crash
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      error: "Resume analysis failed",
      details: error.message
    });
  }
});

export default router;