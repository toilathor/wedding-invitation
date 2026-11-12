/**
 * Quy tắc tên khách + xưng hô cho link cá nhân hoá.
 *
 *   n = tên gọi                       ("Nam")                      bắt buộc
 *   x = mã gộp tối đa 3 ký tự          [nhóm xưng hô][gia đình][tự xưng], phần thiếu coi là 0
 *   p = người đi cùng (người phụ)      nhập tự do như tên: "người thương", "Mai", "❤️"   không bắt buộc
 *
 *   ?n=Nam&x=2                     → "Anh Nam"
 *   ?n=Nam&x=1&p=người%20thương    → "Bạn Nam và người thương"
 *   ?n=Tén&x=2&p=❤️                → "Anh Tén và ❤️"
 *   ?n=Hoàng%20Trang&x=A1          → "Gia đình anh chị Hoàng Trang"   (A = cặp anh chị, chữ số 2 = 1 là gia đình)
 *   ?n=Lan&x=501                   → "Cô Lan", tự xưng "chúng con" thay vì mặc định "chúng cháu"
 *   ?n=Các%20bạn%20lớp%2012A&x=0   → nhóm
 *   ?n=Phước&x=T&d=Thầy&s=chúng%20em&k=thầy   → tuỳ chỉnh (chữ T, kèm d, s, k)
 *
 * Người phụ (`p`) là một người khác đi cùng khách chính, thường có quan hệ với khách chính; mỗi lần mời mỗi khác
 * nên nhập thẳng vào link chứ không đóng khung vào mã. Không áp dụng cho nhóm và cho gia đình (đã gồm cả nhà).
 *
 * BẢNG MÃ LÀ "HỢP ĐỒNG" với Google Sheet sinh link (xem docs/guest-links.md). Đổi mã = phải sinh lại toàn bộ link.
 * Mã lạ, tên chứa ký tự lạ, hoặc tuỳ chỉnh thiếu phần bắt buộc → trả về khách mặc định (trang như chưa cá nhân hoá).
 */

export interface Guest {
  /** Tên gọi đã chuẩn hoá ("Nam"). Rỗng nếu link không có tên. */
  name: string;
  /** Danh xưng + tên (+ "và người phụ"), hiển thị trên phong bì ("Bạn Nam và người thương"). */
  display: string;
  /** Người phụ đúng như nhập (có thể là emoji). Đã nằm trong `display`. Rỗng nếu không có. */
  companion: string;
  you: string; // gọi khách: "anh" (có thể là "gia đình anh" hoặc "anh và người thương")
  youOne: string; // gọi khách ở cấp cá nhân, không kèm "gia đình"/người phụ: dùng cho nhãn ô nhập tên
  youPl: string; // gọi khách ở câu số nhiều: "các bạn" (cá nhân thì = you)
  we: string; // hai bạn tự xưng: "hai em"
  weFormal: string; // tự xưng trang trọng: "chúng tôi" (mặc định) / như we
  couple: string; // khách gọi hai bạn: "hai em"
  nhe: string; // tiểu từ cuối câu mời: "nhé" / "ạ"
  nha: string; // tiểu từ cuối câu cảm ơn: "nha" / "nhé" / "ạ"
  smile: string; // " ^^" chỉ dùng với bạn bè
  personal: boolean;
}

export const DEFAULT_GUEST: Guest = {
  name: "",
  display: "",
  companion: "",
  you: "bạn",
  youOne: "bạn",
  youPl: "các bạn",
  we: "chúng mình",
  weFormal: "chúng tôi",
  couple: "hai bạn",
  nhe: "nhé",
  nha: "nha",
  smile: " ^^",
  personal: false,
};

interface GroupRule {
  title: string; // danh xưng viết hoa đầu: "Anh"
  you: string;
  youPl?: string;
  we: string;
  weFormal?: string;
  couple: string;
  nhe: string;
  nha: string;
  smile: string;
}

const ELDER = { we: "chúng cháu", couple: "hai cháu", nhe: "ạ", nha: "ạ", smile: "" } as const;

