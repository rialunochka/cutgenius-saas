from flask import Flask, render_template, request
import os

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def upload_video():
    if request.method == "POST":
        video = request.files["video"]
        if video:
            video.save(os.path.join(UPLOAD_FOLDER, video.filename))
            return render_template("success.html")
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
