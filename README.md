# 🧭 CareerCompass AI

> An AI-powered career guidance platform that analyzes resumes, extracts skills using NLP, and recommends the most suitable career paths — with full user authentication and cloud database integration.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/atlas)

---

## 📌 Overview

CareerCompass AI is a full-stack web application that helps users understand their career alignment by analyzing their resumes using Natural Language Processing (NLP). It extracts skills from uploaded PDF resumes, evaluates compatibility with different job roles, identifies skill gaps, and recommends the most suitable career path — all behind a secure JWT-authenticated interface.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 📄 **Resume Upload** — PDF resume support via Multer
- 🤖 **NLP Skill Extraction** — Python + spaCy based skill detection
- 🎯 **Job Role Matching** — Algorithm matches extracted skills to predefined roles
- 📊 **Match Percentage** — Score calculated for each career path
- ⚠️ **Skill Gap Analysis** — Identifies missing skills per role
- ⭐ **Best Role Recommendation** — Highlights the top matching career
- 📈 **Interactive Dashboard** — Visual progress bars for each role
- ☁️ **Cloud Database** — MongoDB Atlas for persistent user storage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Multer |
| Authentication | JWT, bcryptjs |
| Database | MongoDB Atlas, Mongoose |
| AI / NLP | Python, Flask, spaCy, pdfminer |

---

## 🧠 How It Works

```
User Uploads Resume (PDF)
        ↓
Express Backend receives file
        ↓
Forwarded to Python Flask NLP Service
        ↓
spaCy extracts skills from text
        ↓
Backend matches skills against job role definitions
        ↓
Match scores + missing skills calculated
        ↓
Best career role recommended
        ↓
Results displayed in React dashboard
```

---

## 📂 Project Structure

```
CareerCompass-AI/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Hero, Stats, Features
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── pages/           # AuthPage, UploadResume
│   │   └── App.js
├── server/                  # Node.js backend
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose User model
│   ├── routes/              # Auth routes (register, login, /me)
│   ├── server.js
│   └── .env                 # Environment variables (not committed)
└── ml-service/              # Python NLP service
    └── app.py
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- Python 3.8+
- MongoDB Atlas account (free tier)

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

---

## 🔐 Authentication Flow

1. User registers with name, email and password
2. Password is hashed with bcrypt before storing in MongoDB
3. JWT token is issued and stored in `localStorage`
4. All protected routes (resume upload) require a valid `Bearer` token
5. Token is verified server-side on every request

---

## 🚀 Current Status

### ✅ Completed
- JWT Authentication (Register / Login / Logout)
- MongoDB Atlas integration with Mongoose
- Resume PDF upload and processing
- NLP-based skill extraction (spaCy)
- Job role matching algorithm
- Career recommendation engine
- Responsive React dashboard with Tailwind CSS

## 📸 Screenshots
<img width="1568" height="766" alt="image" src="https://github.com/user-attachments/assets/848ecdb0-0dfb-4c77-98c7-a57791d51a9f" />
<img width="1568" height="689" alt="image" src="https://github.com/user-attachments/assets/412c773c-592d-45bd-b74f-188691147a70" />
<img width="1568" height="757" alt="image" src="https://github.com/user-attachments/assets/7cc3af3a-ab3e-4a90-85b8-faf901e2fdea" />
<img width="1517" height="784" alt="image" src="https://github.com/user-attachments/assets/08cce75a-cbef-496c-8643-7b7c3c402f10" />

---

### 🔄 In Progress / Upcoming
- User resume history tracking
- Downloadable PDF reports
- Expanded job role definitions
- Advanced NLP model improvements
- Enhanced UI/UX polish

---

## 📈 Future Scope

- ATS-based resume scoring system
- Career roadmap and learning path suggestions
- Graphs and analytics dashboard
- Real job listing API integration (LinkedIn, Indeed)
- AI chatbot for personalized career guidance

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