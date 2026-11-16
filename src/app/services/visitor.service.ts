import { effect, inject, Injectable } from "@angular/core";
import { doc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../core/firebase.config";
import { GuestService } from "./guest.service";

const VISITOR_ID_KEY = "wedding_visitor_id";
const SESSION_FLAG_KEY = "wedding_visit_session";

export type DeviceType = "mobile" | "tablet" | "desktop" | "other";

export function detectDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const isIPad =
    /iPad/i.test(ua) ||
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  const isTablet =
    isIPad || /PlayBook|Tablet|(Android(?!.*Mobile))/i.test(ua);
  if (isTablet) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

export function detectOS(): string {
  if (typeof navigator === "undefined") return "Khác";
  const ua = navigator.userAgent || "";
  const platform =
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    navigator.platform ||
    "";
  if (
    /iPhone|iPad|iPod/i.test(ua) ||
    (platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1)
  ) {
    return "iOS";
  }
  if (/Android/i.test(ua)) return "Android";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "Windows";
  if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return "macOS";
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) return "Linux";
  return "Khác";
}

export function detectBrowser(): string {
  if (typeof navigator === "undefined") return "Khác";
  const ua = navigator.userAgent || "";
  if (/Zalo/i.test(ua)) return "Zalo";
  if (/FBAN|FBAV|FB_IAB|Messenger/i.test(ua)) return "Facebook";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/TikTok/i.test(ua)) return "TikTok";
  if (/CocCoc/i.test(ua)) return "Cốc Cốc";
  if (/Edg/i.test(ua)) return "Edge";
  if (/OPR|Opera|OPT/i.test(ua)) return "Opera";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/Chrome|CriOS/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Khác";
}

@Injectable({
  providedIn: "root",
})
export class VisitorService {
  private readonly guestService = inject(GuestService);
  private visitorId = "";
  private guestLinked = false;

  constructor() {
    this.initVisitor();

    // Đồng bộ thông tin khách khi GuestService phân giải xong tên khách mời
    effect(() => {
      const g = this.guestService.guest();
      if (!this.visitorId || this.guestLinked) return;
      if (g && g.name && g.name !== "Bạn bè & Người thân") {
        const params = new URLSearchParams(window.location.search);
        const code = (params.get("g") || "").trim().toUpperCase().slice(0, 30);
        this.linkGuest(g.name, code);
      }
    });
  }

  private async initVisitor() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    try {
      let isNew = false;
      this.visitorId = localStorage.getItem(VISITOR_ID_KEY) || "";

      if (!this.visitorId) {
        this.visitorId =
          "vis_" +
          Math.random().toString(36).substring(2, 11) +
          "_" +
          Date.now().toString(36);
        localStorage.setItem(VISITOR_ID_KEY, this.visitorId);
        isNew = true;
      }

      const hasVisitedThisSession = sessionStorage.getItem(SESSION_FLAG_KEY) === "1";
      if (hasVisitedThisSession && !isNew) {
        return;
      }

      const deviceType = detectDeviceType();
      const os = detectOS();
      const browser = detectBrowser();
      const screen = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
      const language = (navigator.language || "vi").slice(0, 20);

      let referrer = "";
      if (document.referrer) {
        try {
          referrer = new URL(document.referrer).hostname || "";
        } catch {
          referrer = document.referrer.slice(0, 100);
        }
      }

      const params = new URLSearchParams(window.location.search);
      const guestCode = (params.get("g") || "").trim().toUpperCase().slice(0, 30);
      const guestName = (params.get("n") || "").trim().slice(0, 160);

      const docRef = doc(db, "visitors", this.visitorId);

      if (isNew) {
        const data: Record<string, any> = {
          visitorId: this.visitorId,
          deviceType,
          os,
          browser,
          screen,
          language,
          referrer,
          visitCount: 1,
          firstVisit: serverTimestamp(),
          lastVisit: serverTimestamp(),
        };
        if (guestCode) data["guestCode"] = guestCode;
        if (guestName) data["guestName"] = guestName;

        await setDoc(docRef, data);
      } else {
        const updateData: Record<string, any> = {
          visitCount: increment(1),
          lastVisit: serverTimestamp(),
          screen,
        };
        if (referrer) updateData["referrer"] = referrer;
        if (guestCode) updateData["guestCode"] = guestCode;
        if (guestName) updateData["guestName"] = guestName;

        try {
          await updateDoc(docRef, updateData);
        } catch {
          // Khôi phục tài liệu nếu chưa có trên Firestore
          const fallbackData: Record<string, any> = {
            visitorId: this.visitorId,
            deviceType,
            os,
            browser,
            screen,
            language,
            referrer,
            visitCount: 1,
            firstVisit: serverTimestamp(),
            lastVisit: serverTimestamp(),
          };
          if (guestCode) fallbackData["guestCode"] = guestCode;
          if (guestName) fallbackData["guestName"] = guestName;
          await setDoc(docRef, fallbackData);
        }
      }

      sessionStorage.setItem(SESSION_FLAG_KEY, "1");
    } catch (e) {
      // Giữ cho trang thiệp chạy trơn tru, không chặn người dùng nếu mạng lỗi
      console.warn("Visitor tracking initialized silently:", e);
    }
  }

  private async linkGuest(name: string, code?: string) {
    if (!this.visitorId) return;
    try {
      this.guestLinked = true;
      const docRef = doc(db, "visitors", this.visitorId);
      const payload: Record<string, any> = {
        guestName: name.slice(0, 160),
        lastVisit: serverTimestamp(),
      };
      if (code) payload["guestCode"] = code.slice(0, 30);
      await updateDoc(docRef, payload);
    } catch {
      // Bỏ qua lỗi cập nhật thông tin khách
    }
  }
}
