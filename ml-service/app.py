from flask import Flask, request, jsonify
import spacy
from pdfminer.high_level import extract_text

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# Predefined skill list
SKILL_LIST = [
    # Languages
    "python", "java", "c++", "javascript", "typescript", "kotlin", "swift", "go", "rust",
    # Frontend
    "react", "html", "css", "tailwind", "redux", "vue", "angular",
    # Backend
    "node", "express", "rest api", "graphql", "flask", "django",
    # Database
    "mongodb", "mysql", "sql", "postgresql", "firebase", "redis",
    # DevOps / Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "linux", "ci/cd", "git",
    # Data / ML
    "machine learning", "pandas", "numpy", "tensorflow", "pytorch", "matplotlib", "data science",
    # Mobile
    "react native", "flutter", "android", "ios",
    # Design
    "figma", "adobe xd", "wireframing", "prototyping", "user research",
    # Security
    "networking", "ethical hacking", "firewalls", "siem", "cryptography",
]

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files["resume"]

    file_path = "temp.pdf"
    file.save(file_path)

    text = extract_text(file_path).lower()

    detected_skills = []

    for skill in SKILL_LIST:
        if skill in text:
            detected_skills.append(skill)

    return jsonify({
        "skills": detected_skills
    })

if __name__ == "__main__":
    app.run(port=8000)