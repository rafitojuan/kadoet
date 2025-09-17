import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Music, Gamepad2, Palette, RotateCcw } from 'lucide-react';
import { getSettings, saveSettings, clearAllData } from '../utils/storage';
import { audioManager } from '../utils/audio';
import type { GameSettings } from '../types';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
  onBack: () => void;
}

export default function Settings({ settings: initialSettings, onSettingsChange, onBack }: SettingsProps) {
  const [settings, setSettings] = useState<GameSettings>({
    musicVolume: 0.7,
    soundVolume: 0.7,
    sfxVolume: 0.8,
    soundEnabled: true,
    controlScheme: 'arrows',
    animationsEnabled: true,
    theme: 'pastel',
    difficulty: 'medium'
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
  }, []);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
    audioManager.updateSettings();
    audioManager.playSound('menu_click');
  };

  const handleBack = () => {
    audioManager.playSound('menu_click');
    onBack();
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      clearAllData();
      audioManager.playSound('menu_click');
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  const VolumeSlider = ({ label, value, onChange, icon: Icon }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: any;
  }) => (
    <motion.div 
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        boxShadow: 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff, 0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon size={24} style={{ color: '#FF69B4' }} />
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-sm font-medium text-slate-600 w-12">
          {Math.round(value * 100)}%
        </span>
      </div>
    </motion.div>
  );

  const ToggleButton = ({ label, value, onChange, icon: Icon }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    icon: any;
  }) => (
    <motion.div 
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        boxShadow: 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff, 0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={24} style={{ color: '#FF69B4' }} />
          <span className="font-semibold text-slate-700">{label}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(!value)}
          className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
            value ? 'bg-gradient-to-r from-pink-400 to-pink-500' : 'bg-gray-300'
          }`}
        >
          <motion.div
            animate={{ x: value ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
          />
        </motion.button>
      </div>
    </motion.div>
  );

  const SelectButton = ({ label, options, value, onChange, icon: Icon }: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    icon: any;
  }) => (
    <motion.div 
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        boxShadow: 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff, 0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon size={24} style={{ color: '#FF69B4' }} />
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex gap-2">
        {options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300`}
            style={{
              background: value === option.value
                ? 'linear-gradient(145deg, #f472b6, #ec4899)'
                : 'linear-gradient(145deg, #ffffff, #f8fafc)',
              color: value === option.value ? '#ffffff' : '#64748b',
              boxShadow: value === option.value
                ? 'inset 2px 2px 4px rgba(236, 72, 153, 0.3), inset -2px -2px 4px rgba(244, 114, 182, 0.3), 0 2px 8px rgba(236, 72, 153, 0.2)'
                : 'inset 2px 2px 4px #e2e8f0, inset -2px -2px 4px #ffffff, 0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

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
        className="flex items-center justify-between w-full max-w-2xl mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 30px #FF1493, 0 0 60px #FF1493' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 retro-button"
          style={{ 
            background: 'linear-gradient(145deg, #FF1493, #9932CC)',
            border: '2px solid #FF1493',
            boxShadow: '0 0 20px #FF1493, inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            textShadow: '0 0 10px #FF1493',
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}
        >
          <ArrowLeft size={20} />
          BACK
        </motion.button>

        <h1 className="text-4xl font-bold neon-text" 
            style={{ 
              background: 'linear-gradient(45deg, #FF1493, #00FFFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px #FF1493, 0 0 40px #FF1493, 0 0 60px #FF1493',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
          SETTINGS
        </h1>

        <div className="w-20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 neon-text" style={{
            color: '#00FFFF',
            textShadow: '0 0 15px #00FFFF, 0 0 30px #00FFFF',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>AUDIO SETTINGS</h2>
          
          <ToggleButton
            label="Sound Effects"
            value={settings.soundEnabled}
            onChange={(value) => updateSetting('soundEnabled', value)}
            icon={settings.soundEnabled ? Volume2 : VolumeX}
          />

          {settings.soundEnabled && (
            <>
              <VolumeSlider
                label="Music Volume"
                value={settings.musicVolume}
                onChange={(value) => updateSetting('musicVolume', value)}
                icon={Music}
              />

              <VolumeSlider
                label="Sound Effects Volume"
                value={settings.sfxVolume}
                onChange={(value) => updateSetting('sfxVolume', value)}
                icon={Volume2}
              />
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 neon-text" style={{
            color: '#32CD32',
            textShadow: '0 0 15px #32CD32, 0 0 30px #32CD32',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>GAME SETTINGS</h2>
          
          <SelectButton
            label="Control Scheme"
            options={[
              { value: 'arrows', label: 'Arrow Keys' },
              { value: 'wasd', label: 'WASD' },
              { value: 'both', label: 'Both' }
            ]}
            value={settings.controlScheme}
            onChange={(value) => updateSetting('controlScheme', value)}
            icon={Gamepad2}
          />

          <ToggleButton
            label="Animations"
            value={settings.animationsEnabled}
            onChange={(value) => updateSetting('animationsEnabled', value)}
            icon={Palette}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 neon-text" style={{
            color: '#FF8C00',
            textShadow: '0 0 15px #FF8C00, 0 0 30px #FF8C00',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>DATA MANAGEMENT</h2>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-2xl p-6 retro-glow"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
              border: '2px solid #FF8C00',
              boxShadow: '0 0 20px #FF8C00, inset 0 1px 2px rgba(255, 140, 0, 0.2)'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1, boxShadow: showResetConfirm ? '0 0 30px #ef4444, 0 0 60px #ef4444' : '0 0 30px #FF8C00, 0 0 60px #FF8C00' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetData}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 retro-button`}
              style={{
                background: showResetConfirm 
                  ? 'linear-gradient(145deg, #ef4444, #dc2626)' 
                  : 'linear-gradient(145deg, #FF8C00, #FF4500)',
                border: showResetConfirm ? '2px solid #ef4444' : '2px solid #FF8C00',
                boxShadow: showResetConfirm
                  ? '0 0 20px #ef4444, inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                  : '0 0 20px #FF8C00, inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                textShadow: showResetConfirm ? '0 0 10px #ef4444' : '0 0 10px #FF8C00',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}
            >
              <RotateCcw size={20} />
              {showResetConfirm ? 'CONFIRM RESET ALL DATA' : 'RESET ALL DATA'}
            </motion.button>
            
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 text-sm text-center"
                style={{
                  color: '#FF1493',
                  textShadow: '0 0 10px #FF1493',
                  fontFamily: 'monospace'
                }}
              >
                THIS WILL DELETE ALL HIGH SCORES AND SETTINGS!
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="ml-2 underline hover:scale-105 transition-all duration-300"
                  style={{
                    color: '#00FFFF',
                    textShadow: '0 0 10px #00FFFF',
                    fontFamily: 'monospace'
                  }}
                >
                  CANCEL
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 right-10"
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, #FF1493, #9932CC)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          boxShadow: '0 0 30px #FF1493, 0 0 60px #FF1493'
        }}
      />

      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-10"
        style={{
          width: '50px',
          height: '50px',
          background: 'linear-gradient(45deg, #00FFFF, #32CD32)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          boxShadow: '0 0 25px #00FFFF, 0 0 50px #00FFFF'
        }}
      />

      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 0.8, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-10"
        style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #FF8C00, #FFD700)',
          borderRadius: '0',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 20px #FF8C00, 0 0 40px #FF8C00'
        }}
      />

      <motion.div
        animate={{ x: [0, 20, 0], rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/2"
        style={{
          width: '35px',
          height: '35px',
          background: 'linear-gradient(45deg, #9932CC, #FF1493)',
          clipPath: 'circle(50%)',
          boxShadow: '0 0 25px #9932CC, 0 0 50px #9932CC'
        }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(45deg, #FF1493, #00FFFF);
            cursor: pointer;
            box-shadow: 0 0 15px #FF1493, 0 0 30px #FF1493;
            border: 2px solid #FF1493;
          }
          
          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(45deg, #FF1493, #00FFFF);
            cursor: pointer;
            border: 2px solid #FF1493;
            box-shadow: 0 0 15px #FF1493, 0 0 30px #FF1493;
          }
          
          .slider {
            background: linear-gradient(90deg, #1a1a1a, #2a2a2a) !important;
            border: 1px solid #FF1493 !important;
            box-shadow: 0 0 10px #FF1493 !important;
          }
        `
      }} />
    </div>
  );
}