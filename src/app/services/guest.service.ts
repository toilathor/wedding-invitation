import { Injectable, signal } from "@angular/core";
import { DEFAULT_GUEST, Guest, formatForGuest, parseGuest, personalizeDeep } from "../core/guest-rules";

/** Khách của link hiện tại (đọc một lần từ `location.search`). */
@Injectable({ providedIn: "root" })
export class GuestService {
  readonly guest = signal<Guest>(DEFAULT_GUEST);

  constructor() {
    if (typeof location !== "undefined") {
      try {
        this.guest.set(parseGuest(location.search));
      } catch {
        this.guest.set(DEFAULT_GUEST);
      }
    }
  }

  fmt(text: string): string {
    return formatForGuest(text, this.guest());
  }

  personalize<T>(data: T): T {
    return personalizeDeep(data, this.guest());
  }
}
