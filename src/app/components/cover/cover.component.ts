import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import confetti from "canvas-confetti";
import { BannerData } from "../../models/wedding-data.model";
import { BannerComponent } from "../banner/banner.component";
import { DEFAULT_GUEST, Guest } from "../../core/guest-rules";

/**
 * Màn mở thiệp: phong bì giấy màu đào (theme.secondary) với mực đỏ đất (theme.primary)
 * và dấu sáp vàng đồng. Tấm thiệp bên trong chính là phần đầu trang (banner) thu nhỏ —
 * khi mở xong nó phóng to khớp đúng vị trí banner thật rồi màn phủ tan đi.
 */
@Component({
  selector: "app-cover",
  standalone: true,
  imports: [NgFor, NgIf, BannerComponent],
  template: `
    <div
      #root
      class="cover"
      role="dialog"
      aria-label="Mở thiệp cưới"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
    >
      <!-- Cùng hoa trang trí với banner để lúc chuyển cảnh liền mạch -->
      <img
        src="assets/images/templates/sangtrong/7.png"
        alt=""
        class="absolute top-0 left-0 w-[140px] sm:w-[200px] md:w-[240px] lg:w-[300px] xl:w-[400px] h-auto pointer-events-none opacity-85 sm:opacity-95"
      />

      <div class="petals" aria-hidden="true">
        <span
          *ngFor="let p of petals"
          class="petal"
          [style.--x]="p.x + '%'"
          [style.--drift]="p.drift + 'px'"
          [style.--dur]="p.dur + 's'"
          [style.--delay]="p.delay + 's'"
          [style.--size]="p.size + 'px'"
        ></span>
      </div>

      <button
        type="button"
        class="envelope-btn"
        (click)="onClick($event)"
        aria-label="Chạm hoặc vuốt lên để mở thiệp"
      >
        <div class="float">
          <div #envelope class="envelope">
            <div class="env-part env-shadow"></div>

            <!-- Mặt sau phong bì -->
            <svg class="layer env-part back" viewBox="0 0 340 230" aria-hidden="true">
              <rect width="340" height="230" rx="10" fill="#E6C6B4" />
              <rect width="340" height="230" rx="10" filter="url(#cv-paper)" opacity=".5" />
            </svg>

            <!-- Thiệp = phần đầu trang thu nhỏ -->
            <div #card class="card">
              <div #cardInner class="card-inner">
                <div #cardShadow class="card-shadow"></div>
                <app-banner [data]="data"></app-banner>
              </div>
            </div>

            <!-- Mặt trước phong bì -->
            <svg class="layer env-part front" viewBox="0 0 340 230" aria-hidden="true">
              <rect width="340" height="230" rx="10" fill="url(#cv-paper-front)" />
              <rect width="340" height="230" rx="10" filter="url(#cv-paper)" opacity=".55" />
              <path d="M10 0 H330 Q340 0 340 10 V12 H0 V10 Q0 0 10 0 Z" fill="url(#cv-throat)" />
              <text x="206" y="172" text-anchor="middle" font-family="Prata, PlayfairDisplay, serif" font-size="13" letter-spacing="6" fill="#A12F0C">THIỆP MỜI</text>
              <text x="34" y="205" font-family="BeVietnamPro, sans-serif" font-size="6.6" letter-spacing=".6" fill="#2A1810" opacity=".85">TRÂN TRỌNG KÍNH MỜI:</text>
              <path *ngIf="!guest.display" d="M128 205.5 H306" stroke="#A12F0C" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="0 4.2" opacity=".75" />
              <path *ngIf="guest.display" d="M128 207 H306" stroke="#A12F0C" stroke-width=".7" stroke-linecap="round" opacity=".35" />
              <text data-guest="1" *ngIf="guest.display" x="128" y="204.5" font-family="PinyonScript, 'Pinyon Script', cursive" font-size="17" fill="#A12F0C">{{ guest.display }}</text>
              <rect x=".5" y=".5" width="339" height="229" rx="9.5" fill="none" stroke="#A12F0C" stroke-opacity=".12" />
            </svg>

            <!-- Nắp phong bì: cạnh vát chéo như mẫu -->
            <div #flap class="flap">
              <svg class="layer face" viewBox="0 0 340 230" aria-hidden="true">
                
                <path d="M10 0 H330 Q340 0 340 10 V86 Q340 92.5 333 94 Q170 121 7 140.5 Q0 141.5 0 134 V10 Q0 0 10 0 Z" fill="url(#cv-paper-flap)" />
                <path d="M10 0 H330 Q340 0 340 10 V86 Q340 92.5 333 94 Q170 121 7 140.5 Q0 141.5 0 134 V10 Q0 0 10 0 Z" filter="url(#cv-paper)" opacity=".5" clip-path="url(#cv-flap-clip)" />
                <path d="M7 140.5 Q170 121 333 94" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.1" stroke-linecap="round" />
                <path d="M10 .6 H330" stroke="#7A3A1E" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round" />
                <!-- Monogram -->
                <ellipse cx="128" cy="78" rx="34" ry="13" fill="#A12F0C" opacity=".07" transform="rotate(-24 128 78)" />
                <g fill="none" stroke="#A12F0C" stroke-width=".8" stroke-linecap="round" opacity=".42">
                  <path d="M94 98 C108 82 124 72 142 67" />
                  <path d="M98 100 C114 94 130 85 141 72 C128 74 110 84 98 100 Z" />
                  <path d="M94 98 C104 103 120 102 132 93 C118 92 104 94 94 98 Z" />
                  <path d="M102 88 C108 76 120 66 134 62 C124 70 112 80 102 88 Z" />
                </g>
                <text font-family="Prata, PlayfairDisplay, serif" font-size="6" letter-spacing="2.4" fill="#2A1810" opacity=".8">
                  <textPath href="#cv-arc" startOffset="50%" text-anchor="middle">SAVE THE DATE · {{ data.day }}.{{ data.month }}.{{ data.year }}</textPath>
                </text>
                <text x="140" y="80" text-anchor="middle" font-family="PlayfairDisplay, Prata, serif" font-style="italic" font-size="46" fill="#A12F0C">{{ initials[0] }}</text>
                <text x="168" y="96" text-anchor="middle" font-family="PlayfairDisplay, Prata, serif" font-style="italic" font-size="46" fill="#A12F0C">{{ initials[1] }}</text>
              </svg>
              <svg class="layer face inner" viewBox="0 0 340 230" aria-hidden="true">
                <!-- Cùng một đường viền với mặt trước, lật ngang để sau khi xoay Y 180° trùng khớp -->
                <g transform="translate(340 0) scale(-1 1)">
                  <path d="M10 0 H330 Q340 0 340 10 V86 Q340 92.5 333 94 Q170 121 7 140.5 Q0 141.5 0 134 V10 Q0 0 10 0 Z" fill="#A12F0C" />
                  <path d="M10 0 H330 Q340 0 340 10 V86 Q340 92.5 333 94 Q170 121 7 140.5 Q0 141.5 0 134 V10 Q0 0 10 0 Z" fill="url(#cv-liner)" />
                  <path d="M18 7 H322 Q331 7 331 16 V84 Q331 88 326 89 Q170 114 14 132 Q9 133 9 128 V16 Q9 7 18 7 Z" fill="none" stroke="#F4DBCE" stroke-opacity=".55" stroke-width=".8" stroke-linejoin="round" />
                </g>
              </svg>
            </div>

            <!-- Dấu sáp -->
            <div #seal class="seal">
              <span class="seal-ring"></span>
              <div class="seal-disc"><span>with<br />love</span></div>
            </div>
          </div>
        </div>
      </button>

      <div #names class="names">{{ data.groom }} &amp; {{ data.bride }}</div>
      <p #hint class="hint">Chạm hoặc vuốt lên để mở thiệp</p>

      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <defs>
          <linearGradient id="cv-paper-front" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FAEAE1" />
            <stop offset="1" stop-color="#F1D5C6" />
          </linearGradient>
          <linearGradient id="cv-paper-flap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FCF1EA" />
            <stop offset="1" stop-color="#F6E0D4" />
          </linearGradient>
          <linearGradient id="cv-throat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7A3A1E" stop-opacity=".14" />
            <stop offset="1" stop-color="#7A3A1E" stop-opacity="0" />
          </linearGradient>
          <pattern id="cv-liner" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke="#F4DBCE" stroke-opacity=".22" stroke-width=".8" />
            <circle cx="8" cy="8" r="1" fill="#F4DBCE" fill-opacity=".35" />
          </pattern>
          <filter id="cv-paper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 .48  0 0 0 0 .23  0 0 0 0 .12  0 0 0 .13 0" />
          </filter>
          <filter id="cv-blur"><feGaussianBlur stdDeviation="3" /></filter>
          <clipPath id="cv-flap-clip"><path d="M10 0 H330 Q340 0 340 10 V86 Q340 92.5 333 94 Q170 121 7 140.5 Q0 141.5 0 134 V10 Q0 0 10 0 Z" /></clipPath>
          <path id="cv-arc" d="M92 74 A64 64 0 0 1 218 74" />
        </defs>
      </svg>
    </div>
  `,
  styles: [`
    :host { display: contents; }

    .cover {
      position: fixed; inset: 0; z-index: 10000; overflow: hidden;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; padding: 1.5rem;
      color: #2A1810; touch-action: none; cursor: pointer; user-select: none; -webkit-user-select: none;
      background:
        radial-gradient(ellipse at 85% 92%, rgba(244, 219, 206, .95) 0%, rgba(244, 219, 206, 0) 55%),
        radial-gradient(ellipse at 8% 60%, rgba(244, 219, 206, .6) 0%, rgba(244, 219, 206, 0) 45%),
        #FBF7F5;
    }

    .names {
      font-family: 'PinyonScript', cursive; font-size: clamp(1.8rem, 8.2vw, 2.8rem); line-height: 1.1;
      white-space: nowrap; color: #A12F0C; text-align: center;
    }
    .hint {
      margin: 0; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: #2A1810; opacity: .6; text-align: center;
      animation: hint 2.4s ease-in-out infinite;
    }
    @keyframes hint { 0%, 100% { opacity: .3; } 50% { opacity: .7; } }

    /* Cánh hoa */
    .petals { position: absolute; inset: 0; pointer-events: none; }
    .petal {
      position: absolute; top: -24px; left: var(--x); width: var(--size); height: calc(var(--size) * 1.25);
      border-radius: 0 100% 0 100%; background: linear-gradient(135deg, #fbe3d8, #eeb9a3);
      opacity: 0; animation: fall var(--dur) linear var(--delay) infinite; will-change: transform, opacity;
    }
    @keyframes fall {
      0% { transform: translate3d(0, 0, 0) rotate(0); opacity: 0; }
      10% { opacity: .8; }
      90% { opacity: .6; }
      100% { transform: translate3d(var(--drift), 105vh, 0) rotate(520deg); opacity: 0; }
    }

    /* Phong bì */
    .envelope-btn {
      background: none; border: 0; padding: 0; cursor: pointer; position: relative; border-radius: 6px;
      -webkit-tap-highlight-color: transparent; touch-action: none; user-select: none; -webkit-user-select: none;
    }
    .envelope-btn:focus-visible { outline: 2px solid #A12F0C; outline-offset: 10px; }
    .float { animation: float 3.8s ease-in-out infinite; }
    /* Chỉ tịnh tiến (không xoay) để thiệp khớp chính xác vào banner thật khi mở xong */
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

    .envelope { position: relative; width: min(82vw, 380px); aspect-ratio: 340 / 230; perspective: 1100px; }
    .layer { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
    .env-shadow { position: absolute; inset: 6% 3% 0; z-index: 0; border-radius: 10px; box-shadow: 0 22px 36px rgba(122, 58, 30, .28), 0 4px 10px rgba(122, 58, 30, .18); }
    .back { z-index: 1; }
    .front { z-index: 3; }

    .flap { position: absolute; inset: 0; z-index: 4; transform-origin: 50% 0; transform-style: preserve-3d; will-change: transform; }
    .flap .face { backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: visible; }
    .flap .inner { transform: rotateY(180deg); }

    /* Thiệp (banner thu nhỏ). Kích thước thật = bề rộng màn hình, thu nhỏ bằng transform */
    .card { position: absolute; left: 0; top: 0; z-index: 2; width: 100vw; transform-origin: 0 0; will-change: transform, clip-path; pointer-events: none; text-align: left; }
    .card-inner { position: relative; background: #FBF7F5; transform-origin: 50% 30%; }
    .card-shadow { position: absolute; inset: 0; box-shadow: 0 0 0 1px rgba(161, 47, 12, .14), 0 10px 40px rgba(122, 58, 30, .3); pointer-events: none; }

    /* Dấu sáp */
    .seal { position: absolute; z-index: 6; left: 68%; top: 47.8%; width: 21%; aspect-ratio: 1; translate: -50% -50%; will-change: transform, opacity; }
    .seal-disc {
      position: absolute; inset: 0; display: grid; place-items: center;
      border-radius: 47% 53% 51% 49% / 52% 48% 53% 47%;
      background: radial-gradient(circle at 34% 28%, #f1d58f 0%, #cfa04a 42%, #9a6a22 100%);
      box-shadow: 0 4px 8px rgba(80, 40, 10, .4), inset 0 2px 3px rgba(255, 240, 200, .55), inset 0 -3px 5px rgba(90, 50, 5, .45);
      transition: transform 110ms ease-out;
    }
    .seal-disc::before {
      content: ''; position: absolute; inset: 11%; border-radius: 50%;
      box-shadow: inset 0 2px 3px rgba(90, 50, 5, .5), inset 0 -1px 2px rgba(255, 240, 200, .5);
      background: radial-gradient(circle at 40% 30%, #dcb25c, #b98833);
    }
    .seal-disc span {
      position: relative; font-family: 'PinyonScript', cursive; font-size: clamp(13px, 4.4vw, 20px); line-height: .82; text-align: center;
      color: #7a5212; transform: rotate(-14deg); text-shadow: 0 1px 0 rgba(255, 236, 180, .7), 0 -1px 0 rgba(70, 40, 0, .35);
    }
    .cover:active .seal-disc { transform: scale(.93); }
    .seal-ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(161, 47, 12, .45); animation: ring 2.2s cubic-bezier(.23, 1, .32, 1) infinite; }
    @keyframes ring { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(1.9); opacity: 0; } }

    .cover.is-pulled .hint, .cover.is-pulled .seal-ring { animation: none; }
    .cover.is-pulled .float { animation-play-state: paused; }
    .cover.is-opening .envelope-btn { cursor: default; }

    @media (prefers-reduced-motion: reduce) {
      .float, .hint, .seal-ring { animation: none; }
      .petals { display: none; }
    }
  `],
})
export class CoverComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: BannerData;
  /** Khách của link cá nhân hoá; `display` rỗng thì phong bì để trống dòng mời như trước. */
  @Input() guest: Guest = DEFAULT_GUEST;
  @Output() opened = new EventEmitter<void>();
  @Output() finished = new EventEmitter<void>();

  @ViewChild("root", { static: true }) rootRef!: ElementRef<HTMLElement>;
  @ViewChild("envelope", { static: true }) envelopeRef!: ElementRef<HTMLElement>;
  @ViewChild("card", { static: true }) cardRef!: ElementRef<HTMLElement>;
  @ViewChild("cardInner", { static: true }) cardInnerRef!: ElementRef<HTMLElement>;
  @ViewChild("cardShadow", { static: true }) cardShadowRef!: ElementRef<HTMLElement>;
  @ViewChild("flap", { static: true }) flapRef!: ElementRef<HTMLElement>;
  @ViewChild("seal", { static: true }) sealRef!: ElementRef<HTMLElement>;
  @ViewChild("names", { static: true }) namesRef!: ElementRef<HTMLElement>;
  @ViewChild("hint", { static: true }) hintRef!: ElementRef<HTMLElement>;

  readonly petals = Array.from({ length: 10 }, (_, i) => ({
    x: Math.round(((i * 71) % 100) * 0.96 + 2),
    drift: (i % 2 ? 1 : -1) * (30 + ((i * 17) % 60)),
    dur: 10 + ((i * 13) % 7),
    delay: -((i * 5) % 11),
    size: 9 + ((i * 3) % 6),
  }));

  /** Chữ cái đầu của tên (từ cuối cùng) chú rể & cô dâu, dùng cho monogram trên nắp. */
  get initials(): [string, string] {
    const last = (name: string) => (name.trim().split(/\s+/).pop() ?? "").charAt(0).toUpperCase();
    return [last(this.data.groom), last(this.data.bride)];
  }

  // ───────────── Vật lý: một biến tiến trình p (0 = đóng, 1 = mở) do lò xo điều khiển ─────────────
  private p = 0;
  private v = 0; // đơn vị p / giây
  private target = 0;
  private committed = false;
  private burstDone = false;
  private dragging = false;
  private raf: number | null = null;
  private lastT = 0;
  private startY = 0;
  private samples: { t: number; y: number }[] = [];
  private animations: Animation[] = [];
  private done = false;
  private parts: HTMLElement[] = [];
  private faces: HTMLElement[] = [];
  private fades: HTMLElement[] = [];
  private envRect: DOMRect | null = null;

  private readonly DRAG_RANGE = 240; // px kéo để mở hết
  // Lò xo kiểu Apple: response ≈ 1.7s, damping 0.82
  private readonly OMEGA = (2 * Math.PI) / 1.7;
  private readonly ZETA = 0.82;

  ngAfterViewInit() {
    const env = this.envelopeRef.nativeElement;
    this.parts = Array.from(env.querySelectorAll<HTMLElement>(".env-part"));
    this.faces = Array.from(this.flapRef.nativeElement.querySelectorAll<HTMLElement>(".face"));
    this.fades = [this.namesRef.nativeElement, this.hintRef.nativeElement];
    // Banner trong thiệp không nằm trong IntersectionObserver của trang → tự hiện
    this.cardRef.nativeElement
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => el.classList.add("revealed"));
    this.fitGuestName();
    // Font chữ viết tay tải xong thì đo lại (độ rộng chữ thay đổi theo font)
    document.fonts?.ready.then(() => this.fitGuestName());
    this.render();
  }

  /** Thu nhỏ chữ nếu tên dài hơn đoạn kẻ chấm trên phong bì (rộng 178 đơn vị SVG). */
  private fitGuestName() {
    const el = this.rootRef.nativeElement.querySelector<SVGTextElement>("text[data-guest]");
    if (!el || !this.guest.display) return;
    const max = 176;
    let size = 17;
    el.setAttribute("font-size", String(size));
    for (let i = 0; i < 12 && el.getComputedTextLength() > max && size > 8; i++) {
      size -= 1;
      el.setAttribute("font-size", String(size));
    }
  }

  @HostListener("window:resize")
  onResize() {
    this.envRect = null;
    if (!this.done) this.render();
  }

  onPointerDown(e: PointerEvent) {
    if (this.done) return;
    if (this.committed) { this.skip(); return; }
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* pointer không còn hợp lệ: bỏ qua */ }
    this.dragging = false;
    this.startY = e.clientY;
    this.samples = [{ t: e.timeStamp, y: e.clientY }];
    this.target = 0;
  }

  onPointerMove(e: PointerEvent) {
    if (this.committed || this.samples.length === 0) return;
    const dy = this.startY - e.clientY;
    if (!this.dragging && Math.abs(dy) > 8) this.dragging = true;
    if (!this.dragging) return;
    this.samples.push({ t: e.timeStamp, y: e.clientY });
    if (this.samples.length > 6) this.samples.shift();
    // Kéo lên: bám ngón tay 1:1; kéo xuống: cản dần như dây cao su
    const raw = dy / this.DRAG_RANGE;
    this.p = raw >= 0 ? Math.min(raw, 0.95) : -this.rubber(-raw);
    this.v = 0;
    this.ensureLoop();
  }

  onPointerUp(e: PointerEvent) {
    if (this.samples.length === 0) return;
    const wasDragging = this.dragging;
    const recent = this.samples.filter((m) => e.timeStamp - m.t <= 100);
    this.samples = [];
    this.dragging = false;
    if (this.committed) return;

    if (!wasDragging) {
      if (e.type === "pointerup") this.commit(0.4); // chạm = mở, với cú hích ban đầu
      return;
    }
    // Chỉ tính vận tốc trên ~100ms cuối: nếu ngón tay đã dừng trước khi thả thì vận tốc = 0
    let vel = 0;
    if (recent.length >= 2) {
      const f = recent[0], l = recent[recent.length - 1];
      vel = (f.y - l.y) / (Math.max(16, l.t - f.t) / 1000) / this.DRAG_RANGE;
    }
    const projected = this.p + vel * 0.499; // chiếu động lượng: 0.998 / (1 - 0.998) / 1000
    if (projected > 0.42) this.commit(vel);
    else {
      this.target = 0;
      this.v = vel;
      this.ensureLoop();
    }
  }

  onClick(e: MouseEvent) {
    // Bàn phím (Enter/Space) sinh click với detail = 0
    if (e.detail === 0 && !this.committed) this.commit(0.4);
  }

  private commit(initialVelocity: number) {
    this.committed = true;
    this.target = 1;
    this.v = Math.max(this.v, initialVelocity);
    this.rootRef.nativeElement.classList.add("is-opening");
    this.opened.emit(); // cử chỉ hợp lệ để bật nhạc

    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { this.fadeOut(300, 150); return; }
    this.ensureLoop();
  }

  private ensureLoop() {
    if (this.raf !== null) return;
    this.lastT = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - this.lastT) / 1000);
      this.lastT = now;
      if (!this.dragging) this.step(dt);
      this.render();

      const settledOpen = this.committed && this.p > 0.985 && Math.abs(this.v) < 0.05;
      const settledClosed = !this.committed && !this.dragging && this.target === 0 && this.p <= 0.001 && Math.abs(this.v) < 0.01;
      if (settledOpen) { this.raf = null; this.p = 1; this.v = 0; this.render(); this.fadeOut(380, 60); return; }
      if (settledClosed) { this.raf = null; this.p = 0; this.v = 0; this.render(); return; }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private step(dt: number) {
    const n = 4, h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = this.OMEGA * this.OMEGA * (this.target - this.p) - 2 * this.ZETA * this.OMEGA * this.v;
      this.v += a * h;
      this.p += this.v * h;
    }
    if (this.target === 0 && this.p < 0) { this.p = 0; this.v = Math.max(0, this.v * -0.3); }
  }

  private rubber(over: number) {
    const c = 0.55;
    return (over * c) / (1 + c * over);
  }

  private seg(p: number, a: number, b: number) { return Math.min(1, Math.max(0, (p - a) / (b - a))); }
  private smooth(t: number) { return t * t * (3 - 2 * t); }
  private easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
  private lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

  /** Tính toàn bộ trạng thái hiển thị từ (p, v). Chỉ dùng transform / opacity / clip-path. */
  private render() {
    const p = Math.max(0, this.p), v = this.v;
    const root = this.rootRef.nativeElement;
    const pulled = p > 0.01;
    if (pulled !== root.classList.contains("is-pulled")) {
      root.classList.toggle("is-pulled", pulled);
      this.envRect = null; // phong bì vừa dừng/tiếp tục bồng bềnh → đo lại
    }

    // Con dấu sáp vỡ khỏi mép nắp: hơi nảy lên rồi rơi xuống theo trọng lực và mờ dần
    const s = this.seg(p, 0, 0.12);
    const seal = this.sealRef.nativeElement;
    const fall = s * s * 46; // rơi nhanh dần (px)
    const pop = Math.sin(Math.PI * Math.min(1, s * 2.2)) * -5 * (s < 0.45 ? 1 : 0);
    seal.style.opacity = String(1 - this.smooth(this.seg(s, 0.45, 1)));
    seal.style.transform = `translateY(${fall + pop}px) scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, s * 1.6))}) rotate(${28 * s * s}deg)`;

    // Nắp phong bì: bản lề ở mép trên. Nhấc lên chậm (dính keo) → lật nhanh → rơi xuống thân sau và nảy nhẹ
    const fr = this.seg(p, 0.07, 0.44);
    const f = fr < 0.5 ? 4 * fr * fr * fr : 1 - Math.pow(-2 * fr + 2, 3) / 2; // easeInOutCubic
    const bounce = 7 * Math.sin(Math.PI * this.seg(p, 0.36, 0.52)) * (fr >= 1 || p > 0.36 ? 1 : 0);
    const flap = this.flapRef.nativeElement;
    // +góc = mép tự do nhấc về phía người xem (bốc lên khỏi thân), rồi lật qua bản lề lên trên
    flap.style.transform = `rotateX(${180 * f + bounce}deg)`;
    flap.style.zIndex = f > 0.5 ? "1" : "4";

    // Ánh sáng đổi theo góc nghiêng của giấy: mặt ngoài tối dần khi ngả ra sau, mặt trong sáng dần khi nằm xuống
    if (this.faces.length === 2) {
      this.faces[0].style.filter = `brightness(${1 - 0.09 * Math.min(1, f * 2)})`;
      this.faces[1].style.filter = `brightness(${0.9 + 0.12 * this.seg(f, 0.5, 1)})`;
    }

    // Thiệp: trượt khỏi túi (r) → phóng to khớp đúng vị trí banner thật (g)
    const env = this.envelopeRef.nativeElement;
    const card = this.cardRef.nativeElement;
    const envW = env.offsetWidth, envH = env.offsetHeight;
    const vw = card.offsetWidth, cardH = card.offsetHeight;
    const r = this.easeOut(this.seg(p, 0.3, 0.72));
    const g = this.smooth(this.seg(p, 0.7, 1));
    const e = this.smooth(this.seg(p, 0.74, 0.94));

    const k0 = (0.9 * envW) / vw;
    const x0 = 0.05 * envW, y0 = 0.07 * envH;
    let x = x0, y = y0, k = k0;
    if (r > 0 || g > 0) {
      if (!this.envRect) this.envRect = env.getBoundingClientRect();
      const rect = this.envRect;
      // Nhô lên tới gần mép trên màn hình, nhưng không rời hẳn khỏi túi
      const yRise = Math.max(-(rect.top - 20), -(cardH * k0 - envH * 0.3));
      y = this.lerp(y0, yRise, r);
      x = this.lerp(x0, -rect.left, g);
      y = this.lerp(y, -rect.top, g);
      k = this.lerp(k0, 1, g);
    }
    card.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    // Phần thiệp nằm dưới đáy phong bì bị che; nới dần khi phong bì tan đi
    // Chừa 14px đáy để góc vuông của thiệp không lòi ra khỏi góc bo của phong bì
    const hidden = Math.max(0, cardH - (envH - 14 - y) / k) * (1 - e);
    card.style.clipPath = `inset(-80px -80px ${hidden}px -80px)`;

    // Quán tính: thiệp nghiêng nhẹ theo vận tốc, tắt dần khi về đích
    const sway = Math.min(1, r * 3) * (1 - g);
    const rot = Math.max(-4, Math.min(4, -v * 1.8)) * sway;
    this.cardInnerRef.nativeElement.style.transform = `rotate(${rot}deg)`;
    // Bóng của thiệp chỉ hiện khi nó đã nhô hẳn ra ngoài; còn nằm trong túi thì không được tràn ra mép phong bì
    this.cardShadowRef.nativeElement.style.opacity = String(this.smooth(this.seg(p, 0.5, 0.74)) * (1 - g));

    // Phong bì lùi xuống và tan đi
    this.parts.forEach((el) => {
      el.style.opacity = String(1 - e);
      el.style.transform = `translateY(${30 * e}px)`;
    });
    this.faces.forEach((el) => (el.style.opacity = String(1 - e)));

    // Chữ phụ nhường chỗ
    const t = 1 - this.smooth(this.seg(p, 0.02, 0.16));
    this.fades.forEach((el) => (el.style.opacity = String(t)));

    if (this.committed && !this.burstDone && p > 0.08) {
      this.burstDone = true;
      this.burst();
    }
  }

  /** Thiệp đã nằm đúng chỗ banner thật → chỉ cần làm tan màn phủ. */
  private fadeOut(duration: number, delay: number) {
    const a = this.rootRef.nativeElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration, delay, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards",
    });
    this.animations.push(a);
    a.finished.then(() => this.complete()).catch(() => undefined);
  }

  private skip() {
    if (this.done) return;
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.complete();
  }

  private burst() {
    confetti({
      particleCount: 50,
      spread: 80,
      startVelocity: 26,
      gravity: 0.9,
      ticks: 150,
      scalar: 0.8,
      origin: { x: 0.56, y: 0.5 },
      colors: ["#D4AF37", "#A12F0C", "#F4DBCE", "#eeb9a3", "#ffffff"],
      zIndex: 10001,
      disableForReducedMotion: true,
    });
  }

  private complete() {
    if (this.done) return;
    this.done = true;
    this.finished.emit();
  }

  ngOnDestroy() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.animations.forEach((a) => a.cancel());
  }
}
