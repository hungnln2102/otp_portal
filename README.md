# OTP Portal — Mavryk Premium (`otp.mavrykpremium.com`)

> **Dự án độc lập:** Cổng cấp mã xác minh OTP, link xác minh Hộ gia đình Netflix và tra cứu tài khoản dành riêng cho khách hàng Mavryk Premium.
> **Tên miền hoạt động:** `otp.mavrykpremium.com`

---

## 🌟 Tính Năng Chính
1. **🅰️ Adobe Creative Cloud (2 form trượt qua lại):**
   - **Form 1: Lấy tài khoản:** Tra cứu email/pass, gói bản quyền và hạn sử dụng từ hệ thống/đơn hàng.
   - **Form 2: Nhận OTP:** Lấy mã OTP 6 số đăng nhập Adobe từ các cổng bên thứ 3.
2. **🍿 Netflix Premium (3 form trượt qua lại):**
   - **Form 1: Hộ Gia Đình:** Trích xuất link xác minh Household Netflix, hỗ trợ 1-click mở link trực tiếp.
   - **Form 2: Mã TV 6 số:** Hiển thị mã 6 số dạng PIN block to rõ để đăng nhập trên Smart TV.
   - **Form 3: OTP Đăng Nhập:** Lấy mã OTP 4–8 số từ email Netflix.
3. **UX Polish:**
   - 1-Click Copy vào clipboard.
   - Cooldown 30s chống click spam.
   - Modal FAQ hướng dẫn chi tiết từng bước.
   - Giao diện Dark Glassmorphism cao cấp, responsive 100% trên thiết bị di động.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ
```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy môi trường phát triển (Port 3005)
npm run dev

# 3. Biên dịch bản sản xuất (Production Build)
npm run build
```

---

## 🚢 Hướng Dẫn Triển Khai Lên Máy Chủ (Production Deployment)

Sử dụng script triển khai tự động `deploy.sh`:

```bash
# Phân quyền thực thi (chỉ cần chạy lần đầu)
chmod +x deploy.sh

# Chạy triển khai tiêu chuẩn (Git pull + build + sync web root + reload Nginx/PM2)
./deploy.sh

# Tùy chọn 1: Build và triển khai mã nguồn hiện tại không pull từ Git
./deploy.sh --no-pull

# Tùy chọn 2: Dọn sạch node_modules và build mới hoàn toàn
./deploy.sh --clean
```

