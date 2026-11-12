import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import { InvitationData } from "../../models/wedding-data.model";
import { PageViewService } from "../../services/pageview.service";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: "app-invitation",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section bg-ivory text-center">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Lời mời</p>
          <h2 class="script-title">Trân trọng kính mời</h2>
          <div class="lead mt-2" [innerHTML]="data.descriptionHtml"></div>
        </header>

        <!-- Một thẻ duy nhất: khi nào, ở đâu, còn bao lâu -->
        <div class="card max-w-xl mx-auto px-5 py-8 sm:px-10 sm:py-10 reveal delay-100">
          <p class="eyebrow">{{ data.time }}</p>

          <div
            class="flex items-center justify-center gap-4 sm:gap-6 mt-3 font-prata text-garden-700 text-[2.75rem] sm:text-6xl leading-none tabular-nums"
          >
            <span>{{ data.day }}</span>
            <i class="w-px self-stretch bg-garden-900/15"></i>
            <span>{{ data.month }}</span>
            <i class="w-px self-stretch bg-garden-900/15"></i>
            <span>{{ data.year }}</span>
          </div>

          <p class="mt-4 text-[0.9375rem] text-garden-900/70">{{ data.location }}</p>

          <div class="h-px bg-garden-900/10 my-7 sm:my-8"></div>

          <!-- Đếm ngược -->
          <div class="grid grid-cols-4 divide-x divide-garden-900/10" role="timer" aria-label="Thời gian còn lại đến ngày cưới">
            <div *ngFor="let unit of units" class="px-1">
              <span class="block text-[1.75rem] sm:text-4xl font-light leading-none tracking-[-0.02em] tabular-nums text-garden-900">
                {{ formatDigits(timeLeft[unit.key]) }}
              </span>
              <span class="block mt-2 text-[0.6875rem] tracking-[0.12em] uppercase text-garden-900/50">{{ unit.label }}</span>
            </div>
          </div>
        </div>

        <div class="reveal delay-200">
          <p class="lead max-w-md mx-auto mt-8 sm:mt-10">{{ data.subDescription }}</p>

          <div class="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 mt-6 max-w-xs sm:max-w-none mx-auto">
            <button
              type="button"
              id="btn-confirm-attendance"
              (click)="onOpenRsvp.emit()"
              class="btn btn-primary"
            >
              Xác nhận tham dự
            </button>
            <button type="button" (click)="scrollToGuestbook()" class="btn btn-tinted">
              Gửi lời chúc
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class InvitationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) data!: InvitationData;
  @Output() onOpenRsvp = new EventEmitter<void>();

  private pageViewService = inject(PageViewService);

  timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  readonly units: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: "Ngày" },
    { key: "hours", label: "Giờ" },
    { key: "minutes", label: "Phút" },
    { key: "seconds", label: "Giây" },
  ];
  private timerInterval: any;

  ngOnInit() {
    this.calculateTimeLeft();
    this.timerInterval = setInterval(() => {
      this.calculateTimeLeft();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private calculateTimeLeft() {
    const target = new Date(this.data.countdownDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference > 0) {
      this.timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  formatDigits(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  scrollToGuestbook() {
    this.pageViewService.goToPage(7);
  }
}
