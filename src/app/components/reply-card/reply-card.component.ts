import { Component, EventEmitter, OnDestroy, Output, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageViewService } from "../../services/pageview.service";
import { ReplyService } from "../../services/reply.service";
import { PersonalizePipe } from "../../shared/personalize.pipe";
import { IconComponent } from "../../shared/icon.component";

/** Trang "Sự kiện cưới" trong `AppComponent.pages`: khách đã biết ngày giờ, địa điểm. */
const EVENTS_PAGE = 5;
/** Từ sổ lưu bút trở đi thẻ tự rút lui để không che ô nhập. */
const GUESTBOOK_PAGE = 7;
const SHOW_DELAY_MS = 1400;
const DISMISS_DRAG_PX = 48;

/**
 * Thẻ hồi âm nhỏ (kiểu reply card kẹp trong thiệp giấy): trượt lên từ đáy khi khách cuộn tới phần Sự kiện,
 * một lần mỗi phiên, và chỉ khi thiết bị này chưa hồi âm. Vuốt xuống hoặc bấm × để cất đi.
 */
@Component({
  selector: "app-reply-card",
  standalone: true,
  imports: [CommonModule, PersonalizePipe, IconComponent],
  styles: [`
    .reply-wrap {
      position: fixed;
      inset-inline: 0;
      bottom: calc(68px + env(safe-area-inset-bottom));
      z-index: 9980;
      display: flex;
      justify-content: center;
      padding-inline: 12px;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .reply-wrap { bottom: calc(24px + env(safe-area-inset-bottom)); }
    }
    .reply-card {
      pointer-events: auto;
      position: relative;
      width: 100%;
      max-width: 22rem;
      padding: 1rem 1.25rem 1.125rem;
      border-radius: 22px;
      text-align: center;
      touch-action: none;
      user-select: none;
      box-shadow: 0 2px 6px rgba(23, 36, 27, 0.08), 0 18px 48px -12px rgba(23, 36, 27, 0.32);
      animation: replyIn 520ms var(--ease-apple) both;
      transition: transform 320ms var(--ease-apple), opacity 240ms ease;
    }
    .reply-card.dragging { transition: none; }
    .reply-card.leaving { transform: translateY(140%) !important; opacity: 0; }
    .reply-grip {
      width: 36px;
      height: 4px;
      margin: 0 auto 0.625rem;
      border-radius: 2px;
      background: rgba(140, 114, 56, 0.35);
    }
    .reply-close { position: absolute; top: 8px; right: 8px; }
    .reply-close::after { content: ""; position: absolute; inset: -8px; }
    @keyframes replyIn {
      from { opacity: 0; transform: translateY(120%); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .reply-card { animation: replyFade 200ms ease both; transition: opacity 200ms ease; }
      .reply-card.leaving { transform: none !important; }
      @keyframes replyFade { from { opacity: 0; } to { opacity: 1; } }
    }
  `],
  template: `
    <div class="reply-wrap" *ngIf="visible() && !pageView.locked()">
      <div
        role="region"
        aria-label="Hồi âm lời mời"
        class="reply-card stationery"
        [class.dragging]="dragging"
        [class.leaving]="leaving()"
        [style.transform]="dragY ? 'translateY(' + dragY + 'px)' : null"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerEnd()"
        (pointercancel)="onPointerEnd()">
        <div class="reply-grip" aria-hidden="true"></div>
        <button
          type="button"
          (click)="dismiss()"
          class="reply-close w-7 h-7 flex items-center justify-center rounded-full text-garden-900/50 active:scale-90 transition-transform cursor-pointer"
          aria-label="Để sau">
          <app-icon name="close" class="w-3.5 h-3.5" [strokeWidth]="2.5"></app-icon>
        </button>

        <p class="eyebrow mb-1">R.S.V.P</p>
        <p class="desc text-garden-900 text-[1rem] !leading-snug px-4" style="text-wrap: balance">
          {{ '{You} sẽ đến chung vui cùng {couple} {nhe}?' | personalize }}
        </p>

        <div class="mt-3.5 flex gap-2">
          <button type="button" (click)="answer(true)" class="btn btn-primary btn-sm flex-1 cursor-pointer">
            <app-icon name="heart" class="w-3.5 h-3.5"></app-icon>
            <span>Sẽ đến</span>
          </button>
          <button type="button" (click)="answer(false)" class="btn btn-tinted btn-sm flex-1 cursor-pointer">
            <span>Tiếc quá, không thể</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ReplyCardComponent implements OnDestroy {
  /** true = "Sẽ đến", false = "Tiếc quá, không thể". */
  @Output() reply = new EventEmitter<boolean>();

  pageView = inject(PageViewService);
  private replyService = inject(ReplyService);

  visible = signal(false);
  leaving = signal(false);
  dragging = false;
  dragY = 0;

  private shown = this.replyService.cardSeen;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;
  private startY: number | null = null;

  constructor() {
    effect(() => {
      const page = this.pageView.currentPageIndex();
      const locked = this.pageView.locked();
      const replied = this.replyService.rsvp() !== null;

      // Đã hồi âm (từ nút khác) hoặc đã tới sổ lưu bút: cất thẻ
      if (this.visible() && (replied || page >= GUESTBOOK_PAGE)) {
        this.dismiss();
        return;
      }

      const eligible = !this.shown && !replied && !locked && page >= EVENTS_PAGE && page < GUESTBOOK_PAGE;
      if (eligible && !this.showTimer) {
        this.showTimer = setTimeout(() => {
          this.showTimer = null;
          const p = this.pageView.currentPageIndex();
          if (this.shown || this.pageView.locked() || this.replyService.rsvp() !== null) return;
          if (p < EVENTS_PAGE || p >= GUESTBOOK_PAGE) return;
          this.shown = true;
          this.replyService.markCardSeen();
          this.visible.set(true);
        }, SHOW_DELAY_MS);
      } else if (!eligible && this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }
    });
  }

  answer(attending: boolean) {
    this.visible.set(false);
    this.reply.emit(attending);
  }

  dismiss() {
    if (this.leaving() || !this.visible()) return;
    this.dragY = 0;
    this.leaving.set(true);
    this.leaveTimer = setTimeout(() => {
      this.visible.set(false);
      this.leaving.set(false);
    }, 320);
  }

  onPointerDown(event: PointerEvent) {
    if ((event.target as HTMLElement).closest("button")) return;
    this.startY = event.clientY;
    this.dragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (this.startY === null) return;
    const dy = event.clientY - this.startY;
    // Kéo xuống theo tay; kéo lên thì ghì lại
    this.dragY = dy > 0 ? dy : dy / 6;
  }

  onPointerEnd() {
    if (this.startY === null) return;
    this.startY = null;
    this.dragging = false;
    if (this.dragY > DISMISS_DRAG_PX) this.dismiss();
    else this.dragY = 0;
  }

  ngOnDestroy() {
    if (this.showTimer) clearTimeout(this.showTimer);
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
  }
}
