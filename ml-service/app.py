from flask import Flask, request, jsonify
import spacy
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

# ─── All variations that should map to a canonical skill ──────
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
    "vs code":        "git",          # dev tool context
    "javascript":     "javascript",
    "java script":    "javascript",
}


def normalize(text):
    """Lowercase and replace all known aliases in the raw text."""
    t = text.lower()
    # Sort by length descending so longer aliases matched first
    for alias, canonical in sorted(ALIASES.items(), key=lambda x: -len(x[0])):
        t = t.replace(alias, canonical)
    return t


def extract_skills(raw_text):
    """
    1. Normalize aliases (html5 → html, node.js → node etc.)
    2. Direct substring match against SKILL_LIST  ← most reliable
    3. spaCy lemmatized match as fallback for morphological variations
    """
    normalized = normalize(raw_text)

    detected = set()

    # ── Pass 1: direct substring match on normalized text ────────
    for skill in SKILL_LIST:
        # Use word-boundary style check: skill surrounded by non-alphanumeric
        import re
        pattern = r'(?<![a-z0-9])' + re.escape(skill) + r'(?![a-z0-9])'
        if re.search(pattern, normalized):
            detected.add(skill)

    # ── Pass 2: spaCy lemmatization for remaining skills ─────────
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
    """
    Rank detected skills by TF-IDF cosine similarity.
    Falls back to detected order if ranking fails.
    """
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
    file.save("temp.pdf")

    raw_text = extract_text("temp.pdf")

    if not raw_text or not raw_text.strip():
        return jsonify({"skills": [], "error": "Could not extract text from PDF"}), 400

    detected = extract_skills(raw_text)
    ranked   = rank_skills_tfidf(raw_text, detected)

    return jsonify({
        "skills":      ranked,
        "total_found": len(ranked),
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)