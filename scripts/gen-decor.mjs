// Sinh bộ hoạ tiết trong src/assets/images/decor. Chạy: node scripts/gen-decor.mjs
// Hai kiểu file:
//  - "emboss": nét dập nổi (một lớp sáng lệch lên trên-trái, một lớp bóng lệch xuống dưới-phải), dùng làm background-image trên nền giấy.
//  - "mask": nét đen, dùng làm mask để lấy màu từ background (nhũ vàng, hoặc trắng mờ trên nền tối).
import { writeFileSync } from "node:fs";

const out = (name, svg) =>
  writeFileSync(new URL(`../src/assets/images/decor/${name}`, import.meta.url), svg.replace(/\n\s*/g, ""));
const f = (n) => Math.round(n * 10) / 10;

// width/height là bắt buộc: thiếu kích thước gốc thì border-image cắt lát theo kích thước phần tử chứ không theo viewBox.
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

/** Nét dập nổi: bóng dưới-phải, sáng trên-trái. `fill` (tuỳ chọn) là lớp màu thật nhạt nằm dưới để hoa có khối. */
const emboss = (body, { d = 0.7, hi = 0.95, sh = 0.3, w = 1.1, fill = "" } = {}) =>
  `${fill}<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${w}">
    <g stroke="#5d5638" stroke-opacity="${sh}" transform="translate(${d} ${d})">${body}</g>
    <g stroke="#fff" stroke-opacity="${hi}" transform="translate(${-d} ${-d})">${body}</g>
  </g>`;
const line = (body, { w = 1.3, fill = "" } = {}) =>
  `${fill}<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="${w}">${body}</g>`;
const mirror = (w, body) => `<g transform="translate(${w} 0) scale(-1 1)">${body}</g>`;

// ───────────── Tulip ─────────────
// Bông hoa trong hệ toạ độ riêng: đế ở (0,24), đỉnh ở (0,-27).
const PETAL_L = "M0,24C-16,24 -23,8 -19,-9C-18,-16 -15,-21 -13,-26C-8,-20 -5,-13 -3,-6";
const PETAL_R = "M0,24C16,24 23,8 19,-9C18,-16 15,-21 13,-26C8,-20 5,-13 3,-6";
const PETAL_C = "M0,24C-10,14 -11,-8 0,-27C11,-8 10,14 0,24Z";
const HEAD_FILL = "M0,24C-16,24 -23,8 -19,-9C-18,-16 -15,-21 -13,-26C-8,-20 -4,-14 0,-27C4,-14 8,-20 13,-26C15,-21 18,-16 19,-9C23,8 16,24 0,24Z";
const ne = 'vector-effect="non-scaling-stroke"';

/** Bông tulip có đế đặt tại (x,y), nghiêng `rot` độ so với phương thẳng đứng. */
const head = (x, y, rot, s) => {
  const t = `transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s}) translate(0 -24)"`;
  return {
    stroke: `<g ${t}><path ${ne} d="${PETAL_L}"/><path ${ne} d="${PETAL_R}"/><path ${ne} d="${PETAL_C}"/><path ${ne} d="M0,16C-1,6 -1,-6 0,-16" stroke-opacity=".55"/></g>`,
    fill: `<path ${t} d="${HEAD_FILL}"/>`,
  };
};

/** Cuống cong bậc ba; trả về cả góc tiếp tuyến ở đầu cuống để đặt bông hoa cho khớp. */
const stem = (p0, p1, p2, p3) => ({
  d: `M${p0}C${p1} ${p2} ${p3}`,
  end: p3,
  rot: (Math.atan2(p3[0] - p2[0], -(p3[1] - p2[1])) * 180) / Math.PI,
});

/** Lá tulip: dài, nhọn, hơi vặn. `bend` > 0 cong về bên phải hướng đi. */
const leaf = ([x0, y0], [x1, y1], width, bend = 0.3) => {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
  const c = (k) => `${f(mx + nx * k)},${f(my + ny * k)}`;
  const b = bend * len * 0.5;
  return {
    stroke: `<path d="M${f(x0)},${f(y0)}Q${c(b + width)} ${f(x1)},${f(y1)}Q${c(b - width * 0.45)} ${f(x0)},${f(y0)}Z"/><path d="M${f(x0)},${f(y0)}Q${c(b + width * 0.3)} ${f(x1)},${f(y1)}" stroke-opacity=".5"/>`,
    fill: `<path d="M${f(x0)},${f(y0)}Q${c(b + width)} ${f(x1)},${f(y1)}Q${c(b - width * 0.45)} ${f(x0)},${f(y0)}Z"/>`,
  };
};

