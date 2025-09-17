import { Howl, Howler } from 'howler';
import type { AudioManager } from '../types';
import { getSettings } from './storage';

class GameAudioManager implements AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private currentMusic: Howl | null = null;

  constructor() {
    this.initializeSounds();
    this.updateVolume();
  }

  private initializeSounds(): void {
    const soundFiles = {
      eat: '/sounds/eat.mp3',
      death: '/sounds/death.mp3',
      powerup: '/sounds/powerup.mp3',
      background: '/sounds/background.mp3',
      menu_click: '/sounds/menu_click.mp3',
      game_start: '/sounds/game_start.mp3'
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      const sound = new Howl({
        src: [src],
        volume: key === 'background' ? 0.3 : 0.7,
        loop: key === 'background'
      });
      this.sounds.set(key, sound);
    });
  }

  private updateVolume(): void {
    const settings = getSettings();
    Howler.volume(settings.soundEnabled ? 1 : 0);
  }

  playSound(soundId: string, volume?: number): void {
    const settings = getSettings();
    if (!settings.soundEnabled) return;

    const sound = this.sounds.get(soundId);
    if (sound) {
      if (volume !== undefined) {
        sound.volume(volume * settings.sfxVolume);
      }
      sound.play();
    }
  }

  playMusic(musicId: string, loop: boolean = true): void {
    const settings = getSettings();
    if (!settings.soundEnabled) return;

    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    const music = this.sounds.get(musicId);
    if (music) {
      music.volume(settings.musicVolume);
      music.loop(loop);
      music.play();
      this.currentMusic = music;
    }
  }

  setMasterVolume(volume: number): void {
    Howler.volume(volume);
  }

  stopAll(): void {
    this.sounds.forEach(sound => sound.stop());
    this.currentMusic = null;
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  setSoundVolume(volume: number): void {
    this.sounds.forEach((sound, key) => {
      if (key !== 'background') {
        sound.volume(volume);
      }
    });
  }

  setMusicVolume(volume: number): void {
    if (this.currentMusic) {
      this.currentMusic.volume(volume);
    }
    const backgroundMusic = this.sounds.get('background');
    if (backgroundMusic) {
      backgroundMusic.volume(volume);
    }
  }

  updateSettings(): void {
    this.updateVolume();
    const settings = getSettings();
    
    if (this.currentMusic) {
      this.currentMusic.volume(settings.musicVolume);
    }
  }
}

export const audioManager = new GameAudioManager();