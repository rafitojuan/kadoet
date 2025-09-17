export interface GameState {
  snake: SnakeSegment[];
  food: FoodItem;
  score: number;
  status: 'menu' | 'playing' | 'paused' | 'gameover';
  direction: 'up' | 'down' | 'left' | 'right';
  speed: number;
}

export interface SnakeSegment {
  x: number;
  y: number;
  color: string;
}

export interface FoodItem {
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bonus';
  points: number;
}

export interface HighScore {
  playerName: string;
  score: number;
  date: string;
  gameMode: string;
}

export interface ScoreManager {
  saveScore(score: HighScore): void;
  getTopScores(limit: number): HighScore[];
  isHighScore(score: number): boolean;
}

export interface AudioManager {
  playSound(soundId: string, volume?: number): void;
  playMusic(musicId: string, loop?: boolean): void;
  setMasterVolume(volume: number): void;
  stopAll(): void;
}

export interface InputHandler {
  onKeyPress(key: string): void;
  onTouchSwipe(direction: string): void;
  bindControls(): void;
}

export interface AnimationManager {
  startGameLoop(): void;
  stopGameLoop(): void;
  addParticleEffect(x: number, y: number, type: string): void;
  updateAnimations(deltaTime: number): void;
}

export interface GameSettings {
  musicVolume: number;
  soundVolume: number;
  sfxVolume: number;
  soundEnabled: boolean;
  controlScheme: string;
  animationsEnabled: boolean;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'invincible' | 'double_points';
  duration: number;
  active: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';
export type FoodType = 'normal' | 'special' | 'bonus';
export type PowerUpType = 'speed' | 'invincible' | 'double_points';
export type ParticleType = 'eat' | 'death' | 'sparkle' | 'explosion';