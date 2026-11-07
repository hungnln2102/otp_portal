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
  | "modern";

export interface ThemeArtInfo {
  id: number;
  slug: string;
  name: string;
  art: string;
  font: string;
  accent: string;
}

export const THEME_ART_MAP: Record<FestivalThemeType, ThemeArtInfo> = {
  "tet-duong-lich": { id: 1, slug: "01", name: "Tết Dương Lịch", art: "/assets/holidays/01.webp", font: "Mavryk Display 01", accent: "#edc882" },
  "ong-tao":        { id: 2, slug: "02", name: "Ông Công Ông Táo", art: "/assets/holidays/02.webp", font: "Mavryk Display 02", accent: "#f0bd72" },
  "tet":            { id: 3, slug: "03", name: "Tết Nguyên Đán", art: "/assets/holidays/03.webp", font: "Mavryk Display 03", accent: "#ffcf78" },
  "valentine":      { id: 4, slug: "04", name: "Valentine", art: "/assets/holidays/04.webp", font: "Mavryk Display 04", accent: "#ffb1c4" },
  "nguyen-tieu":    { id: 5, slug: "05", name: "Tết Nguyên Tiêu", art: "/assets/holidays/05.webp", font: "Mavryk Display 05", accent: "#f3d28c" },
  "quoc-te-phu-nu": { id: 6, slug: "06", name: "Quốc Tế Phụ Nữ", art: "/assets/holidays/06.webp", font: "Mavryk Display 06", accent: "#eab7ee" },
  "han-thuc":       { id: 7, slug: "07", name: "Tết Hàn Thực", art: "/assets/holidays/07.webp", font: "Mavryk Display 07", accent: "#b5e3d0" },
  "gio-to":         { id: 8, slug: "08", name: "Giỗ Tổ Hùng Vương", art: "/assets/holidays/08.webp", font: "Mavryk Display 08", accent: "#d9ba77" },
  "thong-nhat":     { id: 9, slug: "09", name: "Thống Nhất Non Sông", art: "/assets/holidays/09.webp", font: "Mavryk Display 09", accent: "#ffd486" },
  "lao-dong":       { id: 10, slug: "10", name: "Quốc Tế Lao Động", art: "/assets/holidays/10.webp", font: "Mavryk Display 10", accent: "#f6cf78" },
  "phat-dan":       { id: 11, slug: "11", name: "Đại Lễ Phật Đản", art: "/assets/holidays/11.webp", font: "Mavryk Display 11", accent: "#f4c5d6" },
  "thieu-nhi":      { id: 12, slug: "12", name: "Quốc Tế Thiếu Nhi", art: "/assets/holidays/12.webp", font: "Mavryk Display 12", accent: "#ffdc9c" },
  "doan-ngo":       { id: 13, slug: "13", name: "Tết Đoan Ngọ", art: "/assets/holidays/13.webp", font: "Mavryk Display 13", accent: "#d8e6a0" },
  "gia-dinh":       { id: 14, slug: "14", name: "Ngày Gia Đình Việt Nam", art: "/assets/holidays/14.webp", font: "Mavryk Display 14", accent: "#f5c894" },
  "that-tich":      { id: 15, slug: "15", name: "Lễ Thất Tịch", art: "/assets/holidays/15.webp", font: "Mavryk Display 15", accent: "#c9b4ff" },
  "vu-lan":         { id: 16, slug: "16", name: "Vu Lan Báo Hiếu", art: "/assets/holidays/16.webp", font: "Mavryk Display 16", accent: "#efc5ab" },
  "quoc-khanh":     { id: 17, slug: "17", name: "Đại Lễ Quốc Khánh", art: "/assets/holidays/17.webp", font: "Mavryk Display 17", accent: "#ffd28b" },
  "trung-thu":      { id: 18, slug: "18", name: "Tết Trung Thu", art: "/assets/holidays/18.webp", font: "Mavryk Display 18", accent: "#f1d08e" },
  "phu-nu-vn":      { id: 19, slug: "19", name: "Phụ Nữ Việt Nam", art: "/assets/holidays/19.webp", font: "Mavryk Display 19", accent: "#edb9d0" },
  "halloween":      { id: 20, slug: "20", name: "Halloween", art: "/assets/holidays/20.webp", font: "Mavryk Display 20", accent: "#f1b877" },
  "nha-giao":       { id: 21, slug: "21", name: "Nhà Giáo Việt Nam", art: "/assets/holidays/21.webp", font: "Mavryk Display 21", accent: "#c4d8ef" },
  "qdnd-vn":        { id: 22, slug: "22", name: "Ngày Thành Lập QĐND", art: "/assets/holidays/22.webp", font: "Mavryk Display 22", accent: "#d8cc8e" },
  "giang-sinh":     { id: 23, slug: "23", name: "Giáng Sinh", art: "/assets/holidays/23.webp", font: "Mavryk Display 23", accent: "#efcf91" },
  "modern":         { id: 24, slug: "24", name: "Mavryk Cyber Security", art: "/assets/holidays/24.webp", font: "Mavryk Display 24", accent: "#7de6e3" },
};

