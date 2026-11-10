import React, { useEffect, useRef, useState } from "react";
import "../styles/festival-themes.css";

export type FestivalThemeType =
  // MÙA XUÂN
  | "tet-duong-lich"
  | "ong-tao"
  | "tet"
  | "valentine"
  | "nguyen-tieu"
  | "quoc-te-phu-nu"
  | "han-thuc"
  | "gio-to"
  // MÙA HẠ
  | "thong-nhat"
  | "lao-dong"
  | "phat-dan"
  | "thieu-nhi"
  | "doan-ngo"
  | "gia-dinh"
  // MÙA THU
  | "that-tich"
  | "vu-lan"
  | "quoc-khanh"
  | "trung-thu"
  | "phu-nu-vn"
  // MÙA ĐÔNG
  | "halloween"
  | "nha-giao"
  | "qdnd-vn"
  | "giang-sinh"
  // CORE
  | "modern"
  // 4 SEASONS ANIME
  | "season-spring"
  | "season-summer"
  | "season-autumn"
  | "season-winter";

export interface ThemeArtInfo {
  id: number;
  slug: string;
  name: string;
  art: string;
  font: string;
  accent: string;
  rayColor: string;
}

// BỘ TẬP TRUNG TOÀN BỘ 28 THEMES - TẤT CẢ BACKGROUND ĐƯỢC GOM CHUNG VÀO /assets/holidays/
export const THEME_ART_MAP: Record<FestivalThemeType, ThemeArtInfo> = {
  // Mùa Xuân
  "tet-duong-lich": { id: 1, slug: "01", name: "Tết Dương Lịch", art: "/assets/holidays/01.webp", font: "Mavryk Display 01", accent: "#edc882", rayColor: "rgba(237, 200, 130, 0.4)" },
  "ong-tao":        { id: 2, slug: "02", name: "Ông Công Ông Táo", art: "/assets/holidays/02.webp", font: "Mavryk Display 02", accent: "#f0bd72", rayColor: "rgba(240, 189, 114, 0.4)" },
  "tet":            { id: 3, slug: "03", name: "Tết Nguyên Đán", art: "/assets/holidays/03.webp", font: "Mavryk Display 03", accent: "#ffcf78", rayColor: "rgba(255, 207, 120, 0.4)" },
  "valentine":      { id: 4, slug: "04", name: "Valentine", art: "/assets/holidays/04.webp", font: "Mavryk Display 04", accent: "#ffb1c4", rayColor: "rgba(255, 177, 196, 0.4)" },
  "nguyen-tieu":    { id: 5, slug: "05", name: "Tết Nguyên Tiêu", art: "/assets/holidays/05.webp", font: "Mavryk Display 05", accent: "#f3d28c", rayColor: "rgba(243, 210, 140, 0.4)" },
  "quoc-te-phu-nu": { id: 6, slug: "06", name: "Quốc Tế Phụ Nữ", art: "/assets/holidays/06.webp", font: "Mavryk Display 06", accent: "#eab7ee", rayColor: "rgba(234, 183, 238, 0.4)" },
  "han-thuc":       { id: 7, slug: "07", name: "Tết Hàn Thực", art: "/assets/holidays/07.webp", font: "Mavryk Display 07", accent: "#b5e3d0", rayColor: "rgba(181, 227, 208, 0.4)" },
  "gio-to":         { id: 8, slug: "08", name: "Giỗ Tổ Hùng Vương", art: "/assets/holidays/08.webp", font: "Mavryk Display 08", accent: "#d9ba77", rayColor: "rgba(217, 186, 119, 0.4)" },
  // Mùa Hạ
  "thong-nhat":     { id: 9, slug: "09", name: "Thống Nhất Non Sông", art: "/assets/holidays/09.webp", font: "Mavryk Display 09", accent: "#ffd486", rayColor: "rgba(255, 212, 134, 0.4)" },
  "lao-dong":       { id: 10, slug: "10", name: "Quốc Tế Lao Động", art: "/assets/holidays/10.webp", font: "Mavryk Display 10", accent: "#f6cf78", rayColor: "rgba(246, 207, 120, 0.4)" },
  "phat-dan":       { id: 11, slug: "11", name: "Đại Lễ Phật Đản", art: "/assets/holidays/11.webp", font: "Mavryk Display 11", accent: "#f4c5d6", rayColor: "rgba(244, 197, 214, 0.4)" },
  "thieu-nhi":      { id: 12, slug: "12", name: "Quốc Tế Thiếu Nhi", art: "/assets/holidays/12.webp", font: "Mavryk Display 12", accent: "#ffdc9c", rayColor: "rgba(255, 220, 156, 0.4)" },
  "doan-ngo":       { id: 13, slug: "13", name: "Tết Đoan Ngọ", art: "/assets/holidays/13.webp", font: "Mavryk Display 13", accent: "#d8e6a0", rayColor: "rgba(216, 230, 160, 0.4)" },
  "gia-dinh":       { id: 14, slug: "14", name: "Ngày Gia Đình Việt Nam", art: "/assets/holidays/14.webp", font: "Mavryk Display 14", accent: "#f5c894", rayColor: "rgba(245, 200, 148, 0.4)" },
  // Mùa Thu
  "that-tich":      { id: 15, slug: "15", name: "Lễ Thất Tịch", art: "/assets/holidays/15.webp", font: "Mavryk Display 15", accent: "#c9b4ff", rayColor: "rgba(201, 180, 255, 0.4)" },
  "vu-lan":         { id: 16, slug: "16", name: "Vu Lan Báo Hiếu", art: "/assets/holidays/16.webp", font: "Mavryk Display 16", accent: "#efc5ab", rayColor: "rgba(239, 197, 171, 0.4)" },
  "quoc-khanh":     { id: 17, slug: "17", name: "Đại Lễ Quốc Khánh", art: "/assets/holidays/17.webp", font: "Mavryk Display 17", accent: "#ffd28b", rayColor: "rgba(255, 210, 139, 0.4)" },
  "trung-thu":      { id: 18, slug: "18", name: "Tết Trung Thu", art: "/assets/holidays/18.webp", font: "Mavryk Display 18", accent: "#f1d08e", rayColor: "rgba(241, 208, 142, 0.4)" },
  "phu-nu-vn":      { id: 19, slug: "19", name: "Phụ Nữ Việt Nam", art: "/assets/holidays/19.webp", font: "Mavryk Display 19", accent: "#edb9d0", rayColor: "rgba(237, 185, 208, 0.4)" },
  // Mùa Đông
  "halloween":      { id: 20, slug: "20", name: "Halloween", art: "/assets/holidays/20.webp", font: "Mavryk Display 20", accent: "#f1b877", rayColor: "rgba(241, 184, 119, 0.4)" },
  "nha-giao":       { id: 21, slug: "21", name: "Nhà Giáo Việt Nam", art: "/assets/holidays/21.webp", font: "Mavryk Display 21", accent: "#c4d8ef", rayColor: "rgba(196, 216, 239, 0.4)" },
  "qdnd-vn":        { id: 22, slug: "22", name: "Ngày Thành Lập QĐND", art: "/assets/holidays/22.webp", font: "Mavryk Display 22", accent: "#d8cc8e", rayColor: "rgba(216, 204, 142, 0.4)" },
  "giang-sinh":     { id: 23, slug: "23", name: "Giáng Sinh", art: "/assets/holidays/23.webp", font: "Mavryk Display 23", accent: "#efcf91", rayColor: "rgba(239, 207, 145, 0.4)" },
  // Core
  "modern":         { id: 24, slug: "24", name: "Mavryk Cyber Security", art: "/assets/holidays/24.webp", font: "Mavryk Display 24", accent: "#00f0ff", rayColor: "rgba(0, 240, 255, 0.35)" },
  // 4 SEASONS ANIME CINEMATIC
  "season-spring":  { id: 101, slug: "season-spring", name: "Xuân Khởi Sắc", art: "/assets/holidays/spring.webp", font: "Mavryk Display 03", accent: "#f4a8c0", rayColor: "rgba(255, 190, 210, 0.45)" },
  "season-summer":  { id: 102, slug: "season-summer", name: "Hạ Rực Rỡ", art: "/assets/holidays/summer.webp", font: "Mavryk Display 12", accent: "#7fd7d2", rayColor: "rgba(127, 215, 210, 0.4)" },
  "season-autumn":  { id: 103, slug: "season-autumn", name: "Thu Đoàn Viên", art: "/assets/holidays/autumn.webp", font: "Mavryk Display 18", accent: "#e9aa68", rayColor: "rgba(255, 185, 100, 0.45)" },
  "season-winter":  { id: 104, slug: "season-winter", name: "Đông Ấm Áp", art: "/assets/holidays/winter.webp", font: "Mavryk Display 23", accent: "#9fd5ef", rayColor: "rgba(175, 225, 255, 0.35)" },
};

