import { ALL_CHARACTERS_POOL } from '../data/scenesData';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates 4 multiple choice options for the current scene
 */
export function generateQuestionOptions(scene, customPool = null) {
  const pool = customPool && customPool.length >= 4 ? customPool : ALL_CHARACTERS_POOL;
  
  const correctOption = {
    name: scene.characterName,
    anime: scene.anime,
    isCorrect: true
  };

  // Filter out the correct character from the pool
  const candidates = pool.filter(c => c.name.toLowerCase() !== scene.characterName.toLowerCase());
  
  // Pick 3 unique distractors
  const shuffledCandidates = shuffleArray(candidates);
  const distractors = shuffledCandidates.slice(0, 3).map(c => ({
    name: c.name,
    anime: c.anime,
    isCorrect: false
  }));

  return shuffleArray([correctOption, ...distractors]);
}

/**
 * Checks if a video file is accessible in the Scenes folder
 */
export async function checkFileExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Procedural anime audio chime generator when video file is not yet downloaded
 */
export function playProceduralVoiceChime(seed = 1) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    const frequencies = [330, 440, 554, 659, 880];
    const baseFreq = frequencies[Math.abs(seed) % frequencies.length];
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 1.2);
    
    // Filter for anime aura synth vibe
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(4, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 1.5);
  } catch (e) {
    // Ignore audio context errors if user hasn't interacted
  }
}
