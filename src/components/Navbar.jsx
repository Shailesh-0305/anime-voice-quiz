import React from 'react';

export default function Navbar({
  currentQuestionIndex,
  totalQuestions,
  score,
  streak,
  onRestartGame,
  gameStarted
}) {
  return (
    <header className="navbar-container glass-nav">
      <div className="navbar-brand" onClick={onRestartGame} title="Return to Title Screen" style={{ cursor: 'pointer' }}>
        <div className="brand-logo-icon">
          <span className="logo-sparkle">⚡</span>
          <span className="logo-mic">🎙️</span>
        </div>
        <div className="brand-text-col">
          <div className="brand-title">
            <span className="brand-anime">ANIME</span>
            <span className="brand-scene">SCENE</span>
            <span className="brand-quiz">QUIZ</span>
          </div>
          <span className="brand-subtitle">Listen to Voice → Guess Character → Watch Scene</span>
        </div>
      </div>

      {gameStarted && (
        <div className="navbar-game-stats">
          <div className="stat-pill counter-pill">
            <span className="stat-label">SCENE</span>
            <span className="stat-value">{currentQuestionIndex + 1} / {totalQuestions}</span>
          </div>

          <div className="stat-pill score-pill">
            <span className="stat-label">SCORE</span>
            <span className="stat-value highlight-score">{score.toLocaleString()}</span>
          </div>

          <div className="stat-pill streak-pill">
            <span className="stat-label">STREAK</span>
            <span className="stat-value">
              {streak > 0 && <span className="streak-flame">🔥</span>}
              {streak}x
            </span>
          </div>
        </div>
      )}

      <div className="navbar-actions">
        {gameStarted && (
          <button
            type="button"
            className="btn-nav-restart"
            onClick={onRestartGame}
            title="Reset Quiz"
          >
            <span className="btn-icon">↺</span>
            <span className="btn-text">Reset</span>
          </button>
        )}
      </div>
    </header>
  );
}