/**
 * Xử lý URL tĩnh tương thích cả khi mount tại /otp/ hoặc root
 * Hỗ trợ tự động phân giải ảnh dọc cho mobile (/assets/holidays/mobile/)
 */
export const resolveArtUrl = (artPath: string, isMobile = false): string => {
  if (!artPath) return "";
  if (artPath.startsWith("http")) return artPath;
  let targetPath = artPath;
  if (isMobile && targetPath.includes("/assets/holidays/")) {
    targetPath = targetPath.replace("/assets/holidays/", "/assets/holidays/mobile/");
  }
  const base = ((import.meta as any).env?.BASE_URL as string) || "/otp/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath;
  if (cleanPath.startsWith("otp/")) {
    return `/${cleanPath}`;
  }
  return `${cleanBase}${cleanPath}`;
};

// =========================================================================
// BOTANICAL SPRITE FACTORY (TẠO HÌNH HỌC LÁ CÂY & HOA ANIME THỰC THỤ)
// =========================================================================

const MAPLE_PALETTES = [
  { main: "#d94819", highlight: "#fb923c", vein: "#7c2d12" }, // Vermilion Crimson
  { main: "#d97706", highlight: "#fde047", vein: "#92400e" }, // Amber Gold
  { main: "#ea580c", highlight: "#fed7aa", vein: "#7c2d12" }, // Flame Orange
  { main: "#dc2626", highlight: "#fca5a5", vein: "#991b1b" }, // Ruby Momiji
  { main: "#b45309", highlight: "#fcd34d", vein: "#78350f" }, // Warm Russet
];

