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
  styles: [`
    /* ---- Tấm thiệp: giấy ngà dập nổi, huy hiệu nhũ vàng, ngày cưới in mực xanh ---- */
    .invite-card { --frame-w: 84px; }
    @media (min-width: 640px) { .invite-card { --frame-w: 104px; } }
    .crest {
      position: relative;
      width: 6.75rem;
      aspect-ratio: 1;
      margin: 0 auto 0.75rem;
      display: grid;
      place-items: center;
    }
    .crest i { position: absolute; inset: 0; }
    /* Hai chữ cái viết tay đan vào nhau, chữ sau thấp hơn một chút */
    .crest b {
      position: relative;
      display: flex;
      margin-top: 0.35rem;
      padding: 0 0.3em 0.1em;
      font-family: var(--font-script);
      font-weight: 400;
      font-size: 2.6rem;
      line-height: 1.25;
      color: var(--green);
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    .crest b span + span { margin-left: -0.2em; transform: translateY(0.24em); }
    @media (min-width: 640px) {
      .crest { width: 8rem; }
      .crest b { font-size: 3.1rem; }
    }

    .inv-date {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.9rem;
      margin-top: 0.75rem;
      font-family: var(--font-serif);
      font-size: 2.75rem;
      line-height: 1;
      color: var(--green);
      font-variant-numeric: lining-nums tabular-nums;
      /* mực in lún nhẹ xuống giấy */
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    .inv-date i {
      width: 5px;
      height: 5px;
      transform: rotate(45deg);
      background: var(--gold);
    }
    @media (min-width: 640px) { .inv-date { font-size: 3.75rem; gap: 1.4rem; } }
    .inv-place {
      margin-top: 0.875rem;
      font-family: var(--font-serif);
      font-size: 0.8125rem;
      letter-spacing: 0.08em;
      color: var(--text-2);
    }

    /* ---- Đồng hồ lật ---- */
    .cd-grid {
      --w: 3.3rem;
      --h: 4.3rem;
      --fs: 2rem;
      --r: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 0.3rem;
    }
    @media (min-width: 640px) {
      .cd-grid { --w: 5rem; --h: 6.25rem; --fs: 3rem; --r: 0.8rem; gap: 0.75rem; }
    }
    .cd-unit { display: flex; flex-direction: column; align-items: center; }

    .flip {
      position: relative;
      width: var(--w);
      height: var(--h);
      perspective: 340px;
      border-radius: var(--r);
      box-shadow:
        0 0 0 1px rgba(140, 114, 56, 0.38),
        0 0 0 3px var(--card),
        0 0 0 4px rgba(140, 114, 56, 0.16),
        0 12px 20px -12px rgba(35, 58, 43, 0.4);
    }
    .half {
      position: absolute;
      left: 0;
      right: 0;
      height: 50%;
      overflow: hidden;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      color: var(--green);
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
      font-family: var(--font-prata, "Prata", serif);
      font-size: var(--fs);
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }
    .half span {
      position: absolute;
      left: 0;
      right: 0;
      height: 200%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .top {
      top: 0;
      border-radius: var(--r) var(--r) 0 0;
      transform-origin: 50% 100%;
      background: linear-gradient(180deg, #fffefa 0%, #f6f1e3 100%);
    }
    .top span { top: 0; }
    .bottom {
      bottom: 0;
      border-radius: 0 0 var(--r) var(--r);
      transform-origin: 50% 0;
      background: linear-gradient(180deg, #f3eedf 0%, #ece6d4 100%);
    }
    .bottom span { bottom: 0; }

    /* Nửa trên cũ gập xuống, rồi nửa dưới mới hạ xuống */
    .flap-out {
      z-index: 2;
      animation: flapOut 0.32s cubic-bezier(0.55, 0, 0.9, 0.4) forwards;
    }
    .flap-in {
      z-index: 2;
      transform: rotateX(90deg);
      animation: flapIn 0.42s cubic-bezier(0.2, 0.9, 0.3, 1.25) 0.3s forwards;
    }
    .flap-out::after,
    .flap-in::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .flap-out::after { background: linear-gradient(180deg, transparent, rgba(60, 50, 20, 0.16)); animation: shade 0.32s forwards; }
    .flap-in::after { background: linear-gradient(0deg, transparent, rgba(60, 50, 20, 0.14)); animation: unshade 0.42s 0.3s forwards; }

    @keyframes flapOut { from { transform: rotateX(0); } to { transform: rotateX(-90deg); } }
    @keyframes flapIn { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }
    @keyframes shade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes unshade { from { opacity: 1; } to { opacity: 0; } }

    /* Khe bản lề giữa hai nửa */
    .hinge {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      z-index: 3;
      height: 1px;
      background: rgba(140, 114, 56, 0.45);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    .hinge::before,
    .hinge::after {
      content: "";
      position: absolute;
      top: -3px;
      width: 3px;
      height: 7px;
      border-radius: 2px;
      background: var(--gold);
    }
    .hinge::before { left: -1px; }
    .hinge::after { right: -1px; }

    .cd-label {
      margin-top: 0.6rem;
      font-size: 0.625rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-family: var(--font-serif);
      color: var(--gold-deep);
    }
    @media (min-width: 640px) { .cd-label { font-size: 0.75rem; margin-top: 0.8rem; } }

    .cd-colon {
      height: var(--h);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.6rem;
    }
    .cd-colon i {
      width: 0.3rem;
      height: 0.3rem;
      transform: rotate(45deg);
      background: var(--gold);
      opacity: 0.5;
    }
    .cd-colon.tick i { animation: tick 1s steps(1) infinite; }
    @keyframes tick { 0% { opacity: 0.9; } 50% { opacity: 0.2; } }

    @media (prefers-reduced-motion: reduce) {
      .flap-out { display: none; }
      .flap-in { animation: none; transform: none; }
      .flap-in::after { display: none; }
      .cd-colon.tick i { animation: none; }
    }
  `],
  template: `
    <section class="section decor decor-tulip paper text-center">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Lời mời</p>
          <h2 class="script-title">Trân trọng kính mời</h2>
          <div class="lead lead-justify mt-2" [innerHTML]="data.descriptionHtml"></div>
        </header>

        <!-- Một thẻ duy nhất: khi nào, ở đâu, còn bao lâu -->
        <div class="invite-card stationery stationery-framed stationery-arch max-w-xl mx-auto px-9 pt-9 pb-11 sm:px-14 sm:pt-12 sm:pb-14 mt-10 reveal delay-100">
          <!-- Huy hiệu chữ lồng trong vòng lá, ép nhũ vàng -->
          <div class="crest" aria-hidden="true">
            <i class="foil-orn orn-crest"></i>
            <b><span>T</span><span>H</span></b>
          </div>

          <p class="eyebrow">{{ data.time }}</p>

          <div class="inv-date">
            <span>{{ data.day }}</span><i></i><span>{{ data.month }}</span><i></i><span>{{ data.year }}</span>
          </div>
          <p class="inv-place">{{ data.location }}</p>

          <div class="orn-rule my-7 sm:my-9" aria-hidden="true">
            <span class="foil-orn orn-hy w-[1.375rem]"></span>
          </div>
          <p class="eyebrow !text-[0.625rem] mb-4" aria-hidden="true">Đếm ngược ngày vui</p>

          <!-- Đếm ngược: đồng hồ lật 3D -->
          <div class="cd-grid" role="timer" aria-label="Thời gian còn lại đến ngày cưới">
            @for (unit of units; track unit.key; let last = $last) {
              <div class="cd-unit">
                <div class="flip" aria-hidden="true">
                  <div class="half top"><span>{{ flips[unit.key].curr }}</span></div>
                  <div class="half bottom"><span>{{ flips[unit.key].prev }}</span></div>
                  @for (v of [flips[unit.key].curr]; track v) {
                    <div class="half top flap-out"><span>{{ flips[unit.key].prev }}</span></div>
                    <div class="half bottom flap-in"><span>{{ v }}</span></div>
                  }
                  <i class="hinge"></i>
                </div>
                <span class="cd-label">{{ unit.label }}</span>
                <span class="sr-only">{{ timeLeft[unit.key] }} {{ unit.label }}</span>
              </div>
              @if (!last) {
                <span class="cd-colon" [class.tick]="unit.key === 'minutes'" aria-hidden="true"><i></i><i></i></span>
              }
            }
          </div>
        </div>

        <div class="reveal delay-200">
          <p class="lead max-w-md mx-auto mt-8 sm:mt-10">{{ data.subDescription }}</p>

          <div class="flex flex-col items-stretch gap-3 mt-6 max-w-xs mx-auto">
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
    this.syncFlips();
  }

  /** Giá trị đang hiện và giá trị trước đó của từng ô lật (để chạy hiệu ứng lật). */
  flips: Record<keyof TimeLeft, { curr: string; prev: string }> = {
    days: { curr: "00", prev: "00" },
    hours: { curr: "00", prev: "00" },
    minutes: { curr: "00", prev: "00" },
    seconds: { curr: "00", prev: "00" },
  };

  private syncFlips() {
    for (const { key } of this.units) {
      const v = this.formatDigits(this.timeLeft[key]);
      if (v !== this.flips[key].curr) {
        this.flips[key] = { prev: this.flips[key].curr, curr: v };
      }
    }
  }

  formatDigits(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  scrollToGuestbook() {
    this.pageViewService.goToPage(7);
  }
}
