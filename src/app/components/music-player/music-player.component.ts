import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .player {
      position: fixed;
      left: 12px;
      bottom: calc(12px + env(safe-area-inset-bottom));
      z-index: 9999;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 9999px;
      display: grid;
      place-items: center;
      color: var(--green);
      cursor: pointer;
      transition: transform 220ms var(--ease-out);
    }
    .player:active { transform: scale(0.92); transition-duration: 90ms; }
    @media (min-width: 768px) { .player { left: 24px; bottom: 24px; } }

    /* Ba vạch âm lượng chỉ chuyển động khi nhạc đang phát */
    .bars { display: flex; align-items: center; gap: 3px; height: 16px; }
    .bars i { width: 3px; height: 100%; border-radius: 2px; background: currentColor; transform-origin: 50% 50%; transform: scaleY(0.25); }
    .playing .bars i { animation: bar 900ms ease-in-out infinite; }
    .playing .bars i:nth-child(2) { animation-delay: -300ms; }
    .playing .bars i:nth-child(3) { animation-delay: -600ms; }
    @keyframes bar { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

    .player:not(.playing) { color: var(--text-3); }
    @media (prefers-reduced-motion: reduce) {
      .playing .bars i { animation: none; transform: scaleY(0.7); }
    }
  `],
  template: `
    <button
      type="button"
      class="player glass"
      [class.playing]="audioService.isPlaying()"
      (click)="audioService.toggle()"
      [attr.aria-pressed]="audioService.isPlaying()"
      [attr.aria-label]="audioService.isPlaying() ? 'Tắt nhạc nền' : 'Bật nhạc nền'"
      [title]="audioService.isPlaying() ? 'Tắt nhạc' : 'Bật nhạc'"
    >
      <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  `
})
export class MusicPlayerComponent {
  audioService = inject(AudioService);
}
