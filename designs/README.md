# BỘ SƯU TẬP THIẾT KẾ GIAO DIỆN LỄ HỘI — MAVRYK OTP PORTAL

Tài liệu này lưu trữ các mẫu thiết kế giao diện toàn màn hình của **Cổng Xác Thực Web OTP** (`otp.mavryk.store/portal/verify-session`) theo chuẩn bản sắc các ngày lễ lớn trong năm, kế thừa kiến trúc từ source mẫu `mavryk-anime-24-source.zip` và `le-hoi-themes` của Master.

---

## 📁 Danh mục tài nguyên

### 1. 🌟 `mavryk-anime-24/` (Bộ 24 Source Themes Anime Độc Quyền của Master)
- **Review Studio Toàn Diện**: Mở trực tiếp [index.html](file:///e:/Project/admin_store/otp_portal/designs/mavryk-anime-24/index.html) bằng Chrome / Edge để duyệt toàn bộ 24 chủ đề anime, thử nghiệm phím điều hướng, tạm dừng animation, ẩn form để xem minh họa toàn màn hình và xuất ghi chú review dạng JSON.
- **24 Trang Độc Lập**: Thư mục `holidays/01.html` đến `24.html` cho phép mở từng trang riêng lẻ.
- **Tài Nguyên WebP & WOFF**:
  + 24 tranh anime độc lập: `assets/holidays/01.webp` đến `24.webp` (không đè text/form, nhân vật giữ nguyên 2 bên sườn).
  + 24 font tiêu đề hiển thị: `assets/fonts/display-01.woff` đến `display-24.woff` hỗ trợ đầy đủ 100% tiếng Việt có dấu.
  + Bộ hiệu ứng Canvas 60fps đa cảnh: `holidays-effects.js` và `anime-rig.js`.

### 2. ⚡ Tích hợp trực tiếp lên ứng dụng Web React (`otp_portal`)
Toàn bộ 24 chủ đề Anime đã được kết nối trực tiếp vào React:
- **Ảnh nền Anime WebP**: Tự động chuyển cảnh mượt mà qua component `<FestivalBackground theme={theme} />` trong `src/components/FestivalBackground.tsx`, lấy tài nguyên từ `/assets/holidays/`.
- **Lớp Phủ Shade Tương Phản**: Thiết kế gradient thông minh giữ nhân vật 2 bên sườn sáng đẹp trong khi form OTP ở giữa luôn rõ nét, dễ đọc.
- **24 Font Chữ Nghệ Thuật**: Khai báo `@font-face` trong `src/styles/festival-themes.css`, tự động áp dụng biến `--display` (`Mavryk Display 01` đến `24`) cho từng ngày lễ.
- **Canvas Hiệu Ứng 60fps**: Chạy trực tiếp `HolidayEffects.Effects` từ `/scripts/holidays-effects.js`, tạo hiệu ứng sống động riêng biệt cho từng lễ hội (pháo hoa, cá chép hóa rồng, hoa mai xoay lật 3D, hoa sen, hoa đăng, sao băng, tuyết rơi, xung matrix...).

### 3. `otp_portal_festivals.html` & `le-hoi-themes/` (Bản demo lịch sử)
- Bộ demo HTML tĩnh thế hệ trước dùng SVG và CSS gradient.

---

## 🚀 Cách sử dụng & Kiểm tra

- **Mở Review Studio**: Nhấp đúp chuột vào [designs/mavryk-anime-24/index.html](file:///e:/Project/admin_store/otp_portal/designs/mavryk-anime-24/index.html).
- **Chạy Web Dev Server**:
  ```bash
  cd e:\Project\admin_store\otp_portal
  npm run dev
  ```
  Truy cập `http://localhost:5173` để trải nghiệm trực tiếp 24 chủ đề trên giao diện thật.
