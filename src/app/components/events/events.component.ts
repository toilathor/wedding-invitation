import { CommonModule } from "@angular/common";
import { GuestService } from "../../services/guest.service";
import { Component, HostListener, Input, inject } from "@angular/core";
import { WeddingEventItem } from "../../models/wedding-data.model";

@Component({
  selector: "app-events",
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      position: relative;
      z-index: 30;
    }
  `],
  template: `
    <section class="section decor decor-tr-bl bg-ivory">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Ngày chung đôi</p>
          <h2 class="script-title">Sự kiện cưới</h2>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-md md:max-w-none mx-auto">
          <article
            *ngFor="let item of events; let idx = index"
            [ngClass]="'reveal delay-' + idx * 100"
            [style.z-index]="openCalendarIndex === idx ? 50 : 20 - idx"
            class="card relative flex flex-col p-6 sm:p-7"
          >
            <p class="eyebrow">{{ item.title }}</p>

            <p class="mt-3 font-prata text-garden-700 text-5xl leading-none tabular-nums tracking-[-0.01em]">
              {{ item.displayTime }}
            </p>
            <p class="mt-3 text-[0.9375rem] font-medium text-garden-900 tabular-nums">
              {{ getEventDay(item) }} · {{ getEventMonth(item) }} · {{ getEventYear(item) }}
            </p>
            <p class="mt-1 text-[0.9375rem] leading-relaxed text-garden-900/70 first-letter:uppercase">
              {{ item.address }}
            </p>

            <div class="relative flex flex-wrap gap-2 mt-6 pt-1 md:mt-auto md:pt-6">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3 transition-transform duration-300 ease-apple"
                  [class.rotate-180]="openCalendarIndex === idx"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Menu mọc ra từ chính nút "Thêm vào lịch" -->
              <div
                *ngIf="openCalendarIndex === idx"
                (click)="$event.stopPropagation()"
                role="menu"
                class="glass materialize absolute top-full left-0 mt-2 w-60 max-w-[85vw] rounded-[20px] p-1.5 z-[9999]"
                style="transform-origin: 40% 0;"
              >
                <a
                  [href]="getGoogleCalendarUrl(item)"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  (click)="openCalendarIndex = null"
                  class="flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-[0.9375rem] font-medium text-garden-900 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-[1.125rem] h-[1.125rem] text-garden-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  role="menuitem"
                  (click)="downloadIcs(item)"
                  class="w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-left text-[0.9375rem] font-medium text-garden-900 hover:bg-garden-900/[0.06] active:bg-garden-900/10 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-[1.125rem] h-[1.125rem] text-garden-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-0.93 2.74 1.01.08 2.03-.5 2.64-1.24z" />
                  </svg>
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
