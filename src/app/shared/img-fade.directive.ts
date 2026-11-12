import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  inject,
} from "@angular/core";

/**
 * Skeleton + "materialize" reveal dùng chung cho mọi ảnh.
 *
 *   <img appImgFade [src]="..." />            → skeleton ánh sáng lướt qua, ảnh hiện dần từ mờ → nét
 *   <img appImgFade="fade" [src]="..." />     → chỉ skeleton + fade (không blur/scale) cho ảnh có animation riêng
 *   <img appImgFade="none" (imgLoaded)="…" /> → không đổi giao diện, chỉ phát sự kiện khi tải xong
 *
 * Quy ước thiết kế (Apple + Emil Kowalski):
 * - Chỉ dùng transform / opacity / filter; skeleton chạy bằng transform (không animate background-position).
 * - Ảnh đã có sẵn trong cache thì hiện ngay, không chớp skeleton.
 * - Skeleton mờ đi chồng lên lúc ảnh hiện ra (crossfade) thay vì bị cắt đột ngột.
 * - Tôn trọng prefers-reduced-motion (xem styles.css, khối "Image skeleton").
 */
@Directive({
  selector: "img[appImgFade]",
  standalone: true,
})
export class ImgFadeDirective implements AfterViewInit, OnDestroy {
  @Input("appImgFade") mode: "" | "blur" | "fade" | "none" = "blur";
  @Output() imgLoaded = new EventEmitter<void>();

  private ref = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private renderer = inject(Renderer2);
  private skeleton: HTMLElement | null = null;
  private unlisten: Array<() => void> = [];
  private removeTimer: ReturnType<typeof setTimeout> | null = null;
  private finished = false;

  ngAfterViewInit() {
    const img = this.ref.nativeElement;
    const mode = this.mode || "blur";

    // Ảnh đã có trong cache: hiện luôn, không dựng skeleton.
    if (img.complete && img.naturalWidth > 0) {
      this.finish(false);
      return;
    }
    if (mode === "none") {
      this.unlisten.push(this.renderer.listen(img, "load", () => this.finish(false)));
      this.unlisten.push(this.renderer.listen(img, "error", () => this.finish(false)));
      return;
    }

    img.classList.add("img-fade", mode === "fade" ? "img-fade-lite" : "img-fade-blur");

    const parent = img.parentElement;
    if (parent) {
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      const sk = this.renderer.createElement("span") as HTMLElement;
      sk.className = "img-skeleton";
      sk.setAttribute("aria-hidden", "true");
      sk.style.borderRadius = getComputedStyle(img).borderRadius;
      parent.insertBefore(sk, img);
      this.skeleton = sk;
    }

    this.unlisten.push(this.renderer.listen(img, "load", () => this.finish(true)));
    this.unlisten.push(this.renderer.listen(img, "error", () => this.fail()));
  }

  private finish(animate: boolean) {
    if (this.finished) return;
    this.finished = true;
    const img = this.ref.nativeElement;
    if (this.mode !== "none") {
      img.classList.add(animate ? "img-loaded" : "img-loaded-instant");
      // `img-fade` ẩn ảnh (opacity 0) cho tới khi tải xong; bỏ nó đi thì ảnh trả về style bình thường của nó.
      img.classList.remove("img-fade");
    }
    if (this.skeleton) {
      const sk = this.skeleton;
      sk.classList.add("img-skeleton-done");
      this.removeTimer = setTimeout(() => sk.remove(), 650);
    }
    // Phát sự kiện ở microtask để không đổi state giữa chu kỳ kiểm tra của Angular.
    Promise.resolve().then(() => this.imgLoaded.emit());
  }

  private fail() {
    if (this.finished) return;
    this.finished = true;
    const img = this.ref.nativeElement;
    img.classList.remove("img-fade");
    // Dừng chuyển động nhưng giữ khối nền trung tính để bố cục không vỡ.
    this.skeleton?.classList.add("img-skeleton-error");
    Promise.resolve().then(() => this.imgLoaded.emit());
  }

  ngOnDestroy() {
    this.unlisten.forEach((u) => u());
    if (this.removeTimer) clearTimeout(this.removeTimer);
    this.skeleton?.remove();
  }
}
