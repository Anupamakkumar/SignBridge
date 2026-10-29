from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SIGNBRIDGE_SECRET", "change-this-secret-key")

QUICK_PHRASES = {
    "Everyday": [
        "Hello, how are you?",
        "Please speak slowly.",
        "Please face me while speaking.",
        "I am deaf / hard of hearing.",
        "Please type your message.",
        "Could you repeat that, please?",
        "Thank you.",
        "I understand.",
        "I don't understand.",
        "Please give me a moment."
    ],
    "Hospital": [
        "I need medical assistance.",
        "I have an appointment.",
        "I am feeling unwell.",
        "Please write the instructions down.",
        "I need an interpreter if available.",
        "Please contact my emergency contact."
    ],
    "Travel": [
        "Where is the bus stop?",
        "Which platform should I go to?",
        "Please show me the direction.",
        "Please tell me when we arrive.",
        "I need help finding this place."
    ],
    "College": [
        "Could you share the notes?",
        "Please provide written instructions.",
        "I need captions for this video.",
        "Could you repeat the question?",
        "I would like to communicate by text."
    ],
    "Emergency": [
        "I need help now.",
        "Please call emergency services.",
        "Please contact my emergency contact.",
        "I cannot hear you. Please type.",
        "My location is: [type your location here]."
    ]
}

@app.route("/")
def index():
    return render_template("index.html", phrases=QUICK_PHRASES)

@app.route("/api/phrase-categories")
def phrase_categories():
    return jsonify(QUICK_PHRASES)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "app": "SignBridge", "time": datetime.utcnow().isoformat() + "Z"})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
