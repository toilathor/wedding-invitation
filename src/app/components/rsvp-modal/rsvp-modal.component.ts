import { Component, ElementRef, EventEmitter, Output, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { RsvpService } from '../../services/rsvp.service';
import { GuestService } from '../../services/guest.service';
import { PersonalizePipe } from '../../shared/personalize.pipe';
import { IconComponent } from '../../shared/icon.component';
import confetti from 'canvas-confetti';
import { WEDDING_DATA } from '../../core/wedding-data';
import { WeddingEventItem } from '../../models/wedding-data.model';

type AttendKey = 'attendParty' | 'attendGroom' | 'attendBride';

/** Khớp sự kiện trong WEDDING_DATA.events với trường RSVP tương ứng (theo tiêu đề). */
const ATTEND_KEY_BY_TITLE: Record<string, AttendKey> = {
  'tiệc cưới': 'attendParty',
  'lễ nhà trai': 'attendGroom',
  'lễ nhà gái': 'attendBride',
};

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function toEventOption(ev: WeddingEventItem) {
  const key = ATTEND_KEY_BY_TITLE[ev.title.trim().toLocaleLowerCase('vi')];
  if (!key) return null;
  const lower = ev.title.trim().toLocaleLowerCase('vi');
  const d = new Date(ev.dateTime);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    key,
    title: lower.charAt(0).toLocaleUpperCase('vi') + lower.slice(1),
    when: `${ev.displayTime}, ${WEEKDAYS[d.getDay()]} - ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    address: ev.address,
  };
}

interface GuestOption {
  value: number;
  label: string;
  sub: string;
}

@Component({
  selector: 'app-rsvp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PersonalizePipe, IconComponent],
  styles: [`
    /* Khung dập nổi ôm cả tấm; nút đóng nằm gọn trong hõm góc trên-phải của khung */
    .rsvp-sheet { --frame-w: 92px; }
    .rsvp-close {
      background: var(--card);
      box-shadow: inset 0 0 0 1px rgba(140, 114, 56, 0.45);
    }
    /* vùng chạm 44px quanh nút nhỏ */
    .rsvp-close::after { content: ""; position: absolute; inset: -7px; }
    /* Nội dung cuộn mờ dần trước khi chạm nút gửi, thay cho đường kẻ */
    .rsvp-foot { position: relative; }
    .rsvp-foot::before {
      content: "";
      position: absolute;
      inset: -1.25rem 2rem auto;
      height: 1.25rem;
      background: linear-gradient(to bottom, rgba(252, 250, 243, 0), #fcfaf3);
      pointer-events: none;
    }
  `],
  template: `
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-title"
      class="fixed inset-0 z-[99999] bg-garden-950/55 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto rsvp-backdrop-in"
      (click)="onClose.emit()">

      <!-- Modal Card Frame with Luxury Arch Top -->
      <div
        class="rsvp-sheet sheet-in stationery stationery-framed !rounded-[28px] max-w-lg w-full max-h-[calc(100dvh-1.5rem)] md:max-h-[min(860px,calc(100dvh-3rem))] relative my-auto overflow-hidden text-center flex flex-col"
        (click)="$event.stopPropagation()">

        <!-- Close Button -->
        <button
          type="button"
          (click)="onClose.emit()"
          class="rsvp-close absolute top-[7px] right-[7px] z-20 w-[30px] h-[30px] flex items-center justify-center rounded-full text-garden-700 transition-transform active:scale-90"
          title="Đóng"
          aria-label="Đóng cửa sổ xác nhận tham dự">
          <app-icon name="close" class="w-3.5 h-3.5" [strokeWidth]="2.5"></app-icon>
        </button>

        <div class="shrink-0 px-8 md:px-10 pt-9 md:pt-10">
          <!-- Header -->
          <div class="mb-5 relative z-10">
            <span class="foil-orn orn-sprig w-28 mx-auto mb-2" aria-hidden="true"></span>
            <p class="eyebrow mb-1">
              R.S.V.P
            </p>
            <h3 id="rsvp-title" class="font-pinyonScript text-garden-700 text-[2.25rem] min-[400px]:text-[2.625rem] md:text-[3.25rem] leading-[1.15] whitespace-nowrap">
              Xác nhận tham dự
            </h3>
            <p class="desc text-garden-900/70 text-[0.9375rem] mt-2 max-w-xs mx-auto">
              {{ 'Sự hiện diện của {you} là niềm vinh hạnh to lớn của cô dâu & chú rể' | personalize }}
            </p>
            <div class="orn-rule w-40 mx-auto mt-4" aria-hidden="true"><span class="foil-orn orn-hy w-[1.125rem]"></span></div>
          </div>

          <!-- Smooth Sliding Pill Toggle -->
          <div class="relative mb-5 p-[3px] bg-[rgba(140,114,56,0.13)] shadow-[inset_0_0_0_1px_rgba(140,114,56,0.2)] rounded-[14px] flex select-none">
            <!-- Sliding Indicator Highlight -->
            <div
              class="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-[11px] bg-[#fffefb] shadow-[0_1px_3px_rgba(23,36,27,0.16),inset_0_0_0_1px_rgba(140,114,56,0.35)] transition-transform duration-300 ease-apple"
              [style.transform]="isAttending ? 'translateX(0)' : 'translateX(100%)'">
            </div>

            <!-- Option 1: Sẽ tham dự -->
            <button
              type="button"
              (click)="isAttending = true"
              class="relative z-10 flex-1 py-2.5 px-3 rounded-[11px] text-[0.875rem] font-medium transition-colors duration-200 flex items-center justify-center"
              [ngClass]="isAttending ? 'text-garden-900' : 'text-garden-900/55'">
              <span>Sẽ tham dự</span>
            </button>

            <!-- Option 2: Rất tiếc vắng mặt -->
            <button
              type="button"
              (click)="isAttending = false"
              class="relative z-10 flex-1 py-2.5 px-3 rounded-[11px] text-[0.875rem] font-medium transition-colors duration-200 flex items-center justify-center"
              [ngClass]="!isAttending ? 'text-garden-900' : 'text-garden-900/55'">
              <span>Rất tiếc vắng mặt</span>
            </button>
          </div>

        </div>

          <!-- Form Body -->
          <form id="rsvp-form" (ngSubmit)="submitRsvp()" (scroll)="closeDropdown()" class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 md:px-10 pb-4 space-y-4 text-left">
            <!-- Name Input -->
            <div>
              <label class="field-label">
                {{ 'Tên của {youOne}' | personalize }} <span class="text-garden-700">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="rsvpName"
                [placeholder]="'Nhập họ và tên của {youOne}...' | personalize"
                required
                class="field h-12"
              />
            </div>

            <!-- Phone Input -->
            <div>
              <label class="field-label">
                Số điện thoại <span class="text-[#2F4A38]">*</span>
              </label>
              <input
                type="tel"
                inputmode="numeric"
                maxlength="10"
                [(ngModel)]="phone"
                (keydown)="onPhoneKeyDown($event)"
                (input)="onPhoneInput($event)"
                (paste)="onPhonePaste($event)"
                (blur)="onPhoneBlur()"
                name="rsvpPhone"
                placeholder="VD: 0912345678 (10 số)..."
                required
                [class.field-error]="!!phoneError"
                class="field h-12"
              />
              <p *ngIf="phoneError" class="text-[11px] text-red-600 font-beVietnamPro mt-1 flex items-center gap-1">
                <app-icon name="info" class="w-3.5 h-3.5 shrink-0"></app-icon>
                <span>{{ phoneError }}</span>
              </p>
            </div>

            <!-- Smooth Collapsible Section for Events & Guest Count -->
            <div
              class="grid overflow-hidden transition-all duration-400 ease-out"
              [attr.aria-hidden]="!isAttending"
              [ngStyle]="{
                'grid-template-rows': isAttending ? '1fr' : '0fr',
                'opacity': isAttending ? '1' : '0',
                'transform': isAttending ? 'translateY(0)' : 'translateY(-8px)'
              }">
              <div class="overflow-hidden space-y-4">
                <!-- Event Selection Cards -->
                <div>
                  <label class="field-label">
                    {{ 'Sự kiện {you} sẽ tham dự' | personalize }}
                  </label>
                  <div class="grid grid-cols-1 gap-2">
                    @for (ev of eventOptions; track ev.key) {
                      <label
                        (click)="toggleEvent(ev.key)"
                        class="flex items-center justify-between gap-3 px-4 py-3 rounded-[16px] bg-white transition-shadow duration-200 cursor-pointer select-none"
                        [ngClass]="this[ev.key] ? 'shadow-[inset_0_0_0_1.5px_#2F4A38]' : 'shadow-[inset_0_0_0_1px_rgba(140,114,56,0.28)]'">
                        <div class="min-w-0">
                          <p class="font-prata text-[0.9375rem] text-garden-900">{{ ev.title }}</p>
                          <p class="text-[0.8125rem] text-garden-900/55">{{ ev.when }}</p>
                          <p class="text-[0.8125rem] text-garden-900/55">{{ ev.address }}</p>
                        </div>
                        <div class="shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors duration-200" [ngClass]="this[ev.key] ? 'bg-garden-700' : 'bg-white shadow-[inset_0_0_0_1.5px_rgba(23,36,27,0.22)]'">
                          <app-icon *ngIf="this[ev.key]" name="check" class="w-3.5 h-3.5 text-white" [strokeWidth]="3"></app-icon>
                        </div>
                      </label>
                    }
                  </div>
                </div>

                <!-- Custom Luxury Dropdown for Guest Count (Pure Minimalist Typography) -->
                <div class="relative" (click)="$event.stopPropagation()">
                  <label class="field-label">
                    Số người tham dự
                  </label>

                  <!-- Dropdown Trigger Box -->
                  <div
                    #guestDropdownTrigger
                    (click)="toggleGuestDropdown($event)"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-[16px] bg-white shadow-[inset_0_0_0_1px_rgba(140,114,56,0.28)] cursor-pointer select-none">
                    <div>
                      <p class="text-[0.9375rem] font-medium text-garden-900">{{ selectedGuestOption.label }}</p>
                      <p class="text-[0.8125rem] text-garden-900/55">{{ selectedGuestOption.sub }}</p>
                    </div>

                    <app-icon
                      name="chevron-down"
                      class="w-4 h-4 text-[#2F4A38] transition-transform duration-300"
                      [class.rotate-180]="isDropdownOpen"
                      [strokeWidth]="2"></app-icon>
                  </div>

                  <!-- Custom Floating Menu -->
                  <div
                    *ngIf="isDropdownOpen"
                    [ngStyle]="guestDropdownStyle"
                    class="hidden fixed glass rounded-[20px] p-1.5 z-[1000000] rsvp-dropdown-in overflow-y-auto overscroll-contain space-y-0.5">
                    <div
                      *ngFor="let opt of guestOptions"
                      (click)="selectGuest(opt)"
                      class="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] cursor-pointer transition-colors"
                      [ngClass]="selectedGuestCount === opt.value ? 'text-garden-700' : 'hover:bg-garden-900/[0.06] text-garden-900'">
                      <div>
                        <p class="text-[0.9375rem] font-medium">{{ opt.label }}</p>
                        <p class="text-[0.75rem] text-garden-900/55">{{ opt.sub }}</p>
                      </div>

                      <app-icon
                        *ngIf="selectedGuestCount === opt.value"
                        name="check"
                        class="w-4 h-4 text-[#2F4A38]"
                        [strokeWidth]="2.5"></app-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wish / Message Note -->
            <div class="transition-all duration-300">
              <label class="field-label">
                {{ isAttending ? 'Gửi lời nhắn đến dâu rể (nếu có)' : 'Lời chúc mừng gửi dâu rể' }}
              </label>
              <textarea
                [(ngModel)]="note"
                name="rsvpNote"
                rows="2"
                [placeholder]="isAttending ? 'Nhập lời nhắn hoặc lưu ý...' : ('Gửi lời chúc mừng hạnh phúc đến {couple}...' | personalize)"
                class="field !py-3 resize-none"></textarea>
            </div>

          </form>

          <!-- Sticky action area: only the form content scrolls. -->
          <div class="rsvp-foot shrink-0 px-8 md:px-10 pt-3 pb-8">
            <button
              type="submit"
              form="rsvp-form"
              [disabled]="!name.trim() || !phone.trim() || isSubmitting"
              class="btn btn-primary w-full !min-h-[3.125rem] !text-base">
              <app-icon *ngIf="!isSubmitting" name="heart" class="w-4 h-4"></app-icon>
              <span>{{ isSubmitting ? 'Đang gửi...' : (isAttending ? 'Gửi xác nhận tham dự' : 'Gửi lời chúc mừng') }}</span>
            </button>
          </div>
      </div>

      <!-- Portal-style menu: outside the scrolling form/card so it cannot be clipped. -->
      <div
        *ngIf="isDropdownOpen"
        (click)="$event.stopPropagation()"
        [ngStyle]="guestDropdownStyle"
        class="fixed glass rounded-[20px] p-1.5 z-[1000000] rsvp-dropdown-in overflow-y-auto overscroll-contain space-y-0.5">
        <div
          *ngFor="let opt of guestOptions"
          (click)="selectGuest(opt)"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] cursor-pointer transition-colors"
          [ngClass]="selectedGuestCount === opt.value ? 'text-garden-700' : 'hover:bg-garden-900/[0.06] text-garden-900'">
          <div>
            <p class="text-[0.9375rem] font-medium">{{ opt.label }}</p>
            <p class="text-[0.75rem] text-garden-900/55">{{ opt.sub }}</p>
          </div>
          <app-icon
            *ngIf="selectedGuestCount === opt.value"
            name="check"
            class="w-4 h-4 text-[#2F4A38]"
            [strokeWidth]="2.5"></app-icon>
        </div>
      </div>
    </div>
  `
})
export class RsvpModalComponent {
  @Output() onClose = new EventEmitter<void>();
  @ViewChild("guestDropdownTrigger") guestDropdownTrigger?: ElementRef<HTMLElement>;
  private toastService = inject(ToastService);
  private rsvpService = inject(RsvpService);
  guestService = inject(GuestService);

  isAttending = true;
  name = '';
  phone = '';
  phoneError = '';
  attendParty = true;
  attendGroom = false;
  attendBride = false;

  readonly eventOptions = WEDDING_DATA.events
    .map(toEventOption)
    .filter((o): o is NonNullable<ReturnType<typeof toEventOption>> => !!o);

  toggleEvent(key: AttendKey) {
    this[key] = !this[key];
  }
  selectedGuestCount = 1;
  isDropdownOpen = false;
  guestDropdownStyle: Record<string, string> = {};
  note = '';
  isSubmitting = false;

  guestOptions: GuestOption[] = [
    { value: 1, label: 'Một mình', sub: 'Đi một mình cho nhẹ nhàng' },
    { value: 2, label: 'Hai mình', sub: 'Có đôi có cặp cho vui' },
    { value: 3, label: 'Gia đình', sub: 'Đi cùng người thân yêu' },
  ];

  get selectedGuestOption(): GuestOption {
    return this.guestOptions.find(o => o.value === this.selectedGuestCount) || this.guestOptions[0];
  }

  selectGuest(opt: GuestOption) {
    this.selectedGuestCount = opt.value;
    this.isDropdownOpen = false;
    this.guestDropdownStyle = {};
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
    this.guestDropdownStyle = {};
  }

  toggleGuestDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.closeDropdown();
      return;
    }

    const trigger = this.guestDropdownTrigger?.nativeElement;
    if (!trigger || typeof window === "undefined") return;

    const rect = trigger.getBoundingClientRect();
    const horizontalPadding = 12;
    const menuHeight = Math.min(240, window.innerHeight - horizontalPadding * 2);
    const gap = 8;
    const hasRoomBelow = rect.bottom + gap + menuHeight <= window.innerHeight - horizontalPadding;
    const top = hasRoomBelow
      ? rect.bottom + gap
      : Math.max(horizontalPadding, rect.top - menuHeight - gap);
    const left = Math.min(
      Math.max(horizontalPadding, rect.left),
      window.innerWidth - rect.width - horizontalPadding,
    );

    this.guestDropdownStyle = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${rect.width}px`,
      maxHeight: `${menuHeight}px`,
    };
    this.isDropdownOpen = true;
  }

  onPhoneKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Enter',
      'Home',
      'End',
    ];
    // Cho phép các phím điều hướng và tổ hợp Ctrl / Cmd + A, C, V, X...
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const isTextSelected = (input.selectionEnd ?? 0) - (input.selectionStart ?? 0) > 0;

    // Chặn tất cả các ký tự không phải chữ số 0-9
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Giới hạn đúng 10 chữ số
    if (input.value.length >= 10 && !isTextSelected) {
      event.preventDefault();
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/[^0-9]/g, '');
    // Giới hạn tối đa 10 chữ số
    if (val.length > 10) {
      val = val.slice(0, 10);
    }
    this.phone = val;
    input.value = val;

    if (this.phoneError) {
      const validation = this.rsvpService.validatePhone(this.phone);
      if (validation.isValid) {
        this.phoneError = '';
      }
    }
  }

  onPhonePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = (event.clipboardData?.getData('text') || '').trim();
    let cleaned = pasteData.replace(/[\s.\-()]/g, '');
    // Tự động chuyển đầu số +84 hoặc 84 về 0
    if (cleaned.startsWith('+84')) {
      cleaned = '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('84') && cleaned.length === 11) {
      cleaned = '0' + cleaned.slice(2);
    }
    // Chỉ giữ lại chữ số và cắt tối đa 10 số
    cleaned = cleaned.replace(/[^0-9]/g, '').slice(0, 10);
    this.phone = cleaned;
    this.onPhoneBlur();
  }

  onPhoneBlur() {
    if (this.phone.trim()) {
      const validation = this.rsvpService.validatePhone(this.phone);
      this.phoneError = validation.isValid ? '' : (validation.errorMessage || 'Số điện thoại không hợp lệ.');
    } else {
      this.phoneError = '';
    }
  }

  async submitRsvp() {
    if (!this.name.trim() || !this.phone.trim() || this.isSubmitting) return;

    const phoneValidation = this.rsvpService.validatePhone(this.phone);
    if (!phoneValidation.isValid) {
      this.phoneError = phoneValidation.errorMessage || 'Số điện thoại không hợp lệ.';
      this.toastService.show(this.phoneError, 'error');
      return;
    }

    this.phoneError = '';
    this.isSubmitting = true;

    try {
      const res = await this.rsvpService.submitRsvp({
        name: this.name,
        phone: this.phone,
        isAttending: this.isAttending,
        attendParty: this.attendParty,
        attendGroom: this.attendGroom,
        attendBride: this.attendBride,
        guestsCount: this.selectedGuestCount,
        note: this.note,
      });

      if (!res.success) {
        this.toastService.show(res.error || 'Có lỗi xảy ra, vui lòng thử lại!', 'error');
        this.isSubmitting = false;
        return;
      }

      if (this.isAttending) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2F4A38', '#DCE5D3', '#C8B273']
        });
        this.toastService.show(`Cảm ơn ${this.name.trim()}! ${this.guestService.fmt('{We} rất mong chờ được đón tiếp {you}. 💕')}`, 'success', 4000);
      } else {
        this.toastService.show(`Cảm ơn ${this.name.trim()} đã gửi lời chúc tốt đẹp đến ${this.guestService.fmt('{we}')}! 💌`, 'info', 4000);
      }

      setTimeout(() => {
        this.isSubmitting = false;
        this.onClose.emit();
      }, 600);
    } catch (error) {
      console.error('Lỗi khi gửi xác nhận RSVP:', error);
      this.toastService.show('Không thể gửi xác nhận, vui lòng thử lại sau!', 'error');
      this.isSubmitting = false;
    }
  }
}
