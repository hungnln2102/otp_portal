# Báo cáo rà soát hằng ngày - 2026-11-12

## [21:55 Asia/Bangkok] Triển khai Production OTP Portal

- **Phạm vi**: Đồng bộ bản build production mới nhất từ local `E:\Project\admin_store\otp_portal` (commit `c9134d80`) lên VPS (`vps` — `180.93.43.169`) tại `/var/www/otp_portal/dist`.
- **Nguyên nhân triển khai**: Cập nhật bộ 3 form trạng thái tài khoản Adobe (*active*, *inactive*, *not_found*), giao diện luồng Fix Team, bổ sung themes lễ hội Anime Rig và chuẩn hóa slot registry.
- **Thay đổi kỹ thuật**:
  - Sao lưu bản build đang chạy trên VPS: `/var/www/otp_portal/.dist-backup-20261112-213450`.
  - Biên dịch build production cục bộ bằng `tsc && vite build`: hoàn thành 100% trong `12.42s`.
  - Chuyển giao gói bundle tĩnh (`index-B8oC2m2u.js`, `index-D09SOTM-.css`, assets) sang `/var/www/otp_portal/dist/`.
  - Cập nhật quyền sở hữu webroot `www-data:www-data` và reload Nginx (0 downtime).
- **Kiểm tra đã chạy**:
  - Kiểm tra cú pháp Nginx: `sudo nginx -t` thành công.
  - Route production: `https://www.mavrykpremium.com/otp/` trả về `HTTP/2 200 OK`.
  - Static bundles: `https://www.mavrykpremium.com/otp/assets/index-B8oC2m2u.js` và `https://www.mavrykpremium.com/otp/assets/index-D09SOTM-.css` đều trả về `HTTP/2 200 OK`.
  - Trình duyệt tải đúng cấu trúc HTML mới và hiệu ứng Anime hoạt động mượt mà.
- **Trạng thái nghiệm thu**: ĐẠT 100% trên môi trường Production.
