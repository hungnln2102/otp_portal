# Daily Review - 2026-11-07

## [19:05 Asia/Bangkok] Chuyển tiêu đề lễ hội ra ngoài card OTP

- **Phạm vi**: Chuyển `currentThemeMeta.title` và `currentThemeMeta.subtitle` từ card OTP sang vùng trống phía trên card; loại bỏ hoàn toàn badge ngày lễ khỏi UI.
- **Thay đổi kỹ thuật**: `src/App.tsx:679` render hai metadata bên ngoài card; card không còn render badge/title/subtitle cũ.
- **Bảo toàn hợp đồng**: Không thay đổi state theme, `localStorage`, query string, API `/api/public/otp/*`, hoặc các form Adobe/Netflix.
- **Kiểm tra đã chạy**: `npm run build` đạt (`tsc && vite build`); `git diff --check` đạt; Playwright tại `http://localhost:3005` xác nhận heading bên ngoài card và không có console error.
- **Kiểm tra động**: Chọn `Quốc Tế Phụ Nữ 8/3` từ festival dock, heading cập nhật thành `Dành riêng cho nàng` và subtitle `Rạng rỡ theo cách của riêng bạn.`
- **Trạng thái nghiệm thu**: Đạt.

## [19:10 Asia/Bangkok] Redesign hero title stage

- **Phạm vi**: Thiết kế lại hai dòng `title` và `subtitle` trong vùng trống phía trên card thành hero title stage ngang.
- **Thay đổi kỹ thuật**: `src/App.tsx:679` dùng semantic classes `festival-title-stage`, `festival-title-stage__title`, `festival-title-stage__subtitle`; `src/styles/festival-themes.css:830` thêm typography responsive, glow theo `var(--glow)`, line accents, reveal animation và reduced-motion fallback.
- **Bảo toàn hợp đồng**: Chỉ render lại `currentThemeMeta.title` và `currentThemeMeta.subtitle`; không thêm badge, không đổi API/state/form/theme persistence.
- **Kiểm tra đã chạy**: `npm run build` đạt (`tsc && vite build`); `git diff --check` đạt; Playwright desktop và viewport `390x844` không có console error.
- **Kiểm tra động**: `?theme=quoc-te-phu-nu` hiển thị đúng `Dành riêng cho nàng` và subtitle; mobile giữ card và festival dock trong viewport.
- **Trạng thái nghiệm thu**: Đạt.

## [19:15 Asia/Bangkok] Nâng toàn bộ main stage lên

- **Phạm vi**: Dịch toàn bộ cụm hero title, OTP card và footer của `main` lên nhẹ để cân lại khoảng trống phía trên/dưới.
- **Thay đổi kỹ thuật**: `src/App.tsx:678` thêm class `main-stage`; `src/styles/festival-themes.css:830` dùng responsive `translateY` desktop `-18px` đến `-42px`, mobile cố định `-14px`.
- **Kiểm tra đã chạy**: `npm run build` đạt; `git diff --check` đạt; Playwright kiểm tra viewport desktop `1920x1080` và không có console error.
- **Trạng thái nghiệm thu**: Đạt.

## [21:12 Asia/Bangkok] Dọn sạch Git Bloat, Deduplicate Assets & Refactor Kiến Trúc OTP Portal

- **Phạm vi**:
  - Dọn dẹp phình Git trong `otp_portal`: xóa video showcase `.mp4` (5.6MB), ảnh preview `.jpg` (>6MB), 24 file HTML clone tĩnh và 76 file assets trùng lặp trong `designs/mavryk-anime-24/`.
  - Giảm số lượng file phình Git từ **219 file xuống còn 103 file sạch** (trong đó 78 file là runtime assets thiết yếu của ứng dụng trong `public/`).
  - Tái cấu trúc (refactor) toàn diện frontend: phân rã `src/App.tsx` từ 1,343 dòng xuống 253 dòng thành các module chuyên biệt: `src/constants/festivalThemes.ts`, `src/types/otp.ts`, `src/services/otpService.ts`, `src/components/OtpPinDisplay.tsx`, `src/components/FaqModal.tsx`, `src/features/adobe/components/AdobeSection.tsx`, `src/features/netflix/components/NetflixSection.tsx`, `src/features/festivals/components/FestivalStage.tsx`, `src/features/festivals/components/FestivalDock.tsx`.
  - Tận dụng `public/assets/` làm nguồn sự thật duy nhất (SSOT) cho cả web app và demo studio.
  - Xóa file `holidays-manifest.json` rơi nhầm ở thư mục gốc `admin_orderlist`.
- **Bảo toàn hợp đồng**:
  - Giữ nguyên 100% giao diện, visual, gradient, hiệu ứng canvas anime 60fps, 24 font hiển thị tiếng Việt, các form lấy tài khoản / lấy OTP Adobe và Netflix (Hộ gia đình, TV 6 số, OTP đăng nhập).
  - Không làm ảnh hưởng tới bất kỳ file nào đang làm dở của Master trong `admin_orderlist`.
- **Kiểm tra đã chạy**:
  - `npm run build` (`tsc && vite build`) đạt 100% trong 2.07s, không có lỗi hoặc warning.
  - `git status -uall -s` xác nhận loại bỏ hoàn toàn các file rác và video nặng.
- **Trạng thái nghiệm thu**: Đạt.


## [22:30 Asia/Bangkok] Triển khai logic gọi theme tự động ẩn & gỡ bỏ hoàn toàn thanh dock dưới đáy

- **Phạm vi**:
  - Gỡ bỏ hoàn toàn component thanh dock chọn mùa / chọn lễ hội (`FestivalDock`) khỏi UI của `otp_portal`. Khách hàng truy cập không còn nhìn thấy bất kỳ thanh điều khiển nào.
  - Xóa bỏ việc phụ thuộc vào tham số URL `?theme=...`. URL giữ nguyên hoàn toàn sạch (`https://otp.mavrykpremium.com/`).
  - Xây dựng module `src/services/themeService.ts` với cỗ máy lịch tự động ẩn (`HOLIDAY_CALENDAR` + `getAutoThemeByDate`): Tự động tính toán ngày giờ hiện tại theo múi giờ `Asia/Bangkok` (GMT+7) và bật đúng theme lễ hội tương ứng trong 24 themes; các ngày bình thường tự động hiển thị theme Cyber Core (`modern`).
  - Tích hợp hàm `resolvePortalTheme()`: Âm thầm gọi `GET /api/public/theme` để nhận diện cấu hình từ `admin_orderlist` khi Master cấu hình cố định theme, có cơ chế chịu lỗi ngầm (silent fallback) mượt mà về cỗ máy lịch khi backend chưa online.
- **Bảo toàn hợp đồng**:
  - Giữ nguyên 100% logic form Adobe, Netflix, modal FAQ, hiệu ứng Canvas 60fps và typography anime.
  - Không làm ảnh hưởng tới bất kỳ file nào của Master trong `admin_orderlist`.
- **Kiểm tra đã chạy**:
  - `npm run build` (`tsc && vite build`) đạt 100% trong 13.61s, 0 lỗi TypeScript, 0 warning.
  - Playwright kiểm tra trực tiếp tại `http://localhost:3005`: Chụp ảnh màn hình nghiệm thu xác nhận thanh dock dưới đáy đã biến mất 100%, visual anime Cyber Core và card OTP hiển thị thoáng đãng, sang trọng, không có lỗi runtime.
- **Trạng thái nghiệm thu**: Đạt.
