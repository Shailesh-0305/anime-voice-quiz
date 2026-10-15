import React, { useState, useEffect, useRef } from 'react';
import AudioVisualizer from './AudioVisualizer';

export default function SceneAudioPlayer({
  scene,
  hintRevealed,
  onRevealHint
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  const videoRef = useRef(null);

  // Video URL that provides audio (hidden — user never sees the video)
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const videoUrl = `${cleanBase}Scenes/${encodeURIComponent(scene.videoFilename)}`;

  useEffect(() => {
    // Reset on scene change
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasAutoPlayed(false);

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [scene.id]);

  const handleCanPlay = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.volume = volume;

      // Auto-play audio on load
      if (!hasAutoPlayed) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasAutoPlayed(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="scene-audio-card glass-panel">
      {/* Hidden video element — extracts audio only, never displayed */}
      <video
        ref={videoRef}
        src={videoUrl}
        preload="auto"
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      />

      <div className="scene-status-row">
        <div className="scene-id-badge">
          <span className="sparkle">✨</span> SCENE VOICE CLUE
        </div>
        <span className="file-badge success">
          <span className="status-dot green" /> Audio Extracted from Scene
        </span>
      </div>

      {/* Audio Visualizer — shows animated bars while playing */}
      <AudioVisualizer isPlaying={isPlaying} />

      {/* Audio Controls */}
      <div className="audio-controls-container">
        <div className="controls-main-row">
          <button
            type="button"
            className={`btn-play-pause ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play Audio'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>{isPlaying ? 'PAUSE' : 'PLAY VOICE'}</span>
          </button>

          <button
            type="button"
            className="btn-replay"
            onClick={handleReplay}
            title="Replay from start"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>REPLAY</span>
          </button>

          <div className="time-display">
            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
          </div>

          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              title="Volume"
            />
          </div>
        </div>

        {/* Timeline bar */}
        <div className="timeline-row">
          <input
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="timeline-slider"
          />
        </div>
      </div>

      {/* Hint Section */}
      <div className="hint-container">
        {hintRevealed ? (
          <div className="hint-revealed animate-fade-in">
            <span className="hint-tag">💡 ANIME HINT:</span>
            <span className="hint-anime">{scene.anime}</span>
          </div>
        ) : (
          <button
            type="button"
            className="btn-hint"
            onClick={onRevealHint}
          >
            <span className="hint-icon">💡</span> Reveal Anime Name (-150 pts)
          </button>
        )}
      </div>
    </div>
  );
}
