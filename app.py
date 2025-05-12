from flask import Flask, render_template, request, send_from_directory
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

@app.route("/uploads")
def list_uploads():
    files = os.listdir(UPLOAD_FOLDER)
    return render_template("uploads.html", files=files)

@app.route("/download/<filename>")
def download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
