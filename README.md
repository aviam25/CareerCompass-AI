# 🧭 CareerCompass AI

> Drop your resume. Discover your skills, gaps, and the career path built for you.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/atlas)

---

## 📌 Overview

CareerCompass AI is an AI-powered web application that analyzes resumes to help users discover their ideal career path. Using NLP techniques like spaCy-based skill extraction and TF-IDF scoring, it identifies key skills, matches them with relevant job roles, highlights skill gaps, and provides personalized career recommendations — all within a secure, modern full-stack platform.

---

## ✨ Features

- 🔐 JWT Authentication with bcrypt security
- 📄 Drag & Drop Resume Upload (PDF)
- 🤖 NLP Skill Extraction using spaCy (lemmatization + smart matching)
- 🧠 TF-IDF Based Skill Ranking
- 🎯 Career Role Matching with match % score
- ⚠️ Skill Gap Analysis for each role
- ⭐ Best Role Recommendation
- 📊 Dashboard with visual insights & progress bars
- 🕓 Analysis History (save & manage reports)
- ☁️ MongoDB Atlas cloud storage
- 🎨 Modern Glassmorphism UI

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
| AI / NLP | Python, Flask, spaCy (lemmatization, NLP pipeline), TF-IDF, pdfminer.six (Resume Parsing) |

---

## 🧠 How It Works

```
User Uploads Resume (PDF)
        ↓
Express Backend receives file (protected route — JWT required)
        ↓
Forwarded to Python Flask NLP Service
        ↓
spaCy extracts skills from resume text
        ↓
Backend matches skills against job role definitions
        ↓
Match scores + missing skills calculated
        ↓
Analysis saved to MongoDB under user account
        ↓
Best career role recommended
        ↓
Results displayed in React dashboard
```

---

## 📂 Project Structure

```
CareerCompass-AI/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Navbar, Hero, Stats, Features
│   │   ├── context/           # AuthContext (global auth state)
│   │   ├── pages/             # AuthPage, UploadResume, History, About
│   │   └── App.js
├── server/                    # Node.js backend
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # Mongoose User + Analysis models
│   ├── routes/                # Auth routes (register, login, /me)
│   ├── server.js
│   └── .env                   # Environment variables (not committed)
└── ml-service/                # Python NLP service
    └── app.py
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

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install flask spacy pdfminer.six
python -m spacy download en_core_web_sm
python app.py
```

NLP service runs at `http://localhost:8000`

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
- MongoDB Atlas integration with Mongoose
- Resume PDF drag & drop upload
- NLP-based skill extraction (spaCy)
- Job role matching algorithm
- Career recommendation engine
- Analysis history (save / view / delete)
- Soft glassmorphism UI redesign
- About page with project overview
- Responsive Navbar with mobile hamburger menu
- Staggered fade-up animations
- Scroll-to-top navigation
- Protected routes with JWT middleware

### 🔄 Upcoming
- ATS resume scoring (score out of 100)
- Downloadable PDF reports
- Graphs & analytics dashboard
- Career roadmap suggestions
- Expanded job role definitions
- Advanced NLP model improvements

---

## 📸 Screenshots

<img width="1545" height="905" alt="image" src="https://github.com/user-attachments/assets/d20a83a6-2a31-4dbb-ac77-5c42676fba61" />
<img width="1528" height="887" alt="image" src="https://github.com/user-attachments/assets/a4fd784d-7201-4b9a-82f8-08f63f905a17" />
<img width="1492" height="872" alt="image" src="https://github.com/user-attachments/assets/f4d07baa-d6b5-4808-a129-adaf52e8a0e0" />
<img width="1525" height="915" alt="image" src="https://github.com/user-attachments/assets/d1f1a3ae-111a-4147-883d-54baebb9162a" />
<img width="1548" height="907" alt="image" src="https://github.com/user-attachments/assets/61bba60a-38d9-4320-bc73-997d8da0d8a0" />
<img width="1516" height="925" alt="image" src="https://github.com/user-attachments/assets/a058912d-b2dd-4595-a60a-d7122f2c9e6d" />

---

## 📈 Future Scope

- ATS-based resume scoring system
- Career roadmap and learning path suggestions
- Graphs and analytics dashboard
- Real job listing API integration (LinkedIn, Indeed)
- AI chatbot for personalized career guidance
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

⭐ If you find this project useful, consider giving it a star!