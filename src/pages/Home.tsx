import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Trophy, Settings, Volume2 } from "lucide-react";
import { audioManager } from "../utils/audio";
import { getHighScores } from "../utils/storage";

interface HomeProps {
  onStartGame: () => void;
  onOpenHighScores: () => void;
  onOpenSettings: () => void;
}

export default function Home({
  onStartGame,
  onOpenHighScores,
  onOpenSettings,
}: HomeProps) {
  const [highScore, setHighScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const scores = getHighScores();
    if (scores.length > 0) {
      setHighScore(scores[0].score);
    }

    audioManager.playMusic("background");

    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    audioManager.playSound("menu_click");
    onStartGame();
  };

  const handleShowHighScores = () => {
    audioManager.playSound("menu_click");
    onOpenHighScores();
  };

  const handleShowSettings = () => {
    audioManager.playSound("menu_click");
    onOpenSettings();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 synthwave-bg retro-grid"
      style={{ position: "relative" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-8xl font-bold mb-4 neon-text retro-glow-strong"
          style={{
            background:
              "linear-gradient(45deg, var(--retro-pink), var(--retro-cyan), var(--retro-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0 0 30px var(--retro-pink), 0 0 60px var(--retro-cyan)",
          }}
          whileHover={{
            scale: 1.05,
            textShadow:
              "0 0 40px var(--retro-pink), 0 0 80px var(--retro-cyan), 0 0 120px var(--retro-green)",
          }}
          transition={{ duration: 0.3 }}
        >
          KADOET
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold neon-text retro-glow"
          style={{ color: "var(--retro-cyan)" }}
        >
          Game uler
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <motion.button
          whileHover={{
            y: -3,
            boxShadow:
              "0 0 40px var(--retro-pink), inset 0 0 20px rgba(255, 255, 255, 0.2)",
          }}
          whileTap={{
            y: 0,
            boxShadow:
              "0 0 20px var(--retro-pink), inset 0 0 10px rgba(255, 255, 255, 0.1)",
          }}
          onClick={handleStartGame}
          className="retro-button flex items-center justify-center gap-3 py-4 px-8 text-xl font-bold neon-text transition-all duration-300"
        >
          <Play size={24} />
          Start Game
        </motion.button>

        <motion.button
          whileHover={{
            y: -3,
            boxShadow:
              "0 0 40px var(--retro-green), inset 0 0 20px rgba(255, 255, 255, 0.2)",
          }}
          whileTap={{
            y: 0,
            boxShadow:
              "0 0 20px var(--retro-green), inset 0 0 10px rgba(255, 255, 255, 0.1)",
          }}
          onClick={handleShowHighScores}
          className="flex items-center justify-center gap-3 py-4 px-8 text-xl font-bold neon-text transition-all duration-300"
          style={{
            background:
              "linear-gradient(45deg, var(--retro-dark), var(--retro-darker))",
            border: "2px solid var(--retro-green)",
            color: "var(--retro-green)",
            textShadow: "0 0 10px currentColor",
            boxShadow:
              "0 0 20px rgba(50, 205, 50, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Trophy size={24} />
          High Scores
        </motion.button>

        <motion.button
          whileHover={{
            y: -3,
            boxShadow:
              "0 0 40px var(--retro-purple), inset 0 0 20px rgba(255, 255, 255, 0.2)",
          }}
          whileTap={{
            y: 0,
            boxShadow:
              "0 0 20px var(--retro-purple), inset 0 0 10px rgba(255, 255, 255, 0.1)",
          }}
          onClick={handleShowSettings}
          className="flex items-center justify-center gap-3 py-4 px-8 text-xl font-bold neon-text transition-all duration-300"
          style={{
            background:
              "linear-gradient(45deg, var(--retro-dark), var(--retro-darker))",
            border: "2px solid var(--retro-purple)",
            color: "var(--retro-purple)",
            textShadow: "0 0 10px currentColor",
            boxShadow:
              "0 0 20px rgba(153, 50, 204, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Settings size={24} />
          Settings
        </motion.button>
      </motion.div>

      {highScore > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center p-6 retro-border"
          style={{
            background:
              "linear-gradient(45deg, var(--retro-dark), var(--retro-darker))",
            backdropFilter: "blur(10px)",
            borderColor: "var(--retro-cyan)",
            boxShadow:
              "0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="text-lg font-semibold neon-text retro-glow mb-2"
            style={{ color: "var(--retro-cyan)" }}
          >
            Best Score
          </div>
          <div
            className="text-4xl font-bold digital-font retro-glow-strong"
            style={{ color: "var(--retro-pink)" }}
          >
            {highScore.toLocaleString()}
          </div>
        </motion.div>
      )}

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 opacity-30"
      >
        <div
          className="w-12 h-12"
          style={{
            background: "var(--retro-pink)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            boxShadow: "0 0 20px var(--retro-pink)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 opacity-40"
      >
        <div
          className="w-10 h-10"
          style={{
            background: "var(--retro-cyan)",
            transform: "rotate(45deg)",
            boxShadow: "0 0 15px var(--retro-cyan)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, 15, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-20 opacity-35"
      >
        <div
          className="w-8 h-8"
          style={{
            background: "var(--retro-green)",
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            boxShadow: "0 0 12px var(--retro-green)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4"
      >
        <div
          className="w-6 h-6"
          style={{
            background: "var(--retro-purple)",
            borderRadius: "50%",
            boxShadow: "0 0 25px var(--retro-purple)",
          }}
        />
      </motion.div>
    </div>
  );
}
