import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { BankData } from "../../models/wedding-data.model";
import { PageViewService } from "../../services/pageview.service";
import { ImgFadeDirective } from "../../shared/img-fade.directive";
import { IconComponent } from "../../shared/icon.component";


@Component({
  selector: "app-bank-gift",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective, IconComponent],
  styles: [`
    .gift-card { --frame-w: 72px; }
    .gift-row { border: 0; background: none; font: inherit; color: inherit; text-align: left; transition: background-color 160ms ease; }
    .gift-row:active { background: rgba(23, 36, 27, 0.05); }
    @media (hover: hover) { .gift-row:hover { background: rgba(23, 36, 27, 0.03); } }
    .gift-row:active .gift-qr { transform: scale(0.96); }
    .gift-qr { transition: transform 220ms var(--ease-out); }
  `],
  template: `
    <section id="bank-gift-section" class="section decor decor-tulip-alt paper">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Gửi trao yêu thương</p>
          <h2 class="script-title">Mừng cưới</h2>
          <p class="lead mt-2">{{ data.description }}</p>
        </header>

        <!-- Một thẻ duy nhất: ảnh ở trên (bên trái trên màn rộng), hai dòng mừng cưới ở dưới -->
        <div class="gift-card stationery stationery-framed max-w-md md:max-w-3xl mx-auto p-10 md:p-11 md:grid md:grid-cols-[5fr_6fr] md:gap-6 reveal delay-100">
          <div class="well"><div class="matted aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <img
              appImgFade
              [src]="data.coverImage"
              alt="Ảnh cưới"
              class="absolute inset-0 w-full h-full object-cover"
              style="object-position: 50% 36%;"
            />
          </div></div>

          <div class="flex flex-col justify-center pt-4 md:py-3">
            <div class="orn-rule w-40 mx-auto mb-2" aria-hidden="true"><span class="foil-orn orn-hy w-[1.125rem]"></span></div>
            <ng-container *ngFor="let who of people; let last = last">
              <button
                type="button"
                (click)="openQrModal(who)"
                class="gift-row w-full flex items-center gap-3.5 px-0 py-4 sm:px-4 sm:py-5 rounded-2xl cursor-pointer"
                [attr.aria-label]="'Mở mã QR mừng cưới ' + who.label + ' ' + who.name"
              >
                <!-- Ảnh VietQR là thẻ dọc 17:22, hiện trọn vẹn chứ không cắt -->
                <span class="gift-qr relative shrink-0 w-[68px] sm:w-20 aspect-[17/22] rounded-lg overflow-hidden bg-white shadow-[0_0_0_1px_rgba(140,114,56,0.4),0_0_0_3px_#fdfcf7,0_0_0_4px_rgba(140,114,56,0.18)]">
                  <img appImgFade="fade" [src]="who.qr" alt="" class="w-full h-full object-contain" />
                </span>

                <span class="min-w-0 flex-1 flex flex-col">
                  <span class="eyebrow">{{ who.label }}</span>
                  <span class="mt-1 font-prata text-[1.0625rem] text-garden-900 leading-snug">{{ who.name }}</span>
                  <span class="desc mt-0.5 text-[0.875rem] text-garden-900/60">{{ who.bank }}</span>
                </span>

                <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/60 shadow-[inset_0_0_0_1px_rgba(140,114,56,0.4)] text-garden-700 text-[0.8125rem] font-medium p-2 sm:pl-3 sm:pr-2 sm:py-1.5">
                  <span class="hidden sm:inline">Mở mã</span>
                  <app-icon name="chevron-right" class="w-3.5 h-3.5" [strokeWidth]="2.5"></app-icon>
                </span>
              </button>
              <div *ngIf="!last" class="h-px mx-2 sm:mx-4 bg-[rgba(140,114,56,0.25)] shadow-[0_1px_0_rgba(255,255,255,0.9)]"></div>
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
        class="sheet-in stationery !rounded-[28px] p-5 max-w-[340px] w-full relative"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-start justify-between gap-3 mb-4 pl-1">
          <div class="min-w-0">
            <p class="eyebrow">Mừng cưới {{ who.label }}</p>
            <h4 class="mt-1 font-prata text-[1.0625rem] text-garden-900 leading-snug">{{ who.name }}</h4>
            <p class="text-[0.875rem] text-garden-900/60">{{ who.bank }}</p>
          </div>
          <button
            type="button"
            (click)="closeQrModal()"
            aria-label="Đóng"
            class="shrink-0 w-9 h-9 rounded-full bg-garden-900/[0.06] text-garden-900/60 flex items-center justify-center active:scale-90 transition-transform"
          >
            <app-icon name="close" class="w-4 h-4" [strokeWidth]="2.5"></app-icon>
          </button>
        </div>
        <img [src]="who.qr" [alt]="'Mã QR ' + who.label" class="w-full h-auto max-h-[62svh] object-contain rounded-2xl shadow-[0_0_0_1px_rgba(140,114,56,0.4)]" />
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
