import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// ✅ API ROUTES FIRST (VERY IMPORTANT)
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/mocktest", mockTestRoutes);

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

// ✅ FRONTEND SERVE LAST
app.use(express.static(path.join(process.cwd(), "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/dist/index.html"));
});

// port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});