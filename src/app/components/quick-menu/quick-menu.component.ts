import { Component, EventEmitter, Output, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewService } from '../../services/pageview.service';
import { IconComponent, IconName } from '../../shared/icon.component';
import { ReplyService } from '../../services/reply.service';

@Component({
  selector: 'app-quick-menu',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="fixed right-3 md:right-6 z-[9990] flex flex-col items-end select-none"
      style="bottom: calc(12px + env(safe-area-inset-bottom));"
      (click)="$event.stopPropagation()">
      <!-- Menu mọc lên từ nút gọi nó ở góc phải dưới -->
      <div
        id="quick-actions"
        role="menu"
        *ngIf="isOpen"
        class="glass materialize mb-3 w-60 rounded-[22px] p-1.5"
        style="transform-origin: 100% 100%;">
        <button
          *ngFor="let a of actions"
          type="button"
          role="menuitem"
          (click)="run(a.id)"
          class="w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-[16px] text-left text-[0.9375rem] font-medium text-garden-900 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors cursor-pointer">
          <span>{{ a.id === 'rsvp' && replyService.rsvp() ? 'Sửa xác nhận tham dự' : a.label }}</span>
          <app-icon [name]="a.icon" class="w-[1.125rem] h-[1.125rem] text-garden-700"></app-icon>
        </button>
      </div>

      <button
        type="button"
        (click)="toggleMenu()"
        [attr.aria-expanded]="isOpen"
        aria-controls="quick-actions"
        [attr.aria-label]="isOpen ? 'Đóng menu tác vụ nhanh' : 'Mở menu tác vụ nhanh'"
        class="relative w-[3.25rem] h-[3.25rem] md:w-14 md:h-14 flex items-center justify-center text-champagne active:scale-[0.92] transition-transform duration-200 cursor-pointer"
        title="Menu tác vụ nhanh">
        <!-- Con dấu sáp: viền sáp chảy không tròn đều, vành dập chìm, nối tiếp con dấu trên phong bì.
             Khi mở menu con dấu xoay nhẹ như vừa được vặn ra, icon ở giữa vẫn đứng thẳng. -->
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          focusable="false"
          class="absolute inset-0 w-full h-full transition-transform duration-500 ease-apple"
          [style.transform]="isOpen ? 'rotate(-28deg)' : 'none'"
          style="filter: drop-shadow(0 1px 1px rgba(15,26,19,.35)) drop-shadow(0 6px 10px rgba(15,26,19,.28));">
          <path
            fill="#2F4A38"
            d="M24 3c5-.6 8.5 2 12 4.5 3.8 2.6 7.6 5.6 8.4 10.5.8 4.6 1.2 9.4-1.6 13.6-2.6 4-5.6 8.2-10.4 9.6-4.6 1.4-9.6 2-14.2-.4-4.2-2.2-8.6-5-10.2-9.8C6.6 26.6 5 21.6 7 17c1.8-4.4 4.6-8.6 9-11 2.6-1.4 5.2-2.7 8-3z" />
          <!-- Ánh bóng của sáp ở mép trên trái -->
          <path d="M10.5 16.5c2-4.2 5.4-7.4 9.5-8.8" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.6" stroke-linecap="round" />
          <!-- Vành dập chìm: một nét tối, một nét sáng lệch xuống -->
          <circle cx="24" cy="24" r="14.5" fill="#17241B" fill-opacity=".14" stroke="#0F1A13" stroke-opacity=".55" stroke-width="1.1" />
          <circle cx="24" cy="24.8" r="14.5" fill="none" stroke="#A9BBA0" stroke-opacity=".4" stroke-width=".7" />
        </svg>
        <app-icon
          [name]="isOpen ? 'close' : 'tulip'"
          class="relative w-[1.375rem] h-[1.375rem]"
          [strokeWidth]="1.7"></app-icon>
        <!-- Chấm nhắc: thiết bị này chưa hồi âm -->
        <span
          *ngIf="!isOpen && !replyService.rsvp()"
          class="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#C8B273] shadow-[0_0_0_2px_#fdfcf7]"
          aria-hidden="true"></span>
      </button>
    </div>
  `,
})
export class QuickMenuComponent {
  @Output() onOpenRsvp = new EventEmitter<void>();

  private pageViewService = inject(PageViewService);
  replyService = inject(ReplyService);
  isOpen = false;

  readonly actions: ReadonlyArray<{ id: 'wish' | 'rsvp' | 'gift'; label: string; icon: IconName }> = [
    { id: 'wish', label: 'Gửi lời chúc', icon: 'pen' },
    { id: 'rsvp', label: 'Xác nhận tham dự', icon: 'rsvp' },
    { id: 'gift', label: 'Mừng cưới', icon: 'gift' },
  ];

  run(id: 'wish' | 'rsvp' | 'gift') {
    if (id === 'wish') this.scrollToGuestbook();
    else if (id === 'rsvp') this.triggerRsvp();
    else this.scrollToBankGift();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:keydown.escape')
  closeMenuWithEscape() {
    this.isOpen = false;
  }

  @HostListener('document:click')
  closeMenu() {
    this.isOpen = false;
  }

  scrollToGuestbook() {
    this.isOpen = false;
    this.pageViewService.goToPage(7);
  }

  scrollToBankGift() {
    this.isOpen = false;
    this.pageViewService.goToPage(8);
  }

  triggerRsvp() {
    this.isOpen = false;
    this.onOpenRsvp.emit();
  }
}
