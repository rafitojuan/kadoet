import type { GameState, SnakeSegment, FoodItem, PowerUp, Direction } from '../types';
import { GAME_CONFIG, COLORS, DIRECTIONS } from '../constants';
import { ParticleSystem } from './particles';
import { audioManager } from './audio';

interface PopupText {
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  color: string;
  createdAt: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private particleSystem: ParticleSystem;
  private powerUps: PowerUp[] = [];
  private popupTexts: PopupText[] = [];
  private lastTime = 0;
  private gameLoop: number | null = null;
  private onScoreUpdate?: (score: number) => void;
  private onGameOver?: (score: number) => void;
  
  private comicMessages = [
    'GOOD JOB!', 'GREAT WORK!', 'YUMMM!', 'NICE!', 
    'AWESOME!', 'TASTY!', 'PERFECT!', 'AMAZING!',
    'DELICIOUS!', 'FANTASTIC!', 'EXCELLENT!', 'SWEET!'
  ];
  
  private comicColors = [
    '#FF1493', '#00FFFF', '#32CD32', '#FFD700',
    '#9932CC', '#FF8C00', '#00BFFF', '#FF69B4'
  ];

  constructor(
    canvas: HTMLCanvasElement, 
    settings: any, 
    onScoreUpdate?: (score: number) => void, 
    onGameOver?: (score: number) => void,
    onGameStateChange?: (state: GameState) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.particleSystem = new ParticleSystem(canvas);
    this.gameState = this.initializeGameState();
    this.gameState.food = this.generateFood();
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
  }

  private initializeGameState(): GameState {
    const centerX = Math.floor(GAME_CONFIG.CANVAS_WIDTH / 2 / GAME_CONFIG.GRID_SIZE);
    const centerY = Math.floor(GAME_CONFIG.CANVAS_HEIGHT / 2 / GAME_CONFIG.GRID_SIZE);
    
    const gameState = {
      snake: [
        { x: centerX, y: centerY, color: COLORS.SNAKE_HEAD },
        { x: centerX - 1, y: centerY, color: COLORS.SNAKE_BODY },
        { x: centerX - 2, y: centerY, color: COLORS.SNAKE_BODY }
      ],
      food: { x: 0, y: 0, type: 'normal' as const, points: 10 },
      score: 0,
      status: 'playing' as const,
      direction: 'right' as const,
      speed: GAME_CONFIG.INITIAL_SPEED
    };
    
    return gameState;
  }

  private generateFood(): FoodItem {
    const gridWidth = Math.floor(GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE);
    const gridHeight = Math.floor(GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE);
    
    let x, y;
    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
    } while (this.isPositionOccupied(x, y));
    
    const rand = Math.random();
    let type: 'normal' | 'special' | 'bonus';
    let points: number;
    
    if (rand < 0.7) {
      type = 'normal';
      points = 10;
    } else if (rand < 0.9) {
      type = 'special';
      points = 25;
    } else {
      type = 'bonus';
      points = 50;
    }
    
