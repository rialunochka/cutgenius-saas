
from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import whisper
import moviepy.editor as mp
from pytube import YouTube
import uuid
import pandas as pd

app = Flask(__name__)
UPLOAD_FOLDER = "static/clips"
DATABASE_FILE = "clips_database.csv"
MIN_DURATION = 15

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def transcribe_and_clip(video_path):
    model = whisper.load_model("base")
    result = model.transcribe(video_path, word_timestamps=True)
    segments = result["segments"]
    language = result.get("language", "en")
    video = mp.VideoFileClip(video_path)
    clips = []

    for i, seg in enumerate(segments):
        start = seg["start"]
        end = seg["end"]
        duration = end - start
        if duration < MIN_DURATION:
            continue

        clip_filename = f"clip_{uuid.uuid4().hex[:8]}.mp4"
        out_path = os.path.join(UPLOAD_FOLDER, clip_filename)
        video.subclip(start, end).write_videofile(out_path, codec="libx264", audio_codec="aac")

        clips.append({
            "file_name": clip_filename,
            "start": round(start, 2),
            "end": round(end, 2),
            "subtitle": seg["text"].strip(),
            "lang": language
        })

    df = pd.DataFrame(clips)
    df.to_csv(DATABASE_FILE, index=False)
    return clips

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files.get("video")
        yt_link = request.form.get("yt_link")
        video_path = None

        try:
            if file and file.filename:
                video_path = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(video_path)

            elif yt_link:
                yt = YouTube(yt_link)
                stream = yt.streams.filter(file_extension="mp4", progressive=True).order_by("resolution").desc().first()
                video_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex[:6]}.mp4")
                stream.download(filename=video_path)

            if video_path:
                transcribe_and_clip(video_path)

        except Exception as e:
            return f"<h2 style='color:red;'>Error: {str(e)}</h2>"

        return redirect(url_for("uploads"))

    return render_template("index.html")

@app.route("/uploads")
def uploads():
    if not os.path.exists(DATABASE_FILE):
        return render_template("uploads.html", clips=[])

    df = pd.read_csv(DATABASE_FILE)
    return render_template("uploads.html", clips=df.to_dict(orient="records"))

@app.route("/save_subtitle", methods=["POST"])
def save_subtitle():
    data = request.get_json()
    filename = data['filename']
    subtitle = data['subtitle']
    lang = data['lang']

    df = pd.read_csv(DATABASE_FILE)
    df.loc[df['file_name'] == filename, 'subtitle'] = subtitle
    df.loc[df['file_name'] == filename, 'lang'] = lang
    df.to_csv(DATABASE_FILE, index=False)

    return jsonify({"message": "Saved successfully!"})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
