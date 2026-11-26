
## Khôi phục deploy OTP Portal

- Sửa tuyến Nginx VPS cho /system/ từ cổng 4001 sang cổng 3005 và thêm chuyển hướng /system. Kiểm tra nginx -t và reload thành công.
- Trang chính, trang con, JavaScript và CSS công khai trả HTTP 200. Link /otp/ dẫn tới /system/ khi theo chuyển hướng.
- GitHub Actions #6, lần chạy lại thứ hai, đạt cả validate và Deploy validated commit. https://github.com/hungnln2102/otp_portal/actions/runs/45659013877

## Triển khai đầy đủ tuyến OTP Portal trên www

- Nginx VPS phục vụ trang chủ, bảng giá và các tuyến OTP qua container cổng 3005. Link cũ chuyển qua HTTPS, giữ slug và query. Bốn link mùa trỏ tới trang mùa tương ứng. Gỡ vhost tên miền phụ OTP đã thêm trong đợt này theo xác nhận của anh.
- Container trả 404 cho tài nguyên thiếu. Pipeline đợi HTTP sẵn sàng trước khi đối chiếu bundle JS/CSS, slug và chuyển hướng.
- Commit b9c9412 triển khai thành công. Bốn API đọc công khai trả 200 JSON. https://github.com/hungnln2102/otp_portal/actions/runs/45664865844
