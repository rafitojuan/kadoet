export const STORAGE_KEYS = {
  HIGH_SCORES: 'kadoet_high_scores',
  GAME_SETTINGS: 'kadoet_settings',
  PLAYER_STATS: 'kadoet_player_stats'
};

export const DEFAULT_SETTINGS = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  soundVolume: 0.8,
  soundEnabled: true,
  controlScheme: 'wasd',
  animationsEnabled: true,
  theme: 'default',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard'
};

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRID_SIZE: 20,
  INITIAL_SPEED: 150,
  MAX_HIGH_SCORES: 10,
  PARTICLE_COUNT: 50,
  ANIMATION_DURATION: 300,
  SNAKE_INITIAL_LENGTH: 3,
  FOOD_SPAWN_DELAY: 100,
  POWER_UP_SPAWN_CHANCE: 0.1,
  POWER_UP_DURATION: 5000
};

export const COLORS = {
  PRIMARY: '#FFB6C1',
  SECONDARY: '#E6E6FA',
  ACCENT: '#F0FFF0',
  BACKGROUND: '#FFE4E1',
  SURFACE: '#F5FFFA',
  TEXT: '#2F2F4F',
  SNAKE_HEAD: '#FF69B4',
  SNAKE_BODY: '#FFB6C1',
  FOOD_NORMAL: '#98FB98',
  FOOD_SPECIAL: '#FFD700',
  FOOD_BONUS: '#FF6347'
};

export const SOUNDS = {
  EAT: 'eat',
  DEATH: 'death',
  POWER_UP: 'powerup',
  BACKGROUND: 'background',
  MENU_CLICK: 'menu_click',
  GAME_START: 'game_start'
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  W: 'KeyW',
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD',
  SPACE: 'Space',
  ESCAPE: 'Escape'
};