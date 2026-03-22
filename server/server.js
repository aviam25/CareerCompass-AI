require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const mongoose = require("mongoose");

// ── Route imports ──────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const protect = require("./middleware/auth");

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB connection ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ── Job role data ──────────────────────────────────────────────
const JOB_ROLES = {
  "frontend developer": ["html", "css", "javascript", "react"],
  "backend developer": ["node", "express", "mongodb", "sql"],
  "data scientist": ["python", "pandas", "numpy", "machine learning"],
};

// ── File upload config ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads/")) fs.mkdirSync("uploads/");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ── Routes ─────────────────────────────────────────────────────

// Auth (public)
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => res.send("Backend running 🚀"));

// Resume upload — protected: requires valid JWT
app.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Send to NLP service
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      { headers: formData.getHeaders() }
    );

    const userSkills = response.data.skills;

    // Matching logic
    let results = {};

    for (let role in JOB_ROLES) {
      const requiredSkills = JOB_ROLES[role];
      const matched = requiredSkills.filter((skill) =>
        userSkills.includes(skill)
      );
      const weight = 0.8;
      const score = Math.round(
        (matched.length / requiredSkills.length) * 100 * weight +
          (userSkills.length > 5 ? 10 : 0)
      );
      const missing = requiredSkills.filter(
        (skill) => !userSkills.includes(skill)
      );
      results[role] = { score: score.toFixed(0), missing };
    }

    // Best role
    let bestRole = "";
    let highestScore = 0;
    for (let role in results) {
      if (parseInt(results[role].score) > highestScore) {
        highestScore = parseInt(results[role].score);
        bestRole = role;
      }
    }

    // Clean up uploaded file
    fs.unlink(filePath, () => {});

    res.json({
      skills: userSkills,
      match: results,
      bestRole: { role: bestRole, score: highestScore },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing resume");
  }
});

// ── Start server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));