require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const protect = require("./middleware/auth");
const Analysis = require("./models/Analysis");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

const JOB_ROLES = {
  "frontend developer": {
    skills: ["html", "css", "javascript", "react", "typescript", "tailwind", "redux"],
    emoji: "🎨"
  },
  "backend developer": {
    skills: ["node", "express", "mongodb", "sql", "python", "rest api", "docker"],
    emoji: "⚙️"
  },
  "data scientist": {
    skills: ["python", "pandas", "numpy", "machine learning", "tensorflow", "sql", "matplotlib"],
    emoji: "📊"
  },
  "devops engineer": {
    skills: ["docker", "kubernetes", "aws", "linux", "git", "ci/cd", "terraform"],
    emoji: "🔧"
  },
  "mobile developer": {
    skills: ["react native", "flutter", "android", "ios", "kotlin", "swift", "firebase"],
    emoji: "📱"
  },
  "ui/ux designer": {
    skills: ["figma", "css", "html", "wireframing", "prototyping", "user research", "adobe xd"],
    emoji: "✏️"
  },
  "cybersecurity analyst": {
    skills: ["networking", "linux", "python", "ethical hacking", "firewalls", "siem", "cryptography"],
    emoji: "🔐"
  },
  "cloud engineer": {
    skills: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux"],
    emoji: "☁️"
  },
  "ml engineer": {
    skills: ["python", "tensorflow", "pytorch", "machine learning", "numpy", "pandas", "docker"],
    emoji: "🤖"
  },
  "fullstack developer": {
    skills: ["html", "css", "javascript", "react", "node", "express", "mongodb", "sql"],
    emoji: "💻"
  }
};

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

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Backend running 🚀"));

app.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const resumeName = req.file.originalname;

    const formData = new FormData();
    formData.append("resume", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      { headers: formData.getHeaders() }
    );

    const userSkills = response.data.skills;

    let results = {};
    for (let role in JOB_ROLES) {
    const requiredSkills = JOB_ROLES[role].skills;  // ← .skills added

    const matched = requiredSkills.filter(skill =>
      userSkills.includes(skill)
    );

    const weight = 0.8;

    const score = Math.round(
      ((matched.length / requiredSkills.length) * 100) * weight +
      (userSkills.length > 5 ? 10 : 0)
    );

    const missing = requiredSkills.filter(skill =>
      !userSkills.includes(skill)
    );

  results[role] = {
      score: score.toFixed(0),
      missing,
      emoji: JOB_ROLES[role].emoji
    };
  }

  // ✅ Find best role
  let bestRole = "";
  let highestScore = 0;
  for (let role in results) {
    if (parseInt(results[role].score) > highestScore) {
      highestScore = parseInt(results[role].score);
      bestRole = role;
    }
  }

    await Analysis.create({
      user: req.user._id,
      skills: userSkills,
      bestRole: { role: bestRole, score: highestScore },
      match: results,
      resumeName,
    });

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

app.get("/api/history", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(analyses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

app.delete("/api/history/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting entry" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));