/**
 * Vẽ lá phong Momiji 5 thùy sắc nét, có cuống cong tự nhiên và hệ thống gân lá
 */
function createMapleLeafSprite(colors: { main: string; highlight: string; vein: string }, size = 64): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size * 0.48;
  const s = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 1. Cuống lá (Stem)
  ctx.beginPath();
  ctx.moveTo(0, 10 * s);
  ctx.quadraticCurveTo(2 * s, 18 * s, 4 * s, 26 * s);
  ctx.strokeStyle = colors.vein;
  ctx.lineWidth = 1.8 * s;
  ctx.lineCap = "round";
  ctx.stroke();

  // 2. Phiến lá 5 thùy với dải màu gradient tự nhiên
  const grad = ctx.createLinearGradient(0, -26 * s, 0, 14 * s);
  grad.addColorStop(0, colors.highlight);
  grad.addColorStop(0.55, colors.main);
  grad.addColorStop(1, colors.vein);

  ctx.beginPath();
  ctx.moveTo(0, 10 * s);

  // Thùy dưới bên trái
  ctx.bezierCurveTo(-8 * s, 10 * s, -16 * s, 12 * s, -22 * s, 8 * s);
  ctx.lineTo(-19 * s, 3 * s);
  ctx.quadraticCurveTo(-15 * s, 0, -18 * s, -2 * s);

  // Thùy trên bên trái
  ctx.lineTo(-26 * s, -8 * s);
  ctx.lineTo(-21 * s, -11 * s);
  ctx.lineTo(-24 * s, -16 * s);
  ctx.lineTo(-17 * s, -16 * s);
  ctx.quadraticCurveTo(-10 * s, -12 * s, -11 * s, -17 * s);

  // Thùy đỉnh chính giữa (nhọn vươn cao)
  ctx.lineTo(-6 * s, -23 * s);
  ctx.lineTo(0, -27 * s);
  ctx.lineTo(6 * s, -23 * s);
  ctx.lineTo(11 * s, -17 * s);

  // Thùy trên bên phải
  ctx.quadraticCurveTo(10 * s, -12 * s, 17 * s, -16 * s);
  ctx.lineTo(24 * s, -16 * s);
  ctx.lineTo(21 * s, -11 * s);
  ctx.lineTo(26 * s, -8 * s);

  // Thùy dưới bên phải
  ctx.quadraticCurveTo(15 * s, 0, 19 * s, 3 * s);
  ctx.lineTo(22 * s, 8 * s);
  ctx.bezierCurveTo(16 * s, 12 * s, 8 * s, 10 * s, 0, 10 * s);

  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // 3. Hệ thống gân lá (Botanical leaf veins)
  ctx.strokeStyle = colors.vein;
  ctx.lineWidth = 1.0 * s;
  ctx.globalAlpha = 0.65;

  // Gân chính giữa
  ctx.beginPath();
  ctx.moveTo(0, 10 * s);
  ctx.quadraticCurveTo(0, -6 * s, 0, -25 * s);
  ctx.stroke();

  // Gân nhánh sang 4 thùy
  ctx.beginPath();
  ctx.moveTo(0, 6 * s);
  ctx.lineTo(-22 * s, -14 * s);
  ctx.moveTo(0, 6 * s);
  ctx.lineTo(22 * s, -14 * s);
  ctx.moveTo(0, 8 * s);
  ctx.lineTo(-19 * s, 7 * s);
  ctx.moveTo(0, 8 * s);
  ctx.lineTo(19 * s, 7 * s);
  ctx.stroke();

  ctx.restore();
  return canvas;
}

