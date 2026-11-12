import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { BankData } from "../../models/wedding-data.model";
import { PageViewService } from "../../services/pageview.service";
import { ImgFadeDirective } from "../../shared/img-fade.directive";


@Component({
  selector: "app-bank-gift",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  styles: [`
    .gift-row { border: 0; background: none; font: inherit; color: inherit; text-align: left; transition: background-color 160ms ease; }
    .gift-row:active { background: rgba(23, 36, 27, 0.05); }
    @media (hover: hover) { .gift-row:hover { background: rgba(23, 36, 27, 0.03); } }
    .gift-row:active .gift-qr { transform: scale(0.96); }
    .gift-qr { transition: transform 220ms var(--ease-out); }
  `],
  template: `
    <section id="bank-gift-section" class="section bg-ivory">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Gửi trao yêu thương</p>
          <h2 class="script-title">Mừng cưới</h2>
          <p class="lead mt-2">{{ data.description }}</p>
        </header>

        <!-- Một thẻ duy nhất: ảnh ở trên (bên trái trên màn rộng), hai dòng mừng cưới ở dưới -->
        <div class="card overflow-hidden max-w-md md:max-w-3xl mx-auto md:grid md:grid-cols-[5fr_6fr] reveal delay-100">
          <div class="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-garden-50">
            <img
              appImgFade
              [src]="data.coverImage"
              alt="Ảnh cưới"
              class="absolute inset-0 w-full h-full object-cover"
              style="object-position: 50% 36%;"
            />
          </div>

          <div class="flex flex-col justify-center md:py-3">
            <ng-container *ngFor="let who of people; let last = last">
              <button
                type="button"
                (click)="openQrModal(who)"
                class="gift-row w-full flex items-center gap-4 px-5 py-4 sm:px-7 sm:py-5 cursor-pointer"
                [attr.aria-label]="'Mở mã QR mừng cưới ' + who.label + ' ' + who.name"
              >
                <!-- Ảnh VietQR là thẻ dọc 17:22, hiện trọn vẹn chứ không cắt -->
                <span class="gift-qr relative shrink-0 w-[68px] sm:w-20 aspect-[17/22] rounded-xl overflow-hidden bg-white ring-1 ring-garden-900/10">
                  <img appImgFade="fade" [src]="who.qr" alt="" class="w-full h-full object-contain" />
                </span>

                <span class="min-w-0 flex-1 flex flex-col">
                  <span class="eyebrow">{{ who.label }}</span>
                  <span class="mt-1 text-[1.0625rem] font-semibold text-garden-900 leading-snug tracking-[-0.01em]">{{ who.name }}</span>
                  <span class="mt-0.5 text-[0.875rem] text-garden-900/60">{{ who.bank }}</span>
                </span>

                <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-garden-700/10 text-garden-700 text-[0.8125rem] font-medium pl-3 pr-2 py-1.5">
                  Mở mã
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
              <div *ngIf="!last" class="h-px bg-garden-900/10 ml-[108px] sm:ml-[136px] mr-5 sm:mr-7"></div>
            </ng-container>
          </div>
        </div>
      </div>
    </section>

    <!-- QR phóng to: nền mờ để tập trung, chạm ra ngoài để đóng -->
    <div
      *ngIf="selected as who"
      (click)="closeQrModal()"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'Mã QR mừng cưới ' + who.label"
      class="fixed inset-0 z-[99999] bg-garden-950/55 backdrop-blur-md flex items-center justify-center p-5 rsvp-backdrop-in"
    >
      <div
        class="sheet-in bg-white rounded-[32px] p-5 max-w-[340px] w-full shadow-float relative"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-start justify-between gap-3 mb-4 pl-1">
          <div class="min-w-0">
            <p class="eyebrow">Mừng cưới {{ who.label }}</p>
            <h4 class="mt-1 text-[1.0625rem] font-semibold text-garden-900 tracking-[-0.01em] leading-snug">{{ who.name }}</h4>
            <p class="text-[0.875rem] text-garden-900/60">{{ who.bank }}</p>
          </div>
          <button
            type="button"
            (click)="closeQrModal()"
            aria-label="Đóng"
            class="shrink-0 w-9 h-9 rounded-full bg-garden-900/[0.06] text-garden-900/60 flex items-center justify-center active:scale-90 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <img [src]="who.qr" [alt]="'Mã QR ' + who.label" class="w-full h-auto max-h-[62svh] object-contain rounded-2xl ring-1 ring-garden-900/10" />
        <p class="mt-3.5 text-center text-[0.8125rem] text-garden-900/60">Quét mã bằng ứng dụng ngân hàng bất kỳ</p>
      </div>
    </div>
  `,
})
export class BankGiftComponent implements OnInit {
  @Input({ required: true }) data!: BankData;
  private pageViewService = inject(PageViewService);

  selected: { label: string; bank: string; name: string; qr: string } | null = null;

  // Tạo một lần duy nhất: nếu trả mảng mới ở mỗi lần render, *ngFor sẽ dựng lại thẻ <img>,
  // ảnh tải lại → kích hoạt render → lặp vô hạn và treo trang.
  people: { label: string; bank: string; name: string; qr: string }[] = [];

  ngOnInit() {
    this.people = [
      { label: "Chú rể", bank: this.data.bankNameGroom, name: this.data.nameGroom, qr: this.data.imageBankGroom },
      { label: "Cô dâu", bank: this.data.bankNameBride, name: this.data.nameBride, qr: this.data.imageBankBride },
    ];
  }

  openQrModal(who: { label: string; bank: string; name: string; qr: string }) {
    this.selected = who;
    this.pageViewService.setLocked(true);
  }

  closeQrModal() {
    this.selected = null;
    this.pageViewService.setLocked(false);
  }
}
