
## Khôi phục deploy OTP Portal

- Sửa tuyến Nginx VPS cho /system/ từ cổng 4001 sang cổng 3005 và thêm chuyển hướng /system. Kiểm tra nginx -t và reload thành công.
- Trang chính, trang con, JavaScript và CSS công khai trả HTTP 200. Link /otp/ dẫn tới /system/ khi theo chuyển hướng.
- GitHub Actions #6, lần chạy lại thứ hai, đạt cả validate và Deploy validated commit. https://github.com/hungnln2102/otp_portal/actions/runs/45659013877

## Triển khai đầy đủ tuyến OTP Portal trên www

- Nginx VPS phục vụ trang chủ, bảng giá và các tuyến OTP qua container cổng 3005. Link cũ chuyển qua HTTPS, giữ slug và query. Bốn link mùa trỏ tới trang mùa tương ứng. Gỡ vhost tên miền phụ OTP đã thêm trong đợt này theo xác nhận của anh.
- Container trả 404 cho tài nguyên thiếu. Pipeline đợi HTTP sẵn sàng trước khi đối chiếu bundle JS/CSS, slug và chuyển hướng.
- Commit b9c9412 triển khai thành công. Bốn API đọc công khai trả 200 JSON. https://github.com/hungnln2102/otp_portal/actions/runs/45664865844

## [23:56] Sửa bố cục form Adobe trên OTP Portal vừa khít 1 màn hình không cuộn

- **Phạm vi**: Khắc phục tình trạng tràn khung và cắt mép dưới hộp tiến trình `Đang xếp hàng đổi team...` / thẻ trạng thái tài khoản trên `otp_portal` theo yêu cầu hiển thị trọn vẹn trong 1 form không cuộn trên desktop/laptop, không thay đổi logic API hay backend.
- **Thay đổi kỹ thuật**:
  - [festival-themes.css](file:///e:/Project/admin_store/otp_portal/src/styles/festival-themes.css) & [App.tsx](file:///e:/Project/admin_store/otp_portal/src/App.tsx): Gỡ `translateY` cưỡng bức của `.main-stage`, thu gọn chiều cao phần đệm `.festival-title-stage` (`min-height: clamp(84px, 11vh, 128px)`) và tinh chỉnh padding/spacing Central Card để toàn bộ nội dung vừa khít trong 1 khung màn hình (`md:h-screen md:max-h-screen md:overflow-hidden`), giữ an toàn cho mobile (`min-h-screen overflow-x-hidden`).
  - [AdobeSection.tsx](file:///e:/Project/admin_store/otp_portal/src/features/adobe/components/AdobeSection.tsx) & [AdobeAccountRecovery.tsx](file:///e:/Project/admin_store/otp_portal/src/features/adobe/components/AdobeAccountRecovery.tsx): Đưa ô nhập mã đơn/mã kích hoạt và nút `Lấy và kiểm tra tài khoản` lên 1 hàng ngang trên desktop kèm nút xóa nhanh (`X`); gộp 2 thẻ `Tài khoản` và `Mật khẩu` thành lưới 2 cột cân đối có phản hồi `Đã chép` theo `copiedKey`.
  - [AccountStatusSwitchTeamCard.tsx](file:///e:/Project/admin_store/otp_portal/src/components/account-status/AccountStatusSwitchTeamCard.tsx), [AccountStatusActiveCard.tsx](file:///e:/Project/admin_store/otp_portal/src/components/account-status/AccountStatusActiveCard.tsx), [AccountStatusNotFoundCard.tsx](file:///e:/Project/admin_store/otp_portal/src/components/account-status/AccountStatusNotFoundCard.tsx): Thiết kế lại 3 thẻ trạng thái theo bố cục ngang gọn đồng bộ, bỏ `animate-ping` kép, nén gọn khoảng trống dọc thừa để hộp tiến trình `Đang xếp hàng đổi team...` và nút hành động hiển thị đầy đủ trên 1 form.
- **Kiểm tra đã chạy**:
  - `npm run build` (`tsc && vite build`) trong `otp_portal/`: đạt (`0` lỗi TypeScript, built in `12.63s`).
  - Kiểm tra mã hóa UTF-8 (không BOM, không `\ufffd`) trên toàn bộ 7 file đã sửa: đạt (`issues: []`).
