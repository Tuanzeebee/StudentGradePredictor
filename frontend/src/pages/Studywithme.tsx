import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder SVG data URLs for missing icons
const placeholderIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNCAxNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNyAxIDEzIDcgNyAxMyAxIDciIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==";

const backIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDEySDRsNS01djNIMjB2NGgtMTF2M2w1LTV6Ii8+PC9zdmc+";

const playIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggNXYxNGwxMS03eiIvPjwvc3ZnPg==";

const pauseIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYgMTloNFY1SDZ2MTR6bTgtMTRoNHYxNGgtNFY1eiIvPjwvc3ZnPg==";

const resetIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDUgNy4yIDkuOGwxLjQgMS40IDIuNC0yLjRWMTVoLTJhNSA1IDAgMSAwIDUgNXY0YTkgOSAwIDEgMS05LTlaIi8+PC9zdmc+";

const settingsIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiM2YjcyODAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTVhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2eiIvPjxwYXRoIGQ9Ik0xOS40IDEzYy0uMy0uNC0uNi0uOC0xLTEuMWwtLjQtLjN2LS45YzAtLjQtLjEtLjgtLjItMS4xIDAtLjQuMS0uOC4yLTEuMXYtLjlsLjQtLjNjLjQtLjMuNy0uNyAxLTEuMUwxNy42IDVjLS40LS40LS44LS42LTEuMS0xbC0uMy0uNGgtLjljLS40IDAtLjgtLjEtMS4xLS4yLS40IDAtLjguMS0xLjEuMmgtLjlsLS4zLS40Yy0uMy0uNC0uNy0uNy0xLjEtMUw5IDEuNGMtLjQuNC0uNi44LTEgMS4xbC0uNC4zaC0uOWMtLjQgMC0uOC4xLTEuMS4yIDAgLjQtLjEuOC0uMiAxLjFoLS45bC0uMy40Yy0uNC4zLS43LjctMSAxLjFMMS40IDZjLjQuNC42LjggMSAxLjFsLjMuNHYuOWMwIC40LjEuOC4yIDEuMS0uNC4xLS44LjItMS4xLjJ2LjlsLS4zLjRjLS40LjMtLjcuNy0xIDEuMWwxLjYgMS42Yy40LS40LjgtLjYgMS4xLTFsLjMtLjRoLjljLjQgMCAuOC0uMSAxLjEtLjIuNCAwIC44LjEgMS4xLjJoLjlsLjMuNGMuMy40LjcuNyAxLjEgMUw5IDE5YzQuNC0uNC42LS44IDEtMS4xbC40LS4zdi0uOWMwLS40LjEtLjguMi0xLjEgMCAuNC4xLjguMiAxLjF2LjlsLjQuM2MuNC4zLjcuNyAxIDEuMWwxLjYtMS42eiIvPjwvc3ZnPg==";

const nextIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYgNHYxNmwxMi04TDYgNHpNMTggNHYxNmgyVjRoLTJ6Ii8+PC9zdmc+";

const prevIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE4IDR2MTZMMTIgMTJsNi04em0tMTIgMHYxNmgyVjRINnoiLz48L3N2Zz4=";

