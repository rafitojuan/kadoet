import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import GameOver from './pages/GameOver';
import Settings from './pages/Settings';
import HighScores from './pages/HighScores';
import { initializeStorage } from './utils/storage';
import { audioManager } from './utils/audio';
import type { GameSettings } from './types';

type Screen = 'home' | 'game' | 'game-over' | 'settings' | 'high-scores';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [finalScore, setFinalScore] = useState(0);
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'medium',
    soundEnabled: true,
    soundVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    controlScheme: 'wasd',
    animationsEnabled: true,
    theme: 'default'
  });

  React.useEffect(() => {
    initializeStorage();
  }, []);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setCurrentScreen('game-over');
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    audioManager.setSoundVolume(newSettings.soundVolume);
    audioManager.setMusicVolume(newSettings.musicVolume);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            onStartGame={() => navigateToScreen('game')}
            onOpenSettings={() => navigateToScreen('settings')}
            onOpenHighScores={() => navigateToScreen('high-scores')}
          />
        );
      case 'game':
        return (
          <Game
            settings={settings}
            onGameOver={handleGameOver}
            onBackToHome={() => navigateToScreen('home')}
          />
        );
      case 'game-over':
        return (
          <GameOver
            score={finalScore}
            finalScore={finalScore}
            onPlayAgain={() => navigateToScreen('game')}
            onBackToHome={() => navigateToScreen('home')}
            onShowHighScores={() => navigateToScreen('high-scores')}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onBack={() => navigateToScreen('home')}
          />
        );
      case 'high-scores':
        return (
          <HighScores
            onBack={() => navigateToScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
}
