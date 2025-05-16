import React, { useState, useEffect } from 'react';
import { FaTiktok, FaYoutube, FaInstagram, FaUserCircle, FaCog } from 'react-icons/fa';

// Search and filter component
function ClipSearchFilter({ searchTerm, onSearch }) {
  return (
    <div className="max-w-4xl mx-auto mb-4">
      <input
        type="text"
        placeholder="Search clips..."
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}

// Onboarding tour modal
function OnboardingTour({ onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Upload Video', content: 'Upload a video or enter a YouTube URL in the Upload section.' },
    { title: 'View Status', content: 'Monitor processing status in the Processing Status panel.' },
    { title: 'Trim Clips', content: 'Use Trim controls below each clip to set start and end points.' },
    { title: 'Share', content: 'Share your clips using the Social Share buttons.' }
  ];
  const current = steps[step];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-2">{current.title}</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-200">{current.content}</p>
        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-500">Skip</button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Next</button>
          ) : (
            <button onClick={onClose} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Done</button>
          )}
        </div>
      </div>
    </div>
  );
}

// Top navigation bar
function NavBar({ onToggleSettings }) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">CutGenius</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <FaUserCircle /><span>Profile</span>
          </button>
          <button onClick={onToggleSettings} className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <FaCog /><span>Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// Dark mode toggle
function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

// Video upload component
function VideoUpload({ onUpload }) {
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const handleFileChange = e => setVideoFile(e.target.files[0]);
  const handleUploadClick = () => {
    if (!videoFile && !youtubeUrl) return;
    setUploading(true);
    onUpload(videoFile || youtubeUrl);
  };
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Upload Video</h2>
      <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-yellow-500 rounded-lg p-8 text-center cursor-pointer">
        <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
        <span className="text-gray-500 dark:text-gray-400">Drag &amp; drop a video or click to select</span>
        {videoFile && <p className="mt-2 text-gray-700 dark:text-gray-200 truncate">{videoFile.name}</p>}
      </label>
      <input
        type="text"
        placeholder="Or enter YouTube URL"
        value={youtubeUrl}
        onChange={e => setYoutubeUrl(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        disabled={uploading || (!videoFile && !youtubeUrl)}
        onClick={handleUploadClick}
        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {uploading ? 'Processing...' : 'Start Processing'}
      </button>
    </div>
  );
}

// Processing status component
function ProcessingStatus({ status, progress }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Processing Status</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{status}</p>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
        <div className="bg-yellow-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{progress}% complete</p>
    </div>
  );
}

// Clips display component
function ClipsDisplay({ clips, onPlay, onDelete }) {
  if (!clips.length) return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center text-gray-500 dark:text-gray-300">No clips generated yet.</div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {clips.map((clip, idx) => (
        <div key={clip.id || idx} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition">
          <p className="font-medium text-gray-800 dark:text-gray-100 mb-2 truncate">{clip.title || `Clip ${idx + 1}`}</p>
          <audio controls src={clip.url} className="w-full mb-4" />
          <div className="mt-auto flex space-x-2">
            <button onClick={() => onPlay(clip)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">Play</button>
            <button onClick={() => onDelete(clip)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Clip trimmer component
function ClipTrimmer({ clip, onTrim }) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(clip.duration || 30);
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Trim Clip</p>
      <div className="flex space-x-2 mt-2">
        <input type="number" value={start} min={0} max={end} onChange={e => setStart(Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
        <span className="text-gray-500 dark:text-gray-400">to</span>
        <input type="number" value={end} min={start} max={clip.duration || 30} onChange={e => setEnd(Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
        <button onClick={() => onTrim(clip.id, start, end)} className="ml-auto bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Trim</button>
      </div>
    </div>
  );
}

// Badge gallery component
function BadgeGallery({ badges }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {badges.map(b => (
        <div key={b.id} className={`p-3 rounded-lg text-center shadow ${b.unlocked ? 'bg-yellow-50' : 'bg-gray-200 dark:bg-gray-700'}`}>
          <div className="text-2xl">{b.icon}</div>
          <p className="mt-1 text-sm font-medium">{b.name}</p>
        </div>
      ))}
    </div>
  );
}

// Social share buttons component
function SocialShareButtons({ clip }) {
  return (
    <div className="flex space-x-4 justify-center">
      <button className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"><FaYoutube /><span>YouTube Shorts</span></button>
      <button className="flex items-center space-x-2 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition"><FaTiktok /><span>TikTok</span></button>
      <button className="flex items-center space-x-2 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition"><FaInstagram /><span>Instagram Reels</span></button>
    </div>
  );
}

// Analytics dashboard component
function AnalyticsDashboard({ clips }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Analytics</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">Total clips: {clips.length}</p>
    </div>
  );
}

// Notification toast component
function NotificationToast({ message, onClose }) {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">{message}</div>;
}

// Settings panel component
function SettingsPanel({ settings, onChange }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow max-w-4xl mx-auto mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Settings</h2>
      <label className="block mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Subtitle Language</span>
        <select value={settings.language} onChange={e => onChange({ ...settings, language: e.target.value })} className="mt-1 block w-full border-gray-300 rounded">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="ru">Russian</option>
        </select>
      </label>
    </div>
  );
}

// Main app component
export default function CutGeniusApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTour, setShowTour] = useState(true);
  const [status, setStatus] = useState('Idle');
  const [progress, setProgress] = useState(0);
  const [clips, setClips] = useState([]);
  const [badges, setBadges] = useState([]);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({ language: 'en' });

  const showNotification = msg => setToast(msg);
  const handleToggleSettings = () => setShowSettings(s => !s);
  const handleCloseTour = () => setShowTour(false);

  const handleUpload = input => {
    setStatus('Uploading'); setProgress(10);
    setTimeout(() => { setStatus('Clipping AI...'); setProgress(50); }, 1000);
    setTimeout(() => { setStatus('Finalizing'); setProgress(90); }, 2500);
    setTimeout(() => {
      setStatus('Completed'); setProgress(100);
      const newClips = [
        { id: '1', title: 'Intro Clip', url: '#' },
        { id: '2', title: 'Highlight Clip', url: '#' }
      ];
      setClips(newClips);
      setBadges([{ id: 'clip', name: 'First Clip', icon: '🎬', unlocked: true }]);
      showNotification('New badge unlocked!');
    }, 3500);
  };

  const handleTrim = (id, start, end) => showNotification(`Trimmed clip ${id} from ${start}s to ${end}s`);

  const filteredClips = clips.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      {showTour && <OnboardingTour onClose={handleCloseTour} />}
      <NavBar onToggleSettings={handleToggleSettings} />
      {showSettings && <SettingsPanel settings={settings} onChange={setSettings} />}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 space-y-8">
        <ClipSearchFilter searchTerm={searchTerm} onSearch={setSearchTerm} />
        <div className="flex justify-end"><DarkModeToggle /></div>
        <VideoUpload onUpload={handleUpload} />
        <ProcessingStatus status={status} progress={progress} />
        <ClipsDisplay clips={filteredClips} onPlay={() => {}} onDelete={c => setClips(clips.filter(x => x.id !== c.id))} />
        {filteredClips.map(c => <ClipTrimmer key={c.id} clip={{ ...c, duration: 30 }} onTrim={handleTrim} />)}
        <SocialShareButtons clip={filteredClips[0] || { url: '' }} />
        <AnalyticsDashboard clips={filteredClips} />
        <BadgeGallery badges={badges} />
      </div>
      {toast && <NotificationToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
