import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award, Calendar, User, Trash2 } from 'lucide-react';
import { getHighScores, clearAllData } from '../utils/storage';
import { audioManager } from '../utils/audio';
import type { HighScore } from '../types';

interface HighScoresProps {
  onBack: () => void;
}

export default function HighScores({ onBack }: HighScoresProps) {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = () => {
    const allScores = getHighScores();
    setScores(allScores);
  };

  const handleBack = () => {
    audioManager.playSound('menu_click');
    onBack();
  };

  const handleClearScores = () => {
    if (showClearConfirm) {
      clearAllData();
      loadScores();
      audioManager.playSound('menu_click');
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return { icon: '🥇', color: '#FFD700', component: Trophy };
      case 1:
        return { icon: '🥈', color: '#C0C0C0', component: Medal };
      case 2:
        return { icon: '🥉', color: '#CD7F32', component: Award };
      default:
        return { icon: `#${index + 1}`, color: '#FF69B4', component: Trophy };
    }
  };

  const filteredScores = scores.filter(score => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'recent') {
      const scoreDate = new Date(score.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scoreDate >= weekAgo;
    }
    return score.gameMode === selectedFilter;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 synthwave-bg retro-grid"
         style={{ 
           background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 25%, #0a1a1a 50%, #1a1a0a 75%, #0a0a0a 100%)',
           position: 'relative',
           overflow: 'hidden'
         }}>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-between w-full max-w-4xl mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 30px #FF1493, 0 0 60px #FF1493' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 retro-button"
          style={{ 
            background: 'linear-gradient(45deg, #FF1493, #9932CC)',
            border: '2px solid #FF1493',
            boxShadow: '0 0 20px #FF1493',
            textShadow: '0 0 10px #FF1493',
            fontFamily: 'monospace'
          }}
        >
          <ArrowLeft size={20} />
          BACK
        </motion.button>

        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl font-bold neon-text" 
          style={{ 
            background: 'linear-gradient(45deg, #FF1493, #00FFFF, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px #FF1493, 0 0 40px #FF1493, 0 0 60px #FF1493',
            fontFamily: 'monospace',
            letterSpacing: '3px'
          }}
        >
          ★ HIGH SCORES ★
        </motion.h1>

        {scores.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: showClearConfirm ? '0 0 30px #ef4444, 0 0 60px #ef4444' : '0 0 30px #FF8C00, 0 0 60px #FF8C00' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClearScores}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 retro-button"
            style={{
              background: showClearConfirm 
                ? 'linear-gradient(45deg, #ef4444, #dc2626)' 
                : 'linear-gradient(45deg, #FF8C00, #FF4500)',
              border: showClearConfirm ? '2px solid #ef4444' : '2px solid #FF8C00',
              boxShadow: showClearConfirm ? '0 0 20px #ef4444' : '0 0 20px #FF8C00',
              textShadow: showClearConfirm ? '0 0 10px #ef4444' : '0 0 10px #FF8C00',
              fontFamily: 'monospace',
              color: 'white'
            }}
          >
            <Trash2 size={20} />
            {showClearConfirm ? 'CONFIRM' : 'CLEAR'}
          </motion.button>
        )}
      </motion.div>

      {scores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          {[
            { value: 'all', label: 'ALL TIME' },
            { value: 'recent', label: 'THIS WEEK' },
            { value: 'classic', label: 'CLASSIC MODE' }
          ].map((filter) => (
            <motion.button
              key={filter.value}
              whileHover={{ scale: 1.05, boxShadow: selectedFilter === filter.value ? '0 0 25px #FF1493' : '0 0 15px #00FFFF' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter.value)}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-300 retro-button"
              style={{
                background: selectedFilter === filter.value
                  ? 'linear-gradient(45deg, #FF1493, #9932CC)'
                  : 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                border: selectedFilter === filter.value ? '2px solid #FF1493' : '2px solid #00FFFF',
                color: selectedFilter === filter.value ? 'white' : '#00FFFF',
                boxShadow: selectedFilter === filter.value ? '0 0 15px #FF1493' : '0 0 10px #00FFFF',
                textShadow: selectedFilter === filter.value ? '0 0 10px #FF1493' : '0 0 8px #00FFFF',
                fontFamily: 'monospace'
              }}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl"
      >
        {filteredScores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
              style={{
                color: '#FF1493',
                textShadow: '0 0 30px #FF1493, 0 0 60px #FF1493'
              }}
            >
              ◆
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 neon-text" style={{
              color: '#00FFFF',
              textShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>NO SCORES YET!</h2>
            <p className="text-xl" style={{
              color: '#9932CC',
              textShadow: '0 0 10px #9932CC',
              fontFamily: 'monospace'
            }}>PLAY SOME GAMES TO SEE YOUR HIGH SCORES HERE.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredScores.map((score, index) => {
              const rank = getRankIcon(index);
              return (
                <motion.div
                  key={`${score.playerName}-${score.date}-${index}`}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  className="bg-black bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between transition-all duration-300 retro-glow"
                  style={{
                    border: '2px solid #FF1493',
                    boxShadow: '0 0 20px #FF1493, inset 0 0 20px rgba(255, 20, 147, 0.1)',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)'
                  }}
                >
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ rotate: index < 3 ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold"
                      style={{ 
                        background: index < 3 
                          ? `linear-gradient(45deg, ${rank.color}, ${rank.color}dd)` 
                          : 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                        color: 'white',
                        textShadow: `0 0 15px ${rank.color}`
                      }}
                    >
                      {index < 3 ? rank.icon : `#${index + 1}`}
                    </motion.div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <User size={20} style={{ color: '#FF69B4' }} />
                        <span className="text-xl font-bold neon-text" style={{
                          color: '#00FFFF',
                          textShadow: '0 0 10px #00FFFF',
                          fontFamily: 'monospace',
                          letterSpacing: '1px'
                        }}>
                          {score.playerName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} style={{ color: '#9932CC' }} />
                        <span style={{
                          color: '#9932CC',
                          textShadow: '0 0 8px #9932CC',
                          fontFamily: 'monospace'
                        }}>{formatDate(score.date)}</span>
                        <span className="px-2 py-1 rounded-full font-medium" style={{
                          background: 'linear-gradient(45deg, #32CD32, #228B22)',
                          color: 'white',
                          textShadow: '0 0 8px #32CD32',
                          fontFamily: 'monospace',
                          border: '1px solid #32CD32',
                          boxShadow: '0 0 10px #32CD32'
                        }}>
                          {score.gameMode.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-right"
                  >
                    <div className="text-3xl font-bold digital-display" style={{ 
                      background: 'linear-gradient(45deg, #FF1493, #FFD700)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px #FF1493, 0 0 40px #FF1493',
                      fontFamily: 'monospace',
                      letterSpacing: '2px'
                    }}>
                      {score.score.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium" style={{
                      color: '#FF8C00',
                      textShadow: '0 0 8px #FF8C00',
                      fontFamily: 'monospace'
                    }}>POINTS</div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">Clear All Scores?</h3>
              <p className="text-slate-600 mb-6">This action cannot be undone!</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-6 rounded-xl bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearScores}
                  className="flex-1 py-3 px-6 rounded-xl bg-red-500 text-white font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-16 h-16"
        style={{
          background: 'linear-gradient(45deg, #FF1493, #00FFFF)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          boxShadow: '0 0 30px #FF1493, 0 0 60px #FF1493'
        }}
      />
      
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-32 right-16 w-12 h-12"
        style={{
          background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          boxShadow: '0 0 25px #FFD700, 0 0 50px #FFD700'
        }}
      />
      
      <motion.div
        animate={{ rotate: [-30, 30, -30], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-32 left-20 w-10 h-10"
        style={{
          background: 'linear-gradient(45deg, #9932CC, #32CD32)',
          borderRadius: '50%',
          boxShadow: '0 0 20px #9932CC, 0 0 40px #9932CC'
        }}
      />
      
      <motion.div
        animate={{ scale: [1, 1.5, 1], x: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-14 h-14"
        style={{
          background: 'linear-gradient(45deg, #00FFFF, #FF1493)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
          boxShadow: '0 0 25px #00FFFF, 0 0 50px #00FFFF'
        }}
      />
    </div>
  );
}