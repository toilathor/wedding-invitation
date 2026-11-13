import { CommonModule } from "@angular/common";
import { GuestService } from "../../services/guest.service";
import { Component, HostListener, Input, inject } from "@angular/core";
import { WeddingEventItem } from "../../models/wedding-data.model";
import { IconComponent } from "../../shared/icon.component";
import { ReplyService } from "../../services/reply.service";
import { PersonalizePipe } from "../../shared/personalize.pipe";

@Component({
  selector: "app-events",
  standalone: true,
  imports: [CommonModule, IconComponent, PersonalizePipe],
  styles: [`
    :host {
      display: block;
      position: relative;
      z-index: 30;
    }
    .ev-card { --frame-w: 72px; }
    .ev-icon { height: 5.25rem; width: auto; filter: drop-shadow(0 8px 10px rgba(92, 78, 40, 0.18)); }
    .ev-time {
      margin-top: 0.5rem;
      font-family: var(--font-serif);
      font-size: 3.25rem;
      line-height: 1;
      letter-spacing: -0.01em;
      color: var(--green);
      font-variant-numeric: lining-nums tabular-nums;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
    }
  `],
  template: `
    <section class="section decor decor-bloom-vine paper">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Ngày chung đôi</p>
          <h2 class="script-title">Sự kiện cưới</h2>
          <p *ngIf="replyService.rsvp() as r" class="desc mt-2 text-[0.9375rem] text-garden-700 inline-flex items-center gap-1.5">
            <app-icon name="check-circle" class="w-4 h-4 shrink-0"></app-icon>
            <span>{{ (r === 'yes' ? 'Cảm ơn {you} đã xác nhận tham dự. Hẹn gặp {you} {nhe}!' : 'Cảm ơn {you} đã hồi âm và gửi lời chúc.') | personalize }}</span>
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-md md:max-w-none mx-auto">
          <article
            *ngFor="let item of events; let idx = index"
            [ngClass]="'reveal delay-' + idx * 100"
            [style.z-index]="openCalendarIndex === idx ? 50 : 20 - idx"
            class="ev-card stationery stationery-framed flex flex-col items-center text-center px-8 pt-9 pb-10"
          >
            <img [src]="item.icon" alt="" class="ev-icon" loading="lazy" />
            <p class="eyebrow mt-4">{{ item.title }}</p>

            <p class="ev-time">{{ item.displayTime }}</p>
            <div class="orn-rule w-36 my-4" aria-hidden="true"><span class="foil-orn orn-hy w-[1.125rem]"></span></div>
            <p class="font-prata text-[0.9375rem] tracking-[0.18em] text-garden-900 tabular-nums">
              {{ getEventDay(item) }} · {{ getEventMonth(item) }} · {{ getEventYear(item) }}
            </p>
            <p class="desc mt-2 text-[0.9375rem] text-garden-900/75 first-letter:uppercase" style="text-wrap: balance;">
              {{ item.address }}
            </p>

            <div class="relative flex flex-wrap justify-center gap-2 mt-6 pt-1 md:mt-auto md:pt-6">
              <a
                [href]="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-primary"
              >
                Chỉ đường
              </a>

              <button
                type="button"
                (click)="toggleCalendarMenu(idx, $event)"
                [attr.aria-expanded]="openCalendarIndex === idx"
                class="btn btn-sm btn-tinted"
                title="Thêm sự kiện vào Google / Apple Calendar"
              >
                <span>Thêm vào lịch</span>
                <app-icon
                  name="chevron-down"
                  class="w-3 h-3 transition-transform duration-300 ease-apple"
                  [class.rotate-180]="openCalendarIndex === idx"
                  [strokeWidth]="2.5"
                ></app-icon>
              </button>

              <!-- Menu mọc ra từ chính nút "Thêm vào lịch" -->
              <div
                *ngIf="openCalendarIndex === idx"
                (click)="$event.stopPropagation()"
                role="menu"
                class="glass materialize absolute top-full inset-x-0 mx-auto mt-2 w-60 max-w-[85vw] rounded-[20px] p-1.5 z-[9999] text-left"
                style="transform-origin: 60% 0;"
              >
                <a
                  [href]="getGoogleCalendarUrl(item)"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  (click)="openCalendarIndex = null"
                  class="flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-[0.9375rem] font-medium text-garden-900 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors"
                >
                  <app-icon name="calendar" class="w-[1.125rem] h-[1.125rem] text-garden-700"></app-icon>
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  role="menuitem"
                  (click)="downloadIcs(item)"
                  class="w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-left text-[0.9375rem] font-medium text-garden-900 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors cursor-pointer"
                >
                  <app-icon name="download" class="w-[1.125rem] h-[1.125rem] text-garden-700"></app-icon>
                  <span>Apple Calendar (.ics)</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class EventsComponent {
  guestService = inject(GuestService);
  replyService = inject(ReplyService);
  @Input({ required: true }) events!: WeddingEventItem[];

  openCalendarIndex: number | null = null;

  getEventDay(item: WeddingEventItem): string {
    const parts = item.displayDate.split(".").map((p) => p.trim());
    return parts[0] || "28";
  }

  getEventMonth(item: WeddingEventItem): string {
    const parts = item.displayDate.split(".").map((p) => p.trim());
    return parts[1] || "11";
  }

  getEventYear(item: WeddingEventItem): string {
    const parts = item.displayDate.split(".").map((p) => p.trim());
    return parts[2] || "2026";
  }

  toggleCalendarMenu(index: number, event: Event) {
    event.stopPropagation();
    this.openCalendarIndex = this.openCalendarIndex === index ? null : index;
  }

  @HostListener("document:click")
  closeMenu() {
    this.openCalendarIndex = null;
  }

  getGoogleCalendarUrl(item: WeddingEventItem): string {
    const title = `${item.title} - Đám Cưới Quang Thọ & Thúy Hiền`;
    const details = `Trân trọng kính mời ${this.guestService.fmt('{you}')} đến tham dự ${item.title} của Quang Thọ & Thúy Hiền.\nĐịa điểm: ${item.address}`;
    const location = item.address;

    const startDate = new Date(item.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
    const dates = `${formatUtc(startDate)}/${formatUtc(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title,
    )}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  }

  downloadIcs(item: WeddingEventItem) {
    this.openCalendarIndex = null;

    const title = `${item.title} - Đám Cưới Quang Thọ & Thúy Hiền`;
    const description = `Trân trọng kính mời ${this.guestService.fmt('{you}')} đến tham dự ${item.title} của Quang Thọ & Thúy Hiền.\nĐịa điểm: ${item.address}`;
    const location = item.address;

    const startDate = new Date(item.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//QuangThoThuyHien//Wedding//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:wedding-${startDate.getTime()}-${Math.floor(Math.random() * 10000)}@linhvuongthuhang.com`,
      `DTSTAMP:${formatUtc(new Date())}`,
      `DTSTART:${formatUtc(startDate)}`,
      `DTEND:${formatUtc(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${item.title.toLowerCase().replace(/\s+/g, "-")}-dam-cuoi.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
