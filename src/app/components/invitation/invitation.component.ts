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
    /* ---- Thẻ mời bao ngoài ---- */
    .invite-card {
      --gold: #b89a62;
      --paper: #fffdf7;
      --notch-bg: #f6f4ec; /* trùng nền bg-ivory của section */
      position: relative;
      border-radius: 30px;
      background:
        radial-gradient(120% 70% at 50% 0%, rgba(184, 154, 98, 0.1), transparent 60%),
        radial-gradient(90% 60% at 50% 100%, rgba(47, 74, 56, 0.06), transparent 70%),
        var(--paper);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.9) inset,
        0 2px 4px rgba(23, 36, 27, 0.04),
        0 24px 48px -20px rgba(23, 36, 27, 0.28),
        0 0 0 1px rgba(184, 154, 98, 0.18);
    }
    /* Khung kép: viền xanh mảnh + viền vàng bên trong */
    .ic-frame {
      position: absolute;
      inset: 10px;
      border: 1px solid rgba(47, 74, 56, 0.16);
      border-radius: 22px;
      pointer-events: none;
    }
    .ic-frame::after {
      content: "";
      position: absolute;
      inset: 4px;
      border: 1px solid rgba(184, 154, 98, 0.45);
      border-radius: 18px;
    }
    .ic-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      border: 1px solid var(--gold);
      background: var(--paper);
    }
    .ic-corner::after {
      content: "";
      position: absolute;
      inset: 3px;
      background: var(--gold);
      opacity: 0.55;
    }
    .ic-corner.tl { top: -7px; left: 22px; }
    .ic-corner.tr { top: -7px; right: 22px; }
    .ic-corner.bl { bottom: -7px; left: 22px; }
    .ic-corner.br { bottom: -7px; right: 22px; }

    /* Con dấu chữ lồng đè lên mép trên */
    .ic-seal {
      position: absolute;
      top: 0;
      left: 50%;
      width: 4.25rem;
      height: 4.25rem;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.05rem;
      border-radius: 9999px;
      color: #f7f2e8;
      background: radial-gradient(circle at 35% 30%, #4a6d55, #2f4a38 55%, #233a2b);
      box-shadow:
        0 0 0 3px var(--paper),
        0 0 0 4px rgba(184, 154, 98, 0.6),
        0 10px 22px -8px rgba(35, 58, 43, 0.6);
      z-index: 1;
    }
    .ic-seal::before {
      content: "";
      position: absolute;
      inset: 4px;
      border-radius: 9999px;
      border: 1px dashed rgba(217, 201, 163, 0.55);
    }
    .ic-seal b {
      font-family: "PinyonScript", "Pinyon Script", cursive;
      font-weight: 400;
      font-size: 1.6rem;
      line-height: 1;
    }
    .ic-seal em {
      font-style: normal;
      font-family: "Prata", serif;
      font-size: 0.7rem;
      color: #d9c9a3;
      margin: 0.35rem 0.3rem 0 0.45rem;
    }
    @media (min-width: 640px) {
      .ic-seal { width: 5rem; height: 5rem; }
      .ic-seal b { font-size: 1.9rem; }
    }

    /* Đường xé vé */
    .ic-perf {
      position: relative;
      height: 1px;
      margin-left: -1.5rem;
      margin-right: -1.5rem;
      background-image: linear-gradient(90deg, rgba(47, 74, 56, 0.28) 50%, transparent 50%);
      background-size: 10px 1px;
      background-position: 14px 0;
      background-repeat: repeat-x;
      background-clip: content-box;
      padding: 0 22px;
    }
    @media (min-width: 640px) {
      .ic-perf { margin-left: -3rem; margin-right: -3rem; }
    }
    .ic-perf::before,
    .ic-perf::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      background: var(--notch-bg);
      box-shadow: inset 0 2px 4px rgba(23, 36, 27, 0.12);
      z-index: 2;
    }
    .ic-perf::before { left: 0; transform: translate(-50%, -50%); }
    .ic-perf::after { right: 0; transform: translate(50%, -50%); }
    .ic-perf span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 0 0.75rem;
      background: var(--paper);
      font-size: 0.625rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold);
      white-space: nowrap;
    }

    /* ---- Đồng hồ lật ---- */
    .cd-grid {
      --w: 3.6rem;
      --h: 4.6rem;
      --fs: 2.15rem;
      --r: 0.7rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 0.3rem;
    }
    @media (min-width: 640px) {
      .cd-grid { --w: 5.5rem; --h: 6.75rem; --fs: 3.25rem; --r: 1rem; gap: 0.75rem; }
    }
    .cd-unit { display: flex; flex-direction: column; align-items: center; }

    .flip {
      position: relative;
      width: var(--w);
      height: var(--h);
      perspective: 340px;
      border-radius: var(--r);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.6),
        0 14px 28px -12px rgba(35, 58, 43, 0.55),
        0 4px 10px -4px rgba(35, 58, 43, 0.35);
    }
    .half {
      position: absolute;
      left: 0;
      right: 0;
      height: 50%;
      overflow: hidden;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      color: #f7f2e8;
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
      background: linear-gradient(180deg, #3d5f48 0%, #33513d 100%);
    }
    .top span { top: 0; }
    .bottom {
      bottom: 0;
      border-radius: 0 0 var(--r) var(--r);
      transform-origin: 50% 0;
      background: linear-gradient(180deg, #2c4735 0%, #233a2b 100%);
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
    .flap-out::after { background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.35)); animation: shade 0.32s forwards; }
    .flap-in::after { background: linear-gradient(0deg, transparent, rgba(0, 0, 0, 0.3)); animation: unshade 0.42s 0.3s forwards; }

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
      background: rgba(0, 0, 0, 0.35);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    .hinge::before,
    .hinge::after {
      content: "";
      position: absolute;
      top: -3px;
      width: 3px;
      height: 7px;
      border-radius: 2px;
      background: #d9c9a3;
    }
    .hinge::before { left: -1px; }
    .hinge::after { right: -1px; }

    .cd-label {
      margin-top: 0.6rem;
      font-size: 0.625rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(47, 74, 56, 0.6);
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
      border-radius: 9999px;
      background: var(--green);
      opacity: 0.35;
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
    <section class="section decor decor-tr-bl bg-ivory text-center">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Lời mời</p>
          <h2 class="script-title">Trân trọng kính mời</h2>
          <div class="lead lead-justify mt-2" [innerHTML]="data.descriptionHtml"></div>
        </header>

        <!-- Một thẻ duy nhất: khi nào, ở đâu, còn bao lâu -->
        <div class="invite-card max-w-xl mx-auto px-6 pt-14 pb-9 sm:px-12 sm:pt-16 sm:pb-12 mt-10 reveal delay-100">
          <!-- Khung kép + góc trang trí -->
          <span class="ic-frame" aria-hidden="true">
            <i class="ic-corner tl"></i><i class="ic-corner tr"></i><i class="ic-corner bl"></i><i class="ic-corner br"></i>
          </span>
          <!-- Con dấu chữ lồng -->
          <span class="ic-seal" aria-hidden="true"><b>T</b><em>&amp;</em><b>H</b></span>

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

          <!-- Đường xé vé: nét đứt với hai vết khuyết hai bên -->
          <div class="ic-perf my-8 sm:my-10" aria-hidden="true"><span>Còn</span></div>

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
