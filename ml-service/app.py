from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import os
import re
import uuid
import json
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
nlp = spacy.load("en_core_web_sm")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


# ─── Expanded Skill List (200+ skills) ───────────────────────
SKILL_LIST = [
    # Languages
    "python", "java", "c++", "c#", "javascript", "typescript", "kotlin",
    "swift", "go", "rust", "ruby", "php", "scala", "r", "matlab", "perl",
    "bash", "shell", "c", "dart", "elixir", "haskell", "lua",
    # Frontend
    "react", "vue", "angular", "nextjs", "nuxtjs", "svelte", "html", "css",
    "tailwind", "bootstrap", "sass", "less", "redux", "zustand", "mobx",
    "webpack", "vite", "babel", "jest", "cypress", "storybook",
    "react query", "framer motion", "three.js", "d3.js",
    # Backend
    "node", "express", "fastapi", "django", "flask", "spring boot",
    "asp.net", "laravel", "rails", "graphql", "rest api", "grpc",
    "fastify", "hapi", "nestjs", "gin", "fiber", "echo",
    # Databases
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "firebase",
    "cassandra", "dynamodb", "elasticsearch", "neo4j", "supabase",
    "planetscale", "cockroachdb", "influxdb", "snowflake", "bigquery",
    # DevOps / Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform",
    "ansible", "jenkins", "github actions", "gitlab ci", "circleci",
    "linux", "git", "nginx", "apache", "prometheus", "grafana",
    "datadog", "splunk", "helm", "istio", "vault",
    # Data / ML / AI
    "machine learning", "deep learning", "pandas", "numpy", "tensorflow",
    "pytorch", "scikit-learn", "keras", "xgboost", "lightgbm",
    "matplotlib", "seaborn", "plotly", "data science", "nlp",
    "computer vision", "reinforcement learning", "hugging face",
    "langchain", "openai", "llm", "rag", "vector database",
    "apache spark", "hadoop", "airflow", "dbt", "kafka",
    # Mobile
    "react native", "flutter", "android", "ios", "swift", "kotlin",
    "xamarin", "ionic", "expo",
    # Design / UX
    "figma", "adobe xd", "sketch", "wireframing", "prototyping",
    "user research", "ui design", "ux design", "canva", "illustrator",
    # Security
    "networking", "ethical hacking", "firewalls", "siem", "cryptography",
    "penetration testing", "owasp", "soc", "vulnerability assessment",
    "cybersecurity", "cloud security",
    # Soft / Methodologies
    "agile", "scrum", "kanban", "jira", "confluence", "git flow",
    "tdd", "bdd", "ci/cd", "microservices", "system design",
    "object oriented programming", "functional programming", "design patterns",
]

ALIASES = {
    "html5":              "html",
    "css3":               "css",
    "node.js":            "node",
    "nodejs":             "node",
    "react.js":           "react",
    "reactjs":            "react",
    "next.js":            "nextjs",
    "nuxt.js":            "nuxtjs",
    "express.js":         "express",
    "mongodb atlas":      "mongodb",
    "rest apis":          "rest api",
    "restful api":        "rest api",
    "restful apis":       "rest api",
    "restful":            "rest api",
    "scikit learn":       "scikit-learn",
    "sklearn":            "scikit-learn",
    "github":             "git",
    "gitlab":             "git",
    "bitbucket":          "git",
    "java script":        "javascript",
    "type script":        "typescript",
    "vue.js":             "vue",
    "angular.js":         "angular",
    "spring":             "spring boot",
    "postgres":           "postgresql",
    "psql":               "postgresql",
    "gpt":                "openai",
    "chatgpt":            "openai",
    "oop":                "object oriented programming",
    "object-oriented":    "object oriented programming",
    "ci cd":              "ci/cd",
    "github actions":     "github actions",
    "aws lambda":         "aws",
    "amazon web services":"aws",
    "google cloud":       "gcp",
    "microsoft azure":    "azure",
}

# ─── ATS scoring weights ──────────────────────────────────────
ATS_SECTIONS    = ["education", "experience", "skills", "projects", "summary",
                   "contact", "certifications", "achievements", "work experience",
                   "professional experience", "technical skills", "objective"]
ACTION_VERBS    = ["developed","built","led","designed","implemented","improved",
                   "created","managed","deployed","optimized","architected","launched",
                   "reduced","increased","delivered","collaborated","mentored",
                   "automated","integrated","migrated","scaled","refactored",
                   "engineered","established","pioneered","streamlined"]
QUANT_PATTERNS  = [r'\d+%', r'\d+x', r'\$\d+', r'\d+\s*years?',
                   r'\d+\s*months?', r'\d+\s*users?', r'\d+\s*team',
                   r'\d+\s*million', r'\d+\s*thousand', r'\d+k\b']


def normalize(text):
    t = text.lower()
    for alias, canonical in sorted(ALIASES.items(), key=lambda x: -len(x[0])):
        t = re.sub(r'\b' + re.escape(alias) + r'\b', canonical, t)
    return t


