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
        linear-gradient(to top, rgba(15, 26, 19, 0.94) 0%, rgba(15, 26, 19, 0.66) 32%, rgba(15, 26, 19, 0) 62%),
        linear-gradient(to bottom, rgba(15, 26, 19, 0.3) 0%, rgba(15, 26, 19, 0) 18%);
    }

    .hero-text {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 1.25rem calc(5.25rem + env(safe-area-inset-bottom));
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
      font-size: clamp(3.25rem, 15.5vw, 5rem);
      line-height: 1.02;
      white-space: nowrap;
      text-shadow: 0 2px 24px rgba(15, 26, 19, 0.35);
    }
    .hero-names span { display: block; }
    .hero-amp { font-size: 0.62em; line-height: 0.9; opacity: 0.85; }

    /* Ngày cưới kiểu thiệp in: thứ ở trên, ngày thật lớn ép nhũ ở giữa, tháng và năm kẹp giữa hai đường chỉ */
    .hero-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1rem;
      font-family: var(--font-serif);
      font-variant-numeric: lining-nums tabular-nums;
    }
    .hd-week {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.6875rem;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.85);
    }
    .hd-week::before, .hd-week::after {
      content: "";
      width: 4px;
      height: 4px;
      transform: rotate(45deg);
      background: #e2cf96;
    }
    .hd-row { display: flex; align-items: center; margin-top: 0.375rem; }
    .hd-side {
      width: 6.75rem;
      padding: 0.5rem 0;
      border-block: 1px solid rgba(226, 207, 150, 0.6);
      font-size: 0.8125rem;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.92);
    }
    .hd-day {
      padding: 0.12em 1.125rem;
      font-size: clamp(4rem, 19vw, 5.25rem);
      line-height: 1.1;
      letter-spacing: -0.02em;
      /* nhũ champagne sáng trên nền ảnh tối, có một vệt sáng lướt qua chậm */
      background: linear-gradient(105deg, #cdb46f 0%, #f6ecc8 30%, #c9ad66 48%, #fff7da 60%, #c2a45c 78%, #ead9a4 100%);
      background-size: 220% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #e2cf96;
      filter: drop-shadow(0 2px 14px rgba(15, 26, 19, 0.45));
      animation: foilSheen 7s ease-in-out infinite;
    }
    @keyframes foilSheen {
      0%, 100% { background-position: 0% 0; }
      50% { background-position: 100% 0; }
    }

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
      .hero-date { margin-top: 1.75rem; }
      .hd-day { font-size: clamp(5.25rem, 7.2vw, 7rem); padding: 0.12em 1.5rem; }
      .hd-side { width: 8rem; font-size: 0.875rem; }
      .hd-week { font-size: 0.75rem; }

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
        <div class="hero-date" role="text" [attr.aria-label]="weekday + ', ngày ' + data.day + ' tháng ' + data.month + ' năm ' + data.year">
          <span class="hd-week" aria-hidden="true">{{ weekday }}</span>
          <div class="hd-row" aria-hidden="true">
            <span class="hd-side">Tháng {{ data.month }}</span>
            <span class="hd-day">{{ data.day }}</span>
            <span class="hd-side">Năm {{ data.year }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BannerComponent {
  @Input({ required: true }) data!: BannerData;

  private static readonly WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  /** Thứ trong tuần, tính từ ngày/tháng/năm của dữ liệu để không lệch khi đổi ngày. */
  get weekday(): string {
    const d = new Date(+this.data.year, +this.data.month - 1, +this.data.day);
    return BannerComponent.WEEKDAYS[d.getDay()] ?? "";
  }
}
