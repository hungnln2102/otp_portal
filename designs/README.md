# BỘ SƯU TẬP THIẾT KẾ GIAO DIỆN LỄ HỘI — MAVRYK OTP PORTAL

Tài liệu này lưu trữ các mẫu thiết kế giao diện toàn màn hình của **Cổng Xác Thực Web OTP** (`otp.mavryk.store/portal/verify-session`) theo chuẩn bản sắc các ngày lễ lớn trong năm, kế thừa kiến trúc từ source mẫu `le-hoi-themes` của Master.

---

## 📂 Danh mục tài nguyên

1. **`otp_portal_festivals.html`** (Bản thiết kế toàn màn hình hoàn chỉnh):
   - Chạy độc lập trên bất kỳ trình duyệt nào mà không cần web server (double click là xem được ngay).
   - Thiết kế chuẩn **Luxury Glassmorphism** ở trung tâm, loại bỏ hoàn toàn emoji hệ điều hành (`🦁`, `🌸`, `🏛️`, `🥮`) và lồng đèn CSS kẹo mút thô kệch.
   - Hỗ trợ chuyển đổi mượt mà 60fps giữa các ngày lễ:
     + 🧧 **Tết Cổ Truyền (Xuân Bính Ngọ)**: Cánh hoa mai vàng lật xoay 3D (`fx.js`), dàn đèn lồng SVG (`#lantern`) đung đưa theo gió, mái đình làng cổ thuần Việt (`#g-dinh`).
     + 🏛️ **Giỗ Tổ Hùng Vương (10/3 Âm Lịch)**: Hào khí Đông Sơn, mái đình Đền Hùng uy nghiêm, hạt bụi vàng Tiên Rồng bay lên từ mặt đất.
     + 🥮 **Tết Trung Thu (Rằm Tháng Tám)**: Mặt trăng 3D siêu thực với SVG filter vân lồi lõm (`fractalNoise`), đom đóm vàng lập lòe bay trong gió đêm, mái nhà sum vầy ấm áp (`#g-house`).
     + 🎃 **Đêm Huyền Bí Halloween**: Trăng khuyết rực lửa, đàn dơi bóng đêm chao liệng vỗ cánh.
     + 🎄 **Giáng Sinh & Năm Mới**: Bầu trời tuyết rơi lãng mạn đa tầng, rừng thông tuyết bách diệp (`#g-pine`).
     + 🌸 **Tôn Vinh Phái Đẹp (8/3 & 20/10)**: Cánh hoa hồng bay nhẹ nhàng, tông màu hồng ngọc trang nhã.

2. **`le-hoi-themes/`** (Source gốc của Master):
   - Toàn bộ source mẫu gốc do Master cung cấp gồm `index.html`, `css/base.css`, `css/themes/*.css`, `js/fx.js`, `js/theme.js`, `assets/`.

---

## 🚀 Cách sử dụng

- **Mở xem trực tiếp**: Nhấp đúp chuột vào file `otp_portal_festivals.html` để mở trong trình duyệt Chrome/Edge/Firefox.
- **Tích hợp vào React**: Sử dụng component `<FestivalBackground theme="..." />` trong `src/components/FestivalBackground.tsx`.

