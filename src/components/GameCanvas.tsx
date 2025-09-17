import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { GameInputHandler } from '../utils/inputHandler';
import type { GameState, GameSettings } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  settings: GameSettings;
  onGameStateChange: (state: GameState) => void;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  isPaused: boolean;
}

export interface GameCanvasRef {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>((
  { gameState, settings, onGameStateChange, onScoreUpdate, onGameOver, isPaused },
  ref
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputHandlerRef = useRef<GameInputHandler | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useImperativeHandle(ref, () => ({
    startGame: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.startGame();
        startGameLoop();
      }
    },
    pauseGame: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.pauseGame();
      }
    },
    resumeGame: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.resumeGame();
        startGameLoop();
      }
    },
    resetGame: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.resetGame();
        onGameStateChange(gameEngineRef.current.getGameState());
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const size = Math.min(containerRect.width - 40, containerRect.height - 40, 600);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    gameEngineRef.current = new GameEngine(
      canvas,
      settings,
      onScoreUpdate,
      onGameOver,
      (state) => onGameStateChange(state)
    );

    inputHandlerRef.current = new GameInputHandler(
      canvas,
      (direction) => gameEngineRef.current?.changeDirection(direction),
      () => {
        if (gameEngineRef.current?.getGameState().status === 'playing') {
          gameEngineRef.current.pauseGame();
        } else if (gameEngineRef.current?.getGameState().status === 'paused') {
          gameEngineRef.current.resumeGame();
          startGameLoop();
        }
      }
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      inputHandlerRef.current?.cleanup();
    };
  }, [settings, onGameStateChange, onScoreUpdate, onGameOver]);

  const startGameLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const gameLoop = (currentTime: number) => {
      if (!gameEngineRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const currentState = gameEngineRef.current.getGameState();
      
      if (currentState.status === 'playing' && !isPaused) {
        gameEngineRef.current.update(deltaTime);
        gameEngineRef.current.render();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      } else if (currentState.status === 'gameover') {
        gameEngineRef.current.render();
        return;
      } else if (currentState.status === 'paused') {
        gameEngineRef.current.render();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else if (gameState.status === 'playing') {
      startGameLoop();
    }
  }, [isPaused, gameState.status]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border-4 rounded-2xl shadow-2xl retro-canvas"
        style={{ 
          borderColor: '#FF1493',
          background: 'linear-gradient(45deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
          boxShadow: '0 0 30px #FF1493, 0 0 60px #FF1493, inset 0 0 30px rgba(255, 20, 147, 0.1)',
          border: '4px solid #FF1493'
        }}
      />
      
      {/* Retro Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3
        }}
      />
      
      {/* Scanline Effect */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.02) 2px, rgba(0, 255, 255, 0.02) 4px)',
          opacity: 0.4
        }}
      />
    </div>
  );
});

export default GameCanvas;