/** Ký tự đầu của `x`: nhóm xưng hô. Chữ số = một người; chữ cái A/C/O = một cặp. */
export const GROUPS: Record<string, GroupRule> = {
  "0": { title: "", you: "các bạn", we: "chúng mình", weFormal: "chúng tôi", couple: "hai bạn", nhe: "nhé", nha: "nha", smile: " ^^" }, // nhóm
  "1": { title: "Bạn", you: "bạn", youPl: "các bạn", we: "chúng mình", weFormal: "chúng tôi", couple: "hai bạn", nhe: "nhé", nha: "nha", smile: " ^^" },
  "2": { title: "Anh", you: "anh", we: "hai em", couple: "hai em", nhe: "nhé", nha: "nhé", smile: "" },
  "3": { title: "Chị", you: "chị", we: "hai em", couple: "hai em", nhe: "nhé", nha: "nhé", smile: "" },
  "4": { title: "Em", you: "em", we: "anh chị", couple: "hai anh chị", nhe: "nhé", nha: "nhé", smile: "" },
  "5": { title: "Cô", you: "cô", ...ELDER },
  "6": { title: "Chú", you: "chú", ...ELDER },
  "7": { title: "Bác", you: "bác", ...ELDER },
  "8": { title: "Ông", you: "ông", ...ELDER },
  "9": { title: "Bà", you: "bà", ...ELDER },
  // Một cặp vợ chồng: tên ghi cả hai ("Hoàng Trang" → "Anh chị Hoàng Trang").
  A: { title: "Anh chị", you: "anh chị", we: "hai em", couple: "hai em", nhe: "nhé", nha: "nhé", smile: "" },
  C: { title: "Cô chú", you: "cô chú", ...ELDER },
  O: { title: "Ông bà", you: "ông bà", ...ELDER },
};
/** Ký tự đầu `T` = tuỳ chỉnh (kèm d, s, k). */
export const CUSTOM_CODE = "T";

