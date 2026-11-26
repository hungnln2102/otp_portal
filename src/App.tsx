import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Film,
  Bot,
  ShieldCheck,
  Tag,
  KeyRound,
  Home,
} from "lucide-react";
import { FestivalBackground, FestivalThemeType } from "./components/FestivalBackground";
import { ToastMessage } from "./types/otp";
import { FestivalStage } from "./features/festivals/components/FestivalStage";
import { AdobeSection } from "./features/adobe/components/AdobeSection";
import { NetflixSection } from "./features/netflix/components/NetflixSection";
import { GptSection } from "./features/gpt/components/GptSection";
import { TwoFactorSection } from "./features/twoFactor/components/TwoFactorSection";
import { PublicPricePage } from "./features/pricing";
import { PortalHomePage } from "./features/home";
import { FaqModal } from "./components/FaqModal";
import { ENTRY_WAIT_SECONDS, useEntryWaitTimer } from "./hooks/useEntryWaitTimer";
import { usePortalRoute } from "./config/portalRoutes";
import {
  getAutoThemeByDate,
  resolvePortalTheme,
  getThemeMeta,
} from "./services/themeService";
import "./styles/festival-themes.css";

export const App: React.FC = () => {
  // Theme State: Khởi tạo ngay lập tức theo URL param ?theme= hoặc ngày lễ thực tế (Zero Flicker)
  const [theme, setTheme] = useState<FestivalThemeType>(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const queryTheme = params.get("theme") as FestivalThemeType | null;
        if (queryTheme) return queryTheme;
      }
    } catch {}
    return getAutoThemeByDate(new Date());
  });

  useEffect(() => {
    let isMounted = true;
    resolvePortalTheme().then((resolvedTheme) => {
      if (isMounted && resolvedTheme) {
        setTheme(resolvedTheme);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentThemeMeta = getThemeMeta(theme);

  // Điều hướng 3 chế độ: Trang chủ (/), Hệ thống (/system/<slug>) và Bảng Giá (/price)
  const {
    pageMode,
    activeTab,
    activeSubTab,
    navigateToHome,
    navigateToPrice,
    navigateToTab,
    navigateToSubTab,
  } = usePortalRoute();
  const isHomePage = pageMode === "home";
  const isPricePage = pageMode === "price";

  useEffect(() => {
    if (isPricePage) {
      document.title = "Bảng Giá Dịch Vụ — Mavryk Premium";
    } else if (isHomePage) {
      document.title = "Mavryk Premium — Hệ Thống & Bảng Giá Chính Thức";
    } else {
      document.title = "Mavryk Premium — Cổng Nhận Mã OTP & Kích Hoạt";
    }
  }, [isHomePage, isPricePage]);

  // Cooldown Counters (seconds)
  const [adobeOtpCooldown, setAdobeOtpCooldown] = useState(0);
  const [netflixCooldown, setNetflixCooldown] = useState(0);
  const [gptCooldown, setGptCooldown] = useState(0);

  // Bộ đếm chờ bắt buộc 30s ngay khi vừa vào trang trước khi cho điền đơn lấy OTP
  const entryWaitSeconds = useEntryWaitTimer(ENTRY_WAIT_SECONDS);

  // UI Helpers
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Tick cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setAdobeOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setNetflixCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setGptCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToast({ type, text });
  };

  const copyToClipboard = (text: string, key: string, label?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("success", label || "Đã sao chép vào bộ nhớ tạm!");
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <div
      className={`${
        isPricePage
          ? "h-screen max-h-screen overflow-hidden"
          : "min-h-screen md:h-screen md:max-h-screen md:overflow-hidden overflow-x-hidden"
      } text-[var(--ink)] flex flex-col justify-between relative selection:bg-[var(--accent)] selection:text-[var(--ground)]`}
    >
      {/* 1. NỀN KHÔNG GIAN LỄ HỘI: CANVAS HẠT 60FPS + BỘ VISUAL CHUYỂN ĐỘNG 2 BÊN SƯỜN */}
      <FestivalBackground theme={theme} />

      {/* 2. TOAST THÔNG BÁO NỔI */}
      {toast && (
        <div
          className={`fixed top-[68px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl backdrop-blur-2xl border transition-all animate-in fade-in slide-in-from-top-3 duration-300 text-xs font-bold max-w-[calc(100vw-2rem)] ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/60"
              : toast.type === "error"
              ? "bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/60"
              : "bg-slate-900/90 border-slate-600/50 text-slate-200 shadow-black/60"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* 3. HEADER TOPBAR GỌN GÀNG */}
      <header className="relative z-20 border-b border-[var(--line)] bg-[var(--panel)] backdrop-blur-xl h-14 flex items-center shrink-0">
        <div className={`${isPricePage ? "max-w-7xl" : "max-w-5xl"} w-full mx-auto px-4 sm:px-6 flex items-center justify-between`}>
          <button
            type="button"
            onClick={navigateToHome}
            title="Về trang chủ Mavryk Premium"
            className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-md border border-[var(--line)]"
              style={{ background: "var(--btn)", color: "var(--btn-ink)", boxShadow: "0 2px 10px var(--glow)" }}
            >
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-xs sm:text-sm text-[var(--ink)]">
                  MAVRYK PREMIUM
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--line)]"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--accent)" }}
                >
                  {isPricePage ? "PRICE LIST" : isHomePage ? "PORTAL" : "SECURE OTP"}
                </span>
              </div>
              <p className="text-[10px] text-[var(--soft)] hidden sm:block">
                {isPricePage
                  ? "Bảng Giá Dịch Vụ & Phần Mềm Bản Quyền Chính Thức"
                  : isHomePage
                  ? "Trung Tâm Dịch Vụ & Cấp Mã Bản Quyền Chính Thức"
                  : "Cổng Cấp Mã Xác Minh & Tra Cứu Bản Quyền Trực Tuyến"}
              </p>
            </div>
          </button>

            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-[var(--line)]"
                style={{ background: "rgba(0, 0, 0, 0.4)", color: "var(--soft)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span>Hệ thống trực tuyến</span>
              </div>

              {isHomePage ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigateToTab(activeTab)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "var(--btn)", color: "var(--btn-ink)" }}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Hệ Thống</span>
                  </button>

                  <button
                    type="button"
                    onClick={navigateToPrice}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <Tag className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Bảng Giá</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFaqModal(true)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="hidden sm:inline">Hướng Dẫn</span>
                  </button>
                </>
              ) : isPricePage ? (
                <>
                  <button
                    type="button"
                    onClick={navigateToHome}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <Home className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="hidden sm:inline">Trang Chủ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToTab(activeTab)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Hệ Thống</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={navigateToHome}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <Home className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="hidden sm:inline">Trang Chủ</span>
                  </button>

                  <button
                    type="button"
                    onClick={navigateToPrice}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <Tag className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Bảng Giá</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFaqModal(true)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Hướng Dẫn</span>
                  </button>
                </>
              )}
            </div>
        </div>
      </header>

      {/* 4. SÂN KHẤU CHÍNH: TRANG CHỦ (/), TRANG BẢNG GIÁ (/price) HOẶC CỔNG OTP (/system/*) */}
      {isHomePage ? (
        <PortalHomePage
          themeTitle={currentThemeMeta.title}
          themeSubtitle={currentThemeMeta.subtitle}
          onNavigateSystem={() => navigateToTab(activeTab)}
          onNavigatePrice={navigateToPrice}
        />
      ) : isPricePage ? (
        <PublicPricePage />
      ) : (
      <main className="main-stage flex-1 min-h-0 flex flex-col justify-center items-center px-3 sm:px-4 py-2 relative z-10">
        {/* Hero Title Stage (Bên ngoài card) */}
        <FestivalStage
          title={currentThemeMeta.title}
          subtitle={currentThemeMeta.subtitle}
        />

        {/* Central Glassmorphism Card */}
        <div
          className="max-w-2xl w-full rounded-[24px] border border-[var(--line)] backdrop-blur-2xl p-3.5 sm:p-5 text-center relative transition-all duration-300"
          style={{
            background: "var(--panel)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px var(--glow)",
          }}
        >
          {/* Main Product Tabs Switcher [Adobe | Netflix | 2FA] */}
          <div
            className="flex p-1 rounded-xl max-w-md mx-auto mb-3 border border-[var(--line)] shadow-lg"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <button
              type="button"
              onClick={() => navigateToTab("adobe")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: activeTab === "adobe" ? "var(--btn)" : "transparent",
                color: activeTab === "adobe" ? "var(--btn-ink)" : "var(--soft)",
                boxShadow: activeTab === "adobe" ? "0 2px 12px var(--glow)" : "none",
              }}
            >
              <span className="w-4 h-4 rounded bg-black/20 flex items-center justify-center text-[10px] font-black">
                A
              </span>
              <span>Adobe</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab("netflix")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: activeTab === "netflix" ? "var(--btn)" : "transparent",
                color: activeTab === "netflix" ? "var(--btn-ink)" : "var(--soft)",
                boxShadow: activeTab === "netflix" ? "0 2px 12px var(--glow)" : "none",
              }}
            >
              <Film className="w-3.5 h-3.5 shrink-0" />
              <span>Netflix</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab("gpt")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: activeTab === "gpt" ? "var(--btn)" : "transparent",
                color: activeTab === "gpt" ? "var(--btn-ink)" : "var(--soft)",
                boxShadow: activeTab === "gpt" ? "0 2px 12px var(--glow)" : "none",
              }}
            >
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span>GPT</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab("two_factor")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: activeTab === "two_factor" ? "var(--btn)" : "transparent",
                color: activeTab === "two_factor" ? "var(--btn-ink)" : "var(--soft)",
                boxShadow: activeTab === "two_factor" ? "0 2px 12px var(--glow)" : "none",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>2FA</span>
            </button>
          </div>

          {/* Form Content: Adobe or Netflix or GPT or 2FA */}
          {activeTab === "adobe" && (
            <AdobeSection
              activeSubTab={activeSubTab === 1 ? 1 : 2}
              onSubTabChange={(sub) => navigateToSubTab("adobe", sub)}
              cooldown={adobeOtpCooldown}
              setCooldown={setAdobeOtpCooldown}
              entryWaitSeconds={entryWaitSeconds}
              showToast={showToast}
              copiedKey={copiedKey}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === "netflix" && (
            <NetflixSection
              activeSubTab={activeSubTab === 1 || activeSubTab === 2 ? activeSubTab : 0}
              onSubTabChange={(sub) => navigateToSubTab("netflix", sub)}
              cooldown={netflixCooldown}
              setCooldown={setNetflixCooldown}
              entryWaitSeconds={entryWaitSeconds}
              showToast={showToast}
              copiedKey={copiedKey}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === "gpt" && (
            <GptSection
              activeSubTab={activeSubTab === 0 ? 0 : 1}
              onSubTabChange={(sub) => navigateToSubTab("gpt", sub)}
              cooldown={gptCooldown}
              setCooldown={setGptCooldown}
              entryWaitSeconds={entryWaitSeconds}
              showToast={showToast}
              copiedKey={copiedKey}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === "two_factor" && (
            <TwoFactorSection
              showToast={showToast}
              copiedKey={copiedKey}
              copyToClipboard={copyToClipboard}
            />
          )}

          {/* Footer Card */}
          <div className="pt-2.5 mt-2.5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--soft)]">
            <span>© 2026 Mavryk Premium • Bảo mật SSL 256-bit</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>API Gateway: <strong>Hoạt động</strong></span>
            </div>
          </div>
        </div>
      </main>
      )}

      {/* 5. MODAL HƯỚNG DẪN CHI TIẾT */}
      <FaqModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />
    </div>
  );
};

export default App;
