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

@Component({
  selector: "app-album",
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. Page Gallery Section -->
    <section
      id="wedding-album-section"
      class="relative max-w-[1443px] w-full mx-auto min-h-[100lvh] lg:min-h-screen flex flex-col justify-center py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 reveal"
    >
      <!-- Title -->
      <h2
        class="text-center text-[30px] sm:text-[40px] md:text-[52px] lg:text-[60px] leading-tight font-pinyonScript text-[#A12F0C] mb-2.5 sm:mb-3 md:mb-4 lg:mb-5"
      >
        {{ data.title }}
      </h2>

      <!-- Gallery Grid: Initial Photos (4 on Mobile, 8 on Desktop when collapsed) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 lg:gap-4 py-1">
        <div
          *ngFor="let img of initialAlbums; let idx = index"
          (click)="openLightbox(idx)"
          [ngClass]="idx >= 4 ? (showAll ? 'block' : 'hidden md:block') : 'block'"
          class="group relative aspect-[3/4] md:aspect-[4/5] max-h-none md:max-h-[32vh] rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-300 bg-stone-100 mx-auto w-full"
        >
          <img
            [src]="img"
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
                class="text-[11px] sm:text-xs md:text-sm font-prata tracking-wider uppercase"
                >Xem ảnh</span
              >
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#A12F0C] shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5 md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expandable / Collapsible Container with Silky Smooth Transition -->
      <div
        *ngIf="extraAlbums.length > 0"
        class="grid transition-all duration-600 ease-in-out overflow-hidden"
        [ngStyle]="{
          'grid-template-rows': showAll ? '1fr' : '0fr',
          opacity: showAll ? '1' : '0',
          'margin-top': showAll ? '0.6rem' : '0px',
        }"
      >
        <div class="overflow-hidden min-h-0">
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 pt-0 md:pt-2"
          >
            <div
              *ngFor="let img of extraAlbums; let i = index"
              (click)="openLightbox(initialCount + i)"
              class="group relative aspect-[3/4] md:aspect-[4/5] rounded-xl sm:rounded-2xl md:rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-500 ease-out bg-stone-100 transform"
              [style.transform]="
                showAll
                  ? 'translateY(0) scale(1)'
                  : 'translateY(-15px) scale(0.96)'
              "
              [style.transition-delay]="showAll ? i * 40 + 'ms' : '0ms'"
            >
              <img
                [src]="img"
                [alt]="'Ảnh cưới ' + (initialCount + i + 1)"
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
                    class="text-[11px] sm:text-xs md:text-sm font-prata tracking-wider uppercase"
                    >Xem ảnh</span
                  >
                  <div
                    class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#A12F0C] shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5 md:w-5 md:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expand / Collapse Button (Shows on mobile when > 4 photos, on desktop when > initialCount) -->
      <div
        class="flex justify-center mt-3 sm:mt-4 md:mt-6"
        *ngIf="data.albums.length > 4"
        [ngClass]="{ 'md:hidden': data.albums.length <= initialCount }"
      >
        <button
          type="button"
          (click)="toggleExpand()"
          class="group uppercase rounded-full text-white font-prata text-[11px] sm:text-xs md:text-sm tracking-wider px-5 sm:px-7 py-2 sm:py-2.5 md:py-3 bg-[#A12F0C] hover:bg-[#852509] transition-all shadow-sm hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>{{ showAll ? "Thu gọn album" : "Xem thêm ảnh" }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ease-out"
            [class.rotate-180]="showAll"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- 2. Ultra-Smooth Lightbox Modal (Placed outside section to avoid transform/reveal container bugs) -->
    <div
      *ngIf="lightboxOpen"
      class="fixed inset-0 z-[999999] w-screen h-[100dvh] min-h-[100svh] bg-black/95 backdrop-blur-xl flex flex-col justify-between items-center select-none overflow-hidden overscroll-contain"
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
          class="slideshow-progress h-full w-full bg-gradient-to-r from-[#F4DBCE] to-[#D4AF37]"
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
              class="text-xs sm:text-sm font-prata tracking-wider text-[#F4DBCE]"
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
            <svg
              *ngIf="!isSlideshow"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <svg
              *ngIf="isSlideshow"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
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
            <svg
              *ngIf="!isZoomed"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
            <svg
              *ngIf="isZoomed"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 sm:w-5 sm:h-5 text-amber-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            </svg>
          </button>

          <!-- Close Modal Button -->
          <button
            type="button"
            (click)="closeLightbox()"
            class="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-[#A12F0C] active:scale-90 transition-all text-white"
            title="Đóng xem ảnh (Phím Esc hoặc nút đóng)"
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
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
          class="absolute left-2 sm:left-4 md:left-6 z-40 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-[#A12F0C] backdrop-blur-md text-white border border-white/15 transition-all active:scale-90 shadow-xl flex items-center justify-center cursor-pointer"
          title="Ảnh trước (Phím mũi tên trái hoặc Vuốt sang phải)"
          aria-label="Ảnh trước"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
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
          <!-- *ngFor với một phần tử: tạo lại thẻ mỗi khi đổi ảnh để hiệu ứng chạy lại từ đầu -->
          <img
            *ngFor="let idx of [currentIndex]"
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
          class="absolute right-2 sm:right-4 md:right-6 z-40 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-[#A12F0C] backdrop-blur-md text-white border border-white/15 transition-all active:scale-90 shadow-xl flex items-center justify-center cursor-pointer"
          title="Ảnh tiếp theo (Phím mũi tên phải hoặc Vuốt sang trái)"
          aria-label="Ảnh tiếp theo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Bottom Thumbnail Carousel Strip -->
      <div
        class="w-full max-w-4xl py-2 sm:py-3 px-3 sm:px-6 z-50 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        (click)="$event.stopPropagation()"
      >
        <div
          #thumbnailStrip
          class="flex items-center justify-start md:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
        >
          <button
            *ngFor="let thumb of data.albums; let idx = index"
            [id]="'lightbox-thumb-' + idx"
            type="button"
            (click)="selectImage(idx)"
            class="relative w-12 h-14 sm:w-16 sm:h-18 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none"
            [ngClass]="{
              'border-[#A12F0C] ring-2 ring-[#A12F0C]/60 scale-105 opacity-100 shadow-lg':
                currentIndex === idx,
              'border-transparent opacity-40 hover:opacity-80 scale-95':
                currentIndex !== idx,
            }"
          >
            <img
              [src]="thumb"
              [alt]="'Thumbnail ' + (idx + 1)"
              class="w-full h-full object-cover"
              loading="lazy"
              draggable="false"
              style="-webkit-touch-callout: none; -webkit-user-drag: none;"
            />
          </button>
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
    this.lightboxOpen = true;
    this.zs = 1; this.ztx = 0; this.zty = 0; this.isZoomed = false;
    this.pageViewService.setLocked(true);
    this.lockBodyScroll();
    this.preloadAdjacentImages();
    setTimeout(() => this.scrollThumbIntoView(), 80);
  }

  closeLightbox() {
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
    if (this.changeTimer) clearTimeout(this.changeTimer);
    this.slideDirection = direction;
    this.changing = true;
    const leaving = this.currentIndex;
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

  private scrollThumbIntoView() {
    const strip = this.thumbnailStrip?.nativeElement;
    const el = document.getElementById("lightbox-thumb-" + this.currentIndex);
    if (!strip || !el) return;

    const targetLeft = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
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
    if (this.changeTimer) clearTimeout(this.changeTimer);
    this.cancelAnim();
    if (this.outgoingTimer) clearTimeout(this.outgoingTimer);
    this.pageViewService.setLocked(false);
    if (this.lightboxOpen) this.restoreBodyScroll();
    else document.body.classList.remove("lightbox-open");
  }
}
