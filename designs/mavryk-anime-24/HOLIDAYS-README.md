# Mavryk — 24 giao diện anime

## Mở và review
Giải nén, mở index.html bằng Chrome / Edge / Safari. Không cần cài Node hay build.
Chọn thẻ 01–24, lọc theo mùa, dùng mũi tên trước/sau, hoặc mở riêng holidays/01.html đến holidays/24.html.
Nút Tạm dừng ngừng hiệu ứng. Nút Ẩn form cho xem rõ minh họa.
Thanh Hiệu ứng chỉnh cường độ. Người dùng có cài đặt giảm chuyển động sẽ thấy cảnh tạm dừng khi mở.

Chọn Chưa review / Chốt mẫu / Cần chỉnh và ghi chú. Ghi chú được lưu trong localStorage trên trình duyệt và origin hiện tại, không đồng bộ thiết bị. Nút Xuất ghi chú review tạo JSON chứa đủ 24 mục để gửi lại khi cần sửa.
Khi mở file trực tiếp, một số trình duyệt có thể tách localStorage theo từng file; nên review tại index.html hoặc trên cùng website để giữ ghi chú cùng nhau.

Form Adobe / Netflix là HTML thật, hỗ trợ đổi tab và kiểm tra định dạng email. Đây là demo thiết kế, chưa kết nối API OTP hoặc tài khoản. Email không được gửi và không được lưu bởi demo.

## Xuất hình và video
exports/previews/01.jpg … 24.jpg là ảnh tham khảo từng mẫu.
exports/mavryk-anime-24-overview.jpg là ảnh tổng quan.
exports/mavryk-anime-24-showcase.mp4 là video 72 giây, 1280 × 776, 30 fps; mỗi mẫu 3 giây. Video dùng cùng bộ hiệu ứng Canvas với form vẽ mẫu; bản HTML là bản chính xác để review bố cục và thao tác. Video không chứa âm thanh.

## Cấu trúc
- index.html: trang review chung.
- holidays/01.html … 24.html: 24 trang riêng.
- holidays.css: bố cục, màu, font, form, responsive, chuyển động CSS của biểu tượng.
- holidays-data.js và holidays-manifest.json: tên, ngày lễ, tiêu đề, bảng màu, chủ đề animation, đường dẫn ảnh.
- holidays.js: chọn giao diện, form, trạng thái review, pause và intensity.
- holidays-effects.js: từng hiệu ứng Canvas và biểu tượng SVG.
- anime-rig.js: bộ quỹ đạo pháo hoa và renderer anime trước. Bộ 24 chỉ tái sử dụng phương thức fireworks và light, không cần sprite cắt nhân vật.
- assets/holidays/01.webp … 24.webp: 24 minh họa anime độc lập, nén WebP, không có form/chữ bên trong.
- assets/fonts chứa font Noto cho form và 24 font tiêu đề có đủ dấu tiếng Việt. Các file WOFF và giấy phép đi cùng mã nguồn để mở offline.
- ART-PROMPTS.md: mô tả sáng tạo của 24 minh họa.

## Phân lớp và chuyển động
1. Lớp minh họa anime tĩnh: nhân vật nằm nguyên vẹn trong tranh bối cảnh, không cắt tay/đầu/tóc, không rig hoặc làm biến dạng.
2. Lớp phủ tạo tương phản: .shade.
3. Lớp Canvas #effects đặt chi tiết theo tọa độ của tranh. Dơi có màng cánh và khớp cánh riêng. Hoa đăng, gợn và phản chiếu di chuyển cùng nhau trên mặt nước.
4. Mẫu 01 dùng hai biểu tượng SVG đồng hồ và sao. Các mẫu 02–24 dùng hình vẽ, chuyển động và ánh sáng đặt trong cảnh.
5. .stage-content: tiêu đề và form HTML/CSS độc lập, luôn nằm trên cùng.

Đây là animation HTML/CSS/Canvas, không phải dự án Spine hay video AI. Các chi tiết đã vẽ trong tranh nền không phải layer riêng; muốn di chuyển một vật cụ thể trong tranh, cần cung cấp PNG tách vật đó rồi ghép vào .decor. Cách này giữ nguyên hình nhân vật và tránh lệch khớp.

## Chỉnh nhanh
Đổi tiêu đề, màu hoặc ảnh trong holidays-data.js; đổi phong cách form trong holidays.css.
Thêm PNG/SVG mới vào .decor; chỉnh @keyframes decor-sway để thay nhịp, góc và điểm neo.
Trong holidays-effects.js, chọn hàm theo số mẫu trong scenes để chỉnh tọa độ, tốc độ và biên độ. Tọa độ dùng khung 1600 × 900, thời gian tính theo giây.
Trong anime-rig.js → Scene.fireworks, sửa shells để đổi thời điểm, vị trí, màu, vận tốc và dạng chùm. drag là lực cản, gravity là độ rơi, life là thời gian sáng, tail là lịch sử vệt lửa.
Pháo hoa dùng quỹ đạo theo thời gian tuyệt đối, không phụ thuộc tích lũy FPS. Phần sáng là phép cộng lighter với nét mảnh và bloom mềm.

