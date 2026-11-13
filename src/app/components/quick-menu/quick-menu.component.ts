import { Component, EventEmitter, Output, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewService } from '../../services/pageview.service';
import { IconComponent, IconName } from '../../shared/icon.component';

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
          <span>{{ a.label }}</span>
          <app-icon [name]="a.icon" class="w-[1.125rem] h-[1.125rem] text-garden-700"></app-icon>
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
        <!-- Nút chính hiện hoa tulip; khi mở menu đổi sang dấu đóng -->
        <app-icon
          [name]="isOpen ? 'close' : 'tulip'"
          class="w-5 h-5 transition-transform duration-300 ease-apple"
          [strokeWidth]="1.8"></app-icon>
      </button>
    </div>
  `,
})
export class QuickMenuComponent {
  @Output() onOpenRsvp = new EventEmitter<void>();

  private pageViewService = inject(PageViewService);
  isOpen = false;

  readonly actions: ReadonlyArray<{ id: 'wish' | 'rsvp' | 'gift'; label: string; icon: IconName }> = [
    { id: 'wish', label: 'Gửi lời chúc', icon: 'pen' },
    { id: 'rsvp', label: 'Xác nhận tham dự', icon: 'check-circle' },
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
