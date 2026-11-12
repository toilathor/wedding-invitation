import { Component, EventEmitter, Output, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewService } from '../../services/pageview.service';

@Component({
  selector: 'app-quick-menu',
  standalone: true,
  imports: [CommonModule],
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
          <span>{{ a.label }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[1.125rem] h-[1.125rem] text-garden-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="a.icon" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        (click)="toggleMenu()"
        [attr.aria-expanded]="isOpen"
        aria-controls="quick-actions"
        [attr.aria-label]="isOpen ? 'Đóng menu tác vụ nhanh' : 'Mở menu tác vụ nhanh'"
        class="w-11 h-11 md:w-12 md:h-12 rounded-full bg-garden-700 text-white shadow-float flex items-center justify-center active:scale-[0.92] transition-transform duration-200 cursor-pointer"
        title="Menu tác vụ nhanh">
        <!-- Dấu cộng xoay thành dấu đóng: cùng một hình, không đổi biểu tượng đột ngột -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 transition-transform duration-300 ease-apple"
          [class.rotate-45]="isOpen"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  `,
})
export class QuickMenuComponent {
  @Output() onOpenRsvp = new EventEmitter<void>();

  private pageViewService = inject(PageViewService);
  isOpen = false;

  readonly actions = [
    { id: 'wish', label: 'Gửi lời chúc', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'rsvp', label: 'Xác nhận tham dự', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'gift', label: 'Mừng cưới', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  ] as const;

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
