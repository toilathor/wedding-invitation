import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from "@angular/core";
import { AlbumData } from "../../models/wedding-data.model";
import { PageViewService } from "../../services/pageview.service";
import { ImgFadeDirective } from "../../shared/img-fade.directive";
import { IconComponent } from "../../shared/icon.component";


@Component({
  selector: "app-album",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective, IconComponent],
  styles: [`
    .album-tile { transition: transform 260ms var(--ease-out); }
    .album-tile:active { transform: scale(0.97); transition-duration: 90ms; }

    /* ---- Dải ảnh nhỏ trong lightbox, kiểu thanh tua của Photos ----
       Một viên kính nổi; ảnh là những lát hẹp, ảnh đang xem nở rộng và tách khỏi hai bên, luôn nằm chính giữa.
       Vuốt dải ảnh để tua: ảnh đi qua tâm là ảnh được chọn. */
    .film-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 0.375rem 0.75rem 0.75rem;
      z-index: 50;
    }
    .film {
      width: min(100%, 34rem);
      padding: 6px 0;
      border-radius: 20px;
      overflow: hidden;
      animation: filmIn 520ms var(--ease-apple) 120ms both;
    }
    @keyframes filmIn {
      from { opacity: 0; transform: translateY(14px) scale(0.96); }
      to { opacity: 1; transform: none; }
    }
    .film-strip {
      --tw: 22px;   /* lát ảnh thường */
      --tg: 3px;    /* khe giữa các lát */
      --aw: 46px;   /* ảnh đang xem */
      --am: 9px;    /* khoảng tách hai bên ảnh đang xem */
      --th: 46px;
      display: flex;
      align-items: center;
      gap: var(--tg);
      height: calc(var(--th) + 4px);
      /* đệm nửa bề rộng mỗi bên để ảnh đầu và ảnh cuối cũng vào được chính giữa */
      padding-inline: calc(50% - var(--tw) / 2);
      overflow-x: auto;
      overscroll-behavior: contain;
      touch-action: pan-x;
      cursor: grab;
      -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 16%, #000 84%, transparent 100%);
      mask-image: linear-gradient(90deg, transparent 0, #000 16%, #000 84%, transparent 100%);
    }
    @media (min-width: 640px) {
      .film-strip { --tw: 28px; --tg: 4px; --aw: 62px; --am: 11px; --th: 56px; }
    }
    .film-thumb {
      position: relative;
      flex: none;
      width: var(--tw);
      height: var(--th);
      padding: 0;
      border: 0;
      border-radius: 5px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
      opacity: 0.55;
      cursor: pointer;
      transition:
        width 360ms var(--ease-apple),
        margin 360ms var(--ease-apple),
        border-radius 360ms var(--ease-apple),
        opacity 200ms ease,
        transform 160ms var(--ease-out);
    }
    .film-thumb img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .film-thumb:active { transform: scale(0.94); }
    @media (hover: hover) { .film-thumb:hover { opacity: 0.9; } }
    .film-thumb.is-active {
      width: var(--aw);
      margin-inline: var(--am);
      border-radius: 9px;
      opacity: 1;
      box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.92), 0 8px 18px -6px rgba(0, 0, 0, 0.6);
    }
    /* Đang tua: mọi lát cùng cỡ (để vị trí không nhảy dưới ngón tay), ảnh ở tâm chỉ sáng lên và nhô cao */
    .film-strip.is-scrubbing { cursor: grabbing; }
    .film-strip.is-scrubbing .film-thumb {
      transition: opacity 120ms ease, transform 160ms var(--ease-out);
    }
    .film-strip.is-scrubbing .film-thumb.is-active {
      width: var(--tw);
      margin-inline: 0;
      border-radius: 5px;
      transform: scaleY(1.09);
    }
    @media (prefers-reduced-motion: reduce) { .film { animation: none; } }
  `],
  template: `
    <!-- 1. Page Gallery Section -->
    <section
      id="wedding-album-section"
      class="section paper-alt reveal"
    >
      <div class="section-inner">
      <header class="section-head">
        <p class="eyebrow">Khoảnh khắc</p>
        <h2 class="script-title">{{ data.title }}</h2>
      </header>

      <!-- Gallery Grid: Initial Photos (4 on Mobile, 8 on Desktop when collapsed) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        <div
          *ngFor="let img of data.albums; let idx = index"
          (click)="openLightbox(idx)"
          [ngClass]="
            idx >= initialCount
              ? showAll
                ? 'block animate-photo-expand'
                : 'hidden'
              : idx >= 6
                ? showAll
                  ? 'block'
                  : 'hidden lg:block'
                : idx >= 4
                  ? showAll
                    ? 'block'
                    : 'hidden md:block'
                  : 'block'
          "
          class="group relative album-tile aspect-[3/4] rounded-[20px] md:rounded-[24px] overflow-hidden cursor-pointer bg-garden-50 w-full"
        >
          <img
            appImgFade
            [src]="thumbOf(img)"
            [alt]="'Ảnh cưới ' + (idx + 1)"
            class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            draggable="false"
            (contextmenu)="$event.preventDefault()"
            style="-webkit-touch-callout: none; -webkit-user-drag: none;"
          />

          <!-- Hover Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 md:p-6 pointer-events-none"
          >
            <div
              class="flex items-center justify-between text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              <span
                class="text-[11px] sm:text-xs md:text-sm font-medium"
                >Xem ảnh</span
              >
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#2F4A38] shadow-lg"
              >
                <app-icon name="zoom-in" class="w-3.5 h-3.5 md:w-5 md:h-5"></app-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expand / Collapse Button (Shows on mobile when > 4 photos, on desktop when > initialCount) -->
      <div
        class="flex justify-center mt-6 md:mt-8"
        *ngIf="data.albums.length > 4"
        [ngClass]="{ 'md:hidden': data.albums.length <= initialCount }"
      >
        <button
          type="button"
          (click)="toggleExpand()"
          class="btn btn-tinted"
        >
          <span>{{ showAll ? "Thu gọn album" : "Xem thêm ảnh" }}</span>
          <app-icon
            name="chevron-down"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ease-out"
            [class.rotate-180]="showAll"
          ></app-icon>
        </button>
      </div>
      </div>
    </section>

    <!-- 2. Ultra-Smooth Lightbox Modal (Placed outside section to avoid transform/reveal container bugs) -->
    <div
      *ngIf="lightboxOpen"
      class="fixed inset-0 z-[999999] w-screen h-[100dvh] min-h-[100svh] bg-garden-950/95 backdrop-blur-xl flex flex-col justify-between items-center select-none overflow-hidden overscroll-contain"
      style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh cưới"
      (click)="closeLightbox()"
      (contextmenu)="$event.preventDefault()"
    >
      <!-- Thanh tiến trình trình chiếu -->
      <div *ngIf="isSlideshow" class="absolute top-0 left-0 right-0 h-[3px] z-[60] bg-white/10 pointer-events-none" style="margin-top: env(safe-area-inset-top);">
        <div
          *ngFor="let idx of [currentIndex]"
          class="slideshow-progress h-full w-full bg-white/90"
          [style.--sl-dur]="slideshowMs + 'ms'"
        ></div>
      </div>

      <!-- Top Navigation & Control Bar -->
      <div
        class="w-full flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 text-white z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        (click)="$event.stopPropagation()"
      >
        <!-- Left: Photo Counter & Album Title -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-sm"
          >
            <span
              class="text-xs sm:text-sm font-prata tracking-wider text-[#DCE5D3]"
            >
              {{ currentIndex + 1 }} / {{ data.albums.length }}
            </span>
          </div>
          <span
            class="text-xs sm:text-sm font-light text-stone-300 tracking-wider hidden sm:inline-block font-prata"
          >
            {{ data.title }}
          </span>
        </div>

        <!-- Right: Action Buttons (Slideshow, Zoom, Close) -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Slideshow Toggle -->
          <button
            type="button"
            (click)="toggleSlideshow()"
            class="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white relative"
            [title]="
              isSlideshow
                ? 'Tạm dừng trình chiếu (Phím Space)'
                : 'Bắt đầu tự động trình chiếu (Phím Space)'
            "
            aria-label="Tự động trình chiếu"
          >
            <app-icon
              *ngIf="!isSlideshow"
              name="play"
              class="w-4 h-4 sm:w-5 sm:h-5"
            ></app-icon>
            <app-icon
              *ngIf="isSlideshow"
              name="pause"
              class="w-4 h-4 sm:w-5 sm:h-5 text-white"
            ></app-icon>
          </button>

          <!-- Zoom Toggle -->
          <button
            type="button"
            (click)="toggleZoom()"
            class="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white"
            [title]="
              isZoomed ? 'Thu nhỏ ảnh (Phím 0 hoặc -)' : 'Phóng to ảnh (Phím +, bấm đúp hoặc chụm hai ngón)'
            "
            aria-label="Phóng to / Thu nhỏ"
          >
            <app-icon
              *ngIf="!isZoomed"
              name="zoom-in"
              class="w-4 h-4 sm:w-5 sm:h-5"
            ></app-icon>
            <app-icon
              *ngIf="isZoomed"
              name="zoom-out"
              class="w-4 h-4 sm:w-5 sm:h-5 text-white"
            ></app-icon>
          </button>

          <!-- Close Modal Button -->
          <button
            type="button"
            (click)="closeLightbox()"
            class="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 transition-all text-white"
            title="Đóng xem ảnh (Phím Esc hoặc nút đóng)"
            aria-label="Đóng"
          >
            <app-icon name="close" class="w-4 h-4 sm:w-5 sm:h-5" [strokeWidth]="2"></app-icon>
          </button>
        </div>
      </div>

      <!-- Main Photo Viewing Stage with Touch Gestures -->
      <div
        #stage
        class="relative w-full flex-1 flex items-center justify-center overflow-hidden px-2 sm:px-14 md:px-20 touch-none"
        [class.cursor-grab]="isZoomed"
        (click)="$event.stopPropagation()"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
        (wheel)="onWheel($event)"
        (dblclick)="onDblClick($event)"
      >
        <!-- Floating Left Arrow -->
        <button
          type="button"
          (click)="prevImage()"
          class="absolute left-2 sm:left-4 md:left-6 z-40 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-white/25 backdrop-blur-md text-white border border-white/15 transition-all active:scale-90 shadow-xl flex items-center justify-center cursor-pointer"
          title="Ảnh trước (Phím mũi tên trái hoặc Vuốt sang phải)"
          aria-label="Ảnh trước"
        >
          <app-icon name="chevron-left" class="w-5 h-5 sm:w-6 sm:h-6" [strokeWidth]="2.5"></app-icon>
        </button>

        <!-- Centered Main Image Container (transform do bộ cử chỉ điều khiển trực tiếp) -->
        <div
          #zoomEl
          class="relative max-w-full max-h-full flex items-center justify-center select-none"
          style="will-change: transform; touch-action: none; -webkit-touch-callout: none;"
        >
          <!-- Ảnh đang rời đi: trượt ra chậm hơn ảnh mới và mờ dần -->
          <img
            *ngIf="outgoingSrc"
            [src]="outgoingSrc"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 m-auto max-w-[92vw] sm:max-w-[85vw] md:max-w-5xl max-h-[64vh] sm:max-h-[70vh] md:max-h-[74vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl"
            [ngClass]="outgoingDir === 'next' ? 'lb-out-next' : 'lb-out-prev'"
            draggable="false"
          />
          <!-- Skeleton giữ chỗ cho ảnh chính (dùng chung với appImgFade) -->
          <div class="img-skeleton img-skeleton-box" [class.img-skeleton-done]="mainLoaded" aria-hidden="true"></div>
          <!-- *ngFor với một phần tử: tạo lại thẻ mỗi khi đổi ảnh để hiệu ứng chạy lại từ đầu -->
          <img
            *ngFor="let idx of [currentIndex]"
            appImgFade="none"
            (imgLoaded)="mainLoaded = true"
            [src]="data.albums[idx]"
            [alt]="'Ảnh cưới ' + (idx + 1)"
            class="max-w-[92vw] sm:max-w-[85vw] md:max-w-5xl max-h-[64vh] sm:max-h-[70vh] md:max-h-[74vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl"
            [class.lightbox-slide-next]="changing && slideDirection === 'next'"
            [class.lightbox-slide-prev]="changing && slideDirection === 'prev'"
            draggable="false"
            style="-webkit-user-drag: none; -webkit-touch-callout: none;"
          />
        </div>

        <!-- Mức phóng đại hiện tại + đặt lại -->
        <button
          #zoomBadge
          type="button"
          (click)="resetZoom(true)"
          class="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-xs font-prata tracking-wider transition-opacity duration-200"
          [class.opacity-0]="!isZoomed"
          [class.pointer-events-none]="!isZoomed"
          aria-label="Đặt lại mức phóng to"
        >
          <span #zoomLabel>100%</span> · Đặt lại
        </button>

        <!-- Floating Right Arrow -->
        <button
          type="button"
          (click)="nextImage()"
          class="absolute right-2 sm:right-4 md:right-6 z-40 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-white/25 backdrop-blur-md text-white border border-white/15 transition-all active:scale-90 shadow-xl flex items-center justify-center cursor-pointer"
          title="Ảnh tiếp theo (Phím mũi tên phải hoặc Vuốt sang trái)"
          aria-label="Ảnh tiếp theo"
        >
          <app-icon name="chevron-right" class="w-5 h-5 sm:w-6 sm:h-6" [strokeWidth]="2.5"></app-icon>
        </button>
      </div>

      <!-- Dải ảnh nhỏ: viên kính nổi, vuốt để tua -->
      <div class="film-wrap" (click)="$event.stopPropagation()">
        <div class="film glass-dark">
          <div
            #thumbnailStrip
            class="film-strip no-scrollbar"
            [class.is-scrubbing]="scrubbing"
            role="listbox"
            aria-label="Chọn ảnh"
            (touchstart)="stripTouching = true; beginScrub()"
            (touchend)="endStripTouch()"
            (touchcancel)="endStripTouch()"
            (wheel)="onStripWheel($event)"
            (scroll)="onStripScroll()"
          >
            <button
              *ngFor="let full of data.albums; let idx = index"
              [id]="'lightbox-thumb-' + idx"
              type="button"
              role="option"
              [attr.aria-selected]="currentIndex === idx"
              [attr.aria-label]="'Ảnh ' + (idx + 1)"
              (click)="selectImage(idx)"
              class="film-thumb"
              [class.is-active]="currentIndex === idx"
            >
              <img
                appImgFade="fade"
                [src]="thumbOf(full)"
                alt=""
                loading="lazy"
                draggable="false"
                style="-webkit-touch-callout: none; -webkit-user-drag: none;"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AlbumComponent implements OnDestroy {
  @Input({ required: true }) data!: AlbumData;
  @ViewChild("thumbnailStrip") thumbnailStrip?: ElementRef<HTMLDivElement>;
  @ViewChild("stage") stageRef?: ElementRef<HTMLDivElement>;
  @ViewChild("zoomEl") zoomElRef?: ElementRef<HTMLDivElement>;
  @ViewChild("zoomLabel") zoomLabelRef?: ElementRef<HTMLSpanElement>;

  private zone = inject(NgZone);

  private pageViewService = inject(PageViewService);

  initialCount = 8;
  showAll = false;
  lightboxOpen = false;
  currentIndex = 0;
  isSlideshow = false;
  isZoomed = false;
  /** false trong lúc ảnh chính của lightbox còn đang tải → hiện khối skeleton giữ chỗ */
  mainLoaded = false;
  changing = false;
  slideDirection: "next" | "prev" = "next";
  readonly slideshowMs = 4000;
  outgoingSrc: string | null = null;
  outgoingDir: "next" | "prev" = "next";
  private outgoingTimer: ReturnType<typeof setTimeout> | null = null;
  private slideshowTimer: ReturnType<typeof setTimeout> | null = null;
  private changeTimer: ReturnType<typeof setTimeout> | null = null;

  private previousBodyStyles = {
    overflow: "",
    htmlOverflow: "",
  };

  /** Bản thu nhỏ (640px) cho lưới và dải hình nhỏ; bản đầy đủ chỉ tải khi mở lightbox. */
  thumbOf(src: string): string {
    return src.replace("/gallery/", "/gallery/thumbs/");
  }

  get initialAlbums(): string[] {
    return this.data?.albums
      ? this.data.albums.slice(0, this.initialCount)
      : [];
  }

  get extraAlbums(): string[] {
    return this.data?.albums ? this.data.albums.slice(this.initialCount) : [];
  }

  toggleExpand() {
    this.showAll = !this.showAll;
  }

  openLightbox(index: number) {
    this.currentIndex = index;
    this.mainLoaded = false;
    this.lightboxOpen = true;
    this.zs = 1; this.ztx = 0; this.zty = 0; this.isZoomed = false;
    this.pageViewService.setLocked(true);
    this.lockBodyScroll();
    this.preloadAdjacentImages();
    // Mở ra là ảnh đang xem đã nằm sẵn ở giữa dải, không cuộn từ đầu tới
    setTimeout(() => {
      const strip = this.thumbnailStrip?.nativeElement;
      if (!strip) return;
      const { step, shift } = this.filmMetrics(strip);
      strip.scrollTo({ left: this.currentIndex * step + shift, behavior: "auto" });
    }, 0);
  }

  closeLightbox() {
    this.endScrubNow();
    this.lightboxOpen = false;
    this.outgoingSrc = null;
    this.cancelAnim();
    this.isZoomed = false;
    this.stopSlideshow();
    this.pageViewService.setLocked(false);
    this.restoreBodyScroll();
  }

  selectImage(index: number) {
    if (this.currentIndex === index) return;
    this.triggerChange(index > this.currentIndex ? "next" : "prev", () => {
      this.currentIndex = index;
      this.resetZoom(false);
      this.preloadAdjacentImages();
      this.scrollThumbIntoView();
    });
  }

  nextImage() {
    this.triggerChange("next", () => {
      this.currentIndex = (this.currentIndex + 1) % this.data.albums.length;
      this.resetZoom(false);
      this.preloadAdjacentImages();
      this.scrollThumbIntoView();
    });
  }

  prevImage() {
    this.triggerChange("prev", () => {
      this.currentIndex =
        (this.currentIndex - 1 + this.data.albums.length) %
        this.data.albums.length;
      this.resetZoom(false);
      this.preloadAdjacentImages();
      this.scrollThumbIntoView();
    });
  }

  toggleZoom() {
    if (this.zs > 1.05) this.animateTo(1, 0, 0);
    else this.zoomAt(this.centerPoint(), this.ZOOM_DOUBLE_TAP);
  }

  toggleSlideshow() {
    if (this.isSlideshow) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  private startSlideshow() {
    this.isSlideshow = true;
    this.resetZoom(false);
    this.scheduleNext();
  }

  private stopSlideshow() {
    this.isSlideshow = false;
    if (this.slideshowTimer) {
      clearTimeout(this.slideshowTimer);
      this.slideshowTimer = null;
    }
  }

  /** Hẹn ảnh kế tiếp. Dùng setTimeout nối tiếp để thanh tiến trình và Ken Burns luôn khớp, kể cả khi người dùng chuyển ảnh tay. */
  private scheduleNext() {
    if (this.slideshowTimer) clearTimeout(this.slideshowTimer);
    this.slideshowTimer = setTimeout(() => {
      if (this.isSlideshow) this.nextImage();
    }, this.slideshowMs);
  }

  private triggerChange(direction: "next" | "prev", action: () => void) {
    this.endScrubNow();
    if (this.changeTimer) clearTimeout(this.changeTimer);
    this.slideDirection = direction;
    this.changing = true;
    const leaving = this.currentIndex;
    this.mainLoaded = false;
    action();
    if (this.currentIndex !== leaving) {
      // Ảnh cũ ở lại và trượt ra phía đối diện trong lúc ảnh mới trượt vào
      this.outgoingDir = direction;
      this.outgoingSrc = this.data.albums[leaving];
      if (this.outgoingTimer) clearTimeout(this.outgoingTimer);
      this.outgoingTimer = setTimeout(() => (this.outgoingSrc = null), 680);
      if (this.isSlideshow) this.scheduleNext();
    }
    this.changeTimer = setTimeout(() => {
      this.changing = false;
      this.changeTimer = null;
    }, 680);
  }

  // ───────────── Dải ảnh nhỏ: căn giữa và tua ─────────────
  /** true trong lúc người dùng đang vuốt dải ảnh để tua. */
  scrubbing = false;
  private scrubTimer: ReturnType<typeof setTimeout> | null = null;
  /** Ngón tay còn đặt trên dải ảnh: chưa kết thúc tua dù đang đứng yên. */
  stripTouching = false;

  endStripTouch() {
    this.stripTouching = false;
    if (this.scrubbing) this.armScrubEnd();
  }

  /** Kích thước dải ảnh, đọc từ biến CSS để công thức khớp với cả hai cỡ màn hình. */
  private filmMetrics(strip: HTMLElement) {
    const cs = getComputedStyle(strip);
    const v = (name: string) => parseFloat(cs.getPropertyValue(name)) || 0;
    const tw = v("--tw");
    return {
      step: tw + v("--tg"), // khoảng cách tâm hai lát liền nhau
      shift: v("--am") + (v("--aw") - tw) / 2, // tâm ảnh đang xem lệch thêm bấy nhiêu khi nó nở rộng
    };
  }

  /** Đưa ảnh đang xem vào chính giữa dải. Tính bằng công thức chứ không đo, vì các lát còn đang đổi bề rộng. */
  private scrollThumbIntoView() {
    const strip = this.thumbnailStrip?.nativeElement;
    if (!strip || this.scrubbing) return;
    const { step, shift } = this.filmMetrics(strip);
    strip.scrollTo({ left: this.currentIndex * step + shift, behavior: "smooth" });
  }

  /** Bắt đầu tua: thu ảnh đang xem về cỡ thường và bù lại độ lệch để nó đứng yên dưới ngón tay. */
  beginScrub() {
    const strip = this.thumbnailStrip?.nativeElement;
    if (!strip) return;
    if (!this.scrubbing) {
      this.scrubbing = true;
      if (this.isSlideshow) this.stopSlideshow();
      const { step } = this.filmMetrics(strip);
      strip.scrollTo({ left: this.currentIndex * step, behavior: "auto" });
    }
    this.armScrubEnd();
  }

  /** Lăn chuột dọc hay ngang trên dải ảnh đều tua được. */
  onStripWheel(e: WheelEvent) {
    const strip = this.thumbnailStrip?.nativeElement;
    if (!strip || e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();
    this.beginScrub();
    strip.scrollLeft += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  }

  onStripScroll() {
    if (!this.scrubbing) return;
    const strip = this.thumbnailStrip?.nativeElement;
    if (!strip) return;
    const { step } = this.filmMetrics(strip);
    const idx = Math.max(0, Math.min(this.data.albums.length - 1, Math.round(strip.scrollLeft / step)));
    if (idx !== this.currentIndex) {
      // Đổi ảnh tức thì, không chạy hiệu ứng trượt: tua nhanh mà trượt thì rối mắt
      if (this.changeTimer) { clearTimeout(this.changeTimer); this.changeTimer = null; }
      this.changing = false;
      this.outgoingSrc = null;
      this.mainLoaded = false;
      this.currentIndex = idx;
      this.resetZoom(false);
    }
    this.armScrubEnd();
  }

  /** Hết cuộn (kể cả đà trượt) một lúc thì coi như tua xong: ảnh được chọn nở ra và vào giữa. */
  private armScrubEnd() {
    if (this.scrubTimer) clearTimeout(this.scrubTimer);
    this.scrubTimer = setTimeout(() => {
      this.scrubTimer = null;
      if (this.stripTouching) return; // còn giữ tay: chờ nhả ra
      this.scrubbing = false;
      this.preloadAdjacentImages();
      this.scrollThumbIntoView();
    }, 180);
  }

  private endScrubNow() {
    if (this.scrubTimer) { clearTimeout(this.scrubTimer); this.scrubTimer = null; }
    this.scrubbing = false;
    this.stripTouching = false;
  }

  private lockBodyScroll() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    this.previousBodyStyles = {
      overflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    document.documentElement.classList.add("lightbox-open");
  }

  private restoreBodyScroll() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    document.body.style.overflow = this.previousBodyStyles.overflow;
    document.documentElement.style.overflow = this.previousBodyStyles.htmlOverflow;
    document.body.classList.remove("lightbox-open");
    document.documentElement.classList.remove("lightbox-open");
  }

  private preloadAdjacentImages() {
    if (!this.data?.albums?.length) return;
    const len = this.data.albums.length;
    const nextIdx = (this.currentIndex + 1) % len;
    const prevIdx = (this.currentIndex - 1 + len) % len;

    const img1 = new Image();
    img1.src = this.data.albums[nextIdx];

    const img2 = new Image();
    img2.src = this.data.albums[prevIdx];
  }

  // ===== Zoom & pan: cử chỉ chụm / kéo / bấm đúp / cuộn, lò xo + quán tính =====
  private readonly ZOOM_MAX = 5;
  private readonly ZOOM_DOUBLE_TAP = 2.6;

  // Trạng thái biến đổi hiện tại của ảnh (tx, ty tính từ tâm khung; zs là tỉ lệ)
  private zs = 1;
  private ztx = 0;
  private zty = 0;
  private zvs = 0;
  private zvx = 0;
  private zvy = 0;
  private zTarget = { s: 1, x: 0, y: 0 };
  private zRaf: number | null = null;
  private zLast = 0;

  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { dist: number; s: number } | null = null;
  private history: { t: number; x: number; y: number }[] = [];
  private gestureStart = { x: 0, y: 0, t: 0, moved: false, onImg: false };
  private lastTap = { t: 0, x: 0, y: 0 };

  private stageRect() {
    return this.stageRef!.nativeElement.getBoundingClientRect();
  }

  private centerPoint() {
    const r = this.stageRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /** Giới hạn kéo ảnh: khi ảnh phóng lớn hơn khung thì được kéo tới mép, không hơn. */
  private bounds(s: number) {
    const stage = this.stageRect();
    const el = this.zoomElRef!.nativeElement;
    return {
      x: Math.max(0, (el.offsetWidth * s - stage.width) / 2),
      y: Math.max(0, (el.offsetHeight * s - stage.height) / 2),
    };
  }

  private clamp(v: number, lo: number, hi: number) {
    return Math.min(hi, Math.max(lo, v));
  }

  private apply() {
    const el = this.zoomElRef?.nativeElement;
    if (!el) return;
    el.style.transform = `translate3d(${this.ztx}px, ${this.zty}px, 0) scale(${this.zs})`;
    const label = this.zoomLabelRef?.nativeElement;
    if (label) label.textContent = Math.round(this.zs * 100) + "%";
    const zoomed = this.zs > 1.02;
    if (zoomed !== this.isZoomed) {
      this.zone.run(() => {
        this.isZoomed = zoomed;
        if (zoomed && this.isSlideshow) this.stopSlideshow(); // đang phóng để ngắm thì đừng tự chuyển ảnh
      });
    }
  }

  /** Phóng/thu quanh điểm màn hình q sao cho điểm ảnh dưới q đứng yên. */
  private setScaleAt(q: { x: number; y: number }, next: number) {
    const c = this.centerPoint();
    const ratio = next / this.zs;
    this.ztx = q.x - c.x - ratio * (q.x - c.x - this.ztx);
    this.zty = q.y - c.y - ratio * (q.y - c.y - this.zty);
    this.zs = next;
  }

  /** Mục tiêu (s, tx, ty) cho một lần phóng tại q, đã kẹp trong giới hạn. */
  private zoomAt(q: { x: number; y: number }, targetScale: number) {
    const c = this.centerPoint();
    const s = this.clamp(targetScale, 1, this.ZOOM_MAX);
    const ratio = s / this.zs;
    let x = q.x - c.x - ratio * (q.x - c.x - this.ztx);
    let y = q.y - c.y - ratio * (q.y - c.y - this.zty);
    const b = this.bounds(s);
    x = this.clamp(x, -b.x, b.x);
    y = this.clamp(y, -b.y, b.y);
    this.animateTo(s, x, y);
  }

  resetZoom(animated: boolean) {
    if (!this.zoomElRef) { this.zs = 1; this.ztx = 0; this.zty = 0; this.isZoomed = false; return; }
    if (animated && this.zs !== 1) this.animateTo(1, 0, 0);
    else { this.cancelAnim(); this.zs = 1; this.ztx = 0; this.zty = 0; this.apply(); }
  }

  // ----- Lò xo (critically damped, response ≈ 0.45s), mang theo vận tốc -----
  private animateTo(s: number, x: number, y: number, v = { x: 0, y: 0, s: 0 }) {
    this.zTarget = { s, x, y };
    this.zvx = v.x; this.zvy = v.y; this.zvs = v.s;
    if (this.zRaf !== null) return;
    this.zLast = performance.now();
    const omega = (2 * Math.PI) / 0.45;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - this.zLast) / 1000);
      this.zLast = now;
      const n = 4, h = dt / n;
      for (let i = 0; i < n; i++) {
        this.zvx += (omega * omega * (this.zTarget.x - this.ztx) - 2 * omega * this.zvx) * h;
        this.zvy += (omega * omega * (this.zTarget.y - this.zty) - 2 * omega * this.zvy) * h;
        this.zvs += (omega * omega * (this.zTarget.s - this.zs) - 1.9 * omega * this.zvs) * h;
        this.ztx += this.zvx * h; this.zty += this.zvy * h; this.zs += this.zvs * h;
      }
      this.apply();
      const done =
        Math.abs(this.zTarget.x - this.ztx) < 0.3 && Math.abs(this.zTarget.y - this.zty) < 0.3 &&
        Math.abs(this.zTarget.s - this.zs) < 0.002 &&
        Math.abs(this.zvx) < 2 && Math.abs(this.zvy) < 2 && Math.abs(this.zvs) < 0.02;
      if (done) {
        this.ztx = this.zTarget.x; this.zty = this.zTarget.y; this.zs = this.zTarget.s;
        this.zRaf = null;
        this.apply();
        return;
      }
      this.zRaf = requestAnimationFrame(tick);
    };
    this.zone.runOutsideAngular(() => (this.zRaf = requestAnimationFrame(tick)));
  }

  private cancelAnim() {
    if (this.zRaf !== null) cancelAnimationFrame(this.zRaf);
    this.zRaf = null;
  }

  // ----- Cử chỉ -----
  onPointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest("button")) return; // nút mũi tên / đặt lại
    this.cancelAnim(); // nắm giữ ảnh đang trượt: dừng ngay tại chỗ
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* bỏ qua */ }
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      this.history = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
      this.gestureStart = {
        x: e.clientX, y: e.clientY, t: e.timeStamp, moved: false,
        onImg: (e.target as HTMLElement).tagName === "IMG",
      };
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: this.zs };
      this.gestureStart.moved = true;
    }
  }

  onPointerMove(e: PointerEvent) {
    const prev = this.pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    this.pointers.set(e.pointerId, cur);

    if (this.pointers.size >= 2 && this.pinch) {
      const [a, b] = [...this.pointers.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const ratio = (Math.hypot(a.x - b.x, a.y - b.y) || 1) / this.pinch.dist;
      let target = this.pinch.s * ratio;
      // Vượt giới hạn thì cản dần như dây cao su
      if (target < 1) target = 1 - (1 - target) * 0.45;
      if (target > this.ZOOM_MAX) target = this.ZOOM_MAX + (target - this.ZOOM_MAX) * 0.3;
      const prevMid = { x: (prev.x + [...this.pointers.entries()].find(([id]) => id !== e.pointerId)![1].x) / 2,
                        y: (prev.y + [...this.pointers.entries()].find(([id]) => id !== e.pointerId)![1].y) / 2 };
      this.ztx += mid.x - prevMid.x; this.zty += mid.y - prevMid.y; // kéo theo trung điểm hai ngón
      this.setScaleAt(mid, target);
      this.apply();
      return;
    }

    if (this.pointers.size === 1) {
      const dx = cur.x - prev.x, dy = cur.y - prev.y;
      if (Math.hypot(cur.x - this.gestureStart.x, cur.y - this.gestureStart.y) > 6) this.gestureStart.moved = true;
      this.history.push({ t: e.timeStamp, x: cur.x, y: cur.y });
      if (this.history.length > 8) this.history.shift();
      if (this.zs > 1.02) {
        // Kéo 1:1; vượt mép thì chỉ đi theo ~35% (cản dần)
        const b = this.bounds(this.zs);
        this.ztx += Math.abs(this.ztx) > b.x && Math.sign(dx) === Math.sign(this.ztx) ? dx * 0.35 : dx;
        this.zty += Math.abs(this.zty) > b.y && Math.sign(dy) === Math.sign(this.zty) ? dy * 0.35 : dy;
        this.apply();
      }
    }
  }

  onPointerUp(e: PointerEvent) {
    if (!this.pointers.has(e.pointerId)) return;
    const wasPinch = this.pointers.size >= 2;
    this.pointers.delete(e.pointerId);

    if (wasPinch) {
      this.pinch = null;
      if (this.pointers.size === 1) {
        // Còn một ngón: tiếp tục kéo từ vị trí hiện tại
        const rest = [...this.pointers.values()][0];
        this.history = [{ t: e.timeStamp, x: rest.x, y: rest.y }];
        this.settle();
      } else {
        this.settle();
      }
      return;
    }

    if (this.pointers.size > 0) return;
    const g = this.gestureStart;

    // Chạm đúp (cảm ứng) → phóng/thu tại điểm chạm
    if (!g.moved && e.pointerType !== "mouse" && g.onImg) {
      const near = Math.hypot(e.clientX - this.lastTap.x, e.clientY - this.lastTap.y) < 30;
      if (e.timeStamp - this.lastTap.t < 300 && near) {
        this.lastTap.t = 0;
        this.zs > 1.05 ? this.animateTo(1, 0, 0) : this.zoomAt({ x: e.clientX, y: e.clientY }, this.ZOOM_DOUBLE_TAP);
        return;
      }
      this.lastTap = { t: e.timeStamp, x: e.clientX, y: e.clientY };
    }

    if (this.zs > 1.02) {
      // Thả tay: quán tính theo vận tốc, dừng ở mép
      const recent = this.history.filter((m) => e.timeStamp - m.t <= 100);
      let vx = 0, vy = 0;
      if (recent.length >= 2) {
        const f = recent[0], l = recent[recent.length - 1];
        const dt = Math.max(16, l.t - f.t) / 1000;
        vx = (l.x - f.x) / dt; vy = (l.y - f.y) / dt;
      }
      this.settle(vx, vy);
      return;
    }
    this.settle();

    // Vuốt ngang khi chưa phóng → chuyển ảnh
    if (e.pointerType !== "mouse" && g.moved) {
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? this.nextImage() : this.prevImage();
      }
    }
  }

  /** Đưa (s, tx, ty) về vùng hợp lệ, cộng thêm quán tính nếu có. */
  private settle(vx = 0, vy = 0) {
    const s = this.clamp(this.zs, 1, this.ZOOM_MAX);
    if (s <= 1.02) { this.animateTo(1, 0, 0, { x: 0, y: 0, s: this.zvs }); return; }
    const b = this.bounds(s);
    const px = this.ztx + vx * 0.499 * 0.5; // chiếu động lượng (giảm nửa để không văng quá xa)
    const py = this.zty + vy * 0.499 * 0.5;
    this.animateTo(s, this.clamp(px, -b.x, b.x), this.clamp(py, -b.y, b.y), { x: vx, y: vy, s: 0 });
  }

  onDblClick(e: MouseEvent) {
    // Chuột: bấm đúp để phóng/thu (cảm ứng đã xử lý ở trên)
    if ((e as PointerEvent).pointerType === "touch") return;
    if ((e.target as HTMLElement).closest("button")) return;
    // Sau setPointerCapture, sự kiện dblclick bị gán về khung (stage) chứ không phải thẻ <img>,
    // nên kiểm tra theo toạ độ: chỉ phản ứng khi bấm đúp lên vùng ảnh.
    const box = this.zoomElRef?.nativeElement.getBoundingClientRect();
    if (!box || e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) return;
    this.zs > 1.05 ? this.animateTo(1, 0, 0) : this.zoomAt({ x: e.clientX, y: e.clientY }, this.ZOOM_DOUBLE_TAP);
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Chụm trên touchpad / Ctrl + lăn: phóng tại con trỏ
      const next = this.clamp(this.zs * Math.exp(-e.deltaY * 0.012), 1, this.ZOOM_MAX);
      this.cancelAnim();
      this.setScaleAt({ x: e.clientX, y: e.clientY }, next);
    } else if (this.zs > 1.02) {
      this.cancelAnim();
      this.ztx -= e.deltaX; this.zty -= e.deltaY; // hai ngón trượt = kéo ảnh
    } else return;
    const b = this.bounds(this.zs);
    this.ztx = this.clamp(this.ztx, -b.x, b.x);
    this.zty = this.clamp(this.zty, -b.y, b.y);
    if (this.zs <= 1.02) { this.zs = 1; this.ztx = 0; this.zty = 0; }
    this.apply();
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.closeLightbox();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.nextImage();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prevImage();
    }
    if (event.key === "+" || event.key === "=") this.zoomAt(this.centerPoint(), Math.min(this.ZOOM_MAX, this.zs * 1.5));
    if (event.key === "-" || event.key === "_") {
      const next = this.zs / 1.5;
      if (next <= 1.05) this.animateTo(1, 0, 0);
      else this.zoomAt(this.centerPoint(), next);
    }
    if (event.key === "0") this.resetZoom(true);
    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      this.toggleSlideshow();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
    if (this.scrubTimer) clearTimeout(this.scrubTimer);
    if (this.changeTimer) clearTimeout(this.changeTimer);
    this.cancelAnim();
    if (this.outgoingTimer) clearTimeout(this.outgoingTimer);
    this.pageViewService.setLocked(false);
    if (this.lightboxOpen) this.restoreBodyScroll();
    else document.body.classList.remove("lightbox-open");
  }
}
