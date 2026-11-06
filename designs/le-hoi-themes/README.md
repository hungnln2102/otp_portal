# Bộ giao diện lễ hội (HTML + CSS + chút JS)

Mở `index.html` bằng trình duyệt, chọn dịp lễ ở thanh biểu tượng phía dưới màn hình.

## Cấu trúc
- `css/base.css` – bố cục trang, các lớp cảnh dùng chung (đèn lồng, trăng, bokeh, đèn nháy, silhouette), animation.
- `css/themes/*.css` – mỗi dịp lễ một tệp: ghi đè biến màu/phông chữ và bật các lớp cảnh.
- `js/fx.js` – hạt chuyển động trên canvas (cánh hoa lật, tuyết nhiều lớp, đom đóm, dơi vỗ cánh).
- `js/theme.js` – dock chọn theme, nội dung từng dịp lễ, đèn nháy.

## Dùng không cần JS
`<html data-theme="trung-thu">` – giá trị: tet, nguyen-tieu, gio-to, trung-thu, halloween, phu-nu, giang-sinh.
(Không có JS thì sẽ không có hạt rơi và nội dung mẫu.)

## Thêm dịp lễ
1. Sao chép một tệp trong `css/themes/`, đổi selector và các biến.
2. Bật lớp cảnh bằng `display:block` (.moon, .lanterns, .bokeh, #g-pine, #g-house, #g-dinh).
3. Thêm một mục vào mảng `T` ở js/theme.js và một cấu hình trong `CFG` ở js/fx.js.
4. Thêm `<link>` trong index.html.

Tôn trọng prefers-reduced-motion: hiệu ứng được tắt khi người dùng bật giảm chuyển động.

## Clip/GIF thật (tùy chọn)
Xem `assets/README.txt`. Thả `assets/overlay-<theme>.webm` (nền đen) để trộn lên giao diện.
