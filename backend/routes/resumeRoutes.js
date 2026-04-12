import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 Upload request received");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";

    try {
      const buffer = fs.readFileSync(req.file.path);
      const data = await pdf(buffer);
      text = data.text.toLowerCase();
    } catch (pdfError) {
      console.log("⚠️ PDF PARSE ERROR:", pdfError);
      return res.status(500).json({
        error: "Failed to read PDF"
      });
    }

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

    // strengths
    if (text.includes("project")) strengths.push("Projects found");
    if (text.includes("intern")) strengths.push("Internship found");
    if (text.includes("github")) strengths.push("GitHub present");

    // missing
    if (!text.includes("docker")) missingSkills.push("Docker missing");
    if (!text.includes("aws")) missingSkills.push("AWS missing");

    // improvements
    if (!text.includes("summary")) improvements.push("Add summary");
    if (!text.includes("experience")) improvements.push("Add experience");

    if (score > 95) score = 95;

    // delete file safely
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.log("File delete error (ignore)");
    }

    return res.json({
      score,
      strengths,
      missingSkills,
      improvements,
      foundSkills
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    return res.status(500).json({
      error: "Server crashed",
      details: error.message
    });
  }
});

export default router;