import React, { useState } from 'react';

export default function GameOverModal({
  score,
  history,
  onPlayAgain
}) {
  const [selectedReviewScene, setSelectedReviewScene] = useState(null);

  const totalQuestions = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Rank
  let rank = { title: 'B-Rank Trainee', color: '#94a3b8', badge: '🔰' };
  if (accuracy >= 90) {
    rank = { title: 'SSS-Rank Divine Voice Master', color: '#fbbf24', badge: '👑' };
  } else if (accuracy >= 80) {
    rank = { title: 'SS-Rank Legendary Otaku', color: '#f43f5e', badge: '🔥' };
  } else if (accuracy >= 65) {
    rank = { title: 'S-Rank Sorcerer', color: '#8b5cf6', badge: '⚡' };
  } else if (accuracy >= 50) {
    rank = { title: 'A-Rank Elite', color: '#06b6d4', badge: '⚔️' };
  }

  return (
    <div className="game-over-container glass-panel animate-scale-up">
      <div className="game-over-header">
        <span className="rank-badge-icon">{rank.badge}</span>
        <h1 className="game-over-title">QUIZ COMPLETE!</h1>
        <p className="game-over-subtitle">How well did you recognize the anime voices?</p>
      </div>

      {/* Rank */}
      <div className="rank-showcase-card" style={{ borderColor: rank.color }}>
        <span className="rank-label">YOUR OTAKU RANK</span>
        <h2 className="rank-hero-title" style={{ color: rank.color }}>{rank.title}</h2>
      </div>

      {/* Stats */}
      <div className="summary-stats-grid">
        <div className="summary-stat-box">
          <span className="stat-sub">FINAL SCORE</span>
          <span className="stat-main score-color">{score.toLocaleString()}</span>
        </div>
        <div className="summary-stat-box">
          <span className="stat-sub">ACCURACY</span>
          <span className="stat-main">{accuracy}%</span>
          <span className="stat-detail">({correctCount} / {totalQuestions} correct)</span>
        </div>
        <div className="summary-stat-box">
          <span className="stat-sub">SCENES</span>
          <span className="stat-main">{totalQuestions}</span>
        </div>
      </div>

      {/* Rewatch overlay */}
      {selectedReviewScene && (
        <div className="rewatch-overlay animate-fade-in">
          <div className="rewatch-card glass-panel">
            <div className="rewatch-header">
              <h3>🎬 {selectedReviewScene.characterName} ({selectedReviewScene.anime})</h3>
              <button type="button" className="btn-close-rewatch" onClick={() => setSelectedReviewScene(null)}>✕</button>
            </div>
            <video
              src={`${(import.meta.env.BASE_URL || './').endsWith('/') ? (import.meta.env.BASE_URL || './') : `${import.meta.env.BASE_URL || './'}/`}Scenes/${encodeURIComponent(selectedReviewScene.videoFilename)}`}
              controls
              autoPlay
              className="rewatch-video"
            />
            <p className="rewatch-quote">"{selectedReviewScene.quote}"</p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="history-breakdown-section">
        <h3 className="breakdown-heading">Scene-by-Scene Breakdown</h3>
        <div className="breakdown-list">
          {history.map((item, idx) => (
            <div key={idx} className={`breakdown-row ${item.isCorrect ? 'row-correct' : 'row-incorrect'}`}>
              <span className="row-num">#{idx + 1}</span>
              <span className="row-result-icon">{item.isCorrect ? '✅' : '❌'}</span>
              <div className="row-info">
                <strong>{item.scene.characterName}</strong>
                <span className="row-anime">({item.scene.anime})</span>
              </div>
              <div className="row-va">CV: {item.scene.voiceActor}</div>
              <div className="row-pts">{item.points > 0 ? `+${item.points}` : '+0'} pts</div>
              <button
                type="button"
                className="btn-rewatch-row"
                onClick={() => setSelectedReviewScene(item.scene)}
                title="Rewatch Scene"
              >
                ▶️ Watch
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Play Again */}
      <div className="game-over-actions">
        <button type="button" className="btn-play-again pulse-btn" onClick={onPlayAgain}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
