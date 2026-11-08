import { convertSolar2Lunar } from "../utils/lunarCalendar";
import { FestivalThemeType } from "../components/FestivalBackground";

export type ThemeCalendarType = "solar" | "lunar";

export interface ThemeDateRule {
  id: string;
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

export interface ThemeScheduleConfig {
  defaultTheme?: FestivalThemeType;
  seasonRules?: SeasonThemeRule[];
  holidayRules?: ThemeDateRule[];
}

function isInRecurringRange(month: number, day: number, rule: ThemeDateRule): boolean {
  const value = month * 32 + day;
  const start = rule.startMonth * 32 + rule.startDay;
  const end = rule.endMonth * 32 + rule.endDay;
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

export function resolveScheduledTheme(config: ThemeScheduleConfig, date: Date): FestivalThemeType | null {
  if (!Array.isArray(config.holidayRules) || !Array.isArray(config.seasonRules)) return null;
  const bangkokDate = new Date(date.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok" }));
  const solarDay = bangkokDate.getDate();
  const solarMonth = bangkokDate.getMonth() + 1;
  const lunar = convertSolar2Lunar(solarDay, solarMonth, bangkokDate.getFullYear());

  const holiday = config.holidayRules.find((rule) => {
    if (!rule.enabled) return false;
    const month = rule.calendarType === "lunar" ? lunar.month : solarMonth;
    const day = rule.calendarType === "lunar" ? lunar.day : solarDay;
    return isInRecurringRange(month, day, rule);
  });
  if (holiday) return holiday.theme;

  const season = config.seasonRules.find((rule) => {
    return rule.startMonth <= rule.endMonth
      ? solarMonth >= rule.startMonth && solarMonth <= rule.endMonth
      : solarMonth >= rule.startMonth || solarMonth <= rule.endMonth;
  });
  return season?.theme || config.defaultTheme || null;
}