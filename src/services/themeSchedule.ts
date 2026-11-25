import { convertSolar2Lunar } from "../utils/lunarCalendar";
import { FestivalThemeType } from "../components/FestivalBackground";

export type ThemeCalendarType = "solar" | "lunar";
export type ThemeBackgroundMode = "fixed_default" | "seasonal_4seasons" | "cycle_loop";

export interface ThemeDateRule {
  id: string;
  name?: string;
  calendarType: ThemeCalendarType;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  theme: FestivalThemeType;
  enabled: boolean;
}

export interface SeasonThemeRule {
  id: string;
  startMonth: number;
  endMonth: number;
  theme: FestivalThemeType;
}

export interface ThemeCycleConfig {
  themes: FestivalThemeType[];
  intervalDays: number;
  startDate: string; // YYYY-MM-DD
}

export interface ThemeScheduleConfig {
  backgroundMode?: ThemeBackgroundMode;
  respectHolidays?: boolean;
  defaultTheme?: FestivalThemeType;
  cycleConfig?: ThemeCycleConfig;
  seasonRules?: SeasonThemeRule[];
  holidayRules?: ThemeDateRule[];
}

function isInRecurringRange(month: number, day: number, rule: ThemeDateRule): boolean {
  const value = month * 32 + day;
  const start = rule.startMonth * 32 + rule.startDay;
  const end = rule.endMonth * 32 + rule.endDay;
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

function resolveCycleTheme(
  cycleConfig: ThemeCycleConfig | undefined,
  solarDay: number,
  solarMonth: number,
  solarYear: number
): FestivalThemeType | null {
  const themes = cycleConfig?.themes;
  if (!Array.isArray(themes) || themes.length === 0) return null;

  const intervalDays = Math.max(1, Math.trunc(cycleConfig?.intervalDays || 1));
  const [sy, sm, sd] = (cycleConfig?.startDate || "2026-01-01").split("-").map(Number);
  const startUtc = Date.UTC(sy || 2026, (sm || 1) - 1, sd || 1);
  const targetUtc = Date.UTC(solarYear, solarMonth - 1, solarDay);
  const diffDays = Math.floor((targetUtc - startUtc) / 86_400_000);
  const slot = Math.floor(diffDays / intervalDays);
  const idx = ((slot % themes.length) + themes.length) % themes.length;
  return themes[idx] || null;
}

export function resolveScheduledTheme(config: ThemeScheduleConfig, date: Date): FestivalThemeType | null {
  const bangkokDate = new Date(date.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok" }));
  const solarDay = bangkokDate.getDate();
  const solarMonth = bangkokDate.getMonth() + 1;
  const solarYear = bangkokDate.getFullYear();
  const lunar = convertSolar2Lunar(solarDay, solarMonth, solarYear);

  if (config.respectHolidays !== false && Array.isArray(config.holidayRules)) {
    const holiday = config.holidayRules.find((rule) => {
      if (!rule.enabled) return false;
      const month = rule.calendarType === "lunar" ? lunar.month : solarMonth;
      const day = rule.calendarType === "lunar" ? lunar.day : solarDay;
      return isInRecurringRange(month, day, rule);
    });
    if (holiday) return holiday.theme;
  }

  if (config.backgroundMode === "cycle_loop") {
    const cycleTheme = resolveCycleTheme(config.cycleConfig, solarDay, solarMonth, solarYear);
    if (cycleTheme) return cycleTheme;
  }

  if (
    config.backgroundMode === "seasonal_4seasons" ||
    (!config.backgroundMode && Array.isArray(config.seasonRules))
  ) {
    const season = (config.seasonRules || []).find((rule) => {
      return rule.startMonth <= rule.endMonth
        ? solarMonth >= rule.startMonth && solarMonth <= rule.endMonth
        : solarMonth >= rule.startMonth || solarMonth <= rule.endMonth;
    });
    if (season?.theme) return season.theme;
  }

  return config.defaultTheme || "modern";
}
