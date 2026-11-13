import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="fixed inset-x-0 z-[999999] flex flex-col items-center gap-2 px-4 pointer-events-none"
      style="top: calc(0.75rem + env(safe-area-inset-top));"
      role="status"
      aria-live="polite">
      <div
        *ngFor="let t of toastService.toasts()"
        class="glass-dark materialize pointer-events-auto max-w-sm w-fit rounded-[22px] pl-5 pr-2 py-2 flex items-center gap-2"
        style="transform-origin: 50% 0;">
        <span class="text-[0.875rem] font-medium leading-snug py-1.5">{{ t.message }}</span>
        <button
          type="button"
          (click)="toastService.remove(t.id)"
          aria-label="Đóng thông báo"
          class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition">
          <app-icon name="close" class="w-4 h-4" [strokeWidth]="2"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