def extract_skills(raw_text):
    normalized = normalize(raw_text)
    detected = set()

    # Pass 1: regex word-boundary match
    for skill in SKILL_LIST:
        pattern = r'(?<![a-z0-9\-])' + re.escape(skill) + r'(?![a-z0-9\-])'
        if re.search(pattern, normalized):
            detected.add(skill)

    # Pass 2: spaCy lemmatization fallback
    doc = nlp(normalized[:50000])   # cap to avoid memory issues
    lemmas = " ".join([t.lemma_ for t in doc if not t.is_punct and len(t.text) > 1])
    noun_chunks = " ".join([c.text for c in doc.noun_chunks])
    combined = lemmas + " " + noun_chunks

    for skill in SKILL_LIST:
        if skill not in detected:
            skill_lemma = " ".join([t.lemma_ for t in nlp(skill)])
            if skill_lemma in combined:
                detected.add(skill)

    return list(detected)


def rank_skills_tfidf(raw_text, detected_skills):
    if not detected_skills:
        return []
    try:
        corpus = [raw_text.lower()] + [
            f"{s} {s} experience proficient {s} skilled" for s in detected_skills
        ]
        vec = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
        mat = vec.fit_transform(corpus)
        sims = cosine_similarity(mat[0:1], mat[1:]).flatten()
        scored = sorted(zip(detected_skills, sims), key=lambda x: -x[1])
        return [s for s, _ in scored]
    except Exception:
        return detected_skills


def compute_ats_score(raw_text, detected_skills):
    """
    ATS Score breakdown (total 100):
      Skills coverage    → 30 pts
      Action verbs       → 20 pts
      Quantified results → 20 pts
      Sections present   → 20 pts
      Length & density   → 10 pts
    """
    text_lower = raw_text.lower()
    words      = raw_text.split()
    word_count = len(words)

    # 1. Skills (30 pts) — more unique skills = higher score, cap at 30
    skill_score = min(30, len(detected_skills) * 1.5)

    # 2. Action verbs (20 pts) — 2 pts per unique verb found, cap 20
    found_verbs = [v for v in ACTION_VERBS if v in text_lower]
    verb_score  = min(20, len(set(found_verbs)) * 2)

    # 3. Quantified results (20 pts) — 4 pts per pattern found, cap 20
    quant_hits = sum(1 for p in QUANT_PATTERNS if re.search(p, text_lower))
    quant_score = min(20, quant_hits * 4)

    # 4. Sections present (20 pts) — 2 pts per section detected, cap 20
    section_hits = sum(1 for s in ATS_SECTIONS if re.search(r'\b' + re.escape(s) + r'\b', text_lower))
    section_score = min(20, section_hits * 2)

    # 5. Length & density (10 pts)
    if 300 <= word_count <= 700:
        length_score = 10
    elif 700 < word_count <= 1200:
        length_score = 7
    elif 150 <= word_count < 300:
        length_score = 5
    else:
        length_score = 2

    total = int(skill_score + verb_score + quant_score + section_score + length_score)
    total = min(100, max(0, total))

    breakdown = {
        "skills":      {"score": int(skill_score),   "max": 30, "label": "Skill coverage"},
        "verbs":       {"score": int(verb_score),     "max": 20, "label": "Action verbs",
                        "found": list(set(found_verbs))[:8]},
        "quantified":  {"score": int(quant_score),    "max": 20, "label": "Quantified results"},
        "sections":    {"score": int(section_score),  "max": 20, "label": "Resume sections"},
        "length":      {"score": int(length_score),   "max": 10, "label": "Length & density",
                        "words": word_count},
    }

    return total, breakdown


# ─── Routes ───────────────────────────────────────────────────

@app.route("/analyze", methods=["POST"])
def analyze():
    file      = request.files["resume"]
    file_path = f"temp_{uuid.uuid4().hex}.pdf"
    file.save(file_path)

    try:
        raw_text = extract_text(file_path)
        if not raw_text or not raw_text.strip():
            return jsonify({"skills": [], "error": "Could not extract text from PDF"}), 400

        detected  = extract_skills(raw_text)
        ranked    = rank_skills_tfidf(raw_text, detected)
        ats_total, ats_breakdown = compute_ats_score(raw_text, ranked)

        return jsonify({
            "skills":        ranked,
            "total_found":   len(ranked),
            "ats_score":     ats_total,
            "ats_breakdown": ats_breakdown,
            "raw_text":      raw_text[:8000],   # pass to agent route (truncated)
        })

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@app.route("/agent/gap", methods=["POST"])
def agent_gap():
    try:
        if not client:
            return jsonify({"error": "OpenAI API key not configured"}), 500

        data = request.json or {}

        user_skills   = data.get("skills", [])
        best_role     = data.get("bestRole", {})
        match_data    = data.get("match", {})
        ats_score     = data.get("atsScore", 0)
        ats_breakdown = data.get("atsBreakdown", {})
        user_message  = data.get("message", "Analyze my resume")
        history       = data.get("history", [])

        # 🔥 FIX: ensure best_role is always dict
        if isinstance(best_role, str):
            best_role = {"role": best_role, "score": 0}

        print("SKILLS:", user_skills)
        print("ROLE:", best_role)

        system_prompt = f"""
You are a career advisor AI.

Candidate skills: {', '.join(user_skills)}
Predicted role: {best_role.get('role', 'unknown')}

STRICT RULES:
- Focus ONLY on the predicted role
- DO NOT assume software developer unless explicitly mentioned

Give:
1. Short summary
2. Strengths
3. Weaknesses
4. Skills to improve specifically for {best_role.get('role', 'role')}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content.strip()

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({
            "error": str(e),
            "reply": "Something went wrong"
        }), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "openai": bool(client)})


if __name__ == "__main__":
    app.run(port=8000, debug=True)