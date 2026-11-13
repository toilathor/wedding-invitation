import { Injectable, signal } from "@angular/core";

const RSVP_KEY = "wedding_rsvp_reply";
const SEEN_KEY = "wedding_reply_card_seen";

export type RsvpReply = "yes" | "no";

/**
 * Trạng thái hồi âm của thiết bị này. Client không đọc được `rsvps` (rules), nên việc "đã xác nhận hay chưa"
 * chỉ có thể nhớ ở localStorage; không lưu tên hay số điện thoại ở đây.
 */
@Injectable({ providedIn: "root" })
export class ReplyService {
  /** null = chưa hồi âm từ thiết bị này. */
  readonly rsvp = signal<RsvpReply | null>(this.read());

  /** Lời chúc chờ điền sẵn vào sổ lưu bút (chọn từ màn cảm ơn sau RSVP). */
  readonly pendingWish = signal<{ name: string; text: string } | null>(null);

  markRsvp(attending: boolean) {
    const value: RsvpReply = attending ? "yes" : "no";
    this.rsvp.set(value);
    try {
      localStorage.setItem(RSVP_KEY, value);
    } catch {
      /* chế độ riêng tư: chỉ nhớ trong phiên */
    }
  }

  /** Thẻ hồi âm chỉ tự hiện một lần mỗi phiên. */
  get cardSeen(): boolean {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return false;
    }
  }

  markCardSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* bỏ qua */
    }
  }

  private read(): RsvpReply | null {
    try {
      const v = localStorage.getItem(RSVP_KEY);
      return v === "yes" || v === "no" ? v : null;
    } catch {
      return null;
    }
  }
}
