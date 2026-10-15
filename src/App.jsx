import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SceneAudioPlayer from './components/SceneAudioPlayer';
import SceneVideoReveal from './components/SceneVideoReveal';
import QuestionCard from './components/QuestionCard';
import TimerRing from './components/TimerRing';
import GameOverModal from './components/GameOverModal';
import { SCENES } from './data/scenesData';
import { shuffleArray, generateQuestionOptions } from './utils/quizUtils';

const QUESTION_TIME_LIMIT = 30;

export default function App() {
  const scenes = SCENES;

  // Game state
  const [gameState, setGameState] = useState('START'); // 'START' | 'PLAYING' | 'GAME_OVER'
  const [quizQueue, setQuizQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questionCount, setQuestionCount] = useState(14);

  // Current question sub-phase: 'GUESSING' (audio only) | 'REVEALED' (video scene revealed)
  const [phase, setPhase] = useState('GUESSING');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  // Scoring & Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);

  // Current active scene
  const currentScene = quizQueue[currentIndex] || null;

  // Initialize a new game session
  const startGame = useCallback(() => {
    let pool = [...scenes];
    if (selectedDifficulty !== 'all') {
      pool = pool.filter((s) => s.difficulty === selectedDifficulty);
      if (pool.length === 0) pool = [...scenes];
    }

    const shuffled = shuffleArray(pool);
    const selectedQueue = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setQuizQueue(selectedQueue);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setGameHistory([]);
    setGameState('PLAYING');
    setupQuestion(selectedQueue[0]);
  }, [scenes, selectedDifficulty, questionCount]);

  // Setup a question
  const setupQuestion = useCallback((scene) => {
    if (!scene) return;
    const options = generateQuestionOptions(scene);
    setCurrentOptions(options);
    setSelectedOption(null);
    setHintRevealed(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsTimerPaused(false);
    setLastPointsEarned(0);
    setPhase('GUESSING');
  }, []);

  // Timer countdown effect during GUESSING phase
  useEffect(() => {
    if (gameState !== 'PLAYING' || phase !== 'GUESSING' || isTimerPaused) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, phase, isTimerPaused, timeLeft]);

  // User submits answer
  const handleSelectOption = (option) => {
    if (phase !== 'GUESSING') return;

    setIsTimerPaused(true);
    setSelectedOption(option);

    let points = 0;
    if (option.isCorrect) {
      const timeBonus = timeLeft * 25;
      const streakBonus = streak * 100;
      const penalty = hintRevealed ? 150 : 0;
      points = Math.max(200, 1000 + timeBonus + streakBonus - penalty);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setScore((prev) => prev + points);
    } else {
      setStreak(0);
    }

    setLastPointsEarned(points);
    setGameHistory((prev) => [
      ...prev,
      {
        scene: currentScene,
        userAnswer: option,
        isCorrect: option.isCorrect,
        points
      }
    ]);

    // Transition to REVEALED phase — show video
    setPhase('REVEALED');
  };

  // Timeout event
  const handleTimeout = () => {
    setIsTimerPaused(true);
    setStreak(0);
    setLastPointsEarned(0);
    setSelectedOption(null);

    setGameHistory((prev) => [
      ...prev,
      {
        scene: currentScene,
        userAnswer: null,
        isCorrect: false,
        points: 0,
        isTimeout: true
      }
    ]);

    setPhase('REVEALED');
  };

  // Advance to next question or complete game
  const handleNextQuestion = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < quizQueue.length) {
      setCurrentIndex(nextIdx);
      setupQuestion(quizQueue[nextIdx]);
    } else {
      setGameState('GAME_OVER');
    }
  };

  const handleRestart = () => {
    setGameState('START');
  };

  return (
    <div className="app-root">
      {/* Dynamic ambient backdrop */}
      <div className="ambient-background">
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
        <div className="cyber-grid-overlay" />
      </div>

      <Navbar
        currentQuestionIndex={currentIndex}
        totalQuestions={quizQueue.length}
        score={score}
        streak={streak}
        onRestartGame={handleRestart}
        gameStarted={gameState === 'PLAYING'}
      />

      <main className="main-content-stage">
        {/* START SCREEN */}
        {gameState === 'START' && (
          <div className="start-screen-container glass-panel animate-scale-up">
            <div className="hero-badge">
              <span className="badge-spark">⚡</span> ANIME VOICE RECOGNITION CHALLENGE
            </div>

            <h1 className="hero-title">
              GUESS THE <span className="neon-text">ANIME CHARACTER</span> BY VOICE
            </h1>

            <p className="hero-description">
              Listen to iconic dialogue from famous anime scenes — only the audio plays!
              Pick the right character, then watch the full scene video reveal with the answer.
            </p>

            {/* How It Works 3-Step Banner */}
            <div className="how-it-works-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">🎧</div>
                <h3>Listen to Audio Only</h3>
                <p>The scene video is hidden — only the character's voice plays. Focus on the tone and dialogue!</p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">🎯</div>
                <h3>Pick the Character</h3>
                <p>Choose from 4 options. Use keyboard shortcuts [1]-[4] for speed. Faster = more points!</p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">🎬</div>
                <h3>Watch the Scene</h3>
                <p>The full video plays with the answer revealed — see the character, voice actor, and iconic quote!</p>
              </div>
            </div>

            {/* Game Options */}
            <div className="start-controls-panel">
              <div className="control-group">
                <label className="control-label">Difficulty Filter</label>
                <div className="difficulty-pills">
                  {['all', 'easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      className={`pill-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label className="control-label">Number of Scenes</label>
                <div className="count-pills">
                  {[5, 7, 10, 14].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`pill-btn ${questionCount === num ? 'active' : ''}`}
                      onClick={() => setQuestionCount(num)}
                    >
                      {num} {num === 14 ? '(ALL)' : 'SCENES'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scene count info */}
            <div className="scene-count-info">
              {scenes.length} anime scenes loaded and ready to play
            </div>

            {/* Launch CTA */}
            <div className="start-actions-row">
              <button
                type="button"
                className="btn-start-game pulse-btn"
                onClick={startGame}
              >
                <span className="btn-play-icon">▶</span>
                <span>START QUIZ NOW</span>
              </button>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'PLAYING' && currentScene && (
          <div className="quiz-stage-container animate-fade-in">
            {/* Top Stage Bar: Scene Info & Timer */}
            <div className="stage-top-bar">
              <div className="scene-indicator-box">
                <span className="scene-lead">SCENE {currentIndex + 1} OF {quizQueue.length}</span>
                <span className="difficulty-tag">{currentScene.difficulty.toUpperCase()}</span>
              </div>

              {phase === 'GUESSING' && (
                <TimerRing
                  timeLeft={timeLeft}
                  totalTime={QUESTION_TIME_LIMIT}
                  isPaused={isTimerPaused}
                />
              )}
            </div>

            {/* PHASE 1: GUESSING (Audio Only Mode) */}
            {phase === 'GUESSING' && (
              <div className="guessing-phase-grid">
                <div className="left-audio-panel">
                  <SceneAudioPlayer
                    scene={currentScene}
                    hintRevealed={hintRevealed}
                    onRevealHint={() => setHintRevealed(true)}
                  />
                </div>

                <div className="right-question-panel">
                  <QuestionCard
                    options={currentOptions}
                    onSelectOption={handleSelectOption}
                    selectedOption={selectedOption}
                    disabled={false}
                  />
                </div>
              </div>
            )}

            {/* PHASE 2: REVEALED (Full Video Scene + Feedback) */}
            {phase === 'REVEALED' && (
              <div className="revealed-phase-wrapper">
                <SceneVideoReveal
                  scene={currentScene}
                  userAnswer={selectedOption}
                  isTimeout={selectedOption === null && timeLeft <= 0}
                  pointsEarned={lastPointsEarned}
                  onNextQuestion={handleNextQuestion}
                />
              </div>
            )}
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'GAME_OVER' && (
          <GameOverModal
            score={score}
            history={gameHistory}
            onPlayAgain={startGame}
          />
        )}
      </main>
    </div>
  );
}
