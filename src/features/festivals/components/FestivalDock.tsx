import React from "react";
import { FestivalThemeType } from "../../../components/FestivalBackground";
import { SeasonFilter, ThemeMeta, SEASON_TABS } from "../../../constants/festivalThemes";

interface FestivalDockProps {
  theme: FestivalThemeType;
  onThemeChange: (theme: FestivalThemeType) => void;
  selectedSeason: SeasonFilter;
  onSelectSeason: (season: SeasonFilter) => void;
  themes: ThemeMeta[];
}

export const FestivalDock: React.FC<FestivalDockProps> = ({
  theme,
  onThemeChange,
  selectedSeason,
  onSelectSeason,
  themes,
}) => {
  const filteredThemes =
    selectedSeason === "all" ? themes : themes.filter((t) => t.season === selectedSeason);

  return (
    <div className="festival-dock-container">
      {/* Thanh Chọn Mùa */}
      <div className="festival-season-tabs" role="tablist" aria-label="Lọc mùa lễ hội">
        {SEASON_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selectedSeason === tab.id}
            onClick={() => onSelectSeason(tab.id)}
            className={`season-tab-btn ${selectedSeason === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Thanh Cuộn Ngang Danh Sách Lễ Hội Tương Ứng */}
      <nav className="festival-dock" aria-label="Chọn chủ đề lễ hội">
        {filteredThemes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onThemeChange(t.id)}
            className={`dock-item ${theme === t.id ? "active" : ""}`}
            title={t.badge}
          >
            <span>{t.icon}</span>
            <span>{t.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
