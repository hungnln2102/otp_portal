import { FestivalThemeType } from "../components/FestivalBackground";

export type SeasonFilter = "all" | "spring" | "summer" | "autumn" | "winter" | "modern";

export interface ThemeMeta {
  id: FestivalThemeType;
  season: SeasonFilter;
  name: string;
  icon: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface SeasonTabItem {
  id: SeasonFilter;
  label: string;
}

export const SEASON_TABS: SeasonTabItem[] = [
  { id: "all", label: "Tất cả (28)" },
  { id: "spring", label: "Xuân (9)" },
  { id: "summer", label: "Hạ (7)" },
  { id: "autumn", label: "Thu (6)" },
  { id: "winter", label: "Đông (5)" },
  { id: "modern", label: "Cyber Core" },
];

// BỘ SƯU TẬP TOÀN BỘ 24 LỄ HỘI VIỆT NAM & QUỐC TẾ XUYÊN SUỐT 12 THÁNG
export const FESTIVAL_THEMES: ThemeMeta[] = [
  // -------------------------------------------------------------
  // MÙA XUÂN (XUÂN KHỞI SẮC & TÌNH YÊU)
  // -------------------------------------------------------------
  {
    id: "tet-duong-lich",
    season: "spring",
    name: "Tết Dương Lịch",
    icon: "🎆",
    badge: "1 Tháng 1 — Chào Năm Mới",
    title: "Chào năm mới",
    subtitle: "Một khởi đầu, ngàn điều rực rỡ.",
    desc: "New Year countdown, elegant anime young couple in winter coats on far left, golden ornate clock tower, snowy violet city on far right, midnight indigo sky. No fireworks painted in sky; fireworks will be animated separately.",
  },
  {
    id: "ong-tao",
    season: "spring",
    name: "Ông Công Ông Táo",
    icon: "🐟",
    badge: "23 Tháng Chạp Âm Lịch",
    title: "Cá chép hóa rồng",
    subtitle: "Tiễn năm cũ, đón điều lành.",
    desc: "Vietnamese Kitchen Gods festival: joyful anime kitchen deity in traditional red ceremonial robe and mandarin hat at far left, huge graceful red carp leaping through multicolored clouds at far right, jade teal heavenly palace.",
  },
  {
    id: "tet",
    season: "spring",
    name: "Tết Nguyên Đán",
    icon: "🧧",
    badge: "Tết Cổ Truyền Việt Nam",
    title: "Xuân khởi sắc",
    subtitle: "Mai đào nở, bình an gõ cửa.",
    desc: "Vietnamese Lunar New Year: anime girl in red ao dai on far left beside pink peach blossom tree, green square banh chung cakes, red hanging lanterns, yellow apricot blossom garden and traditional Vietnamese courtyard at far right.",
  },
  {
    id: "valentine",
    season: "spring",
    name: "Lễ Valentine",
    icon: "💘",
    badge: "14 Tháng 2 — Lễ Tình Nhân",
    title: "Gửi ngàn yêu thương",
    subtitle: "Một lời thương, một kết nối gần.",
    desc: "Valentine romantic anime couple at far left sharing a red rose, chocolate gift boxes on far right, rose-covered Parisian balcony, ruby and plum night sky, delicate heart shaped bokeh, romantic refined anime illustration.",
  },
  {
    id: "nguyen-tieu",
    season: "spring",
    name: "Tết Nguyên Tiêu",
    icon: "🏮",
    badge: "Rằm Tháng Giêng Âm Lịch",
    title: "Trăng đầu năm",
    subtitle: "Ánh trăng soi những ước nguyện an lành.",
    desc: "Vietnamese first full moon festival: anime girl in flowing traditional ao dai releasing a lotus lantern at far left, full golden moon, floating lantern river with curved bridge and pagoda at far right, poetic indigo and amber.",
  },
  {
    id: "quoc-te-phu-nu",
    season: "spring",
    name: "Quốc Tế Phụ Nữ 8/3",
    icon: "🌸",
    badge: "8 Tháng 3 — Tôn Vinh Phái Đẹp",
    title: "Quốc Tế Phụ Nữ",
    subtitle: "Rạng rỡ theo cách của riêng bạn.",
    desc: "International Womens Day: elegant anime woman in lavender dress at far left, pink tulips and roses at far right, graceful silk and luminous butterflies, pastel lilac garden, gentle pearlescent evening.",
  },
  {
    id: "han-thuc",
    season: "spring",
    name: "Tết Hàn Thực",
    icon: "🥣",
    badge: "Mùng 3 Tháng 3 Âm Lịch",
    title: "Hương vị cội nguồn",
    subtitle: "Một chút ngọt lành, vẹn nguyên ký ức.",
    desc: "Vietnamese Cold Food Festival: gentle anime woman in pale ao dai at far left presenting a porcelain plate of white round rice dumplings, bowl of sweet soup and lotus blossoms at far right, peaceful ancestral courtyard, jade and ivory palette.",
  },
  {
    id: "gio-to",
    season: "spring",
    name: "Giỗ Tổ Hùng Vương",
    icon: "🏛️",
    badge: "Mùng 10 Tháng 3 Âm Lịch",
    title: "Về miền đất Tổ",
    subtitle: "Ngàn năm nguồn cội, một lòng hướng về.",
    desc: "Hung Kings commemoration Vietnam: anime Vietnamese young woman in dignified traditional ceremonial ao dai far left, large bronze Dong Son drum and stylized Lac birds far right, misty Hung temple mountain, ancient bronze gold and emerald landscape, respectful solemn.",
  },

  // -------------------------------------------------------------
  // MÙA HẠ (HẠ RỰC RỠ & LAO ĐỘNG — ĐOAN NGỌ)
  // -------------------------------------------------------------
  {
    id: "thong-nhat",
    season: "summer",
    name: "Giải Phóng 30/4",
    icon: "🇻🇳",
    badge: "30 Tháng 4 — Ngày Giải Phóng",
    title: "Non sông liền một dải",
    subtitle: "Hòa bình nở trên những mùa hoa.",
    desc: "Vietnam reunification celebration: anime Vietnamese woman wearing red ao dai at far left holding small Vietnamese flag with one centered yellow five pointed star, blooming Independence Palace garden far right, peaceful red and golden evening, celebratory.",
  },
  {
    id: "lao-dong",
    season: "summer",
    name: "Quốc Tế Lao Động 1/5",
    icon: "☭",
    badge: "1 Tháng 5 — Quốc Tế Lao Động",
    title: "Vinh quang lao động",
    subtitle: "Từ đôi bàn tay, dựng xây ngày mới.",
    desc: "International Labor Day Vietnam: proud friendly anime woman engineer with hardhat and worker in blue overalls far left, large decorative golden industrial gears with wheat stalks far right, optimistic illustrated city and fields, amber blue palette.",
  },
  {
    id: "phat-dan",
    season: "summer",
    name: "Đại Lễ Phật Đản",
    icon: "🪷",
    badge: "Rằm Tháng 4 Âm Lịch — Vesak",
    title: "Sen nở an lành",
    subtitle: "Một đóa sen, một niềm an.",
    desc: "Vesak Buddhist festival Vietnam: serene anime young woman in modest pale ceremonial clothes with palms together far left, seven pink lotuses, lotus lanterns and peaceful Vietnamese Buddhist temple far right, soft golden spiritual light, pink and midnight blue, respectful.",
  },
  {
    id: "thieu-nhi",
    season: "summer",
    name: "Quốc Tế Thiếu Nhi",
    icon: "🎈",
    badge: "1 Tháng 6 — Quốc Tế Thiếu Nhi",
    title: "Thế giới tuổi thơ",
    subtitle: "Giữ mãi những ngày trong veo.",
    desc: "International Childrens Day: happy adorable 2D anime children playing with colorful pinwheels at far left, balloons and whimsical playground far right, floating stars, cheerful blue peach and lemon palette, magical illustrated sky.",
  },
  {
    id: "doan-ngo",
    season: "summer",
    name: "Tết Đoan Ngọ",
    icon: "🌿",
    badge: "Mùng 5 Tháng 5 Âm Lịch",
    title: "Hương lành Đoan Ngọ",
    subtitle: "Nếp thơm, trái ngọt, mùa hè an vui.",
    desc: "Vietnamese Doan Ngo festival: anime young woman in green traditional ao dai far left, mugwort leaves and five colored sachets overhead, golden translucent pyramid rice dumplings, ripe lychees plums and ceramic rice wine jar far right, warm green village garden.",
  },
  {
    id: "gia-dinh",
    season: "summer",
    name: "Ngày Gia Đình VN",
    icon: "🏡",
    badge: "28 Tháng 6 — Ngày Gia Đình VN",
    title: "Nơi yêu thương trở về",
    subtitle: "Có nhau là đủ đầy.",
    desc: "Vietnamese Family Day: warm wholesome anime Vietnamese family parents and child gathered at far left, warmly glowing house and family dinner table at far right, lush happiness tree arching around sides, golden peach dusk and blue evening.",
  },

  // -------------------------------------------------------------
  // MÙA THU (THU ĐOÀN VIÊN & THẤT TỊCH — TRI ÂN)
  // -------------------------------------------------------------
  {
    id: "that-tich",
    season: "autumn",
    name: "Lễ Thất Tịch",
    icon: "🌌",
    badge: "Mùng 7 Tháng 7 Âm Lịch",
    title: "Hẹn dưới Ngân Hà",
    subtitle: "Dẫu xa ngàn sao, vẫn tìm thấy nhau.",
    desc: "Qixi Vietnamese That Tich: anime cowherd and celestial weaver girl in elegant fantasy traditional clothes meet at far left on magpie bridge, Milky Way and distant celestial palace at far right, bowl of red bean sweet soup on stone ledge, violet cosmic romance.",
  },
  {
    id: "vu-lan",
    season: "autumn",
    name: "Vu Lan Báo Hiếu",
    icon: "🕯️",
    badge: "Rằm Tháng 7 Âm Lịch",
    title: "Một đời biết ơn",
    subtitle: "Bông hồng nhỏ, tình yêu lớn.",
    desc: "Vietnamese Vu Lan filial piety: touching anime young adult gently honoring elderly mother at far left, red rose pinned on chest, floating lotus lanterns on river and tranquil pagoda at far right, amber gold and plum night, respectful tender illustration.",
  },
  {
    id: "quoc-khanh",
    season: "autumn",
    name: "Quốc Khánh 2/9",
    icon: "⭐️",
    badge: "2 Tháng 9 — Tết Độc Lập",
    title: "Rạng ngời Việt Nam",
    subtitle: "Một niềm tự hào, triệu trái tim.",
    desc: "Vietnam National Day: anime Vietnamese woman in flowing red ao dai at far left carrying Vietnamese red flag with one yellow centered five pointed star, recognizable respectful Ba Dinh square and Ho Chi Minh mausoleum far right, red gold and blue festive evening.",
  },
  {
    id: "trung-thu",
    season: "autumn",
    name: "Tết Trung Thu",
    icon: "🥮",
    badge: "Rằm Tháng Tám Đoàn Viên",
    title: "Đêm hội trăng rằm",
    subtitle: "Trăng tròn sum vầy, hội ngộ bình an.",
    desc: "Vietnamese Mid Autumn: elegant anime Chang Nga moon goddess in flowing ivory and lavender gown at far left holding white jade rabbit, star shaped lanterns and ornate revolving lantern, mooncakes and gentle full moon over Vietnamese lantern town far right, indigo gold dream.",
  },
  {
    id: "phu-nu-vn",
    season: "autumn",
    name: "Phụ Nữ VN 20/10",
    icon: "💐",
    badge: "20 Tháng 10 — Phụ Nữ Việt Nam",
    title: "Nét đẹp Việt Nam",
    subtitle: "Dịu dàng mà rực rỡ.",
    desc: "Vietnamese Womens Day: beautiful graceful anime Vietnamese woman in pale pink ao dai far left, lush pink lotus and peonies far right, poetic Vietnamese lakeside pavilion, rose pink plum and champagne palette, soft painterly anime.",
  },

  // -------------------------------------------------------------
  // MÙA ĐÔNG (ĐÔNG ẤM ÁP & TÔN SƯ TRỌNG ĐẠO)
  // -------------------------------------------------------------
  {
    id: "halloween",
    season: "winter",
    name: "Đêm Halloween",
    icon: "🎃",
    badge: "31 Tháng 10 — Halloween",
    title: "Phép màu đêm bí ngô",
    subtitle: "Một chút kỳ bí, thật nhiều niềm vui.",
    desc: "Halloween: cute elegant anime witch with purple hat and black cat far left, glowing jack o lantern pumpkins at far right, crooked bare trees and gothic fantasy house, purple moonlit sky and warm orange glows, charming no horror gore.",
  },
  {
    id: "nha-giao",
    season: "winter",
    name: "Nhà Giáo VN 20/11",
    icon: "🎓",
    badge: "20 Tháng 11 — Tôn Sư Trọng Đạo",
    title: "Người thắp những ước mơ",
    subtitle: "Từ trang sách nhỏ, đến chân trời xa.",
    desc: "Vietnamese Teachers Day: warm anime female teacher in light blue ao dai holding open book at far left, golden knowledge boat carrying books on calm river at far right, chalk flowers, warm desk lamp and schoolhouse, blue and warm gold thoughtful mood.",
  },
  {
    id: "qdnd-vn",
    season: "winter",
    name: "Quân Đội 22/12",
    icon: "🎖️",
    badge: "22 Tháng 12 — QĐND Việt Nam",
    title: "Vững bước dưới quân kỳ",
    subtitle: "Bình yên hôm nay, niềm tin ngày mai.",
    desc: "Vietnam Peoples Army anniversary: respectful friendly anime Vietnamese soldier in green uniform and green pith helmet with small yellow star far left, peaceful green mountains and country village far right, golden star motifs, olive green and warm dawn gold, no combat no weapons.",
  },
  {
    id: "giang-sinh",
    season: "winter",
    name: "Giáng Sinh Noel",
    icon: "🎄",
    badge: "24 Tháng 12 — Giáng Sinh",
    title: "Mùa an lành",
    subtitle: "Để yêu thương sưởi ấm mùa đông.",
    desc: "Christmas: charming anime young woman and young man in winter coats at far left, snow covered Christmas tree and gold bells with gifts far right, glowing Bethlehem star, cozy European snowy town, burgundy emerald and warm golden night.",
  },

  // -------------------------------------------------------------
  // CORE CÔNG NGHỆ HIỆN ĐẠI
  // -------------------------------------------------------------
  {
    id: "modern",
    season: "modern",
    name: "Cyber Core",
    icon: "⚡",
    badge: "Mavryk Security Core",
    title: "Kết nối trong an tâm",
    subtitle: "Bảo vệ từng kết nối của bạn.",
    desc: "Cyber security anime: stylish anime female cyber guardian wearing futuristic black teal jacket far left, translucent cyan holographic shield and luminous electronic circuit architecture far right, neon violet cyan midnight futuristic city, sleek anime cel shading.",
  },

  // -------------------------------------------------------------
  // 4 SEASONS ANIME (MOTION LAB)
  // -------------------------------------------------------------
  {
    id: "season-spring",
    season: "spring",
    name: "Mùa Xuân Anime",
    icon: "🌸",
    badge: "Xuân Khởi Sắc",
    title: "Xuân khởi sắc",
    subtitle: "Bình minh dịu, cánh hoa và thung lũng anime.",
    desc: "Bình minh dịu dàng, cánh hoa anh đào trôi bồng bềnh giữa thung lũng anime mơ mộng.",
  },
  {
    id: "season-summer",
    season: "summer",
    name: "Mùa Hạ Anime",
    icon: "☀️",
    badge: "Hạ Rực Rỡ",
    title: "Hạ rực rỡ",
    subtitle: "Nắng xanh, đồng lúa và mặt nước yên.",
    desc: "Nắng xanh rực rỡ, hạt sáng óng ánh, đồng lúa bao la và mặt nước phẳng lặng yên bình.",
  },
  {
    id: "season-autumn",
    season: "autumn",
    name: "Mùa Thu Anime",
    icon: "🍁",
    badge: "Thu Đoàn Viên",
    title: "Thu đoàn viên",
    subtitle: "Phố cổ, nắng mật ong và sắc lá ấm.",
    desc: "Phố cổ trầm mặc, ánh nắng hoàng hôn mật ong và những chiếc lá phong vàng rơi bay lãng mạn.",
  },
  {
    id: "season-winter",
    season: "winter",
    name: "Mùa Đông Anime",
    icon: "❄️",
    badge: "Đông Ấm Áp",
    title: "Đông ấm áp",
    subtitle: "Làng núi, tuyết xanh và những ô cửa ấm.",
    desc: "Ngôi làng phủ tuyết trắng tinh khôi, ánh đèn ấm áp từ những ô cửa sổ giữa mùa đông thanh bình.",
  },
];

