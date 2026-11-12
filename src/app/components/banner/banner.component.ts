import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BannerData } from "../../models/wedding-data.model";
import { ImgFadeDirective } from "../../shared/img-fade.directive";

/**
 * Trang đầu. Điện thoại: ảnh tràn màn hình, chữ trắng nằm trên lớp phủ xanh đậm ở đáy
 * (như dòng "Celestial Bond" trên ảnh cưới). Màn rộng: chữ bên trái, hai ảnh bo góc bên phải.
 * CoverComponent nhúng lại component này làm tấm thiệp, nên bố cục chỉ phụ thuộc vào viewport.
 */
@Component({
  selector: "app-banner",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  styles: [`
    :host { display: block; }

    .hero {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100svh;
      overflow: hidden;
      background: #17241b;
      color: #fff;
    }

    .hero-photo { position: absolute; inset: 0; }
    .hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; }
    .hero-photo-2 { display: none; }

    /* Lớp phủ chỉ đậm ở nơi có chữ, phần còn lại của ảnh giữ nguyên */
    .hero-scrim {
      position: absolute; inset: 0; pointer-events: none;
      background:
        linear-gradient(to top, rgba(15, 26, 19, 0.92) 0%, rgba(15, 26, 19, 0.62) 26%, rgba(15, 26, 19, 0) 56%),
        linear-gradient(to bottom, rgba(15, 26, 19, 0.3) 0%, rgba(15, 26, 19, 0) 18%);
    }

    .hero-text {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 1.25rem calc(3.25rem + env(safe-area-inset-bottom));
    }

    .hero-eyebrow {
      font-family: var(--font-serif);
      font-size: 0.6875rem;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.82);
    }

    .hero-names {
      margin: 0.5rem 0 0;
      font-family: var(--font-script);
      font-weight: 400;
      font-size: clamp(3.5rem, 17vw, 5.25rem);
      line-height: 1.02;
      white-space: nowrap;
      text-shadow: 0 2px 24px rgba(15, 26, 19, 0.35);
    }
    .hero-names span { display: block; }
    .hero-amp { font-size: 0.62em; line-height: 0.9; opacity: 0.85; }

    .hero-date {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-top: 1.25rem;
      font-family: var(--font-serif);
      font-size: 1.125rem;
      letter-spacing: 0.14em;
      font-variant-numeric: lining-nums tabular-nums;
    }
    .hero-date i { width: 1px; height: 0.9em; background: rgba(255, 255, 255, 0.5); }

    @media (min-width: 900px) {
      .hero {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: clamp(2.5rem, 6vw, 6rem);
        padding: 4rem clamp(2rem, 6vw, 6rem);
        background:
          radial-gradient(ellipse at 78% 40%, rgba(95, 125, 99, 0.28) 0%, rgba(95, 125, 99, 0) 60%),
          #17241b;
      }
      .hero-scrim { display: none; }
      .hero-text { order: 1; flex: 0 1 30rem; padding: 0; }
      .hero-names { font-size: clamp(4.5rem, 7.4vw, 7.5rem); }
      .hero-eyebrow { font-size: 0.75rem; }
      .hero-date { font-size: 1.375rem; margin-top: 1.75rem; }

      .hero-photos {
        order: 2;
        position: relative;
        flex: 0 0 auto;
        height: min(76svh, 720px);
        aspect-ratio: 0.8;
      }
      .hero-photo {
        position: absolute;
        overflow: hidden;
        border-radius: 32px;
        background: #233a2b;
        box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.6);
      }
      .hero-photo-1 { inset: 0 0 0 16%; }
      .hero-photo-1 img { object-position: 50% 30%; }
      .hero-photo-2 {
        display: block;
        inset: auto auto 7% 0;
        width: 40%;
        aspect-ratio: 0.72;
        box-shadow: 0 0 0 6px #17241b, 0 30px 60px -24px rgba(0, 0, 0, 0.7);
      }
    }
  `],
  template: `
    <section class="hero">
      <div class="hero-photos">
        <div class="hero-photo hero-photo-1">
          <img appImgFade [src]="data.image1" alt="Ảnh cưới" />
        </div>
        <div class="hero-photo hero-photo-2">
          <img appImgFade [src]="data.image2" alt="Ảnh cưới" />
        </div>
      </div>

      <div class="hero-scrim"></div>

      <div class="hero-text">
        <p class="hero-eyebrow">{{ data.title }}</p>
        <h1 class="hero-names select-none">
          <span>{{ data.groom }}</span>
          <span class="hero-amp" aria-hidden="true">&amp;</span>
          <span>{{ data.bride }}</span>
        </h1>
        <div class="hero-date" [attr.aria-label]="data.day + '/' + data.month + '/' + data.year">
          <span>{{ data.day }}</span><i></i><span>{{ data.month }}</span><i></i><span>{{ data.year }}</span>
        </div>
      </div>
    </section>
  `,
})
export class BannerComponent {
  @Input({ required: true }) data!: BannerData;
}