/**
 * Vẽ cánh hoa anh đào (Sakura Petal) mềm mại với khuyết chóp hoa V-notch đặc trưng
 */
function createSakuraPetalSprite(size = 48): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size / 2;
  const s = size / 48;

  ctx.save();
  ctx.translate(cx, cy);

  const grad = ctx.createLinearGradient(0, -18 * s, 0, 16 * s);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.2, "#fce7f3");
  grad.addColorStop(0.85, "#f472b6");
  grad.addColorStop(1, "#ec4899");

  ctx.beginPath();
  ctx.moveTo(0, 16 * s);
  ctx.bezierCurveTo(-14 * s, 12 * s, -17 * s, -6 * s, -11 * s, -16 * s);
  // Khuyết chóp hoa anh đào (V-notch)
  ctx.lineTo(-4 * s, -18 * s);
  ctx.quadraticCurveTo(0, -13 * s, 4 * s, -18 * s);
  ctx.lineTo(11 * s, -16 * s);
  ctx.bezierCurveTo(17 * s, -6 * s, 14 * s, 12 * s, 0, 16 * s);

  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Gân cánh mờ
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(0, 14 * s);
  ctx.lineTo(0, -12 * s);
  ctx.stroke();

  ctx.restore();
  return canvas;
}

/**
 * Vẽ bông tuyết 6 cánh tinh xảo (Crystalline snowflake)
 */
function createSnowflakeSprite(size = 40): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);

    // Gai phụ nhánh tuyết
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(-r * 0.25, -r * 0.65);
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(r * 0.25, -r * 0.65);

    ctx.moveTo(0, -r * 0.75);
    ctx.lineTo(-r * 0.18, -r * 0.9);
    ctx.moveTo(0, -r * 0.75);
    ctx.lineTo(r * 0.18, -r * 0.9);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
  return canvas;
}

interface FestivalBackgroundProps {
  theme: FestivalThemeType;
}

