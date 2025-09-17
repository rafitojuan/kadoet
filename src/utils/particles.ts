import type { Particle, ParticleType } from '../types';
import { COLORS } from '../constants';

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  addParticleEffect(x: number, y: number, type: ParticleType): void {
    const particleCount = this.getParticleCount(type);
    const colors = this.getParticleColors(type);
    
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2
      };
      
      this.particles.push(particle);
    }
  }

  private getParticleCount(type: ParticleType): number {
    switch (type) {
      case 'eat': return 8;
      case 'death': return 20;
      case 'sparkle': return 5;
      case 'explosion': return 15;
      default: return 10;
    }
  }

  private getParticleColors(type: ParticleType): string[] {
    switch (type) {
      case 'eat':
        return [COLORS.FOOD_NORMAL, COLORS.ACCENT, '#90EE90'];
      case 'death':
        return [COLORS.SNAKE_HEAD, '#FF4500', '#DC143C'];
      case 'sparkle':
        return [COLORS.FOOD_SPECIAL, '#FFD700', '#FFA500'];
      case 'explosion':
        return [COLORS.FOOD_BONUS, '#FF6347', '#FF4500'];
      default:
        return [COLORS.PRIMARY, COLORS.SECONDARY];
    }
  }

  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= deltaTime / 1000;
      particle.vy += 0.1;
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  clear(): void {
    this.particles = [];
  }

  getParticlesLength(): number {
    return this.particles.length;
  }
}