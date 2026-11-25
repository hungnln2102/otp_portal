# Nghiệm thu ngày 25/11/2026

## 22:03 · Dựng trang Bảng Giá công khai `mavrykpremium.com/price`

- **Phạm vi**: Dựng trang Bảng Giá công khai tại đường dẫn `/price` trên `otp_portal`, có Menu Bar danh mục cạnh bên (desktop sidebar + mobile pill bar) và bảng 4 cột (`Product + Hình ảnh`, `variant_name`, `desc`, `price`), đồng bộ theme glassmorphism của portal và tách biệt hoàn toàn khỏi luồng OTP `/system/*`.
- **Thay đổi kỹ thuật**:
  - Feature Bảng Giá: [PublicPricePage.tsx](../src/features/pricing/components/PublicPricePage.tsx), [PricingCategorySidebar.tsx](../src/features/pricing/components/PricingCategorySidebar.tsx), [PricingTable.tsx](../src/features/pricing/components/PricingTable.tsx), [usePublicPriceList.ts](../src/features/pricing/hooks/usePublicPriceList.ts), [pricingService.ts](../src/features/pricing/services/pricingService.ts), [pricing.ts](../src/features/pricing/types/pricing.ts).
  - Routing & Hạ tầng: [portalRoutes.ts](../src/config/portalRoutes.ts), [App.tsx](../src/App.tsx), [nginx.conf](../nginx.conf), [vite.config.ts](../vite.config.ts).
- **Kiểm thử đã chạy**:
  - `npm run build` (`tsc && vite build`): **PASS** (0 lỗi TypeScript, xuất bundle production `dist/`).
  - API nguồn `GET /api/public/price-list` (từ `admin_orderlist`): **HTTP 200**, 6 danh mục, 94 gói sản phẩm đang hoạt động, 0 rò rỉ dữ liệu giá vốn/NCC.
- **Lưu ý deploy**: Nginx container `otp_portal` đã hỗ trợ `location = /price` và `location ^~ /price/`. Trên VPS host ngoài cùng của `mavrykpremium.com`, bổ sung proxy `location ^~ /price` sang `http://127.0.0.1:3005` để mở trực tiếp `https://mavrykpremium.com/price`.

## 22:19 · Gộp Product + Variant `--xm`, thêm cột Thời hạn và Khuyến mãi cho `/price`

- **Phạm vi**: Cập nhật [PricingTable.tsx](../src/features/pricing/components/PricingTable.tsx), [pricing.ts](../src/features/pricing/types/pricing.ts), [usePublicPriceList.ts](../src/features/pricing/hooks/usePublicPriceList.ts) và [vite.config.ts](../vite.config.ts) để phục vụ trực tiếp `/price` ở local, gộp ô `Product + Hình ảnh` theo sản phẩm, gộp ô `variant_name` theo tiền tố trước `--xm`, hiển thị cột `Thời hạn` (số tháng) và tách riêng 2 cột `Price` / `Khuyến mãi`.
- **Kiểm thử đã chạy**:
  - `npm run build` (`tsc && vite build`): **PASS**.
  - Kiểm tra trực tiếp `http://localhost:3005/price` (HTTP 200) và `http://localhost:3005/api/public/price-list` (HTTP 200, dữ liệu Adobe/Canva/Netflix gom nhóm đúng thứ tự).

## 23:28 · Xây dựng trang chủ `mavrykpremium.com/` (2 nút Hệ Thống & Bảng Giá) và hỗ trợ `/system` không cần slug

- **Phạm vi**: Thêm trang chủ Portal Landing Hub tại `/` trên `otp_portal` với 2 nút điều hướng chính (**Hệ Thống** → `/system/adobe-otp`, **Bảng Giá** → `/price`), hỗ trợ truy cập trực tiếp `/system` không cần trailing slash ở cả Vite dev lẫn Nginx production, và cho phép bấm logo **MAVRYK PREMIUM** hoặc nút **Trang Chủ** trên Header để quay về `/`.
- **Thay đổi kỹ thuật**:
  - Định tuyến 3 chế độ (`home` | `system` | `price`): [portalRoutes.ts](../src/config/portalRoutes.ts)
  - Giao diện trang chủ: [PortalHomePage.tsx](../src/features/home/components/PortalHomePage.tsx), [index.ts](../src/features/home/index.ts)
  - Tích hợp Header & luồng hiển thị: [App.tsx](../src/App.tsx)
  - Hạ tầng Dev & Nginx: [vite.config.ts](../vite.config.ts) (rewrite `/`, `/system`, `/price`, `/price/`), [nginx.conf](../nginx.conf) (đổi `location = /` từ `301 /system/` sang `try_files /system/index.html =404` kèm header chống cache).
- **Kiểm thử đã chạy**:
  - `npm run build` (`tsc && vite build`): **PASS** (0 lỗi TypeScript, build `dist/` trong 2.41s).
  - Kiểm tra HTTP trực tiếp trên `http://localhost:3005`: `/` → `HTTP 200`, `/system` → `HTTP 200`, `/system/` → `HTTP 200`, `/price` → `HTTP 200`.
  - Kiểm thử trình duyệt bằng Playwright MCP:
    - Mở `http://localhost:3005/` → URL giữ nguyên `/`, tiêu đề `Mavryk Premium — Hệ Thống & Bảng Giá Chính Thức`, hiển thị đủ 2 thẻ nút **Hệ Thống** và **Bảng Giá**.
    - Bấm **Hệ Thống** → chuyển SPA sang `http://localhost:3005/system/adobe-otp`.
    - Bấm **Trang Chủ** → quay lại `http://localhost:3005/`.
    - Bấm **Bảng Giá** → chuyển SPA sang `http://localhost:3005/price`.
    - Mở trực tiếp `http://localhost:3005/system` → tự động vào `http://localhost:3005/system/adobe-otp`.
- **Lưu ý deploy**:
  - `chrome_devtools` MCP không kết nối được do máy local chưa bật Chrome remote debugging (`DevToolsActivePort` ENOENT); toàn bộ kiểm thử giao diện và điều hướng đã được xác minh trực tiếp qua Playwright MCP.
  - Trên VPS host ngoài cùng của `mavrykpremium.com`, đảm bảo proxy đường dẫn `/` về `http://127.0.0.1:3005` để Nginx của container `otp_portal` phục vụ trang chủ mới.
