import React from 'react';

export default function TimerRing({
  timeLeft,
  totalTime = 20,
  isPaused = false
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const strokeDashoffset = circumference - (progress * circumference);

  let colorClass = 'timer-safe';
  if (timeLeft <= 5) {
    colorClass = 'timer-critical';
  } else if (timeLeft <= 10) {
    colorClass = 'timer-warning';
  }

  return (
    <div className={`timer-ring-container ${colorClass} ${timeLeft <= 5 && !isPaused ? 'pulsing-fast' : ''}`}>
      <svg className="timer-svg" width="80" height="80" viewBox="0 0 80 80">
        <circle
          className="timer-track"
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="6"
        />
        <circle
          className="timer-progress"
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="timer-number-wrapper">
        <span className="timer-number">{timeLeft}</span>
        <span className="timer-sec-label">SEC</span>
      </div>
    </div>
  );
}