interface FestivalBackgroundProps {
  theme: FestivalThemeType;
}

export const FestivalBackground: React.FC<FestivalBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentArt = THEME_ART_MAP[theme] || THEME_ART_MAP["tet"];
  const [loadedArt, setLoadedArt] = useState<string>(currentArt.art);
  const [artOpacity, setArtOpacity] = useState<number>(1);

  // Cập nhật data-theme trên html tag và sync accent color
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent", currentArt.accent);
  }, [theme, currentArt]);

  // Preload và chuyển cảnh mượt mà giữa các tranh minh họa anime
  useEffect(() => {
    setArtOpacity(0.3);
    const img = new Image();
    img.src = currentArt.art;
    img.onload = () => {
      setLoadedArt(currentArt.art);
      setArtOpacity(1);
    };
    img.onerror = () => {
      setLoadedArt(currentArt.art);
      setArtOpacity(1);
    };
  }, [currentArt.art]);

  // Canvas Engine tích hợp HolidayEffects 60fps chuẩn gốc 24 Lễ hội
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let time = 2;
    let last = performance.now();
    let fxInstance: any = null;

    const setupEngine = () => {
      const HolidayEffects = (window as any).HolidayEffects;
      if (HolidayEffects?.Effects) {
        fxInstance = new HolidayEffects.Effects(canvas);
        fxInstance.amount = 0.85;
        fxInstance.setTheme({ id: currentArt.id, slug: currentArt.slug, name: currentArt.name });
      }
      handleResize();
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      if (fxInstance) {
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

    window.addEventListener("resize", handleResize);

    if ((window as any).HolidayEffects) {
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

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      if (fxInstance) {
        fxInstance.draw(time);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, currentArt]);

  return (
    <>
      {/* 1. LỚP TRANH MINH HỌA ANIME ĐỘC QUYỀN (WEBP NÉN TỐI ƯU TỪ SOURCE MASTER) */}
      <div
        className="festival-art-layer fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: `url("${loadedArt}")`,
          opacity: artOpacity,
        }}
      />

      {/* 2. LỚP PHỦ TƯƠNG PHẢN ĐA TẦNG (SHADE OVERLAY):
             Tôn vinh nhân vật anime 2 bên sườn & Giữ form trung tâm siêu nét, tương phản hoàn hảo */}
      <div
        className="festival-art-shade fixed inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* 3. CANVAS ENGINE HIỆU ỨNG TƯƠNG TÁC 60FPS CHUẨN 24 SCENES (PHÁO HOA, CÁ CHÉP, SAO BĂNG, HOA ĐĂNG...) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[2]"
        aria-hidden="true"
      />
    </>
  );
};