const compose = (parts) => ({
  stroke: parts.map((p) => p.stroke ?? "").join(""),
  fill: parts.map((p) => p.fill ?? "").join(""),
});
const tulipOn = (st, s) => {
  const h = head(st.end[0], st.end[1], st.rot, s);
  return { stroke: `<path d="${st.d}"/>${h.stroke}`, fill: h.fill };
};

// Bó ba bông mọc lên từ góc dưới-trái
const bouquet = () => compose([
  leaf([50, 346], [168, 250], 26, 0.3),
  leaf([28, 346], [14, 222], 20, -0.22),
  leaf([42, 346], [84, 218], 17, 0.1),
  tulipOn(stem([38, 346], [46, 262], [72, 190], [94, 130]), 1.9),
  tulipOn(stem([58, 346], [92, 296], [144, 250], [176, 204]), 1.5),
  tulipOn(stem([22, 346], [24, 300], [34, 260], [36, 226]), 1.35),
]);
// Một cành tulip nằm vắt ngang góc trên-trái
const lying = () => compose([
  leaf([30, 28], [176, 26], 24, -0.26),
  leaf([64, 50], [136, 158], 20, 0.3),
  tulipOn(stem([-12, 6], [50, 44], [124, 70], [176, 86]), 1.9),
]);

const tint = (g, color = "#9fb294", op = 0.16) => `<g fill="${color}" fill-opacity="${op}">${g.fill}</g>`;
const maskFill = (g, op = 0.22) => `<g fill="#000" fill-opacity="${op}">${g.fill}</g>`;

for (const [name, w, h, build] of [["tulips", 240, 340, bouquet], ["tulip-top", 300, 190, lying]]) {
  const g = build();
  const L = name === "tulips" ? "bl" : "tl", R = name === "tulips" ? "br" : "tr";
  out(`${name}-${L}-emboss.svg`, svg(w, h, emboss(g.stroke, { w: 1.25, d: 0.8, sh: 0.34, fill: tint(g) })));
  out(`${name}-${R}-emboss.svg`, svg(w, h, emboss(mirror(w, g.stroke), { w: 1.25, d: 0.8, sh: 0.34, fill: mirror(w, tint(g)) })));
  out(`${name}-${L}.svg`, svg(w, h, line(g.stroke, { fill: maskFill(g) })));
  out(`${name}-${R}.svg`, svg(w, h, mirror(w, line(g.stroke, { fill: maskFill(g) }))));
}

// ───────────── Hoạ tiết đầu mục: tulip giữa hai nhánh cuộn rococo ─────────────
{
  const h = head(0, 26, 0, 0.5);
  const side = `
    <path d="M9,30C20,30 26,20 39,20C49,20 55,26 53,32C51.500,36.500 45,36.500 44.500,32C44.200,29.500 46.500,28.300 48,29.200"/>
    <path d="M24,25.500C30,33.500 40,36 47,37.500" stroke-opacity=".7"/>
    <path d="M55,29.500H78"/>
    <path d="M80,29.500l3,-3l3,3l-3,3z" fill="#000"/>
    <path d="M16,29.200C17,24 21,21 25.500,20.500C24.500,25 21,28.500 16,29.200Z" fill="#000" fill-opacity=".35"/>`;
  out("sprig.svg", svg(180, 40,
    `<g transform="translate(90 0)">${line(`${h.stroke}<path d="M0,26V36"/>${side}<g transform="scale(-1 1)">${side}</g>`, { w: 1.1, fill: `<g fill="#000" fill-opacity=".25">${h.fill}</g>` })}</g>`));
}

