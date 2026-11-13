import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

/**
 * Bộ icon riêng của thiệp. Vẽ trên lưới 24×24, nét tròn đầu/nối, cùng một độ dày nét
 * nên mọi icon đứng cạnh nhau đều đồng bộ. Màu lấy theo `color` của phần tử cha (currentColor),
 * kích thước đặt bằng class Tailwind trên thẻ <app-icon> (vd. class="w-4 h-4").
 */
const SEARCH = 'M10.8 17.6a6.8 6.8 0 1 0 0-13.6 6.8 6.8 0 0 0 0 13.6zM15.8 15.8L20 20';

const PATHS = {
  close: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'],
  plus: ['M12 5.5v13', 'M5.5 12h13'],
  car: [
    'M3 15.5v-2.5l1.8-3.6c.5-1 1.2-1.4 2.2-1.4h9c1 0 1.7.4 2.2 1.4l1.8 3.6v2.5z',
    'M7.6 11.5h8.8',
    'M5.5 16.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0z',
    'M14.5 16.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0z',
  ],
  tulip: [
    'M7.5 4l2 4.5L12 6l2.5 2.5L16.5 4c0 5-1.5 8-4.5 8s-4.5-3-4.5-8z',
    'M12 12v9',
    'M12 19c-3.2 0-5-2.2-5-4.6 2.6-.2 4.4 1.2 5 4.6z',
    'M12 19c3.2 0 5-2.2 5-4.6-2.6-.2-4.4 1.2-5 4.6z',
  ],
  search: [SEARCH],
  'zoom-in': [SEARCH, 'M10.8 8.6v4.4', 'M8.6 10.8h4.4'],
  'zoom-out': [SEARCH, 'M8.6 10.8h4.4'],
  'chevron-down': ['M6.5 9.5l5.5 5.5 5.5-5.5'],
  'chevron-up': ['M6.5 14.5l5.5-5.5 5.5 5.5'],
  'chevron-left': ['M14.5 6.5L9 12l5.5 5.5'],
  'chevron-right': ['M9.5 6.5L15 12l-5.5 5.5'],
  play: ['M8 5.6v12.8c0 .8.9 1.3 1.6.9l10.2-6.4c.6-.4.6-1.3 0-1.7L9.6 4.7C8.9 4.3 8 4.8 8 5.6z'],
  pause: ['M7.5 5h2.8v14H7.5z', 'M13.7 5h2.8v14h-2.8z'],
  pen: ['M4.5 19.5l1-4.2L15.6 5.2a2.2 2.2 0 0 1 3.1 3.1L8.6 18.5l-4.1 1z', 'M13.8 7l3.2 3.2'],
  check: ['M5 12.6l4.4 4.4L19 7.4'],
  'check-circle': ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0z', 'M8.3 12.3l2.5 2.5 5-5.2'],
  info: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0z', 'M12 11v5.2', 'M12 7.9v.2'],
  gift: [
    'M4 8.5h16v3.2H4z',
    'M5.5 11.7V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-7.3',
    'M12 8.5v12',
    'M12 8.5C12 6 10.3 4.2 8.6 4.6 7 5 7.3 7.3 9.1 8.1 10.4 8.7 12 8.5 12 8.5z',
    'M12 8.5c0-2.5 1.7-4.3 3.4-3.9 1.6.4 1.3 2.7-.5 3.5-1.3.6-2.9.4-2.9.4z',
  ],
  heart: ['M12 19.6C6.4 16 3.6 13 3.6 9.3 3.6 6.8 5.5 5 7.8 5c1.7 0 3.1.9 4.2 2.4C13.1 5.9 14.5 5 16.2 5c2.3 0 4.2 1.8 4.2 4.3 0 3.7-2.8 6.7-8.4 10.3z'],
  bulb: ['M9.2 17.2h5.6', 'M10 20.6h4', 'M12 3.4a6.1 6.1 0 0 0-3.7 10.9c.6.5.9 1.1.9 1.8v.3h5.6v-.3c0-.7.3-1.3.9-1.8A6.1 6.1 0 0 0 12 3.4z'],
  calendar: [
    'M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z',
    'M4 10h16',
    'M8.2 2.8v3.4',
    'M15.8 2.8v3.4',
    'M8 14h2.5',
    'M13.5 14h2.5',
    'M8 17.2h2.5',
  ],
  download: ['M12 4v11', 'M7.8 11.2L12 15.4l4.2-4.2', 'M5 19.5h14'],
} as const;

export type IconName = keyof typeof PATHS;

const FILLED: ReadonlySet<IconName> = new Set<IconName>(['play', 'pause', 'heart']);

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [NgFor],
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.fill]="filled ? 'currentColor' : 'none'"
      [attr.stroke]="filled ? 'none' : 'currentColor'"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path *ngFor="let d of paths" [attr.d]="d" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
        flex-shrink: 0;
      }
      svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
    `,
  ],
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() strokeWidth = 1.8;

  get paths(): readonly string[] {
    return PATHS[this.name] ?? [];
  }

  get filled(): boolean {
    return FILLED.has(this.name);
  }
}
