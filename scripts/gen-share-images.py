#!/usr/bin/env python3
"""Tạo ảnh xem trước khi chia sẻ link (og:image) và favicon.

Chạy từ thư mục gốc của repo:  python3 scripts/gen-share-images.py
Cần Pillow (pip install pillow).

- src/assets/images/share/og_image.jpg   1200x630, cắt giữa từ OG_SOURCE
- src/assets/images/share/favicon-32.png, favicon-180.png (apple-touch-icon),
  cắt vuông từ ICON_SOURCE theo ICON_BOX

Đổi ảnh chia sẻ: sửa OG_SOURCE (và OG_FOCUS_Y nếu cần đẩy khung cắt lên/xuống).
Đường dẫn ảnh được ghi trong src/index.html.
"""
import os

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
OUT = os.path.join(ROOT, "share")

OG_SOURCE = os.path.join(ROOT, "gallery", "album_1.webp")
OG_SIZE = (1200, 630)
OG_FOCUS_Y = 0.5  # 0 = sát mép trên, 1 = sát mép dưới

ICON_SOURCE = os.path.join(ROOT, "couple", "banner_right.webp")
ICON_BOX = (230, 400, 720)  # trái, trên, cạnh (px trên ảnh gốc 1221x1800): khung vuông quanh hai gương mặt


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


def favicon(px):
    im = Image.open(ICON_SOURCE).convert("RGB")
    left, top, side = ICON_BOX
    im = im.crop((left, top, left + side, top + side)).resize((px, px), Image.LANCZOS)
    im.save(os.path.join(OUT, f"favicon-{px}.png"), optimize=True)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    og_image()
    for px in (32, 180):
        favicon(px)
    print("Đã ghi vào", os.path.normpath(OUT))
