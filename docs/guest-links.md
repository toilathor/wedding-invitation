# Link cá nhân hoá cho khách mời

Mỗi khách nhận một link riêng. Trang tự ghi tên khách lên phong bì và đổi cách xưng hô trong cả thiệp.
Quy tắc nằm ở `src/app/core/guest-rules.ts`; bảng dưới đây là "hợp đồng" với Google Sheet sinh link.
**Đổi mã = phải sinh lại toàn bộ link đã gửi.**

Link có tối đa **ba tham số**:

```
https://toilathor.github.io/wedding-invite/?n=Nam&x=1&p=người thương
```

| Tham số | Ý nghĩa | Bắt buộc |
|---|---|---|
| `n` | Tên gọi ("Nam", "Lan"). Với cặp vợ chồng ghi cả hai ("Hoàng Trang"). Nên ngắn để link ngắn | Có |
| `x` | **Mã gộp tối đa 3 ký tự** `[nhóm xưng hô][gia đình][tự xưng]` | Có |
| `p` | **Người phụ** đi cùng khách chính, nhập tự do như tên: `người thương`, `Mai`, `chị Lan`, `❤️`... | Không |

## Mã gộp `x`

Ba ký tự ghép liền. Có thể bỏ bớt ký tự **cuối**: `2` = `200`, `21` = `210`. Không được bỏ ký tự ở giữa:
muốn đổi tự xưng thì phải ghi đủ 3 ký tự, ví dụ `201`.

### Ký tự 1: nhóm xưng hô

**Một người** (chữ số):

| Mã | Dùng cho | Phong bì ghi | Hai bạn tự xưng | Gọi khách | Khách gọi hai bạn |
|---|---|---|---|---|---|
| 0 | Nhóm (tên ghi nguyên văn) | Các bạn lớp 12A | chúng mình | các bạn | hai bạn |
| 1 | Bạn bè, đồng nghiệp ngang tuổi | Bạn Nam | chúng mình | bạn | hai bạn |
| 2 | Anh | Anh Nam | hai em | anh | hai em |
| 3 | Chị | Chị Lan | hai em | chị | hai em |
| 4 | Em (nhỏ tuổi hơn) | Em Bi | anh chị | em | hai anh chị |
| 5 | Cô | Cô Lan | chúng cháu | cô | hai cháu |
| 6 | Chú | Chú Nam | chúng cháu | chú | hai cháu |
| 7 | Bác | Bác Nam | chúng cháu | bác | hai cháu |
| 8 | Ông | Ông Hùng | chúng cháu | ông | hai cháu |
| 9 | Bà | Bà Mai | chúng cháu | bà | hai cháu |

**Một cặp** (chữ cái, tên ghi cả hai người):

| Mã | Dùng cho | Phong bì ghi | Hai bạn tự xưng | Gọi khách |
|---|---|---|---|---|
| `A` | Anh chị (vợ chồng) | Anh chị Hoàng Trang | hai em | anh chị |
| `C` | Cô chú (vợ chồng) | Cô chú Minh Hạnh | chúng cháu | cô chú |
| `O` | Ông bà (vợ chồng) | Ông bà Hùng Mai | chúng cháu | ông bà |

Mặc định "chúng **cháu**" cho cô/chú/bác/ông/bà (gia đình ở miền Bắc). Muốn "chúng con" thì dùng ký tự 3 = 1.

**Tuỳ chỉnh** (`T`, hiếm, nên làm tay): thêm ba tham số chữ `d` = danh xưng, `s` = hai bạn tự xưng, `k` = gọi khách,
mỗi giá trị tối đa 24 ký tự, chỉ gồm chữ cái. `s` và `k` bắt buộc; thiếu một trong hai thì trang dùng dạng chung.
Ví dụ: `?n=Phước&x=T&d=Thầy&s=chúng%20em&k=thầy` → "Thầy Phước".

### Ký tự 2: gia đình

| Mã | Ý nghĩa |
|---|---|
| 0 | Gửi cho một người (hoặc một cặp) |
| 1 | Gửi cho **cả gia đình**: thêm "Gia đình" trước danh xưng, "gia đình" vào cách gọi khách. Đã gồm cả nhà nên **không có người phụ**. Không áp dụng cho nhóm (0) |

Ví dụ: `?n=Hoàng Trang&x=A1` → "**Gia đình anh chị** Hoàng Trang" (gồm anh Hoàng, chị Trang và các con).

### Ký tự 3: đổi cách tự xưng

| Mã | Hai bạn tự xưng | Khách gọi hai bạn |
|---|---|---|
| 0 | theo nhóm (bảng trên) | theo nhóm |
| 1 | chúng con | hai con |
| 2 | chúng cháu | hai cháu |
| 3 | hai em | hai em |
| 4 | chúng mình | hai bạn |
| 5 | anh chị | hai anh chị |

## Người phụ `p`

Người phụ là một người khác đi cùng khách chính, thường quen khách chính chứ không phải khách quan trọng
(mời để thể hiện sự cởi mở). Mỗi lần mời một khác nên **nhập tự do như nhập tên** chứ không đóng vào mã.
Đặt sau chữ "và":

