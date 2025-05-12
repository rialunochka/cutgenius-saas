from flask import Flask, render_template, send_from_directory
import pandas as pd
import os

app = Flask(__name__)
CSV_FILE = "clips_database.csv"
CLIPS_FOLDER = "static/clips"

@app.route('/')
def index():
    if not os.path.exists(CSV_FILE):
        return "clips_database.csv not found"
    df = pd.read_csv(CSV_FILE)
    return render_template("index.html", clips=df.to_dict(orient="records"))

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(CLIPS_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
