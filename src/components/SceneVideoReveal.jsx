import React, { useState, useEffect, useRef } from 'react';

export default function SceneVideoReveal({
  scene,
  userAnswer,
  isTimeout,
  pointsEarned,
  onNextQuestion
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const isCorrect = userAnswer && userAnswer.isCorrect;
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const videoSrc = `${cleanBase}Scenes/${encodeURIComponent(scene.videoFilename)}`;

  // Keyboard shortcut for Enter → Next Question
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextQuestion]);

  // Autoplay the full video when entering reveal phase
  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 0.9;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [scene.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true));
  };

  return (
    <div className="scene-reveal-container glass-panel animate-scale-up">
      {/* Result Status Banner */}
      <div className={`result-banner ${isCorrect ? 'banner-correct' : isTimeout ? 'banner-timeout' : 'banner-incorrect'}`}>
        <div className="result-banner-icon">
          {isCorrect ? '✅' : isTimeout ? '⏰' : '❌'}
        </div>
        <div className="result-banner-content">
          <h2 className="result-title">
            {isCorrect ? 'CORRECT!' : isTimeout ? 'TIME\'S UP!' : 'WRONG!'}
          </h2>
          <p className="result-subtitle">
            {isCorrect
              ? `You nailed it! +${pointsEarned} points earned!`
              : `The character was ${scene.characterName} from ${scene.anime}`}
          </p>
        </div>
        <div className="result-points-pill">
          {isCorrect ? `+${pointsEarned} PTS` : '+0 PTS'}
        </div>
      </div>

      {/* Full Video Reveal — THIS IS THE SCENE */}
      <div className="video-cinema-stage">
        <div className="cinema-header">
          <span className="cinema-tag">🎬 SCENE REVEAL</span>
          <span className="cinema-voice-tag">Now you can see who it was!</span>
        </div>

        <div className="video-frame-container">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="scene-video-player"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <div className="cinema-actions-bar">
          <button type="button" className="btn-cinema-action" onClick={togglePlay}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button type="button" className="btn-cinema-action" onClick={handleReplay}>
            🔄 Replay
          </button>
        </div>
      </div>

      {/* Character Info Card */}
      <div className="character-dossier-grid">
        <div className="dossier-avatar-col">
          <div className="avatar-circle">
            <span className="avatar-emoji">{scene.characterAvatar || '🎌'}</span>
          </div>
          <span className="difficulty-pill">{scene.difficulty.toUpperCase()}</span>
        </div>

        <div className="dossier-details-col">
          <div className="dossier-header-row">
            <h1 className="character-name-hero">{scene.characterName}</h1>
            <span className="anime-series-badge">{scene.anime}</span>
          </div>

          <div className="voice-actor-row">
            <span className="va-label">🎙️ VOICE ACTOR (CV):</span>
            <span className="va-name">{scene.voiceActor}</span>
          </div>

          <div className="quote-box">
            <span className="quote-mark">"</span>
            <p className="dialogue-quote">{scene.quote}</p>
            <span className="quote-mark end">"</span>
          </div>
        </div>
      </div>

      {/* Next Question CTA */}
      <div className="next-action-footer">
        <button
          type="button"
          className="btn-next-question pulse-btn"
          onClick={onNextQuestion}
          autoFocus
        >
          <span>Next Scene</span>
          <span className="key-hint">[Enter ↵]</span>
        </button>
      </div>
    </div>
  );
}
