## [00:06] Sửa giao diện trạng thái key không tồn tại & vị trí Toast trên OTP Portal

- **Phạm vi**: Khắc phục lỗi Toast đè lên Header và nâng cấp thẻ hiển thị khi tra cứu mã đơn / mã kích hoạt Adobe không tồn tại trên `otp_portal`, giữ gọn trong 1 màn hình không cuộn.
- **Thay đổi kỹ thuật**:
  - [App.tsx](file:///e:/Project/admin_store/otp_portal/src/App.tsx): Dời vị trí Toast nổi từ `top-4` xuống `top-[68px]` (nằm bên dưới Header `h-14`) và giới hạn `max-w-[calc(100vw-2rem)]` để không che `"Hệ thống trực tuyến"` hay các nút điều hướng.
  - [AdobeAccountRecovery.tsx](file:///e:/Project/admin_store/otp_portal/src/features/adobe/components/AdobeAccountRecovery.tsx): Thay thanh báo lỗi 1 dòng bằng thẻ Glassmorphism `KHÔNG TÌM THẤY` bố cục ngang gọn đồng bộ với `AccountStatusNotFoundCard`, có nút `Nhập lại mã khác` tự động xóa và focus lại ô `#adobe-recovery-code`, đồng thời bỏ `showToast` trùng lặp khi thẻ lỗi đã hiển thị trực tiếp.
- **Kiểm tra đã chạy**:
  - `npm run build` (`tsc && vite build`) trong `otp_portal/`: đạt (`0` lỗi TypeScript, built in `14.84s`).
  - Kiểm tra mã hóa UTF-8 (không BOM, không `\ufffd`) trên 2 file đã sửa: đạt (`issues: []`).