// ───────────── Khung thiệp (border-image, cắt 80) ─────────────
// Góc lõm kiểu khung hoành phi/Art Deco: hai đường chỉ ôm một hõm tròn, trong hõm là bông hoa bốn cánh.
{
  // Hai đường chỉ là hai đường khép kín (không nối từ bốn mảnh) để chỗ giáp nhau giữa cạnh không bị đậm lên khi kéo giãn
  const flower = (x, y) => `<g transform="translate(${x} ${y})" stroke-width=".8">
      <path d="M0,-7.500C3,-4 3,-3 0,0C-3,-3 -3,-4 0,-7.500ZM0,7.500C3,4 3,3 0,0C-3,3 -3,4 0,7.500ZM-7.500,0C-4,-3 -3,-3 0,0C-3,3 -4,3 -7.500,0ZM7.500,0C4,-3 3,-3 0,0C3,3 4,3 7.500,0Z"/>
    </g>`;
  const all = `
    <path d="M40,6H200A34,34 0 0 0 234,40V200A34,34 0 0 0 200,234H40A34,34 0 0 0 6,200V40A34,34 0 0 0 40,6Z"/>
    <path d="M45.200,11.500H194.800A39.500,39.500 0 0 0 228.500,45.200V194.800A39.500,39.500 0 0 0 194.800,228.500H45.200A39.500,39.500 0 0 0 11.500,194.800V45.200A39.500,39.500 0 0 0 45.200,11.500Z" stroke-width=".7"/>
    ${flower(19, 19)}${flower(221, 19)}${flower(19, 221)}${flower(221, 221)}`;
  out("frame.svg", svg(240, 240, emboss(all, { w: 1.2, d: 0.8, sh: 0.36 })));
}

// ───────────── Vân nền dập nổi: lưới ogee thưa, mỗi ô một hoa thị nhỏ (không có hoa lá) ─────────────
{
  const star = (x, y) => `<path d="M${x},${y - 5}C${x + 1.6},${y - 1.6} ${x + 1.6},${y - 1.6} ${x + 5},${y}C${x + 1.6},${y + 1.6} ${x + 1.6},${y + 1.6} ${x},${y + 5}C${x - 1.6},${y + 1.6} ${x - 1.6},${y + 1.6} ${x - 5},${y}C${x - 1.6},${y - 1.6} ${x - 1.6},${y - 1.6} ${x},${y - 5}Z"/>`;
  const W = 128, H = 192;
  const body = `
    <path d="M64,6C64,36 4,60 4,96M64,6C64,36 124,60 124,96M4,96C4,132 64,156 64,186M124,96C124,132 64,156 64,186"/>
    <path d="M64,-6V6M64,186V198M-4,96H4M124,96H132"/>
    ${star(64, 96)}${star(0, 0)}${star(W, 0)}${star(0, H)}${star(W, H)}`;
  out("emboss-pattern.svg", svg(W, H, emboss(body, { w: 0.8, d: 0.5, sh: 0.085, hi: 0.7 })));
}

// ───────────── Giấy: bề mặt sần nhẹ, chiếu sáng từ góc trên-trái (feDiffuseLighting) ─────────────
// File đặc (không trong suốt) nên dùng thẳng làm nền; màu phẳng trùng với màu giấy tương ứng trong styles.css.
{
  const paper = (name, [r, g, b], { freq = "0.9", scale = 0.7, linen = false } = {}) => {
    const k = 1 / Math.sin((74 * Math.PI) / 180); // bù độ nghiêng nguồn sáng để mặt phẳng ra đúng màu giấy
    const lit = `rgb(${[r, g, b].map((v) => Math.min(255, Math.round(v * k))).join(",")})`;
    const noise = linen
      ? `<feTurbulence type="fractalNoise" baseFrequency="0.012 0.75" numOctaves="2" seed="3" stitchTiles="stitch" result="a"/>
         <feTurbulence type="fractalNoise" baseFrequency="0.75 0.012" numOctaves="2" seed="8" stitchTiles="stitch" result="b"/>
         <feComposite in="a" in2="b" operator="arithmetic" k2=".5" k3=".5" result="n"/>`
      : `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" seed="5" stitchTiles="stitch" result="n"/>`;
    out(name, `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
      <filter id="p" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        ${noise}
        <feDiffuseLighting in="n" surfaceScale="${scale}" diffuseConstant="1" lighting-color="${lit}">
          <feDistantLight azimuth="225" elevation="74"/>
        </feDiffuseLighting>
      </filter>
      <rect width="256" height="256" fill="rgb(${r},${g},${b})"/>
      <rect width="256" height="256" filter="url(#p)"/>
    </svg>`);
  };
  paper("paper.svg", [245, 242, 232], { scale: 0.75 });
  paper("paper-linen.svg", [250, 248, 241], { linen: true, scale: 0.42 });
  paper("paper-card.svg", [253, 252, 247], { freq: "0.7", scale: 0.5 });
}

