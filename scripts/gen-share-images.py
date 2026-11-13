#!/usr/bin/env python3
"""Tạo ảnh xem trước khi chia sẻ link (og:image) và favicon.

Chạy từ thư mục gốc của repo:  python3 scripts/gen-share-images.py
Cần Pillow (pip install pillow).

- src/assets/images/share/og_image.jpg   1200x630, cắt giữa từ OG_SOURCE
- src/assets/images/share/favicon-32.png, favicon-180.png (apple-touch-icon)

Đổi ảnh chia sẻ: sửa OG_SOURCE (và OG_FOCUS_Y nếu cần đẩy khung cắt lên/xuống).
Đường dẫn ảnh được ghi trong src/index.html.
"""
import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
OUT = os.path.join(ROOT, "share")

OG_SOURCE = os.path.join(ROOT, "gallery", "album_1.webp")
OG_SIZE = (1200, 630)
OG_FOCUS_Y = 0.5  # 0 = sát mép trên, 1 = sát mép dưới

GREEN = (47, 74, 56)  # #2F4A38, mực xanh của phong bì
IVORY = (246, 240, 226)
GOLD = (201, 169, 106)


def og_image():
    im = Image.open(OG_SOURCE).convert("RGB")
    w, h = im.size
    tw, th = OG_SIZE
    if w * th <= h * tw:  # ảnh cao hơn khung: cắt trên dưới
        ch = round(w * th / tw)
        top = round((h - ch) * OG_FOCUS_Y)
        box = (0, top, w, top + ch)
    else:  # ảnh rộng hơn khung: cắt hai bên
        cw = round(h * tw / th)
        left = (w - cw) // 2
        box = (left, 0, left + cw, h)
    im = im.crop(box).resize(OG_SIZE, Image.LANCZOS)
    im.save(os.path.join(OUT, "og_image.jpg"), quality=86, optimize=True, progressive=True)


def heart(cx, cy, size, steps=240):
    pts = []
    for i in range(steps):
        t = 2 * math.pi * i / steps
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * size / 32, cy - y * size / 32))
    return pts


def favicon(px):
    s = 8  # vẽ lớn rồi thu nhỏ để khử răng cưa
    n = px * s
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, n - 1, n - 1), radius=n * 0.22, fill=GREEN)
    if px >= 64:  # viền vàng mảnh chỉ thấy được ở cỡ lớn
        m = n * 0.085
        d.rounded_rectangle((m, m, n - 1 - m, n - 1 - m), radius=n * 0.15, outline=GOLD, width=max(1, round(n * 0.012)))
    d.polygon(heart(n / 2, n * 0.5, n * 0.56), fill=IVORY)
    im.resize((px, px), Image.LANCZOS).save(os.path.join(OUT, f"favicon-{px}.png"), optimize=True)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    og_image()
    for px in (32, 180):
        favicon(px)
    print("Đã ghi vào", os.path.normpath(OUT))
