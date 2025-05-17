# 🎬 CutGenius

**AI-powered video clipping and subtitle translation** tool to generate viral-ready TikToks, YouTube Shorts, and Instagram Reels—faster than ever.

---

### ✨ Features

- 🎞 Upload local or YouTube videos
- 🧠 Auto-transcribe using Whisper
- 🌐 Translate subtitles (English, Spanish, Russian, etc.)
- ✂️ Auto-highlight viral moments
- 📤 Upload or export clips
- 💬 Export `.srt` subtitle files
- 🎨 Beautiful pastel UI with responsive layout

---

### 🚀 Setup

```bash
npm install
npm start

🧱 Structure
File	Description
src/CutGeniusApp.jsx	Main app logic (hook up here if not yet)
src/index.js	Entry point for React
src/index.css	Tailwind CSS imports and theme styling
public/index.html	Mounting point for app

🧠 Backend API Endpoints Expected
POST /api/transcribe → Returns { transcript: [...] }

POST /api/translate → { transcript, targetLang } → { translated: [...] }

POST /api/upload-clip → Social media upload

POST /api/export-clip → Trims and returns clip .mp4

🧑‍🎨 Author
Built with love by @rialunochka 💛
Proudly pastel. Always viral.
