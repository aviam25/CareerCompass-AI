# 🧭 CareerCompass AI

> 🚀 AI-powered resume analyzer with ATS scoring, OpenAI feedback, and career guidance chatbot.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org)
![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet)
![ATS Optimized](https://img.shields.io/badge/ATS-Optimized-green)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/atlas)

---

## 📌 Overview

CareerCompass AI is an AI-powered career intelligence platform that analyzes resumes and guides users toward their ideal career path.

It combines NLP (spaCy + TF-IDF) with AI (OpenAI) to not only extract skills and match roles, but also evaluate resumes using ATS-style scoring, identify improvement areas, and provide personalized career guidance through an interactive chatbot.

The platform goes beyond analysis — it helps users understand *what to improve and how to improve it*.

---

## ✨ Features

- 🔐 JWT Authentication with bcrypt security  
- 📄 Drag & Drop Resume Upload (PDF)  

### 🤖 AI & NLP Features
- 🧠 NLP Skill Extraction using spaCy (lemmatization + smart matching)  
- 📊 TF-IDF Based Skill Ranking  
- 🎯 Career Role Matching with match % score  
- ⚠️ Skill Gap Analysis for each role  
- ⭐ Best Role Recommendation  

### 🆕 AI-Powered Enhancements
- 📊 ATS Resume Scoring (score out of 100)  
- 🧠 OpenAI-powered resume analysis  
- ⚠️ Personalized improvement suggestions to boost ATS score  
- 💬 AI Chatbot for interactive career guidance  

### 📊 Platform Features
- 📊 Dashboard with visual insights & progress bars  
- 🕓 Analysis History (save & manage reports)  
- ☁️ MongoDB Atlas cloud storage  
- 🎨 Modern Glassmorphism UI 

---

## 🧠 AI Capabilities

CareerCompass AI now integrates OpenAI to move beyond static analysis:

- Understands resume context, not just keywords  
- Suggests meaningful improvements (not generic tips)  
- Helps optimize resumes for ATS systems  
- Enables interactive Q&A through chatbot  

This transforms the platform from a **resume analyzer → career assistant**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| State Management | React AuthContext (global session) |
| Backend | Node.js, Express.js |
| File Handling | Multer (PDF uploads) |
| Authentication | JWT, bcryptjs |
| Database | MongoDB Atlas, Mongoose |
| AI / NLP | Python, Flask, spaCy, TF-IDF, OpenAI API, pdfminer.six |

---

## 🏗️ Architecture

CareerCompass AI follows a multi-service architecture:

- React (Frontend UI)
- Node.js + Express (API + Auth Layer)
- Python Flask (NLP + AI Processing)
- OpenAI API (Intelligent feedback & chatbot)

This separation ensures scalability and modular development.

---

## 🧠 How It Works

```
User Uploads Resume (PDF)
        ↓
Express Backend receives file (JWT protected)
        ↓
Resume sent to Python Flask NLP Service
        ↓
spaCy extracts skills + preprocessing
        ↓
TF-IDF ranks and filters important skills
        ↓
Backend performs:
    → Career role matching
    → Skill gap analysis
    → ATS scoring
        ↓
OpenAI analyzes resume:
    → Provides improvement suggestions
    → Generates personalized feedback
        ↓
User can interact via AI chatbot for guidance
        ↓
Results stored in MongoDB
        ↓
Displayed in React dashboard
```

---

## 📂 Project Structure

```
CareerCompass-AI/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Navbar, Hero, Stats, Features, CareerAgent, ATSReport
│   │   ├── context/           # AuthContext (global auth state)
│   │   ├── pages/             # AuthPage, UploadResume, History, About
│   │   └── App.js
├── server/                    # Node.js backend
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # Mongoose User + Analysis models
│   ├── routes/                # Auth routes (register, login, /me)
│   ├── server.js
│   └── .env                   # Environment variables (not committed)
└── ml-service/                # AI and NLP service
    └── app.py                 # spaCy, TF-IDF, Flask, OpenAI
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- Python 3.8+
- MongoDB Atlas account (free tier works fine)

---

### 1. Clone Repository

```bash
git clone https://github.com/aviam25/CareerCompass-AI.git
cd CareerCompass-AI
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/careercompass?retryWrites=true&w=majority&appName=cluster0
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the server:

```bash
node server.js
```

You should see:
```
✅ MongoDB connected
Server running on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

### 4. Python NLP Service Setup

> ⚠️ This service handles both NLP processing and OpenAI-powered resume analysis & chatbot responses.

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install flask spacy pdfminer.six python-dotenv openai
python -m spacy download en_core_web_sm

NLP service runs at `http://localhost:8000`
```

Create a `.env` file inside `/ml-service`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Run the Service
```
python app.py
```

---

### Running All Three Services

| Terminal | Command | Port |
|---|---|---|
| 1 — NLP | `python app.py` (inside ml-service with venv active) | 8000 |
| 2 — Backend | `node server.js` (inside server/) | 5000 |
| 3 — Frontend | `npm start` (inside client/) | 3000 |

---

## 🔐 Authentication Flow

1. User registers with name, email and password
2. Password is hashed with bcrypt before storing in MongoDB
3. JWT token is issued and stored in `localStorage`
4. All protected routes (resume upload, history) require a valid `Bearer` token
5. Token is verified server-side on every protected request
6. AuthContext manages global session state across the React app

---

## 🚀 Current Status

### ✅ Completed
- JWT Authentication (Register / Login / Logout)
- Resume PDF upload system
- NLP-based skill extraction (spaCy)
- TF-IDF skill ranking
- Career role matching engine
- Skill gap analysis
- ATS Resume Scoring system
- OpenAI-powered resume feedback
- AI chatbot for career guidance
- Analysis history (save / view / delete)
- Dashboard with visual insights
- Modern glassmorphism UI
- Protected routes with JWT middleware

---

## 📸 Screenshots

<img width="1545" height="905" alt="image" src="https://github.com/user-attachments/assets/d20a83a6-2a31-4dbb-ac77-5c42676fba61" />
<img width="1528" height="887" alt="image" src="https://github.com/user-attachments/assets/a4fd784d-7201-4b9a-82f8-08f63f905a17" />
<img width="1492" height="872" alt="image" src="https://github.com/user-attachments/assets/f4d07baa-d6b5-4808-a129-adaf52e8a0e0" />
<img width="1525" height="915" alt="image" src="https://github.com/user-attachments/assets/d1f1a3ae-111a-4147-883d-54baebb9162a" />
<img width="1692" height="917" alt="image" src="https://github.com/user-attachments/assets/869b23d4-c628-41c2-bf54-89d53ea6ffe2" />
<img width="1681" height="911" alt="image" src="https://github.com/user-attachments/assets/27e25876-517e-49fa-b7b0-2eadecdd4594" />
<img width="1691" height="905" alt="image" src="https://github.com/user-attachments/assets/2262a5f2-a50c-4d21-bb03-26b3d9dae253" />
<img width="1516" height="925" alt="image" src="https://github.com/user-attachments/assets/9a3f749c-ef26-477a-b9cc-255e75eb207f" />

---

## 🎥 Demo

Coming soon...

> Upload resume → Get ATS score → Improve with AI → Chat for guidance

---

## 📈 Future Scope

- Downloadable ATS reports (PDF)
- Advanced analytics dashboard
- Career roadmap & learning paths
- Real job listing API integration (LinkedIn, Indeed)
- Improved AI chatbot with memory
- Resume comparison across multiple uploads

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📬 Contact

Built by **Avi Mishra** — feel free to connect or raise an issue for feedback and suggestions.

---

## 🏷️ Tags

AI • OpenAI • Resume Analyzer • ATS Scoring • NLP • Full Stack • Career Tech • React • Node.js • Python

---

⭐ If you found this project useful, consider giving it a star — it motivates me to keep building!
