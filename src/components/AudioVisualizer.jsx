import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isPlaying = true, audioRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const barCount = 48;
    const heights = new Array(barCount).fill(4);

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      for (let i = 0; i < barCount; i++) {
        // Target height based on playing state & sine waves to simulate voice rhythm
        let targetHeight = 6;
        if (isPlaying) {
          const wave1 = Math.sin((time * 0.005) + (i * 0.25));
          const wave2 = Math.cos((time * 0.008) - (i * 0.15));
          const wave3 = Math.sin((time * 0.003) + (i * 0.4));
          const amplitude = Math.max(0.08, (wave1 + wave2 + wave3 + 2.5) / 5);
          targetHeight = 8 + amplitude * (height * 0.85);
        }

        // Smooth transition
        heights[i] += (targetHeight - heights[i]) * 0.2;

        const x = i * (barWidth + gap) + gap / 2;
        const barHeight = heights[i];
        const y = (height - barHeight) / 2;

        // Gradient from cyan through violet to hot pink
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3]);
        ctx.fill();

        // Top glow dot
        if (isPlaying && barHeight > 25) {
          ctx.fillStyle = '#f472b6';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y, barWidth / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="visualizer-container">
      <div className="visualizer-header">
        <span className="live-indicator">
          <span className={`pulse-dot ${isPlaying ? 'active' : ''}`} />
          {isPlaying ? 'AUDIO PLAYING' : 'AUDIO PAUSED'}
        </span>
        <span className="audio-mode-pill">🎧 GUESS BY VOICE ONLY</span>
      </div>
      
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={640} height={120} className="visualizer-canvas" />
      </div>

      <div className="visualizer-footer">
        <span className="visualizer-hint">
          Listen carefully to the voice, tone, and inflection in the scene...
        </span>
      </div>
    </div>
  );
}