| Link | Phong bì | Trong câu chữ |
|---|---|---|
| `?n=Nam&x=1&p=người thương` | Bạn Nam và người thương | Sự hiện diện của bạn và người thương… |
| `?n=Tén&x=2&p=❤️` | Anh Tén và ❤️ | Sự hiện diện của anh và người đi cùng… |
| `?n=Nam&x=1&p=Mai` | Bạn Nam và Mai | Sự hiện diện của bạn và Mai… |
| `?n=Nam&x=2&p=chị Lan` | Anh Nam và chị Lan | Sự hiện diện của anh và chị Lan… |

- Phong bì ghi **đúng như nhập** (chữ hoa/thường giữ nguyên). Trong câu chữ, nếu người phụ chỉ là emoji thì đọc thành "người đi cùng".
- Cho phép chữ cái (có dấu), số, khoảng trắng, dấu `.` `'` `-` và emoji; tối đa 30 ký tự.
- **Không áp dụng cho nhóm (0) và gia đình (ký tự 2 = 1)**, vì hai trường hợp đó đã gồm nhiều người.

### Ví dụ khác

| Link | Phong bì | Câu mẫu |
|---|---|---|
| `?n=Nam&x=1` | Bạn Nam | Sự hiện diện của bạn là niềm vinh dự của chúng mình! |
| `?n=Nam&x=2` | Anh Nam | Sự hiện diện của anh là niềm vinh dự của hai em! |
| `?n=Nam&x=21` | Gia đình anh Nam | Sự hiện diện của gia đình anh là niềm vinh dự của hai em! |
| `?n=Hoàng Trang&x=A` | Anh chị Hoàng Trang | Sự hiện diện của anh chị là niềm vinh dự của hai em! |
| `?n=Lan&x=5` | Cô Lan | Sự hiện diện của cô là niềm vinh dự của chúng cháu! |
| `?n=Lan&x=501` | Cô Lan | Sự hiện diện của cô là niềm vinh dự của chúng con! |
| `?n=Bi&x=4` | Em Bi | Sự hiện diện của em là niềm vinh dự của anh chị! |

## Quy tắc kiểm tra (trang tự làm, Sheet nên cũng kiểm)

- Tên `n`: chữ cái (có dấu), số, khoảng trắng, dấu `.` `'` `-`; tối đa 40 ký tự; bắt đầu bằng chữ cái.
- `x` sai (không theo bảng: tối đa 3 ký tự, ký tự 1 ngoài `0-9`, `A`, `C`, `O`, `T`; ký tự 2 khác 0/1; ký tự 3 ngoài 0 đến 5), tên hoặc `p` có ký tự lạ (`<`, `>`, `&`, `/`, `=`, `?`...) hoặc quá dài, thiếu `x`
  → trang hiện **dạng chung** (bạn, chúng mình, phong bì để trống dòng mời). Không bao giờ lỗi.
- Tên tự viết hoa chữ đầu mỗi từ ("nguyễn văn nam" → "Nguyễn Văn Nam"); riêng nhóm (0) chỉ viết hoa chữ đầu.

## Công thức Google Sheet

> **File mẫu Excel đầy đủ: `docs/mau-danh-sach-khach-moi.xlsx`.** Các ô Nhóm, Gia đình, Tự xưng là danh sách **chữ** ("Anh", "Cô chú (vợ chồng)", "chúng con"...), không cần nhớ mã; file tự đổi sang mã `x` khi tạo link. Có thể mở bằng Excel hoặc nhập vào Google Sheets. Phần dưới là bản dùng mã trực tiếp, nếu bạn thích tự dựng.

Hàng 2: A = tên, B = nhóm xưng hô (danh sách thả xuống: 0 đến 9, A, C, O), C = gia đình (để trống hoặc 1),
D = tự xưng (để trống hoặc 1 đến 5), E = người phụ (để trống hoặc gõ tự do).
`N()` biến ô trống thành 0 nên `x` luôn đủ 3 ký tự:

```
="https://toilathor.github.io/wedding-invite/?n="&ENCODEURL(A2)&"&x="&B2&N(C2)&N(D2)&IF(E2<>"","&p="&ENCODEURL(E2),"")
```

Cột kiểm tra (phát hiện sớm dòng không hợp lệ):

```
=IF(AND(LEN(A2)>0,LEN(A2)<=40,REGEXMATCH(A2,"^[\p{L}][\p{L}0-9 .'’-]*$"),REGEXMATCH(B2&"","^[0-9ACO]$"),OR(C2="",C2=0,C2=1),OR(D2="",AND(D2>=0,D2<=5)),LEN(E2)<=30,NOT(REGEXMATCH(E2&"","[<>&/\\=?#%+]")),OR(E2="",C2<>1,FALSE)),"OK","KIỂM TRA LẠI")
```

(Điều kiện cuối chỉ nhắc: nếu `C = 1` thì cột E nên để trống, vì gia đình không có người phụ; trang sẽ bỏ qua `p` trong trường hợp đó.)

## Ghi chú

- Tên khách và người phụ nằm trong link, ai nhận được link đều thấy; trang đã chặn lập chỉ mục (`noindex`) nên Google không lưu link.
- Giữ danh sách khách và cột link trong Google Sheet, không đưa vào repo (repo đang public).
- Câu chữ có token `{you}`, `{we}`, `{couple}`... nằm trong `src/app/core/wedding-data.ts` và vài component; muốn thêm câu mới chỉ cần viết token vào đó.
