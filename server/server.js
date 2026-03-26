require("dotenv").config();

const express  = require("express");
const multer   = require("multer");
const cors     = require("cors");
const axios    = require("axios");
const fs       = require("fs");
const FormData = require("form-data");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const protect    = require("./middleware/auth");
const Analysis   = require("./models/Analysis");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ─── Job Roles ────────────────────────────────────────────────
const JOB_ROLES = {
  "frontend developer": {
    skills: ["html", "css", "javascript", "react", "typescript", "tailwind", "redux", "nextjs"],
    emoji: "🎨",
  },
  "backend developer": {
    skills: ["node", "express", "mongodb", "sql", "python", "rest api", "docker", "postgresql"],
    emoji: "⚙️",
  },
  "fullstack developer": {
    skills: ["html", "css", "javascript", "react", "node", "express", "mongodb", "sql", "git"],
    emoji: "💻",
  },
  "data scientist": {
    skills: ["python", "pandas", "numpy", "machine learning", "tensorflow", "sql", "matplotlib", "scikit-learn"],
    emoji: "📊",
  },
  "ml engineer": {
    skills: ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "numpy", "docker", "mlops"],
    emoji: "🤖",
  },
  "devops engineer": {
    skills: ["docker", "kubernetes", "aws", "linux", "git", "ci/cd", "terraform", "ansible"],
    emoji: "🔧",
  },
  "cloud engineer": {
    skills: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "networking"],
    emoji: "☁️",
  },
  "mobile developer": {
    skills: ["react native", "flutter", "android", "ios", "kotlin", "swift", "firebase"],
    emoji: "📱",
  },
  "ui/ux designer": {
    skills: ["figma", "css", "html", "wireframing", "prototyping", "user research", "adobe xd"],
    emoji: "✏️",
  },
  "cybersecurity analyst": {
    skills: ["networking", "linux", "python", "ethical hacking", "firewalls", "cryptography", "siem"],
    emoji: "🔐",
  },
  "data engineer": {
    skills: ["python", "sql", "apache spark", "kafka", "airflow", "aws", "postgresql", "dbt"],
    emoji: "🗄️",
  },
  "ai engineer": {
    skills: ["python", "openai", "langchain", "llm", "rag", "vector database", "fastapi", "docker"],
    emoji: "🧠",
  },
};

// ─── Multer ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads/")) fs.mkdirSync("uploads/");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ─── Auth routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("CareerCompass backend running 🚀"));

// ─── Upload & Analyze ─────────────────────────────────────────
app.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    const filePath   = req.file.path;
    const resumeName = req.file.originalname;

    // Forward to Python NLP service
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(filePath));

    const nlpRes = await axios.post("http://127.0.0.1:8000/analyze", formData, {
      headers: formData.getHeaders(),
    });

    const { skills: userSkills, ats_score, ats_breakdown } = nlpRes.data;

    // Career matching
    const results = {};
    for (const role in JOB_ROLES) {
      const required = JOB_ROLES[role].skills;
      const matched  = required.filter((s) => userSkills.includes(s));
      const score    = Math.min(
        100,
        Math.round(
          ((matched.length / required.length) * 100) * 0.85 +
          (userSkills.length > 5 ? 8 : 0)
        )
      );
      results[role] = {
        score:   score.toString(),
        missing: required.filter((s) => !userSkills.includes(s)),
        emoji:   JOB_ROLES[role].emoji,
      };
    }

    // Best role
    let bestRole = "";
    let highest  = 0;
    for (const role in results) {
      const s = parseInt(results[role].score);
      if (s > highest) { highest = s; bestRole = role; }
    }

    // Save to MongoDB
    await Analysis.create({
      user:         req.user._id,
      skills:       userSkills,
      bestRole:     { role: bestRole, score: highest },
      match:        results,
      resumeName,
      atsScore:     ats_score    || 0,
      atsBreakdown: ats_breakdown || {},
    });

    fs.unlink(filePath, () => {});

    res.json({
      skills:       userSkills,
      match:        results,
      bestRole:     { role: bestRole, score: highest },
      atsScore:     ats_score    || 0,
      atsBreakdown: ats_breakdown || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing resume" });
  }
});

// ─── History ──────────────────────────────────────────────────
app.get("/api/history", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

app.delete("/api/history/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting" });
  }
});

// ─── AI Agent proxy ───────────────────────────────────────────
// Proxies to Python /agent/gap which calls OpenAI.
// Keeps OpenAI key server-side only (set in ml-service env).
app.post("/api/agent/chat", protect, async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/agent/gap",
      req.body   // ✅ forward frontend data directly
    );

    res.json(response.data);
  } catch (error) {
    const msg = error.response?.data?.error || "Agent unavailable";
    res.status(500).json({ reply: msg, error: msg });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));