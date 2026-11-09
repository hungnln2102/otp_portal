import { FestivalThemeType } from "../components/FestivalBackground";
import { FESTIVAL_THEMES, ThemeMeta } from "../constants/festivalThemes";
import { convertSolar2Lunar } from "../utils/lunarCalendar";
import { resolveScheduledTheme, ThemeScheduleConfig } from "./themeSchedule";

export interface PortalThemeConfig extends ThemeScheduleConfig {
  mode?: "fixed" | "auto";
  theme?: FestivalThemeType;
  updated_at?: string;
}

/**
 * Tự động xác định theme theo ngày thực tế (Hỗ trợ cả Âm Lịch Việt Nam & Dương Lịch)
 * Múi giờ Asia/Bangkok GMT+7
 */
export function getAutoThemeByDate(date: Date = new Date()): FestivalThemeType {
  // Lấy ngày, tháng, năm theo múi giờ Bangkok UTC+7
  const bangkokDateStr = date.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok" });
  const d = new Date(bangkokDateStr);
  const sDay = d.getDate();
  const sMonth = d.getMonth() + 1;
  const sYear = d.getFullYear();

  // Chuyển sang Âm Lịch
  const lunar = convertSolar2Lunar(sDay, sMonth, sYear);
  const ld = lunar.day;
  const lm = lunar.month;

  // 1. CÁC NGÀY LỄ ÂM LỊCH (Ưu tiên cao nhất)
  // Tết Nguyên Đán: 29/12 hoặc 30/12 Âm đến Mùng 4/1 Âm
  if ((lm === 12 && ld >= 29) || (lm === 1 && ld <= 4)) {
    return "tet";
  }

  // Ông Công Ông Táo: 23 Tháng Chạp (12 Âm)
  if (lm === 12 && ld === 23) {
    return "ong-tao";
  }

  // Rằm Tháng Giêng (Tết Nguyên Tiêu): 15/1 Âm
  if (lm === 1 && ld === 15) {
    return "nguyen-tieu";
  }

  // Tết Hàn Thực: 3/3 Âm
  if (lm === 3 && ld === 3) {
    return "han-thuc";
  }

  // Giỗ Tổ Hùng Vương: 10/3 Âm
  if (lm === 3 && ld === 10) {
    return "gio-to";
  }

  // Đại Lễ Phật Đản: 15/4 Âm
  if (lm === 4 && ld === 15) {
    return "phat-dan";
  }

  // Tết Đoan Ngọ: 5/5 Âm
  if (lm === 5 && ld === 5) {
    return "doan-ngo";
  }

  // Lễ Thất Tịch: 7/7 Âm
  if (lm === 7 && ld === 7) {
    return "that-tich";
  }

  // Đại Lễ Vu Lan: 15/7 Âm
  if (lm === 7 && ld === 15) {
    return "vu-lan";
  }

  // Tết Trung Thu: 14/8 và 15/8 Âm
  if (lm === 8 && (ld === 14 || ld === 15)) {
    return "trung-thu";
  }

  // 2. CÁC NGÀY LỄ DƯƠNG LỊCH
  // Tết Dương Lịch: 1/1 Dương
  if (sMonth === 1 && sDay === 1) return "tet-duong-lich";

  // Lễ Valentine: 14/2 Dương
  if (sMonth === 2 && sDay === 14) return "valentine";

  // Quốc Tế Phụ Nữ: 8/3 Dương
  if (sMonth === 3 && sDay === 8) return "quoc-te-phu-nu";

  // Giải Phóng Miền Nam: 30/4 Dương
  if (sMonth === 4 && sDay === 30) return "thong-nhat";

  // Quốc Tế Lao Động: 1/5 Dương
  if (sMonth === 5 && sDay === 1) return "lao-dong";

  // Quốc Tế Thiếu Nhi: 1/6 Dương
  if (sMonth === 6 && sDay === 1) return "thieu-nhi";

  // Ngày Gia Đình Việt Nam: 28/6 Dương
  if (sMonth === 6 && sDay === 28) return "gia-dinh";

  // Quốc Khánh: 2/9 Dương
  if (sMonth === 9 && sDay === 2) return "quoc-khanh";

  // Phụ Nữ Việt Nam: 20/10 Dương
  if (sMonth === 10 && sDay === 20) return "phu-nu-vn";

  // Halloween: 31/10 Dương
  if (sMonth === 10 && sDay === 31) return "halloween";

  // Nhà Giáo Việt Nam: 20/11 Dương
  if (sMonth === 11 && sDay === 20) return "nha-giao";

  // Quân Đội Nhân Dân VN: 22/12 Dương
  if (sMonth === 12 && sDay === 22) return "qdnd-vn";

  // Giáng Sinh Noel: 24/12 & 25/12 Dương
  if (sMonth === 12 && (sDay === 24 || sDay === 25)) return "giang-sinh";

  // Mặc định ngày thường không có lễ hội: Cyber Core
  return "modern";
}

/**
 * Gọi API lấy cấu hình theme từ backend admin_orderlist (/api/public/theme)
 * Có cơ chế âm thầm chịu lỗi (silent fallback) nếu server chưa mount endpoint.
 */
export async function fetchRemoteThemeConfig(): Promise<PortalThemeConfig | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500); // Timeout 3.5s

    const res = await fetch("/api/public/theme", {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data.success || data.ok)) {
      return data.config || data.data || data;
    }
    return null;
  } catch {
    return null; // Fallback mượt mà nếu offline hoặc backend chưa có route
  }
}

/**
 * Hàm điều phối Theme tối cao (Resolver):
 * 1. Nếu Admin cố định theme -> Lấy theme cố định từ backend admin_orderlist.
 * 2. Nếu Admin để tự động (hoặc backend chưa online) -> Tự động nhận diện theo ngày lễ thực tế (kết hợp cả Âm & Dương lịch).
 */
export async function resolvePortalTheme(): Promise<FestivalThemeType> {
  // 0. Cho phép xem trước trực tiếp qua URL query param ?theme=... (tiện lợi cho Admin/Master test nhanh)
  try {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryTheme = params.get("theme") as FestivalThemeType | null;
      if (queryTheme && FESTIVAL_THEMES.some((t) => t.id === queryTheme)) {
        return queryTheme;
      }
    }
  } catch {}

  const remote = await fetchRemoteThemeConfig();

  if (remote?.mode === "fixed" && remote.theme && FESTIVAL_THEMES.some((t) => t.id === remote.theme)) {
    return remote.theme;
  }

  const targetSchedule = (remote && ((remote as any).schedule || remote)) as ThemeScheduleConfig | undefined;
  const scheduledTheme = targetSchedule ? resolveScheduledTheme(targetSchedule, new Date()) : null;
  if (scheduledTheme && FESTIVAL_THEMES.some((t) => t.id === scheduledTheme)) {
    return scheduledTheme;
  }

  return getAutoThemeByDate(new Date());
}

/**
 * Lấy metadata chi tiết của theme hiện hành
 */
export function getThemeMeta(themeId: FestivalThemeType): ThemeMeta {
  return FESTIVAL_THEMES.find((t) => t.id === themeId) || FESTIVAL_THEMES[0];
}
