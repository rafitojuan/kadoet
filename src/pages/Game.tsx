import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Home, Volume2, VolumeX } from 'lucide-react';
import { GameEngine } from '../utils/gameEngine';
import { GameInputHandler } from '../utils/inputHandler';
import { audioManager } from '../utils/audio';
import { getSettings } from '../utils/storage';
import { GAME_CONFIG } from '../constants';

interface GameProps {
  settings: any;
  onGameOver: (score: number) => void;
  onBackToHome: () => void;
}

export default function Game({ settings, onGameOver, onBackToHome }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputHandlerRef = useRef<GameInputHandler | null>(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

    const currentSettings = getSettings();
    
    const gameEngine = new GameEngine(canvas, currentSettings, setScore, onGameOver);
    const inputHandler = new GameInputHandler(canvas, (direction) => gameEngine.changeDirection(direction), () => togglePause());

    gameEngineRef.current = gameEngine;
    inputHandlerRef.current = inputHandler;

    gameEngine.setScoreUpdateCallback(setScore);
    gameEngine.setGameOverCallback((finalScore) => {
      onGameOver(finalScore);
    });

    inputHandler.setDirectionChangeCallback((direction) => {
      gameEngine.setDirection(direction);
    });

    inputHandler.setPauseCallback(() => {
      togglePause();
    });
    setSoundEnabled(currentSettings.soundEnabled);

    const startTimer = setTimeout(() => {
      gameEngine.start();
      setGameStarted(true);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      inputHandler.unbindControls();
      gameEngine.reset();
    };
  }, [onGameOver]);

  const togglePause = () => {
    if (!gameEngineRef.current || !gameStarted) return;

    if (isPaused) {
      gameEngineRef.current.resume();
      audioManager.playSound('menu_click');
    } else {
      gameEngineRef.current.pause();
      audioManager.playSound('menu_click');
    }
    setIsPaused(!isPaused);
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    
    if (newSoundState) {
      audioManager.setMasterVolume(1);
      audioManager.playMusic('background');
    } else {
      audioManager.setMasterVolume(0);
      audioManager.stopAll();
    }
  };

  const handleBackToHome = () => {
    audioManager.playSound('menu_click');
    if (gameEngineRef.current) {
      gameEngineRef.current.reset();
    }
    onBackToHome();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 synthwave-bg retro-grid"
         style={{ 
           background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)',
           position: 'relative'
         }}>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-between w-full max-w-4xl mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2, rotateX: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToHome}
          className="retro-button flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition-all duration-300 neon-text"
          style={{ 
            background: 'linear-gradient(145deg, #ff1493, #ff69b4)',
            border: '2px solid #ff1493',
            boxShadow: '0 0 20px #ff1493, inset 0 0 10px rgba(255, 20, 147, 0.3)',
            textShadow: '0 0 10px #ff1493'
          }}
        >
          <Home size={20} />
          HOME
        </motion.button>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center retro-glow"
        >
          <div className="text-lg font-bold text-cyan-400 mb-1 neon-text" style={{ textShadow: '0 0 10px #00ffff' }}>SCORE</div>
          <div className="text-5xl font-bold neon-text" style={{ 
            color: '#00ffff',
            textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
            fontFamily: 'monospace'
          }}>
            {score.toLocaleString()}
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            className="retro-button p-4 rounded-lg text-white transition-all duration-300 neon-text"
            style={{ 
              background: soundEnabled 
                ? 'linear-gradient(145deg, #32cd32, #00ff00)' 
                : 'linear-gradient(145deg, #ff4500, #ff6347)',
              border: soundEnabled ? '2px solid #32cd32' : '2px solid #ff4500',
              boxShadow: soundEnabled
                ? '0 0 20px #32cd32, inset 0 0 10px rgba(50, 205, 50, 0.3)'
                : '0 0 20px #ff4500, inset 0 0 10px rgba(255, 69, 0, 0.3)',
              textShadow: soundEnabled ? '0 0 10px #32cd32' : '0 0 10px #ff4500'
            }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            className="retro-button flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition-all duration-300 neon-text"
            style={{ 
              background: 'linear-gradient(145deg, #9932cc, #ba55d3)',
              border: '2px solid #9932cc',
              boxShadow: '0 0 20px #9932cc, inset 0 0 10px rgba(153, 50, 204, 0.3)',
              textShadow: '0 0 10px #9932cc'
            }}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
            {isPaused ? 'RESUME' : 'PAUSE'}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="border-4 rounded-lg shadow-2xl retro-glow"
          style={{ 
            borderColor: '#00ffff',
            background: '#0a0a0a',
            boxShadow: '0 0 30px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)',
            border: '3px solid #00ffff'
          }}
        />
        
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl font-bold text-white neon-text"
              style={{
                color: '#ff1493',
                textShadow: '0 0 20px #ff1493, 0 0 40px #ff1493',
                fontFamily: 'monospace'
              }}
            >
              GET READY!
            </motion.div>
          </motion.div>
        )}

        {isPaused && gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl font-bold text-white neon-text"
              style={{
                color: '#9932cc',
                textShadow: '0 0 20px #9932cc, 0 0 40px #9932cc',
                fontFamily: 'monospace'
              }}
            >
              PAUSED
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-6 text-center"
      >
        <div className="text-lg font-bold text-cyan-400 mb-2 neon-text" style={{ textShadow: '0 0 10px #00ffff' }}>CONTROLS</div>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-3 py-1 bg-black bg-opacity-70 rounded-lg border border-cyan-400 text-cyan-400 neon-text" style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>ARROW KEYS / WASD</span>
          <span className="px-3 py-1 bg-black bg-opacity-70 rounded-lg border border-purple-500 text-purple-400 neon-text" style={{ boxShadow: '0 0 10px rgba(153, 50, 204, 0.3)' }}>SPACE/ESC TO PAUSE</span>
          <span className="px-3 py-1 bg-black bg-opacity-70 rounded-lg border border-pink-500 text-pink-400 neon-text" style={{ boxShadow: '0 0 10px rgba(255, 20, 147, 0.3)' }}>SWIPE ON MOBILE</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 opacity-30"
      >
        <div className="w-20 h-20" 
             style={{ 
               background: 'linear-gradient(45deg, #ff1493, #00ffff)',
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               boxShadow: '0 0 20px #ff1493'
             }} />
      </motion.div>

      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-20 opacity-40"
      >
        <div className="w-16 h-16" 
             style={{ 
               background: 'linear-gradient(45deg, #32cd32, #9932cc)',
               clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
               boxShadow: '0 0 15px #32cd32'
             }} />
      </motion.div>
    </div>
  );
}