// ───────────── Huy hiệu: vòng lá ôm chữ lồng, tulip trên đỉnh ─────────────
{
  const cx = 60, cy = 64, r = 44;
  let leaves = "";
  const pts = [];
  for (let i = 0; i <= 11; i++) {
    const a = ((100 + i * 13.2) * Math.PI) / 180; // từ đáy vòng lên phía trái
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    pts.push([x, y]);
    if (i === 0) continue;
    const tx = -Math.sin(a), ty = Math.cos(a); // hướng đi lên dọc vòng
    const nx = Math.cos(a), ny = Math.sin(a); // hướng ra ngoài
    const len = 12 - i * 0.35;
    for (const sgn of [1, -1]) {
      const dx = tx * 0.86 + nx * 0.5 * sgn, dy = ty * 0.86 + ny * 0.5 * sgn;
      leaves += leaf([x, y], [x + dx * len, y + dy * len], 2.6, 0.25 * sgn).fill;
    }
  }
  const arc = `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join("L")}`;
  const h = head(60, 21, 0, 0.3);
  const crest = (ink) => {
    const half = `<path d="${arc}" fill="none" stroke="${ink}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><g fill="${ink}">${leaves}</g>`;
    return svg(120, 120,
      `${half}${mirror(120, half)}
       <g fill="${ink}" fill-opacity=".3">${h.fill}</g>
       <g fill="none" stroke="${ink}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${h.stroke}<path d="M52,110C56,106 64,106 68,110M52,106C56,110 64,110 68,106"/></g>`);
  };
  out("crest.svg", crest("#000")); // mask
  out("crest-ink.svg", crest("#2F4A38")); // in mực xanh trên nắp phong bì
}

// ───────────── Chữ song hỷ 囍, nét thẳng ─────────────
{
  const half = (c) => `
    <path d="M${c - 6},3H${c + 6}M${c},0V7.500"/>
    <rect x="${c - 5.500}" y="11" width="11" height="6.500"/>
    <path d="M${c - 4.500},21l1.800,3.500M${c + 4.500},21l-1.800,3.500"/>
    <rect x="${c - 5.500}" y="31" width="11" height="7.500"/>`;
  out("hy.svg", svg(44, 40,
    `<g fill="none" stroke="#000" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
      ${half(12)}${half(32)}<path d="M2,7.500H42M1,27.500H43"/>
    </g>`));
}

// ───────────── Khung vòm (border-image, cắt 140 80 80 80) ─────────────
// Hai vai vòm kiểu ogee nằm trọn trong hai góc trên, đỉnh vòm là đoạn thẳng nên kéo giãn không méo. Hai góc dưới lõm như khung thường.
{
  const flower = (x, y) => `<g transform="translate(${x} ${y})" stroke-width=".8">
      <path d="M0,-7.500C3,-4 3,-3 0,0C-3,-3 -3,-4 0,-7.500ZM0,7.500C3,4 3,3 0,0C-3,3 -3,4 0,7.500ZM-7.500,0C-4,-3 -3,-3 0,0C-3,3 -4,3 -7.500,0ZM7.500,0C4,-3 3,-3 0,0C3,3 4,3 7.500,0Z"/>
    </g>`;
  const H = 300;
  const halfOuter = "M120,6H82C52,6 32,38 32,76V82H26C14,82 6,90 6,104V260A34,34 0 0 0 40,294H120";
  const halfInner = "M120,11.500H82C56,11.500 37.500,42 37.500,76V87.500H26C17,87.500 11.500,93 11.500,104V254.800A39.500,39.500 0 0 0 45.200,288.500H120";
  const half = `<path d="${halfOuter}"/><path d="${halfInner}" stroke-width=".7"/>${flower(19, 281)}`;
  out("frame-arch.svg", svg(240, H, emboss(`${half}${mirror(240, half)}`, { w: 1.2, d: 0.8, sh: 0.36 })));
}

