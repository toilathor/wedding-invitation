import { Injectable, signal } from "@angular/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../core/firebase.config";
import { DEFAULT_GUEST, Guest, formatForGuest, parseGuest, personalizeDeep } from "../core/guest-rules";

/** Khách của link hiện tại (đọc một lần từ `location.search`). */
@Injectable({ providedIn: "root" })
export class GuestService {
  readonly guest = signal<Guest>(DEFAULT_GUEST);

  constructor() {
    if (typeof location !== "undefined") {
      try {
        const g = new URLSearchParams(location.search).get("g");
        if (g !== null) void this.resolveCode(g);
        else this.guest.set(parseGuest(location.search));
      } catch {
        this.guest.set(DEFAULT_GUEST);
      }
    }
  }

  /**
   * Link ngắn `?g=RBB007`: tra tài liệu `guests/{mã}` (chỉ cho đọc từng mã) rồi dựng lại chuỗi n/x/p (và d/s/k cho
   * xưng hô tuỳ chỉnh) y như link dài, để `parseGuest` kiểm tra mọi thứ. Không tra được thì giữ thiệp dạng chung.
   */
  private async resolveCode(raw: string) {
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z]{3}\d{3,6}$/.test(code)) return;
    try {
      const g = (await getDoc(doc(db, "guests", code))).data();
      if (!g || typeof g["name"] !== "string") return;
      const hid = String(g["honorificId"] ?? "");
      const group = hid.startsWith("builtin-") ? hid.slice(8) : "T";
      if (!/^[0-9ACOT]$/.test(group)) return;
      const family = !!g["family"] && group !== "0";
      let x = `${group}${family ? 1 : 0}${Number(g["self"] || 0)}`;
      while (x.length > 1 && x.endsWith("0")) x = x.slice(0, -1);
      const q = new URLSearchParams({ n: g["name"], x });
      const companion = String(g["companion"] ?? "").trim();
      if (companion && !family && group !== "0") q.set("p", companion);
      if (group === "T") {
        const h = (await getDoc(doc(db, "honorifics", hid))).data();
        if (!h) return;
        if (h["title"]) q.set("d", String(h["title"]).toLowerCase());
        q.set("s", String(h["we"]).toLowerCase());
        q.set("k", String(h["you"]).toLowerCase());
      }
      this.guest.set(parseGuest("?" + q.toString()));
    } catch {
      /* không tra được: giữ thiệp dạng chung */
    }
  }

  fmt(text: string): string {
    return formatForGuest(text, this.guest());
  }

  personalize<T>(data: T): T {
    return personalizeDeep(data, this.guest());
  }
}