    return { x, y, type, points };
  }

  private isPositionOccupied(x: number, y: number): boolean {
    return this.gameState.snake.some(segment => segment.x === x && segment.y === y);
  }

  setDirection(direction: Direction): void {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    if (opposites[direction] !== this.gameState.direction) {
      this.gameState.direction = direction;
    }
  }

  start(): void {
    this.gameState.status = 'playing';
    audioManager.playSound('game_start');
    audioManager.playMusic('background');
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  pause(): void {
    this.gameState.status = 'paused';
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  resume(): void {
    if (this.gameState.status === 'paused') {
      this.gameState.status = 'playing';
      this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }
  }

  public update(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= this.gameState.speed) {
      this.moveSnake();
      this.checkCollisions();
      this.lastTime = currentTime;
    }
    
    this.particleSystem.update(deltaTime);
    this.updatePopupTexts(deltaTime);
    this.render();
    
    if (this.gameState.status === 'playing') {
      this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }
  }

  private moveSnake(): void {
    const head = { ...this.gameState.snake[0] };
    const direction = DIRECTIONS[this.gameState.direction.toUpperCase() as keyof typeof DIRECTIONS];
    
    head.x += direction.x;
    head.y += direction.y;
    
    this.gameState.snake.unshift(head);
    
    if (!this.checkFoodCollision()) {
      this.gameState.snake.pop();
    }
  }

  private checkFoodCollision(): boolean {
    const head = this.gameState.snake[0];
    const food = this.gameState.food;
    
    if (head.x === food.x && head.y === food.y) {
      this.gameState.score += food.points;
      audioManager.playSound('eat');
      this.particleSystem.addParticleEffect(
        food.x * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
        food.y * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
        'eat'
      );
      
      this.addComicPopup(
        head.x * GAME_CONFIG.GRID_SIZE,
        head.y * GAME_CONFIG.GRID_SIZE
      );
      
      this.gameState.food = this.generateFood();
      
      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.gameState.score);
      }
      
      return true;
    }
    
    return false;
  }

  private checkCollisions(): void {
    const head = this.gameState.snake[0];
    const gridWidth = Math.floor(GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE);
    const gridHeight = Math.floor(GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE);
    
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      this.gameOver();
      return;
    }
    
    for (let i = 1; i < this.gameState.snake.length; i++) {
      if (head.x === this.gameState.snake[i].x && head.y === this.gameState.snake[i].y) {
        this.gameOver();
        return;
      }
    }
  }

  private gameOver(): void {
    this.gameState.status = 'gameover';
    audioManager.stopMusic();
    audioManager.playSound('death');
    
    const head = this.gameState.snake[0];
    this.particleSystem.addParticleEffect(
      head.x * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
      head.y * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
      'death'
    );
    
    if (this.onGameOver) {
      this.onGameOver(this.gameState.score);
    }
  }

  public render(): void {
    // Retro dark background with subtle grid
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render retro grid background
    this.renderRetroGrid();
    
    this.renderSnake();
    this.renderFood();
    this.particleSystem.render();
    this.renderPopupTexts();
  }

  private renderSnake(): void {
    this.gameState.snake.forEach((segment, index) => {
      const x = segment.x * GAME_CONFIG.GRID_SIZE;
      const y = segment.y * GAME_CONFIG.GRID_SIZE;
      const size = GAME_CONFIG.GRID_SIZE - 2;
      
      if (index === 0) {
        // Snake head with neon glow
        this.ctx.shadowColor = '#FF1493';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#FF1493';
        this.ctx.fillRect(x, y, size, size);
        
        // Inner glow
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = '#FF69B4';
        this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      } else {
        // Snake body with cyan glow
        this.ctx.shadowColor = '#00FFFF';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.fillRect(x, y, size, size);
        
        // Inner body
        this.ctx.shadowBlur = 3;
        this.ctx.fillStyle = '#40E0D0';
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      }
      
      this.ctx.shadowBlur = 0;
    });
  }

  private renderFood(): void {
    const food = this.gameState.food;
    const x = food.x * GAME_CONFIG.GRID_SIZE;
    const y = food.y * GAME_CONFIG.GRID_SIZE;
    const size = GAME_CONFIG.GRID_SIZE - 2;
    
    let glowColor: string;
    let fillColor: string;
    
    switch (food.type) {
      case 'special':
        glowColor = '#9932CC';
        fillColor = '#DA70D6';
        break;
      case 'bonus':
        glowColor = '#FFD700';
        fillColor = '#FFA500';
        break;
      default:
        glowColor = '#32CD32';
        fillColor = '#90EE90';
        break;
    }
    
    // Pulsing glow effect
    const pulseIntensity = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = 20 * pulseIntensity;
    this.ctx.fillStyle = glowColor;
    this.ctx.fillRect(x, y, size, size);
    
    // Inner food with different color
    this.ctx.shadowBlur = 8;
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    
    this.ctx.shadowBlur = 0;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  setScoreUpdateCallback(callback: (score: number) => void): void {
    this.onScoreUpdate = callback;
  }

  setGameOverCallback(callback: (score: number) => void): void {
    this.onGameOver = callback;
  }

  private addComicPopup(x: number, y: number): void {
    const message = this.comicMessages[Math.floor(Math.random() * this.comicMessages.length)];
    const color = this.comicColors[Math.floor(Math.random() * this.comicColors.length)];
    
    this.popupTexts.push({
      text: message,
      x: x + GAME_CONFIG.GRID_SIZE / 2,
      y: y - 10,
      opacity: 1,
      scale: 0.5,
      color: color,
      createdAt: Date.now()
    });
  }
  
  private updatePopupTexts(deltaTime: number): void {
    const currentTime = Date.now();
    
    this.popupTexts = this.popupTexts.filter(popup => {
      const age = currentTime - popup.createdAt;
      const maxAge = 1500;
      
      if (age > maxAge) return false;
      
      const progress = age / maxAge;
      popup.y -= 0.8;
      popup.opacity = Math.max(0, 1 - progress);
      popup.scale = Math.min(1.2, 0.5 + progress * 0.7);
      
      return true;
    });
  }
  
  private renderRetroGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    const gridSize = GAME_CONFIG.GRID_SIZE;
    
    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private renderPopupTexts(): void {
    this.popupTexts.forEach(popup => {
      this.ctx.save();
      
      this.ctx.globalAlpha = popup.opacity;
      this.ctx.translate(popup.x, popup.y);
      this.ctx.scale(popup.scale, popup.scale);
      
      // Retro neon text effect
      this.ctx.shadowColor = popup.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = popup.color;
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.font = 'bold 16px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      this.ctx.strokeText(popup.text.toUpperCase(), 0, 0);
      this.ctx.fillText(popup.text.toUpperCase(), 0, 0);
      
      this.ctx.shadowBlur = 0;
      this.ctx.restore();
    });
  }

  reset(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
    
    this.gameState = this.initializeGameState();
    this.gameState.food = this.generateFood();
    this.particleSystem.clear();
    this.powerUps = [];
    this.popupTexts = [];
  }

  startGame(): void {
    this.start();
  }

  pauseGame(): void {
    this.pause();
  }

  resumeGame(): void {
    this.resume();
  }

  resetGame(): void {
    this.reset();
  }

  changeDirection(direction: Direction): void {
    this.setDirection(direction);
  }
}