# Báo cáo rà soát hằng ngày - 2026-11-10

## [01:19 Asia/Bangkok] Triển khai production OTP Portal

- **Phạm vi**: Pull `main` tại local `E:\Project\admin_store\otp_portal`, cài dependency, build production và đồng bộ bản build lên VPS `vps` tại `/var/www/otp_portal/dist`.
- **Nguyên nhân triển khai**: VPS chỉ chứa web root tĩnh, không có `.git`; không thể chạy `git pull` hoặc `./deploy.sh` trực tiếp trong `/var/www/otp_portal`.
- **Thay đổi kỹ thuật**: `git pull --ff-only origin main` báo `Already up to date`; `npm ci --prefer-offline --no-audit`; `npm run build` đạt; upload theo release tạm, giữ backup `/var/www/otp_portal/.dist-backup-20261110-011830`, thay thế `dist` và reload Nginx.
- **Kiểm tra đã chạy**: `nginx -t` thành công; `https://www.mavrykpremium.com/otp/` trả `200 OK`; bundle mới `assets/index-DrHy0JSx.js` và `assets/index-CkqHd56j.css` đều trả `200 OK`; HTML production tham chiếu đúng hai bundle mới.
- **Điều kiện cần xử lý**: `https://otp.mavrykpremium.com` chưa có virtual host trên VPS; route production hiện tại là `https://www.mavrykpremium.com/otp/`. `www.mavrykpremium.com/` trả `502` do đang proxy tới upstream `127.0.0.1:4001`, không liên quan đến static route `/otp/`.
- **Trạng thái nghiệm thu**: Đạt đối với route `/otp/`; chưa nghiệm thu domain riêng `otp.mavrykpremium.com` vì DNS/vhost chưa được cấu hình.