/** Ký tự thứ ba của `x`: đổi cách tự xưng (0 = mặc định của nhóm). */
export const SELF_OVERRIDES: Record<number, { we: string; couple: string }> = {
  1: { we: "chúng con", couple: "hai con" },
  2: { we: "chúng cháu", couple: "hai cháu" },
  3: { we: "hai em", couple: "hai em" },
  4: { we: "chúng mình", couple: "hai bạn" },
  5: { we: "anh chị", couple: "hai anh chị" },
};

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}0-9\s.'’-]{0,39}$/u;
const WORD_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{0,23}$/u;
/** Người phụ: chữ, số, khoảng trắng, dấu nối và emoji (kể cả ❤️ = U+2764 + U+FE0F). Tối đa 30 ký tự. */
const COMPANION_RE = /^[\p{L}\p{M}\p{Extended_Pictographic}][\p{L}\p{M}\p{N}\p{Extended_Pictographic}‍️\s.'’-]{0,29}$/u;

const cap = (s: string) => (s ? s.charAt(0).toLocaleUpperCase("vi") + s.slice(1) : s);

function cleanName(raw: string | null, titleCase: boolean, max = 40): string | null {
  if (raw == null) return "";
  const v = raw.normalize("NFC").replace(/\s+/g, " ").trim();
  if (!v) return "";
  if (v.length > max || !NAME_RE.test(v)) return null; // null = không hợp lệ
  // Tên người: viết hoa chữ đầu mỗi từ ("lê quang thọ" → "Lê Quang Thọ"). Nhóm: chỉ viết hoa chữ đầu câu.
  return titleCase
    ? v.replace(/(^|\s)(\p{L})/gu, (_, sp, ch) => sp + ch.toLocaleUpperCase("vi"))
    : cap(v);
}

function cleanWord(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("vi");
  return v && WORD_RE.test(v) ? v : null;
}

/** Người phụ giữ nguyên chữ hoa/thường người nhập ("người thương", "Mai"). null = không hợp lệ. */
function cleanCompanion(raw: string | null): string | null {
  if (raw == null) return "";
  const v = raw.normalize("NFC").replace(/\s+/g, " ").trim();
  if (!v) return "";
  return v.length <= 30 && COMPANION_RE.test(v) ? v : null;
}

/** Đọc `location.search`. Bất kỳ giá trị nào không hợp lệ → khách mặc định. */
export function parseGuest(search: string): Guest {
  const q = new URLSearchParams(search);
  if (!q.has("x") && !q.has("n")) return DEFAULT_GUEST;

  // x = [nhóm][gia đình][tự xưng]; thiếu ký tự cuối coi là 0, không được bỏ trống ở giữa nên không mơ hồ.
  const xRaw = (q.get("x") ?? "").toUpperCase();
  if (!/^[0-9TACO](?:[01][0-5]?)?$/.test(xRaw)) return DEFAULT_GUEST;
  const code = xRaw.padEnd(3, "0");
  const groupKey = code[0];
  const custom = groupKey === CUSTOM_CODE;
  const isGroup = groupKey === "0";
  const familyFlag = code[1] === "1";
  const selfCode = Number(code[2]);

  const name = cleanName(q.get("n"), !isGroup);
  if (name === null) return DEFAULT_GUEST;
  const companionRaw = cleanCompanion(q.get("p"));
  if (companionRaw === null) return DEFAULT_GUEST;

  let title: string;
  let you: string;
  let youPl: string;
  let we: string;
  let weFormal: string;
  let couple: string;
  let nhe = "nhé";
  let nha = "nhé";
  let smile = "";

  if (custom) {
    const d = cleanWord(q.get("d")); // danh xưng
    const s = cleanWord(q.get("s")); // tự xưng
    const k = cleanWord(q.get("k")); // gọi khách
    if (!k || !s) return DEFAULT_GUEST;
    title = d ? cap(d) : "";
    you = youPl = k;
    we = weFormal = s;
    couple = "hai bạn";
  } else {
    const r = GROUPS[groupKey];
    if (!r) return DEFAULT_GUEST;
    title = r.title;
    you = r.you;
    youPl = r.youPl ?? r.you;
    we = r.we;
    weFormal = r.weFormal ?? r.we;
    couple = r.couple;
    nhe = r.nhe;
    nha = r.nha;
    smile = r.smile;
  }

  if (selfCode !== 0) {
    const o = SELF_OVERRIDES[selfCode];
    we = weFormal = o.we;
    couple = o.couple;
  }

  const youOne = isGroup ? "bạn" : you;
  const family = familyFlag && !isGroup;
  let display: string;
  if (family) {
    display = `Gia đình ${title ? title.toLocaleLowerCase("vi") + " " : ""}${name}`.trim();
    you = `gia đình ${you}`;
    youPl = `gia đình ${youPl}`;
  } else {
    display = isGroup ? name : `${title} ${name}`.trim();
  }
  // Có danh xưng nhưng chưa có tên → không in danh xưng lẻ loi lên phong bì.
  if (!name) display = "";

  // Người phụ: ghi đúng như nhập trên phong bì; trong câu chữ, nếu chỉ là emoji thì đọc thành "người đi cùng".
  let companion = "";
  if (companionRaw && !family && !isGroup) {
    companion = companionRaw;
    const spoken = /\p{L}/u.test(companionRaw) ? companionRaw : "người đi cùng";
    if (display) display = `${display} và ${companionRaw}`;
    you = `${you} và ${spoken}`;
    youPl = you;
  }

  return { name, display, companion, you, youOne, youPl, we, weFormal, couple, nhe, nha, smile, personal: true };
}

/** Thay {you} {You} {youOne} {YouOne} {we} {We} {weFormal} {WeFormal} {youPl} {couple} {nhe} {nha} {smile} {name} {display} {companion}. */
export function formatForGuest(text: string, g: Guest): string {
  return text.replace(/\{(\w+)\}/g, (match, token: string) => {
    const key = token.charAt(0).toLowerCase() + token.slice(1);
    const value = (g as unknown as Record<string, unknown>)[key];
    if (typeof value !== "string") return match;
    return token.charAt(0) !== key.charAt(0) ? cap(value) : value;
  });
}

/** Áp {token} lên mọi chuỗi trong một cấu trúc dữ liệu (không đụng tới chuỗi không có token). */
export function personalizeDeep<T>(data: T, g: Guest): T {
  if (typeof data === "string") return (data.includes("{") ? formatForGuest(data, g) : data) as unknown as T;
  if (Array.isArray(data)) return data.map((v) => personalizeDeep(v, g)) as unknown as T;
  if (data && typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) out[k] = personalizeDeep(v, g);
    return out as T;
  }
  return data;
}
