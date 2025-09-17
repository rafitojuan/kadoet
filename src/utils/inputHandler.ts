import type { InputHandler, Direction } from '../types';
import { KEYS } from '../constants';

export class GameInputHandler implements InputHandler {
  private onDirectionChange?: (direction: Direction) => void;
  private onPause?: () => void;
  private touchStartX = 0;
  private touchStartY = 0;
  private minSwipeDistance = 50;
  private boundHandleKeyPress: (event: KeyboardEvent) => void;
  private boundHandleTouchStart: (event: TouchEvent) => void;
  private boundHandleTouchEnd: (event: TouchEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onDirectionChange: (direction: Direction) => void,
    onPauseToggle: () => void
  ) {
    this.boundHandleKeyPress = this.handleKeyPress.bind(this);
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
    this.bindControls();
  }

  bindControls(): void {
    document.addEventListener('keydown', this.boundHandleKeyPress);
    document.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
    document.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });
  }

  private handleKeyPress(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    
    event.preventDefault();
    
    switch (event.code) {
      case KEYS.ARROW_UP:
      case KEYS.W:
        this.onKeyPress('up');
        break;
      case KEYS.ARROW_DOWN:
      case KEYS.S:
        this.onKeyPress('down');
        break;
      case KEYS.ARROW_LEFT:
      case KEYS.A:
        this.onKeyPress('left');
        break;
      case KEYS.ARROW_RIGHT:
      case KEYS.D:
        this.onKeyPress('right');
        break;
      case KEYS.SPACE:
      case KEYS.ESCAPE:
        if (this.onPause) {
          this.onPause();
        }
        break;
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) {
      return;
    }
    
    if (absDeltaX > absDeltaY) {
      this.onTouchSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
      this.onTouchSwipe(deltaY > 0 ? 'down' : 'up');
    }
  }

  onKeyPress(key: string): void {
    if (this.onDirectionChange && ['up', 'down', 'left', 'right'].includes(key)) {
      this.onDirectionChange(key as Direction);
    }
  }

  onTouchSwipe(direction: string): void {
    if (this.onDirectionChange && ['up', 'down', 'left', 'right'].includes(direction)) {
      this.onDirectionChange(direction as Direction);
    }
  }

  setDirectionChangeCallback(callback: (direction: Direction) => void): void {
    this.onDirectionChange = callback;
  }

  setPauseCallback(callback: () => void): void {
    this.onPause = callback;
  }

  unbindControls(): void {
    document.removeEventListener('keydown', this.boundHandleKeyPress);
    document.removeEventListener('touchstart', this.boundHandleTouchStart);
    document.removeEventListener('touchend', this.boundHandleTouchEnd);
  }

  cleanup(): void {
    this.unbindControls();
  }
}