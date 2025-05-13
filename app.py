
from flask import Flask, render_template, request, redirect, url_for
import os
import uuid
import yt_dlp
from moviepy.editor import VideoFileClip
import pandas as pd

UPLOAD_FOLDER = "static/clips"
DATABASE_FILE = "static/clips/clips_database.csv"

app = Flask(__name__)

def download_youtube_video(url):
    video_id = str(uuid.uuid4())[:8]
    output_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp4")
    ydl_opts = {
        'format': 'best[ext=mp4]',
        'outtmpl': output_path,
        'quiet': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return output_path

def transcribe_and_clip(video_path):
    clip = VideoFileClip(video_path)
    clip_data = []
    clip_duration = clip.duration
    segments = [(i, min(i + 15, clip_duration)) for i in range(0, int(clip_duration), 15)]
    for i, (start, end) in enumerate(segments):
        subclip = clip.subclip(start, end)
        filename = f"clip_{i+1}.mp4"
        path = os.path.join(UPLOAD_FOLDER, filename)
        subclip.write_videofile(path, codec="libx264", audio_codec="aac", verbose=False, logger=None)
        clip_data.append({"clip_id": f"clip_{i+1}", "file_name": filename, "start": start, "end": end})
    df = pd.DataFrame(clip_data)
    df.to_csv(DATABASE_FILE, index=False)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        video_file = request.files.get("video")
        youtube_link = request.form.get("youtube_link")
        video_path = None

        if video_file and video_file.filename != "":
            video_id = str(uuid.uuid4())[:8]
            video_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp4")
            video_file.save(video_path)

        elif youtube_link:
            try:
                video_path = download_youtube_video(youtube_link)
            except:
                return f"<h3 style='color:red;'>Error: Video is unavailable</h3>"

        if video_path:
            transcribe_and_clip(video_path)

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