const Studywithme: React.FC = () => {
  const navigate = useNavigate();
  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [sessionCount, setSessionCount] = useState(0);
  
  // Music player state
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer durations in seconds
  const durations = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  // Study music playlist with real YouTube embeds
  const playlist = [
    { 
      title: "Lofi Hip Hop Radio - beats to relax/study to", 
      artist: "Lofi Girl", 
      duration: "24/7 Live",
      embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault_live.jpg"
    },
    { 
      title: "Deep Focus Music - Enhanced Concentration", 
      artist: "Greenred Productions", 
      duration: "3:00:00",
      embedUrl: "https://www.youtube.com/embed/6p0DAz_30qQ?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/6p0DAz_30qQ/maxresdefault.jpg"
    },
    { 
      title: "Peaceful Piano & Soft Rain", 
      artist: "Soothing Relaxation", 
      duration: "2:45:12",
      embedUrl: "https://www.youtube.com/embed/1ZYbU82GVz4?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/1ZYbU82GVz4/maxresdefault.jpg"
    },
    { 
      title: "Study Music Alpha Waves", 
      artist: "Study Music Project", 
      duration: "4:22:18",
      embedUrl: "https://www.youtube.com/embed/WPni755-Krg?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/WPni755-Krg/maxresdefault.jpg"
    },
    { 
      title: "Chillhop Essentials - Chill Instrumental Hip Hop", 
      artist: "Chillhop Music", 
      duration: "1:58:44",
      embedUrl: "https://www.youtube.com/embed/5yx6BWlEVcY?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/5yx6BWlEVcY/maxresdefault.jpg"
    },
    { 
      title: "Forest Sounds - Birds Chirping Nature Sounds", 
      artist: "Relaxing Sounds of Nature", 
      duration: "2:30:00",
      embedUrl: "https://www.youtube.com/embed/xNN7iTA57jM?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3",
      thumbnail: "https://i.ytimg.com/vi/xNN7iTA57jM/maxresdefault.jpg"
    }
  ];

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsPaused(false);
      // Timer finished - increment session count
      if (mode === 'pomodoro') {
        setSessionCount(prev => prev + 1);
      }
      // Auto switch mode after timer finishes
      if (mode === 'pomodoro') {
        changeMode(sessionCount % 4 === 3 ? 'longBreak' : 'shortBreak');
      } else {
        changeMode('pomodoro');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, sessionCount]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode change handlers
  const changeMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsActive(false);
    setIsPaused(false);
  };

  // Control handlers
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(durations[mode]);
  };

  // Music controls
  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % playlist.length);
    // Auto play next song if currently playing
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
    // Auto play previous song if currently playing
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col">
      
      {/* Header with Session Counter and Back Button */}
      <div className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/prediction-details')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <img src={backIcon} alt="Back" className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Prediction Details</span>
          </button>
          <div className="text-lg font-semibold">
            Study With Me - Focus Session
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-80">Sessions Completed</div>
          <div className="text-2xl font-bold">{sessionCount}</div>
        </div>
      </div>

      <div className="flex-1 flex">
        
        {/* Left Panel - Music Player */}
        <div className="w-80 p-6 flex flex-col">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">🎵 Study Playlist</h3>
            
            {/* Current Song Display */}
            <div className="mb-6">
              {/* YouTube Embed Player */}
              {isPlaying ? (
                <div className="w-full h-32 rounded-lg overflow-hidden mb-3 relative">
                  <iframe
                    width="100%"
                    height="128"
                    src={playlist[currentSong].embedUrl}
                    title={playlist[currentSong].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg pointer-events-none"
                    style={{ 
                      border: 'none',
                      outline: 'none'
                    }}
                  ></iframe>
                  {/* Custom overlay to hide YouTube branding completely */}
                  <div 
                    className="absolute inset-0 bg-transparent pointer-events-none"
                    style={{ zIndex: 1 }}
                  ></div>
                </div>
              ) : (
                <div 
                  className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-cover bg-center relative cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  style={{ 
                    backgroundImage: playlist[currentSong].thumbnail ? `url(${playlist[currentSong].thumbnail})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  onClick={toggleMusic}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                  <div className="relative text-4xl text-white">🎵</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
                      <img src={playIcon} alt="Play" className="w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
              )}
              <div className="text-sm font-medium">{playlist[currentSong].title}</div>
              <div className="text-xs opacity-70">{playlist[currentSong].artist}</div>
              <div className="text-xs opacity-50">{playlist[currentSong].duration}</div>
            </div>

            {/* Music Controls */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <button
                onClick={prevSong}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <img src={prevIcon} alt="Previous" className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleMusic}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <img 
                  src={isPlaying ? pauseIcon : playIcon} 
                  alt={isPlaying ? "Pause" : "Play"} 
                  className="w-6 h-6" 
                />
              </button>
              
              <button
                onClick={nextSong}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <img src={nextIcon} alt="Next" className="w-5 h-5" />
              </button>
            </div>

            {/* Open in YouTube button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  // Extract video ID from embed URL
                  const videoId = playlist[currentSong].embedUrl.match(/embed\/([^?]+)/)?.[1];
                  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                  window.open(youtubeUrl, '_blank');
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-2"
              >
                📱 Open in YouTube
              </button>
            </div>

            {/* Playlist */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentSong(index);
                    if (isPlaying) {
                      setIsPlaying(false);
                      setTimeout(() => setIsPlaying(true), 100);
                    }
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                    index === currentSong ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded bg-cover bg-center flex-shrink-0"
                    style={{ 
                      backgroundImage: song.thumbnail ? `url(${song.thumbnail})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{song.title}</div>
                    <div className="text-xs opacity-70 truncate">{song.artist}</div>
                  </div>
                  {index === currentSong && isPlaying && (
                    <div className="text-green-400 text-xs">🎵</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Timer */}
        <div className="flex-1 flex flex-col justify-center items-center px-8">
          
          {/* Mode Selection */}
          <div className="flex gap-3 mb-12">
            <button
              onClick={() => changeMode('pomodoro')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                mode === 'pomodoro'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'border-2 border-white/50 text-white hover:bg-white/10'
              }`}
            >
              🍅 Pomodoro (25m)
            </button>
            <button
              onClick={() => changeMode('shortBreak')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                mode === 'shortBreak'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'border-2 border-white/50 text-white hover:bg-white/10'
              }`}
            >
              ☕ Short Break (5m)
            </button>
            <button
              onClick={() => changeMode('longBreak')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                mode === 'longBreak'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'border-2 border-white/50 text-white hover:bg-white/10'
              }`}
            >
              🛋️ Long Break (15m)
            </button>
          </div>

          {/* Timer Circle */}
          <div className="relative w-96 h-96 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-mono font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xl text-white/80">
                {mode === 'pomodoro' ? '🎯 Focus Time' : 
                 mode === 'shortBreak' ? '☕ Short Break' : '🛋️ Long Break'}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isActive && !isPaused ? (
              <button
                onClick={startTimer}
                className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                ▶️ Start
              </button>
            ) : isActive ? (
              <button
                onClick={pauseTimer}
                className="px-12 py-4 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                ⏸️ Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                ▶️ Resume
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <img src={resetIcon} alt="Reset" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Panel - Stats & Settings */}
        <div className="w-80 p-6 flex flex-col">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white mb-6">
            <h3 className="text-lg font-semibold mb-4">📊 Today's Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Pomodoros:</span>
                <span className="font-bold">{sessionCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Focus Time:</span>
                <span className="font-bold">{Math.floor(sessionCount * 25)} min</span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-bold">{sessionCount > 0 ? '🔥 ' + sessionCount : '0'}</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-white/10 rounded-lg">
              <div className="text-sm opacity-80 mb-1">Progress</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((sessionCount / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs opacity-70 mt-1">{sessionCount}/8 daily goal</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">⚙️ Quick Settings</h3>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-all">
                🔊 Volume Control
              </button>
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-all">
                🌙 Dark Mode
              </button>
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-all">
                📈 View Analytics
              </button>
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-all">
                <img src={settingsIcon} alt="Settings" className="w-4 h-4 inline mr-2" />
                More Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studywithme;
