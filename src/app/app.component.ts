import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { AlbumComponent } from "./components/album/album.component";
import { BankGiftComponent } from "./components/bank-gift/bank-gift.component";
import { CoverComponent } from "./components/cover/cover.component";
import { BannerComponent } from "./components/banner/banner.component";
import { EventsComponent } from "./components/events/events.component";
import { GuestbookComponent } from "./components/guestbook/guestbook.component";
import { IntroductionComponent } from "./components/introduction/introduction.component";
import { InvitationComponent } from "./components/invitation/invitation.component";
import { MusicPlayerComponent } from "./components/music-player/music-player.component";
import { QuickMenuComponent } from "./components/quick-menu/quick-menu.component";
import { ReplyCardComponent } from "./components/reply-card/reply-card.component";
import { RsvpModalComponent } from "./components/rsvp-modal/rsvp-modal.component";
import { StoryComponent } from "./components/story/story.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { ToastComponent } from "./components/toast/toast.component";
import { WEDDING_DATA } from "./core/wedding-data";
import { AudioService } from "./services/audio.service";
import { GuestService } from "./services/guest.service";
import { PageViewService } from "./services/pageview.service";
import { ReplyService } from "./services/reply.service";

export interface PageInfo {
  id: string;
  title: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    CoverComponent,
    BannerComponent,
    InvitationComponent,
    IntroductionComponent,
    StoryComponent,
    TimelineComponent,
    EventsComponent,
    AlbumComponent,
    GuestbookComponent,
    BankGiftComponent,
    MusicPlayerComponent,
    RsvpModalComponent,
    ToastComponent,
    QuickMenuComponent,
    ReplyCardComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  guestService = inject(GuestService);
  /** Dữ liệu thiệp đã thay token xưng hô ({you}, {we}...) theo khách của link; không có link cá nhân thì giữ nguyên văn như cũ. */
  private weddingData$ = computed(() => this.guestService.personalize(WEDDING_DATA));
  get weddingData() {
    return this.weddingData$();
  }
  pageViewService = inject(PageViewService);
  audioService = inject(AudioService);
  private replyService = inject(ReplyService);
  isRsvpOpen = false;
  /** Lựa chọn điền sẵn khi mở modal từ thẻ hồi âm (null = mặc định). */
  rsvpPreset: boolean | null = null;
  isCoverVisible = true;
  private previousBodyOverflow = "";

  @ViewChild("pageContainer") pageContainerRef?: ElementRef<HTMLDivElement>;

  pages: PageInfo[] = [
    { id: "page-banner", title: "Trang đầu" },
    { id: "page-invitation", title: "Lời mời & Đếm ngược" },
    { id: "page-introduction", title: "Cô dâu & Chú rể" },
    { id: "page-story", title: "Chuyện chúng mình" },
    { id: "page-timeline", title: "Cột mốc tình yêu" },
    { id: "page-events", title: "Sự kiện cưới" },
    { id: "page-album", title: "Album ảnh cưới" },
    { id: "page-guestbook", title: "Sổ lưu bút" },
    { id: "page-bank-gift", title: "Mừng cưới & Cảm ơn" },
  ];

  private observer: IntersectionObserver | null = null;
  private scrollHintObserver: IntersectionObserver | null = null;
  private scrollHintTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private visibleScrollHints = new Set<string>();
  private scrollFrame: number | null = null;

  onCoverOpened() {
    this.audioService.play();
  }

  onCoverFinished() {
    this.isCoverVisible = false;
    this.pageViewService.setLocked(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = this.previousBodyOverflow;
    }
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  openRsvp(preset: boolean | null = null) {
    this.rsvpPreset = preset;
    this.isRsvpOpen = true;
    this.pageViewService.setLocked(true);
    if (typeof document !== "undefined") {
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  }

  closeRsvp() {
    this.isRsvpOpen = false;
    this.pageViewService.setLocked(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = this.previousBodyOverflow;
    }
  }

  /** Khách chọn một lời chúc ở màn cảm ơn sau RSVP: đóng modal, điền sẵn vào sổ lưu bút và cuộn tới đó. */
  onRsvpWish(wish: { name: string; text: string }) {
    this.closeRsvp();
    this.replyService.pendingWish.set(wish);
    this.pageViewService.goToPage(7);
  }

  goToPage(index: number) {
    this.pageViewService.goToPage(index);
  }

  isScrollHintVisible() {
    return this.visibleScrollHints.size > 0;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    this.pageViewService.handleKeyDown(event);
  }

  @HostListener("window:scroll")
  onWindowScroll() {
    if (typeof window === "undefined") return;
    this.hideScrollHints();
    if (this.scrollFrame !== null) return;
    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = null;
      this.updateActiveSectionOnScroll();
    });
  }

  private updateActiveSectionOnScroll() {
    // Tạm dừng cập nhật active section khi đang nhập liệu để tránh nhảy trạng thái khi bàn phím bật
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    this.pageViewService.syncFromViewport();
  }

  ngAfterViewInit() {
    if (typeof window === "undefined") return;

    // Khoá cuộn trang cho tới khi khách mở thiệp
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    this.pageViewService.setLocked(true);

    const container = this.pageContainerRef?.nativeElement;
    if (container) {
      const sectionElements = Array.from(
        container.querySelectorAll<HTMLElement>(".pageview-section"),
      );
      this.pageViewService.init(container, sectionElements);

      // Setup IntersectionObserver for reveal animations
      if ("IntersectionObserver" in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
              }
            });
          },
          {
            root: null, // observe against viewport for seamless scroll in both modes
            threshold: 0.05,
            rootMargin: "0px 0px -20px 0px",
          },
        );

        container
          .querySelectorAll(".reveal, .reveal-left, .reveal-right")
          .forEach((el) => this.observer?.observe(el));

        this.scrollHintObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const sectionId = (entry.target as HTMLElement).id;
              if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                this.scheduleScrollHint(sectionId);
              } else {
                this.clearScrollHint(sectionId);
              }
            });
          },
          { threshold: [0, 0.2] },
        );

        container
          .querySelectorAll<HTMLElement>("[data-scroll-hint-section]")
          .forEach((section) => this.scrollHintObserver?.observe(section));
      }
    }
  }

  ngOnDestroy() {
    if (this.scrollFrame !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this.scrollFrame);
    }
    if (typeof document !== "undefined") {
      document.body.style.overflow = this.previousBodyOverflow;
    }
    this.observer?.disconnect();
    this.scrollHintObserver?.disconnect();
    this.scrollHintTimers.forEach((timer) => clearTimeout(timer));
    this.pageViewService.destroy();
  }

  private scheduleScrollHint(sectionId: string) {
    if (this.scrollHintTimers.has(sectionId) || this.visibleScrollHints.has(sectionId)) {
      return;
    }

    const timer = setTimeout(() => {
      this.scrollHintTimers.delete(sectionId);
      this.visibleScrollHints.add(sectionId);
    }, 1000);
    this.scrollHintTimers.set(sectionId, timer);
  }

  private clearScrollHint(sectionId: string) {
    const timer = this.scrollHintTimers.get(sectionId);
    if (timer) clearTimeout(timer);
    this.scrollHintTimers.delete(sectionId);
    this.visibleScrollHints.delete(sectionId);
  }

  private hideScrollHints() {
    this.visibleScrollHints.clear();
  }
}
