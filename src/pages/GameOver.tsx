import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Star, Skull } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { saveHighScore, getHighScores, isHighScore } from '../utils/storage';
import type { HighScore } from '../types';

interface GameOverProps {
  score: number;
  finalScore: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
  onShowHighScores: () => void;
}

export default function GameOver({ score, finalScore, onPlayAgain, onBackToHome, onShowHighScores }: GameOverProps) {
  const [playerName, setPlayerName] = useState('');
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [topScores, setTopScores] = useState<HighScore[]>([]);
  const [showDeathAnimation, setShowDeathAnimation] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsNewHighScore(isHighScore(score));
    setTopScores(getHighScores().slice(0, 3));
    
    const animationTimer = setTimeout(() => {
      setShowDeathAnimation(false);
    }, 2000);

    return () => clearTimeout(animationTimer);
  }, [score]);

  useEffect(() => {
    if (isNewHighScore && !scoreSaved && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isNewHighScore, scoreSaved]);

  const handleSaveScore = () => {
    if (playerName.trim() && !scoreSaved) {
      saveHighScore(playerName.trim(), score);
      setScoreSaved(true);
      audioManager.playSound('menu_click');
      setTopScores(getHighScores().slice(0, 3));
    }
  };

  const handlePlayAgain = () => {
    audioManager.playSound('menu_click');
    onPlayAgain();
  };

  const handleBackToHome = () => {
    audioManager.playSound('menu_click');
    onBackToHome();
  };

  const handleShowHighScores = () => {
    audioManager.playSound('menu_click');
    onShowHighScores();
  };

  if (showDeathAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ 
             background: '#000000',
             position: 'relative',
             overflow: 'hidden'
           }}>
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 0.1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 0, 0, 0.03) 2px, rgba(139, 0, 0, 0.03) 4px)',
            pointerEvents: 'none'
          }}
        />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-center relative z-10"
        >
          <motion.h1
            animate={{
              opacity: [0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
              scale: [1, 1.05, 1, 0.98, 1, 1.02, 1]
            }}
            transition={{
              duration: 3,
              times: [0, 0.1, 0.3, 0.35, 0.5, 0.7, 0.75, 0.85, 0.95, 1],
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="text-8xl font-bold"
            style={{
              color: '#8B0000',
              textShadow: '0 0 20px #8B0000, 0 0 40px #8B0000, 0 0 60px #8B0000',
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              filter: 'contrast(1.2) brightness(1.1)'
            }}
          >
            YOU DIED
          </motion.h1>
          
          <motion.div
            animate={{
              opacity: [0, 0.5, 0]
            }}
            transition={{ duration: 0.05, repeat: Infinity }}
            className="absolute inset-0"
            style={{
              background: 'rgba(139, 0, 0, 0.1)',
              mixBlendMode: 'screen'
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
         style={{ 
           background: '#000000',
           position: 'relative',
           overflow: 'hidden'
         }}>
      
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 0.08, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 0, 0, 0.02) 2px, rgba(139, 0, 0, 0.02) 4px)',
          pointerEvents: 'none'
        }}
      />
      
      <motion.div
        animate={{
          opacity: [0, 0.3, 0]
        }}
        transition={{ duration: 0.03, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          background: 'rgba(139, 0, 0, 0.05)',
          mixBlendMode: 'screen',
          pointerEvents: 'none'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-8"
      >
        <motion.h1 
          animate={{
            opacity: [0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
            scale: [1, 1.02, 1, 0.99, 1, 1.01, 1]
          }}
          transition={{
            duration: 4,
            times: [0, 0.1, 0.4, 0.45, 0.6, 0.8, 0.85, 0.9, 0.95, 1],
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-6xl font-bold mb-4" 
          style={{ 
            color: '#8B0000',
            textShadow: '0 0 15px #8B0000, 0 0 30px #8B0000, 0 0 45px #8B0000',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            filter: 'contrast(1.1) brightness(1.05)'
          }}
        >
          YOU DIED
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-8 p-6 rounded-2xl"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #8B0000',
            boxShadow: '0 0 15px #8B0000, inset 0 0 10px rgba(139, 0, 0, 0.2)'
          }}
        >
          <h2 className="text-3xl font-bold mb-2" style={{ 
            color: '#8B0000',
            textShadow: '0 0 8px #8B0000, 0 0 16px #8B0000',
            fontFamily: 'monospace'
          }}>FINAL SCORE</h2>
          <div className="text-6xl font-bold" style={{ 
            color: '#DC143C',
            textShadow: '0 0 12px #DC143C, 0 0 24px #DC143C',
            fontFamily: 'monospace'
          }}>
            {finalScore.toLocaleString()}
          </div>
        </motion.div>
      </motion.div>

      {isNewHighScore && !scoreSaved && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl p-6 mb-8 w-full max-w-md"
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #8B0000',
            boxShadow: '0 0 15px #8B0000, inset 0 0 10px rgba(139, 0, 0, 0.2)',
            pointerEvents: 'auto'
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotateY: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Trophy size={48} className="mx-auto mb-2" style={{ color: '#FFD700' }} />
            </motion.div>
            <h2 className="text-2xl font-bold" style={{ 
              color: '#8B0000',
              textShadow: '0 0 8px #8B0000',
              fontFamily: 'monospace'
            }}>New High Score!</h2>
          </motion.div>
          
          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="ENTER YOUR NAME"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && playerName.trim()) {
                  handleSaveScore();
                }
              }}
              onKeyUp={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg relative z-50 pointer-events-auto retro-glow"
              maxLength={20}
              autoFocus
              tabIndex={0}
              style={{ 
                userSelect: 'text', 
                pointerEvents: 'auto',
                background: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid #8B0000',
                color: '#DC143C',
                textShadow: '0 0 5px #DC143C',
                fontFamily: 'monospace',
                boxShadow: '0 0 10px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.2)'
              }}
            />
            
            <motion.button
              whileHover={{ 
                y: -2,
                boxShadow: '0 0 25px #ff8c00, inset 0 0 15px rgba(255, 140, 0, 0.2)',
                textShadow: '0 0 15px #ff8c00'
              }}
              whileTap={{ 
                y: 0,
                boxShadow: '0 0 15px #ff8c00, inset 0 0 10px rgba(255, 140, 0, 0.3)'
              }}
              onClick={handleSaveScore}
              disabled={!playerName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-lg font-bold transition-all duration-200 disabled:opacity-50 retro-button"
              style={{ 
                background: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid #8B0000',
                color: '#DC143C',
                textShadow: '0 0 8px #DC143C',
                fontFamily: 'monospace',
                boxShadow: '0 0 12px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.2)'
              }}
            >
              <Star size={20} />
              SAVE SCORE
            </motion.button>
          </div>
        </motion.div>
      )}

      {scoreSaved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-8 p-4 rounded-2xl"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #8B0000',
            boxShadow: '0 0 15px #8B0000, inset 0 0 10px rgba(139, 0, 0, 0.2)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, type: 'spring', stiffness: 200 }}
            className="text-4xl mb-2 neon-text"
            style={{
              color: '#8B0000',
              textShadow: '0 0 12px #8B0000'
            }}
          >
            ✓
          </motion.div>
          <div className="text-xl font-semibold" style={{ 
            color: '#8B0000',
            textShadow: '0 0 8px #8B0000',
            fontFamily: 'monospace'
          }}>
            SCORE SAVED!
          </div>
        </motion.div>
      )}

      {topScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl p-6 mb-8 w-full max-w-md"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #8B0000',
            boxShadow: '0 0 15px #8B0000, inset 0 0 10px rgba(139, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold text-center mb-4" style={{ 
            color: '#8B0000',
            textShadow: '0 0 8px #8B0000',
            fontFamily: 'monospace'
          }}>TOP SCORES</h3>
          <div className="space-y-2">
            {topScores.map((highScore, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex justify-between items-center py-2 px-4 rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #8B0000',
                  boxShadow: '0 0 8px rgba(139, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" style={{
                    color: index === 0 ? '#8B0000' : index === 1 ? '#A0522D' : '#654321',
                    textShadow: `0 0 8px ${index === 0 ? '#8B0000' : index === 1 ? '#A0522D' : '#654321'}`
                  }}>
                    {index === 0 ? '★' : index === 1 ? '◆' : '▲'}
                  </span>
                  <span className="font-semibold" style={{
                    color: '#DC143C',
                    textShadow: '0 0 5px #DC143C',
                    fontFamily: 'monospace'
                  }}>{highScore.playerName}</span>
                </div>
                <span className="font-bold" style={{ 
                  color: '#8B0000',
                  textShadow: '0 0 6px #8B0000',
                  fontFamily: 'monospace'
                }}>
                  {highScore.score.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <motion.button
          whileHover={{ 
            y: -2,
            boxShadow: '0 0 25px #8B0000, inset 0 0 12px rgba(139, 0, 0, 0.3)',
            textShadow: '0 0 12px #8B0000'
          }}
          whileTap={{ 
            y: 0,
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.4)'
          }}
          onClick={handlePlayAgain}
          className="flex items-center justify-center gap-3 py-4 px-8 rounded-2xl text-xl font-bold transition-all duration-200"
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #8B0000',
            color: '#DC143C',
            textShadow: '0 0 8px #DC143C',
            fontFamily: 'monospace',
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.2)'
          }}
        >
          <RotateCcw size={24} />
          PLAY AGAIN
        </motion.button>

        <motion.button
          whileHover={{ 
            y: -2,
            boxShadow: '0 0 25px #8B0000, inset 0 0 12px rgba(139, 0, 0, 0.3)',
            textShadow: '0 0 12px #8B0000'
          }}
          whileTap={{ 
            y: 0,
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.4)'
          }}
          onClick={handleShowHighScores}
          className="flex items-center justify-center gap-3 py-4 px-8 rounded-2xl text-xl font-bold transition-all duration-200"
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #8B0000',
            color: '#DC143C',
            textShadow: '0 0 8px #DC143C',
            fontFamily: 'monospace',
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.2)'
          }}
        >
          <Trophy size={24} />
          VIEW ALL SCORES
        </motion.button>

        <motion.button
          whileHover={{ 
            y: -2,
            boxShadow: '0 0 25px #8B0000, inset 0 0 12px rgba(139, 0, 0, 0.3)',
            textShadow: '0 0 12px #8B0000'
          }}
          whileTap={{ 
            y: 0,
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.4)'
          }}
          onClick={handleBackToHome}
          className="flex items-center justify-center gap-3 py-4 px-8 rounded-2xl text-xl font-bold transition-all duration-200"
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #8B0000',
            color: '#DC143C',
            textShadow: '0 0 8px #DC143C',
            fontFamily: 'monospace',
            boxShadow: '0 0 15px #8B0000, inset 0 0 8px rgba(139, 0, 0, 0.2)'
          }}
        >
          <Home size={24} />
          BACK TO HOME
        </motion.button>
      </motion.div>

      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute top-10 right-10 opacity-30"
      >
        <div className="w-16 h-16" 
             style={{ 
               background: 'linear-gradient(45deg, #ff1493, #9932cc)',
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               boxShadow: '0 0 20px #ff1493, inset 0 0 10px rgba(255, 20, 147, 0.3)'
             }} />
      </motion.div>
      
      <motion.div
        animate={{ 
          rotate: [0, -360],
          y: [0, -20, 0]
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute bottom-20 left-10 opacity-20"
      >
        <div className="w-12 h-12" 
             style={{ 
               background: 'linear-gradient(135deg, #00ffff, #32cd32)',
               transform: 'rotate(45deg)',
               boxShadow: '0 0 15px #00ffff, inset 0 0 8px rgba(0, 255, 255, 0.3)'
             }} />
      </motion.div>
      
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="absolute top-1/3 left-20 opacity-15"
      >
        <div className="w-8 h-8 rounded-full" 
             style={{ 
               background: 'radial-gradient(circle, #ff8c00, transparent)',
               boxShadow: '0 0 25px #ff8c00'
             }} />
      </motion.div>
    </div>
  );
}