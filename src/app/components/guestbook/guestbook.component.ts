import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import confetti from "canvas-confetti";
import { GuestMessage } from "../../models/wedding-data.model";
import { GuestbookService } from "../../services/guestbook.service";
import { ToastService } from "../../services/toast.service";
import { GuestService } from "../../services/guest.service";
import { PersonalizePipe } from "../../shared/personalize.pipe";

@Component({
  selector: "app-guestbook",
  standalone: true,
  imports: [CommonModule, FormsModule, PersonalizePipe],
  styles: [`
    /* Mép mờ thay cho đường kẻ cứng ở nơi danh sách cuộn */
    .wish-list {
      -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 22px), transparent 100%);
      mask-image: linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 22px), transparent 100%);
    }
  `],
  template: `
    <section id="sangtrong-message-id" class="section bg-white">
      <div class="section-inner">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <!-- Cột trái: tiêu đề, đứng yên khi danh sách lời chúc cuộn -->
          <header class="head-ornament md:col-span-5 md:sticky md:top-24 flex flex-col items-center md:items-start text-center md:text-left gap-2 reveal">
            <p class="eyebrow">Lời chúc</p>
            <h2 class="script-title">Sổ lưu bút</h2>
            <p class="lead mt-1 max-w-sm">
              Gửi những lời chúc mừng và nhắn nhủ yêu thương đến cô dâu
              &amp; chú rể
            </p>
            <!-- Trang trí cho cột trái trên desktop, lấp khoảng trống bên dưới tiêu đề -->
            <img
              src="assets/images/decor/ladder-love.png"
              alt=""
              aria-hidden="true"
              width="409"
              height="636"
              loading="lazy"
              class="hidden md:block w-full max-w-[280px] mt-6 opacity-90 pointer-events-none select-none"
            />
          </header>

          <div class="md:col-span-7 rounded-[28px] bg-ivory p-4 sm:p-7 reveal delay-100">
            <!-- Form -->
            <form
              (ngSubmit)="submitWish()"
              class="space-y-3"
            >
              <div>
                <input
                  type="text"
                  [ngModel]="name"
                  (ngModelChange)="name = $event ? $event.toUpperCase() : ''"
                  name="name"
                  [disabled]="guestbookService.isLimitReached() || isSubmitting"
                  [placeholder]="'Tên của {youOne} (tối đa 160 ký tự) *' | personalize"
                  required
                  class="field h-12 uppercase"
                />
              </div>

              <!-- Textarea with Bottom-Right Lightbulb Icon Button -->
              <div class="relative">
                <textarea
                  [(ngModel)]="content"
                  name="content"
                  rows="4"
                  [disabled]="guestbookService.isLimitReached() || isSubmitting"
                  [placeholder]="
                    guestbookService.isLimitReached()
                      ? ('{YouOne} đã gửi tối đa 5 lời chúc từ thiết bị này. Cảm ơn tình cảm của {youOne}! 💕' | personalize)
                      : ('Nhập lời chúc của {youOne} (tối đa 3000 ký tự) *' | personalize)
                  "
                  required
                  class="field h-[150px] sm:h-[170px] !py-3.5 !pr-12 !pb-10 resize-none leading-relaxed"
                >
                </textarea>

                <!-- Lightbulb Icon Button (Bottom-Right Inside Textarea) -->
                <div
                  *ngIf="!guestbookService.isLimitReached()"
                  class="absolute bottom-3 right-2 z-10"
                >
                  <button
                    type="button"
                    (click)="toggleSuggestions($event)"
                    class="w-9 h-9 rounded-full flex items-center justify-center bg-garden-700/10 text-garden-700 transition-transform active:scale-90 cursor-pointer"
                    title="Gợi ý lời chúc mẫu"
                    aria-label="Gợi ý lời chúc mẫu"
                  >
                    <!-- Glowing Lightbulb Icon -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C7.58 2 4 5.58 4 10c0 2.62 1.27 4.96 3.23 6.43.34.25.57.64.63 1.06L8.2 20c.09.56.58 1 1.15 1h5.3c.57 0 1.06-.44 1.15-1l.34-2.51c.06-.42.29-.81.63-1.06C18.73 14.96 20 12.62 20 10c0-4.42-3.58-8-8-8zm-2 20c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1h-4v1z"
                      />
                    </svg>
                  </button>

                  <!-- Suggestions Popover Menu (Right-Aligned Above Icon Button) -->
                  <div
                    *ngIf="isSuggestionsOpen"
                    (click)="$event.stopPropagation()"
                    class="glass materialize absolute bottom-full right-0 mb-2 w-[85vw] max-w-[300px] sm:max-w-[340px] rounded-[20px] p-3 z-50 text-left" style="transform-origin: 100% 100%;"
                  >
                    <!-- Header with Title & Close button -->
                    <div
                      class="flex items-center justify-between pb-2 mb-2 border-b border-garden-900/10"
                    >
                      <div
                        class="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-garden-900"
                      >
                        <span>Chọn lời chúc mẫu</span>
                      </div>
                      <button
                        type="button"
                        (click)="isSuggestionsOpen = false"
                        class="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <!-- Suggestions List Items -->
                    <div
                      class="flex flex-col gap-1.5 max-h-56 overflow-y-auto no-scrollbar"
                    >
                      <button
                        *ngFor="let suggestion of wishSuggestions"
                        type="button"
                        (click)="applySuggestion(suggestion)"
                        class="text-left text-[0.8125rem] p-2.5 rounded-[14px] text-garden-900/80 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors leading-relaxed cursor-pointer"
                      >
                        {{ suggestion }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Button & Counter Area -->
              <div class="flex items-center justify-between pt-0.5">
                <span
                  class="text-[11px] font-medium"
                  [ngClass]="
                    guestbookService.isLimitReached()
                      ? 'text-garden-700 font-semibold'
                      : 'text-stone-400'
                  "
                >
                  <ng-container *ngIf="guestbookService.myWishesCount() > 0">
                    {{
                      guestbookService.isLimitReached()
                        ? 'Đã gửi đủ 5/5 lời chúc'
                        : 'Đã gửi ' + guestbookService.myWishesCount() + '/5 lời chúc'
                    }}
                  </ng-container>
                </span>

                <button
                  type="submit"
                  [disabled]="
                    !name.trim() ||
                    !content.trim() ||
                    isSubmitting ||
                    guestbookService.isLimitReached()
                  "
                  class="btn btn-primary"
                >
                  <svg
                    *ngIf="!isSubmitting"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  <span>{{
                    isSubmitting
                      ? "Đang gửi..."
                      : guestbookService.isLimitReached()
                      ? "Đã gửi 5/5 lời chúc"
                      : "Gửi lời chúc"
                  }}</span>
                </button>
              </div>
            </form>

            <!-- Divider -->
            <div class="my-5 w-full h-px bg-garden-900/10"></div>

            <!-- Empty state when no wishes yet -->
            <div
              *ngIf="guestbookService.messages().length === 0"
              class="flex flex-col items-center text-center gap-3 rounded-[20px] border border-dashed border-garden-900/15 bg-white/60 px-6 py-10 sm:py-12"
            >
              <span class="flex items-center justify-center w-12 h-12 rounded-full bg-garden-700/10 text-2xl" aria-hidden="true">💌</span>
              <p class="font-semibold text-garden-900 text-[0.9375rem]">Chưa có lời chúc nào</p>
              <p class="text-garden-900/60 text-[0.875rem] leading-relaxed max-w-xs">
                Hãy là người đầu tiên gửi lời chúc mừng đến cô dâu &amp; chú rể nhé!
              </p>
            </div>

            <!-- 1. Fixed Pinned Latest Wish from this Device (Stays stationary, gentle warm highlight without icon/badge) -->
            <div
              *ngIf="myLatestWish"
              class="bg-white px-4 py-3.5 rounded-[18px] mb-3 shrink-0"
            >
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="text-[0.8125rem] font-semibold text-garden-700 uppercase tracking-[0.04em]">
                  {{ myLatestWish.name }} • {{ '{YouOne}' | personalize }}
                </h4>
                <span class="text-[10px] sm:text-[11px] text-stone-400 font-light font-beVietnamPro">
                  {{ myLatestWish.createdAt || "Mới đây" }}
                </span>
              </div>
              <p class="text-garden-900/75 text-[0.875rem] leading-relaxed">
                {{ myLatestWish.content }}
              </p>
            </div>

            <!-- 2. Readable Messages List (only this area scrolls) -->
            <div
              *ngIf="otherMessages.length > 0"
              class="wish-list max-h-[320px] md:max-h-[44vh] overflow-y-auto overscroll-contain text-start flex flex-col gap-3.5 px-1 py-2 select-text"
            >
              <article
                *ngFor="let msg of otherMessages; trackBy: trackByMessageId"
                class="border-b border-garden-900/10 pb-3.5 last:border-b-0"
              >
                <div class="flex items-center justify-between gap-3 mb-1.5">
                  <h4 class="text-[0.8125rem] font-semibold text-garden-900 uppercase tracking-[0.04em] truncate">
                    {{ msg.name }}
                  </h4>
                  <time class="text-[10px] sm:text-[11px] text-stone-400 font-light font-beVietnamPro shrink-0">
                    {{ msg.createdAt || "Mới đây" }}
                  </time>
                </div>
                <p class="text-garden-900/75 text-[0.875rem] leading-relaxed break-words">
                  {{ msg.content }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class GuestbookComponent {
  guestbookService = inject(GuestbookService);
  toastService = inject(ToastService);
  guestService = inject(GuestService);

  name = "";
  content = "";
  isSubmitting = false;
  isSuggestionsOpen = false;

  private readonly wishTemplates: string[] = [
    "Chúc mừng hạnh phúc! Chúc {couple} trăm năm hòa hợp, vẹn tròn yêu thương! 💕",
    "Chúc mừng ngày trọng đại! Hạnh phúc bền lâu, trọn vẹn và an yên nhé! 🌸",
    "Chúc {couple} bên nhau đầu bạc răng long, sớm đón thiên thần nhỏ đáng yêu! 👶",
    "Trăm năm tình viên mãn, bạc đầu nghĩa phu thê! Chúc {couple} mãi ngọt ngào! 🥂",
    "Mừng ngày chung đôi! Chúc tổ ấm nhỏ luôn ngập tràn tiếng cười và hạnh phúc! 💐",
  ];

  /** Gợi ý lời chúc, gọi hai bạn theo xưng hô của khách ({couple}). */
  get wishSuggestions(): string[] {
    return this.wishTemplates.map((t) => this.guestService.fmt(t));
  }

  @HostListener("document:click")
  onDocumentClick() {
    this.isSuggestionsOpen = false;
  }

  toggleSuggestions(event: Event) {
    event.stopPropagation();
    this.isSuggestionsOpen = !this.isSuggestionsOpen;
  }

  // Lời chúc gần nhất của thiết bị hiện tại (ghim cố định ở trên, không cuộn)
  get myLatestWish(): GuestMessage | null {
    const all = this.guestbookService.messages();
    const myMessages = all.filter((m) => m.deviceId === this.guestbookService.deviceId);
    return myMessages.length > 0 ? myMessages[0] : null;
  }

  // Các lời chúc còn lại nằm trong danh sách cuộn
  get otherMessages(): GuestMessage[] {
    const all = this.guestbookService.messages();
    const latest = this.myLatestWish;
    if (!latest) return all;
    return all.filter((m) => m.id !== latest.id);
  }

  trackByMessageId(_index: number, message: GuestMessage): string | number {
    return message.id;
  }

  applySuggestion(suggestion: string) {
    this.content = suggestion;
    this.isSuggestionsOpen = false;
  }

  async submitWish() {
    if (!this.name.trim() || !this.content.trim()) return;

    if (this.guestbookService.isLimitReached()) {
      this.toastService.show(
        this.guestService.fmt("{YouOne} đã gửi tối đa 5 lời chúc từ thiết bị này. Cảm ơn tình cảm của {youOne}! 💕"),
        "info",
      );
      return;
    }

    this.isSubmitting = true;
    const res = await this.guestbookService.addMessage(this.name, this.content);

    if (res.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#2F4A38", "#DCE5D3", "#C8B273"],
      });

      this.toastService.show(
        this.guestService.fmt("Cảm ơn {you} đã gửi lời chúc mừng đến dâu rể! 💕"),
        "success",
      );

      this.name = "";
      this.content = "";
    } else if (res.error) {
      this.toastService.show(res.error, "error");
    }

    this.isSubmitting = false;

  }
}