// ───────────── Các kiểu cỏ cây khác cho góc section ─────────────
const P = (x, y) => `${f(x)},${f(y)}`;
/** Điểm và góc tiếp tuyến trên đường cong bậc ba. */
const cubic = (p0, p1, p2, p3) => (t) => {
  const u = 1 - t;
  const q = (i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  const d = (i) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return { p: [q(0), q(1)], ang: Math.atan2(d(1), d(0)) };
};
const cubicD = (p0, p1, p2, p3) => `M${P(...p0)}C${P(...p1)} ${P(...p2)} ${P(...p3)}`;
const polar = ([x, y], ang, len) => [x + Math.cos(ang) * len, y + Math.sin(ang) * len];

/** Lá bầu có gân giữa và gân bên (kiểu lá trong thiệp dập nổi). */
const ovate = ([x, y], ang, len, w, veins = 4) => {
  const d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]];
  const at = (u, v) => [x + d[0] * u * len + n[0] * v * w, y + d[1] * u * len + n[1] * v * w];
  const tip = at(1, 0);
  const side = (sg) => `C${P(...at(0.16, sg * 1.05))} ${P(...at(0.62, sg * 0.98))} ${P(...tip)}`;
  const wd = (u) => 0.76 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.8);
  let v = `M${P(x, y)}L${P(...tip)}`;
  for (let k = 1; k <= veins; k++) {
    const u = k / (veins + 1.3), ue = Math.min(u + 0.22, 0.95);
    for (const sg of [1, -1]) v += `M${P(...at(u, 0))}Q${P(...at(u + 0.1, sg * wd(ue) * 0.5))} ${P(...at(ue, sg * wd(ue) * 0.86))}`;
  }
  return {
    stroke: `<path d="M${P(x, y)}${side(1)}M${P(x, y)}${side(-1)}"/><path d="${v}" stroke-opacity=".55"/>`,
    fill: `<path d="M${P(x, y)}${side(1)}C${P(...at(0.62, -0.98))} ${P(...at(0.16, -1.05))} ${P(x, y)}Z"/>`,
  };
};

// Cành lá lớn vươn ra từ góc trên-trái, lá mọc đối từng đôi
const leafBranch = () => {
  const pts = [[-14, 30], [60, 44], [130, 76], [214, 150]];
  const c = cubic(...pts);
  const parts = [{ stroke: `<path d="${cubicD(...pts)}"/>` }];
  [0.14, 0.38, 0.62, 0.84].forEach((t, i) => {
    const { p, ang } = c(t), len = 104 - i * 15;
    parts.push(ovate(p, ang - 0.82, len * 0.92, len * 0.4));
    parts.push(ovate(p, ang + 0.86, len, len * 0.42));
  });
  const end = c(1);
  parts.push(ovate(end.p, end.ang + 0.06, 62, 24));
  return compose(parts);
};

// Bụi cỏ: lá dài và mấy bông cỏ trổ hạt, mọc từ góc dưới-trái
const grass = () => {
  const ear = (pts) => {
    const c = cubic(...pts);
    const parts = [{ stroke: `<path d="${cubicD(...pts)}"/>` }];
    for (let t = 0.58, i = 0; t <= 1.001; t += 0.047, i++) {
      const { p, ang } = c(Math.min(t, 1)), sg = i % 2 ? 1 : -1;
      parts.push(leaf(p, polar(p, ang + sg * 0.5, 15 - (t - 0.58) * 11), 3.6, 0));
    }
    return compose(parts);
  };
  return compose([
    leaf([20, 346], [4, 150], 9, -0.16),
    leaf([34, 346], [72, 112], 11, 0.14),
    leaf([48, 346], [158, 196], 11, 0.34),
    leaf([28, 346], [44, 226], 7.5, 0.22),
    leaf([62, 346], [200, 276], 9.5, 0.3),
    leaf([40, 346], [112, 246], 7.5, -0.2),
    ear([[30, 346], [34, 250], [52, 152], [100, 72]]),
    ear([[44, 346], [62, 282], [114, 206], [178, 150]]),
    ear([[22, 346], [20, 282], [16, 204], [36, 132]]),
  ]);
};

