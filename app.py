
from flask import Flask, render_template, request, redirect, url_for
import os
import uuid
import pandas as pd

app = Flask(__name__)
UPLOAD_FOLDER = "static/clips"
DATABASE_FILE = "static/clips/clips_database.csv"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        video = request.files.get("video")
        yt_link = request.form.get("yt_link")
        if video and video.filename != "":
            file_path = os.path.join(UPLOAD_FOLDER, video.filename)
            video.save(file_path)
        elif yt_link:
            return "<h3>YouTube processing will be handled via Colab</h3>"
        return redirect(url_for("uploads"))
    return render_template("index.html")

@app.route("/uploads")
def uploads():
    if not os.path.exists(DATABASE_FILE):
        return render_template("uploads.html", clips=[])
    df = pd.read_csv(DATABASE_FILE)
    return render_template("uploads.html", clips=df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
