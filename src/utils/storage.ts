import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';
import type { HighScore, GameSettings } from '../types';

export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.HIGH_SCORES)) {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}

export function saveHighScore(playerName: string, score: number, gameMode: string = 'classic'): void {
  const scores = getHighScores();
  const newScore: HighScore = {
    playerName,
    score,
    date: new Date().toISOString(),
    gameMode
  };
  
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  scores.splice(10);
  
  localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scores));
}

export function getHighScores(): HighScore[] {
  const scores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
  return scores ? JSON.parse(scores) : [];
}

export function isHighScore(score: number): boolean {
  const scores = getHighScores();
  return scores.length < 10 || score > scores[scores.length - 1].score;
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
}

export function getSettings(): GameSettings {
  const settings = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
  return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
  localStorage.removeItem(STORAGE_KEYS.GAME_SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
}