// Hoa năm cánh nở, có nhuỵ chấm tròn
const PETAL = "M0,0C-22,-14 -27,-44 -9,-53C-4,-55 -1,-51 0,-47C1,-51 4,-55 9,-53C27,-44 22,-14 0,0Z";
const bloom = (x, y, r, rot0 = 0, simple = false) => {
  const sc = r / 55;
  let st = "", fl = "";
  for (let i = 0; i < 5; i++) {
    const t = `transform="translate(${f(x)} ${f(y)}) rotate(${rot0 + i * 72}) scale(${f(sc * 100) / 100})"`;
    st += `<g ${t}><path ${ne} d="${PETAL}"/>${simple ? "" : `<path ${ne} d="M0,-15V-37M-4.500,-15L-10,-33M4.500,-15L10,-33" stroke-opacity=".5"/>`}</g>`;
    fl += `<path ${t} d="${PETAL}"/>`;
  }
  let dots = "";
  if (!simple) for (let i = 0; i < 9; i++) {
    const a = (i * 40 * Math.PI) / 180;
    dots += `<circle cx="${f(x + Math.cos(a) * 12 * sc)}" cy="${f(y + Math.sin(a) * 12 * sc)}" r="${f(2 * sc)}"/>`;
  }
  st += `<circle cx="${f(x)}" cy="${f(y)}" r="${f((simple ? 9 : 6.500) * sc)}"/>${dots}`;
  return { stroke: st, fill: fl };
};
/** Nhánh nhỏ: lá chét mọc so le, đầu nhánh có thể kết quả tròn. */
const sprig = (pts, { n = 6, len = 23, berries = 0 } = {}) => {
  const c = cubic(...pts);
  const parts = [{ stroke: `<path d="${cubicD(...pts)}"/>` }];
  for (let i = 0; i < n; i++) {
    const { p, ang } = c(0.22 + (i * 0.74) / n), sg = i % 2 ? 1 : -1;
    parts.push(leaf(p, polar(p, ang + sg * 0.7, len - i), len * 0.27, 0.2 * sg));
  }
  const end = c(1);
  if (berries) {
    let b = "";
    for (let i = 0; i < berries; i++) {
      const q = polar(end.p, end.ang + (i - (berries - 1) / 2) * 0.9, 7);
      b += `<path d="M${P(...end.p)}L${P(...q)}"/><circle cx="${f(q[0])}" cy="${f(q[1])}" r="3"/>`;
    }
    parts.push({ stroke: b });
  } else parts.push(leaf(end.p, polar(end.p, end.ang, len - 4), 4, 0));
  return compose(parts);
};
// Chùm hoa nở ở góc trên-trái, toả ra hai nhánh lá và một nhánh quả
const blossom = () => compose([
  sprig([[96, 70], [142, 92], [196, 86], [252, 52]], { n: 7 }),
  sprig([[70, 100], [96, 150], [92, 204], [62, 256]], { n: 7 }),
  sprig([[104, 104], [132, 126], [150, 150], [160, 182]], { n: 3, len: 16, berries: 3 }),
  bloom(150, 30, 30, 20),
  bloom(34, 148, 26, 50),
  bloom(64, 62, 60, -8),
]);

