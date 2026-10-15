import React, { useEffect } from 'react';

export default function QuestionCard({
  options,
  onSelectOption,
  selectedOption,
  disabled = false
}) {
  const optionKeys = ['1', '2', '3', '4'];
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Keyboard navigation 1-4
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e) => {
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && idx < options.length) {
        e.preventDefault();
        onSelectOption(options[idx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, disabled, onSelectOption]);

  return (
    <div className="question-card-container">
      <div className="question-title-row">
        <h3 className="question-heading">
          <span className="question-target-icon">🎯</span> Who is speaking in this anime scene?
        </h3>
        <span className="keyboard-prompt">Use keys [1] - [4] or click below</span>
      </div>

      <div className="options-grid">
        {options.map((opt, idx) => {
          const letter = optionLetters[idx];
          const isSelected = selectedOption && selectedOption.name === opt.name;
          
          let stateClass = '';
          if (disabled) {
            if (opt.isCorrect) {
              stateClass = 'option-correct';
            } else if (isSelected && !opt.isCorrect) {
              stateClass = 'option-wrong';
            } else {
              stateClass = 'option-dimmed';
            }
          }

          return (
            <button
              key={`${opt.name}_${idx}`}
              type="button"
              className={`option-btn ${stateClass} ${isSelected ? 'option-selected' : ''}`}
              onClick={() => !disabled && onSelectOption(opt)}
              disabled={disabled}
            >
              <div className="option-badge-col">
                <span className="option-key-badge">{idx + 1}</span>
                <span className="option-letter">{letter}</span>
              </div>

              <div className="option-info-col">
                <span className="option-character-name">{opt.name}</span>
                <span className="option-anime-name">{opt.anime}</span>
              </div>

              {disabled && opt.isCorrect && (
                <div className="option-status-icon check">✓</div>
              )}
              {disabled && isSelected && !opt.isCorrect && (
                <div className="option-status-icon cross">✕</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