export const FestivalBackground: React.FC<FestivalBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Nhận diện màn hình Mobile / Portrait để tự động kích hoạt bộ tranh dọc 1080x1920
  const checkIsMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768 || (window.innerWidth < window.innerHeight && window.innerWidth <= 1024);
  };
  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile);

  useEffect(() => {
    const handleScreenChange = () => {
      setIsMobile(checkIsMobile());
    };
    window.addEventListener("resize", handleScreenChange);
    window.addEventListener("orientationchange", handleScreenChange);
    return () => {
      window.removeEventListener("resize", handleScreenChange);
      window.removeEventListener("orientationchange", handleScreenChange);
    };
  }, []);

  const currentArt = THEME_ART_MAP[theme] || THEME_ART_MAP["tet"];
  const resolvedArt = resolveArtUrl(currentArt.art, isMobile);
  const [loadedArt, setLoadedArt] = useState<string>(resolvedArt);
  const [artOpacity, setArtOpacity] = useState<number>(1);

  // Cập nhật data-theme trên html tag và sync accent color
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent", currentArt.accent);
  }, [theme, currentArt]);

  // Preload và chuyển cảnh mượt mà giữa các tranh minh họa anime (hỗ trợ tự chuyển ngang/dọc)
  useEffect(() => {
    setArtOpacity(0.3);
    const targetUrl = resolveArtUrl(currentArt.art, isMobile);
    const img = new Image();
    img.src = targetUrl;
    img.onload = () => {
      setLoadedArt(targetUrl);
      setArtOpacity(1);
    };
    img.onerror = () => {
      // Fallback an toàn về tranh gốc nếu có sự cố
      const fallbackUrl = resolveArtUrl(currentArt.art, false);
      setLoadedArt(fallbackUrl);
      setArtOpacity(1);
    };
  }, [currentArt.art, isMobile]);

  // Canvas Engine: Tích hợp đầy đủ cả Thảm thực vật Anime (Lá phong, Hoa anh đào, Đom đóm, Tuyết tinh)
  // và Hiệu ứng điện ảnh bổ sung (God Rays, Bụi sáng lấp lánh, Bokeh rực rỡ)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let time = 0;
    let last = performance.now();
    let fxInstance: any = null;

    // Chuẩn bị sprites offscreen (tối ưu 60fps)
    const mapleSprites = MAPLE_PALETTES.map((pal) => createMapleLeafSprite(pal, 64));
    const sakuraSprite = createSakuraPetalSprite(48);
    const snowflakeSprite = createSnowflakeSprite(40);

    // Xác định chế độ mùa
    const isSeasonalMode = theme.startsWith("season-");
    const seasonKey = theme.replace("season-", "") as "spring" | "summer" | "autumn" | "winter";

    // 1. Thảm hạt tự nhiên (Foliage Particles)
    const foliageBaseCount = isSeasonalMode
      ? seasonKey === "autumn"
        ? 34
        : seasonKey === "spring"
        ? 38
        : seasonKey === "summer"
        ? 24
        : 45
      : 0;
    // Trên điện thoại giảm 50% số hạt để tiết kiệm pin và không che lấp form OTP
    const foliageCount = isMobile ? Math.round(foliageBaseCount * 0.5) : foliageBaseCount;

    const canvasVirtualW = isMobile ? 1080 : 1600;
    const canvasVirtualH = isMobile ? 1920 : 900;

    const foliage = Array.from({ length: foliageCount }, () => ({
      x: Math.random() * canvasVirtualW,
      y: Math.random() * (canvasVirtualH + 50) - 50,
      size: (16 + Math.random() * 22) * (isMobile ? 0.85 : 1),
      vy: 0.55 + Math.random() * 1.1,
      vx: 0.15 + Math.random() * 0.45,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.035,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.025 + Math.random() * 0.045,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 1.2 + Math.random() * 1.8,
      spriteIndex: Math.floor(Math.random() * MAPLE_PALETTES.length),
    }));

    // 2. Bụi sáng lấp lánh (Shimmering Light Motes / Stardust)
    const motesCount = isMobile ? 16 : 32;
    const motes = Array.from({ length: motesCount }, () => ({
      x: Math.random() * canvasVirtualW,
      y: Math.random() * canvasVirtualH,
      r: (1.2 + Math.random() * 2.2) * (isMobile ? 0.85 : 1),
      vy: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 1.5 + Math.random() * 2.5,
      baseAlpha: 0.4 + Math.random() * 0.5,
    }));

    // 3. Bokeh Orbs chiều sâu (Depth of Field)
    const bokehCount = isMobile ? 8 : 14;
    const bokehOrbs = Array.from({ length: bokehCount }, () => ({
      x: Math.random() * canvasVirtualW,
      y: Math.random() * canvasVirtualH,
      r: (25 + Math.random() * 55) * (isMobile ? 0.8 : 1),
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.05 + Math.random() * 0.09,
      colorCore: currentArt.accent,
      colorGlow: currentArt.rayColor,
    }));

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (isSeasonalMode) {
        if (isMobile) {
          // Uniform scale theo khung 1080x1920: giữ các hạt hoa/tuyết/lá tròn chuẩn xác
          const scale = Math.max(canvas.width / 1080, canvas.height / 1920);
          ctx.setTransform(scale, 0, 0, scale, (canvas.width - 1080 * scale) / 2, (canvas.height - 1920 * scale) / 2);
        } else {
          ctx.setTransform(canvas.width / 1600, 0, 0, canvas.height / 900, 0, 0);
        }
      } else if (fxInstance) {
        if (currentArt.id === 1) {
          fxInstance.ctx.setTransform(canvas.width / 1600, 0, 0, canvas.height / 900, 0, 0);
        } else {
          const scale = Math.max(canvas.width / 1600, canvas.height / 900);
          const visibleWidth = canvas.width / scale;
          fxInstance.viewport = {
            width: visibleWidth,
            left: (1600 - visibleWidth) / 2,
            right: (1600 + visibleWidth) / 2,
          };
          fxInstance.ctx.setTransform(
            scale,
            0,
            0,
            scale,
            (canvas.width - 1600 * scale) / 2,
            (canvas.height - 900 * scale) / 2
          );
        }
        fxInstance.draw(time);
      }
    };

    const setupEngine = () => {
      if (isSeasonalMode) {
        handleResize();
        return;
      }
      const HolidayEffects = (window as any).HolidayEffects;
      if (HolidayEffects?.Effects) {
        fxInstance = new HolidayEffects.Effects(canvas);
        fxInstance.amount = isMobile ? 0.45 : 0.85;
        fxInstance.setTheme({ id: currentArt.id, slug: currentArt.slug, name: currentArt.name });
      }
      handleResize();
    };

    window.addEventListener("resize", handleResize);

    if (isSeasonalMode) {
      setupEngine();
    } else if ((window as any).HolidayEffects) {
      setupEngine();
    } else {
      const checkInterval = setInterval(() => {
        if ((window as any).HolidayEffects) {
          clearInterval(checkInterval);
          setupEngine();
        }
      }, 50);
      setTimeout(() => clearInterval(checkInterval), 3000);
    }

    // VÒNG LẶP RENDER CHÍNH 60FPS
    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (isSeasonalMode) {
          ctx.clearRect(0, 0, 1600, 900);

          // -------------------------------------------------------------
          // LỚP 1: VOLUMETRIC GOD RAYS (NẮNG XIÊN LUNG LINH ĐIỆN ẢNH)
          // -------------------------------------------------------------
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          const rayColor = currentArt.rayColor || "rgba(255, 200, 120, 0.4)";
          for (let i = 0; i < 4; i++) {
            const rayOffset = Math.sin(time * 0.25 + i * 1.6) * 40;
            const rayAlpha = 0.045 + 0.035 * Math.sin(time * 0.35 + i * 2.1);

            const rayGrad = ctx.createLinearGradient(-100, -50, 1400, 900);
            rayGrad.addColorStop(0, rayColor);
            rayGrad.addColorStop(0.55, rayColor);
            rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = rayGrad;
            ctx.globalAlpha = rayAlpha;

            ctx.beginPath();
            const rx = -100 + i * 180 + rayOffset;
            ctx.moveTo(rx, -60);
            ctx.lineTo(rx + 190, -60);
            ctx.lineTo(rx + 1300, 960);
            ctx.lineTo(rx + 1080, 960);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // -------------------------------------------------------------
          // LỚP 2: BOKEH ORBS MỜ ẢO CHIỀU SÂU TIỀN CẢNH & HẬU CẢNH
          // -------------------------------------------------------------
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          for (const b of bokehOrbs) {
            b.y += Math.sin(time * 0.4 + b.phase) * 0.25;
            b.x += Math.cos(time * 0.3 + b.phase) * 0.2;
            const bAlpha = b.baseAlpha * (0.65 + 0.35 * Math.sin(time * 0.6 + b.phase));

            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.globalAlpha = bAlpha;

            const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r);
            radGrad.addColorStop(0, b.colorCore);
            radGrad.addColorStop(0.5, b.colorGlow);
            radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(0, 0, b.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();

          // -------------------------------------------------------------
          // LỚP 3: THẢM HẠT THỰC VẬT ANIME (LÁ PHONG 3D, HOA ANH ĐÀO, ĐOM ĐÓM)
          // -------------------------------------------------------------
          ctx.save();
          const windSway = Math.sin(time * 0.6) * 1.2;

          for (const p of foliage) {
            // Khí động học rơi & lắc lư theo gió
            p.y += p.vy;
            p.x += Math.sin(time * 0.8 + p.swayPhase) * p.swayAmp + windSway * 0.4;
            p.rot += p.rotSpeed;
            p.flip += p.flipSpeed;

            // Tái tuần hoàn mượt mà khi rơi hết màn hình (tự thích ứng khung dọc 1080x1920 hoặc khung ngang 1600x900)
            const maxY = isMobile ? 1960 : 940;
            const maxX = isMobile ? 1120 : 1650;
            if (p.y > maxY) {
              p.y = -40;
              p.x = Math.random() * maxX - 50;
            }
            if (p.x > maxX) p.x = -30;
            if (p.x < -40) p.x = maxX - 10;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);

            // MÔ PHỎNG LẬT 3D CHAO LIỆNG TRONG KHÔNG TRUNG
            const scale3D = Math.cos(p.flip);
            ctx.scale(scale3D, 1);

            if (seasonKey === "autumn") {
              // Vẽ lá phong Momiji 5 thùy chân thực
              const sprite = mapleSprites[p.spriteIndex] || mapleSprites[0];
              ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
            } else if (seasonKey === "spring") {
              // Vẽ cánh hoa anh đào có khuyết chóp V-notch
              ctx.drawImage(sakuraSprite, -p.size / 2, -p.size / 2, p.size * 0.9, p.size * 1.1);
            } else if (seasonKey === "summer") {
              // Vẽ đom đóm phát sáng mùa hạ
              const pulse = 0.5 + 0.5 * Math.sin(time * 3 + p.swayPhase);
              ctx.globalAlpha = 0.2 + 0.7 * pulse;
              const fGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.8);
              fGrad.addColorStop(0, "#ffffff");
              fGrad.addColorStop(0.35, currentArt.accent);
              fGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
              ctx.fillStyle = fGrad;
              ctx.beginPath();
              ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Mùa đông: Bông tuyết 6 cánh tinh khiết
              ctx.globalAlpha = 0.85;
              ctx.drawImage(snowflakeSprite, -p.size / 2, -p.size / 2, p.size, p.size);
            }

            ctx.restore();
          }
          ctx.restore();

          // -------------------------------------------------------------
          // LỚP 4: BỤI SÁNG LẤP LÁNH (LIGHT MOTES / STARDUST BẮT ÁNH NẮNG)
          // -------------------------------------------------------------
          ctx.save();
          for (const m of motes) {
            m.y -= m.vy;
            m.x += Math.sin(time * 0.5 + m.phase) * 0.3;
            if (m.y < -20) {
              m.y = isMobile ? 1940 : 920;
              m.x = Math.random() * (isMobile ? 1080 : 1600);
            }
            const mAlpha = (0.2 + 0.7 * Math.abs(Math.sin(time * m.twinkleSpeed + m.phase))) * m.baseAlpha;
            ctx.save();
            ctx.translate(m.x, m.y);
            ctx.globalAlpha = mAlpha;

            const moteGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, m.r * 2.2);
            moteGrad.addColorStop(0, "#ffffff");
            moteGrad.addColorStop(0.4, currentArt.accent);
            moteGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = moteGrad;
            ctx.beginPath();
            ctx.arc(0, 0, m.r * 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();
        } else if (fxInstance) {
          fxInstance.draw(time);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, currentArt, isMobile]);

  return (
    <>
      {/* 0. LỚP AMBIENT BACKDROP MỜ ẢO (SMART BLURRED BACKING TỰ THÍCH ỨNG MỌI MẪU ĐIỆN THOẠI) */}
      <div
        className="festival-art-ambient fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: `url("${loadedArt}")`,
          opacity: artOpacity,
        }}
        aria-hidden="true"
      />

      {/* 1. LỚP TRANH MINH HỌA ANIME CHÍNH (GIỮ 100% NÉT CĂNG & KHÔNG BỊ CẮT XÉN) */}
      <div
        className="festival-art-layer fixed inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: `url("${loadedArt}")`,
          opacity: artOpacity,
        }}
      />

      {/* 2. LỚP PHỦ TƯƠNG PHẢN ĐA TẦNG (SHADE OVERLAY):
             Tôn vinh nhân vật anime 2 bên sườn & Giữ form trung tâm siêu nét */}
      <div
        className="festival-art-shade fixed inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* 3. CANVAS ENGINE HIỆU ỨNG TƯƠNG TÁC 60FPS (VOLUMETRIC GOD RAYS, LÁ PHONG 3D, SAKURA NOTCH, STARDUST, BOKEH) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
        aria-hidden="true"
      />
    </>
  );
};

export default FestivalBackground;