## Triển khai
Đưa toàn bộ thư mục lên static hosting và giữ nguyên đường dẫn tương đối. Không cần build hay backend cho bản review.
Toàn bộ 24 mẫu dùng chung CSS/JS để chỉnh đồng bộ; mỗi trang riêng chọn đúng theme bằng data-theme trên body.
Mỗi cảnh đặt chuyển động theo bố cục tranh. Các cảnh có cùng loại vật thể dùng chung cách vẽ, với vị trí, nhịp và màu riêng.

## Font tiêu đề theo từng mẫu

| Mẫu | Font | Sắc thái |
|---|---|---|
| 01 · Tết Dương Lịch | [Playfair Display](https://github.com/google/fonts/tree/main/ofl/playfairdisplay) · 550 | Serif thanh lịch cho đêm đếm ngược |
| 02 · Ông Công Ông Táo | [Pattaya](https://github.com/google/fonts/tree/main/ofl/pattaya) · 400 | Nét bút tròn cho chuyện cá chép hóa rồng |
| 03 · Tết Nguyên Đán | [Dancing Script](https://github.com/google/fonts/tree/main/ofl/dancingscript) · 600 | Chữ viết tay rộn ràng như thiệp Tết |
| 04 · Valentine | [Great Vibes](https://github.com/google/fonts/tree/main/ofl/greatvibes) · 400 | Nét nối mềm như thư tình |
| 05 · Tết Nguyên Tiêu | [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond) · 600 | Serif nghiêng nhẹ cho đêm trăng |
| 06 · Quốc Tế Phụ Nữ | [Prata](https://github.com/google/fonts/tree/main/ofl/prata) · 400 | Serif tương phản nét thanh đậm như bìa tạp chí |
| 07 · Tết Hàn Thực | [Lora](https://github.com/google/fonts/tree/main/ofl/lora) · 500 | Nét cong dịu cho không khí gia đình |
| 08 · Giỗ Tổ Hùng Vương | [Alegreya](https://github.com/google/fonts/tree/main/ofl/alegreya) · 600 | Serif mang chất sách cổ và lễ nghi |
| 09 · Thống Nhất Non Sông | [Roboto Slab](https://github.com/google/fonts/tree/main/apache/robotoslab) · 550 | Chân vuông vững cho tiêu đề kỷ niệm |
| 10 · Quốc Tế Lao Động | [Barlow Condensed](https://github.com/google/fonts/tree/main/ofl/barlowcondensed) · 600 | Nét thẳng, gọn, có nhịp công nghiệp |
| 11 · Đại Lễ Phật Đản | [Spectral](https://github.com/google/fonts/tree/main/ofl/spectral) · 500 | Serif cân đối, tiết chế cho cảnh chùa |
| 12 · Quốc Tế Thiếu Nhi | [Baloo 2](https://github.com/google/fonts/tree/main/ofl/baloo2) · 600 | Nét tròn vui, hợp bóng bay và tuổi thơ |
| 13 · Tết Đoan Ngọ | [Merienda](https://github.com/google/fonts/tree/main/ofl/merienda) · 500 | Nét thủ công cho dịp truyền thống |
| 14 · Ngày Gia Đình Việt Nam | [Nunito](https://github.com/google/fonts/tree/main/ofl/nunito) · 700 | Chữ tròn và ấm cho ngày gia đình |
| 15 · Lễ Thất Tịch | [Birthstone](https://github.com/google/fonts/tree/main/ofl/birthstone) · 400 | Nét bay dài cho cảnh sao băng |
| 16 · Vu Lan Báo Hiếu | [Crimson Pro](https://github.com/google/fonts/tree/main/ofl/crimsonpro) · 500 | Serif cổ điển cho lời tri ân |
| 17 · Đại Lễ Quốc Khánh | [Oswald](https://github.com/google/fonts/tree/main/ofl/oswald) · 500 | Dáng đứng và gọn cho tiêu đề Quốc Khánh |
| 18 · Tết Trung Thu | [Charm](https://github.com/google/fonts/tree/main/ofl/charm) · 400 | Nét thư pháp mềm cho đêm hội trăng rằm |
| 19 · Phụ Nữ Việt Nam | [Italianno](https://github.com/google/fonts/tree/main/ofl/italianno) · 400 | Chữ viết tay thanh và uyển chuyển |
| 20 · Halloween | [Grenze Gotisch](https://github.com/google/fonts/tree/main/ofl/grenzegotisch) · 500 | Chữ Gothic có góc nhọn cho Halloween |
| 21 · Nhà Giáo Việt Nam | [Literata](https://github.com/google/fonts/tree/main/ofl/literata) · 500 | Serif mang nhịp chữ in sách |
| 22 · Ngày Thành Lập QĐND | [Be Vietnam Pro](https://github.com/google/fonts/tree/main/ofl/bevietnampro) · 600 | Nét hiện đại, rõ ràng cho chủ đề quân kỳ |
| 23 · Giáng Sinh | [Pacifico](https://github.com/google/fonts/tree/main/ofl/pacifico) · 400 | Chữ thiệp retro, mềm và vui |
| 24 · Mavryk Cyber Security | [Chakra Petch](https://github.com/google/fonts/tree/main/ofl/chakrapetch) · 600 | Nét cắt góc cho giao diện Cyber |
