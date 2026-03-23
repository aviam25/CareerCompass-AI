from flask import Flask, request, jsonify
import spacy
import os
import re
import uuid
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# ─── Skill List ───────────────────────────────────────────────
SKILL_LIST = [
    # Languages
    "python", "java", "c++", "javascript", "typescript",
    "kotlin", "swift", "go", "rust", "c",
    # Frontend
    "react", "html", "css", "tailwind", "redux", "vue", "angular",
    # Backend
    "node", "express", "rest api", "graphql", "flask", "django",
    # Database
    "mongodb", "mysql", "sql", "postgresql", "firebase", "redis",
    # DevOps / Cloud
    "docker", "kubernetes", "aws", "azure", "gcp",
    "terraform", "linux", "git",
    # Data / ML
    "machine learning", "pandas", "numpy", "tensorflow",
    "pytorch", "matplotlib", "data science", "scikit-learn",
    # Mobile
    "react native", "flutter", "android", "ios",
    # Design
    "figma", "adobe xd", "wireframing", "prototyping", "user research",
    # Security
    "networking", "ethical hacking", "firewalls", "siem", "cryptography",
]

# ─── Alias normalization ──────────────────────────────────────
ALIASES = {
    "html5":          "html",
    "css3":           "css",
    "node.js":        "node",
    "nodejs":         "node",
    "react.js":       "react",
    "reactjs":        "react",
    "express.js":     "express",
    "mongodb atlas":  "mongodb",
    "rest apis":      "rest api",
    "restful api":    "rest api",
    "restful apis":   "rest api",
    "scikit learn":   "scikit-learn",
    "sklearn":        "scikit-learn",
    "ci/cd":          "git",
    "github":         "git",
    "java script":    "javascript",
}


def normalize(text):
    t = text.lower()
    for alias, canonical in sorted(ALIASES.items(), key=lambda x: -len(x[0])):
        t = t.replace(alias, canonical)
    return t


def extract_skills(raw_text):
    normalized = normalize(raw_text)
    detected = set()

    # Pass 1: direct regex word-boundary match
    for skill in SKILL_LIST:
        pattern = r'(?<![a-z0-9])' + re.escape(skill) + r'(?![a-z0-9])'
        if re.search(pattern, normalized):
            detected.add(skill)

    # Pass 2: spaCy lemmatization fallback
    doc = nlp(normalized)
    lemmas = " ".join([
        token.lemma_ for token in doc
        if not token.is_punct and len(token.text) > 1
    ])
    noun_chunks = " ".join([chunk.text for chunk in doc.noun_chunks])
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
            f"{skill} {skill} experience proficient {skill}"
            for skill in detected_skills
        ]
        vec = TfidfVectorizer(ngram_range=(1, 2))
        mat = vec.fit_transform(corpus)
        sims = cosine_similarity(mat[0:1], mat[1:]).flatten()
        scored = sorted(zip(detected_skills, sims), key=lambda x: -x[1])
        ranked = [s for s, _ in scored]
        return ranked if ranked else detected_skills
    except Exception:
        return detected_skills


@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files["resume"]

    # Unique filename — safe for concurrent uploads, no leftover files
    file_path = f"temp_{uuid.uuid4().hex}.pdf"
    file.save(file_path)

    try:
        raw_text = extract_text(file_path)

        if not raw_text or not raw_text.strip():
            return jsonify({"skills": [], "error": "Could not extract text from PDF"}), 400

        detected = extract_skills(raw_text)
        ranked   = rank_skills_tfidf(raw_text, detected)

        return jsonify({
            "skills":      ranked,
            "total_found": len(ranked),
        })

    finally:
        # Always delete the temp file, even if an error occurs
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    app.run(port=8000, debug=True)