// Dây leo uốn cuộn với hoa nhỏ, bò lên từ góc dưới-trái
const spiral = ([x, y], ang, r, dir = 1, turns = 1.2) => {
  const c0 = polar([x, y], ang + (dir * Math.PI) / 2, r);
  let d = `M${P(x, y)}`, cur = c0;
  const N = 44;
  for (let i = 1; i <= N; i++) {
    const th = (i / N) * turns * 2 * Math.PI, rr = r * (1 - 0.8 * (i / N));
    const a = ang - (dir * Math.PI) / 2 + dir * th;
    // tâm trượt dần để vòng xoắn khép vào trong mà vẫn tiếp tuyến ở điểm đầu
    cur = polar(c0, ang + (dir * Math.PI) / 2 + dir * th * 0.5, (r - rr) * 0.25);
    d += `L${P(...polar(cur, a, rr))}`;
  }
  return { stroke: `<path d="${d}"/>` };
};
const vine = () => {
  const segs = [
    [[26, 392], [92, 340], [6, 290], [46, 236]],
    [[46, 236], [80, 190], [16, 150], [52, 98]],
    [[52, 98], [70, 72], [66, 46], [50, 30]],
  ];
  const parts = segs.map((sg) => ({ stroke: `<path d="${cubicD(...sg)}"/>` }));
  const at = (i, t) => cubic(...segs[i])(t);
  parts.push(spiral(at(2, 1).p, at(2, 1).ang, 15, -1));
  // tua cuốn và lá
  [[0, 0.3, 1, 22], [0, 0.78, -1, 18], [1, 0.42, 1, 20], [1, 0.86, -1, 16], [2, 0.5, 1, 12]].forEach(([i, t, dir, r]) => {
    const { p, ang } = at(i, t);
    const out2 = ang + dir * 0.9;
    const tip = polar(p, out2, r * 1.7);
    parts.push({ stroke: `<path d="M${P(...p)}Q${P(...polar(p, ang + dir * 0.3, r))} ${P(...tip)}"/>` });
    parts.push(spiral(tip, out2 + dir * 0.5, r * 0.5, dir, 1.1));
  });
  [[0, 0.14], [0, 0.52], [0, 0.92], [1, 0.2], [1, 0.62], [2, 0.2], [2, 0.75]].forEach(([i, t], k) => {
    const { p, ang } = at(i, t), sg = k % 2 ? 1 : -1;
    parts.push(leaf(p, polar(p, ang - sg * 0.8, 24), 6.5, 0.2 * sg));
    parts.push(leaf(p, polar(p, ang + sg * 1.9, 12), 3.4, 0));
  });
  [[0, 0.56, 1, 64, 300], [1, 0.1, -1, 22, 214], [1, 0.7, 1, 78, 132]].forEach(([i, t, , fx, fy]) => {
    const { p } = at(i, t);
    parts.push({ stroke: `<path d="M${P(...p)}Q${P((p[0] + fx) / 2 + 4, (p[1] + fy) / 2 - 6)} ${P(fx, fy)}"/>` });
    parts.push(bloom(fx, fy, 16, i * 30, true));
  });
  return compose(parts);
};

for (const [name, w, h, build, corners] of [
  ["leaves", 300, 260, leafBranch, ["tl", "tr"]],
  ["grass", 240, 340, grass, ["bl", "br"]],
  ["blossom", 280, 280, blossom, ["tl", "tr"]],
  ["vine", 150, 392, vine, ["bl", "br"]],
]) {
  const g = build();
  const opt = { w: 1.2, d: 0.8, sh: 0.34 };
  out(`${name}-${corners[0]}-emboss.svg`, svg(w, h, emboss(g.stroke, { ...opt, fill: tint(g, "#b9c4a8", 0.13) })));
  out(`${name}-${corners[1]}-emboss.svg`, svg(w, h, emboss(mirror(w, g.stroke), { ...opt, fill: mirror(w, tint(g, "#b9c4a8", 0.13)) })));
}

// ───────────── Viền ảnh lồng trong thiệp (border-image, cắt 40, dùng đúng 40px) ─────────────
// Cùng ngôn ngữ với khung thiệp: góc lõm. Chỉ vàng mảnh, kèm một nét sáng để trông như ép xuống giấy.
// Đường viền cách mép ảnh 6px; ảnh được khoét góc lõm bán kính 18px (xem .matted), nên cung ở đây có bán kính 12.
{
  const d = "M17.400,1H102.600A12,12 0 0 0 119,17.400V102.600A12,12 0 0 0 102.600,119H17.400A12,12 0 0 0 1,102.600V17.400A12,12 0 0 0 17.400,1Z";
  out("photo-frame.svg", svg(120, 120,
    `<g fill="none" stroke-linejoin="round"><path d="${d}" stroke="#fff" stroke-opacity=".9" stroke-width="1" transform="translate(.7 .7)"/><path d="${d}" stroke="#a88c4e" stroke-opacity=".8" stroke-width="1"/></g>`));
}

// ───────────── Độ sần giấy dạng xám trung tính, để phủ kiểu soft-light lên giấy màu (phong bì) ─────────────
{
  const k = 1 / Math.sin((72 * Math.PI) / 180), g = Math.round(128 * k);
  out("paper-relief.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <filter id="p" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="11" stitchTiles="stitch" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="3.4" diffuseConstant="1" lighting-color="rgb(${g},${g},${g})">
        <feDistantLight azimuth="225" elevation="72"/>
      </feDiffuseLighting>
    </filter>
    <rect width="256" height="256" fill="#808080"/>
    <rect width="256" height="256" filter="url(#p)"/>
  </svg>`);
}

console.log("decor: ok");
