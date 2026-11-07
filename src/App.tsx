import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Film,
  ShieldCheck,
} from "lucide-react";
import { FestivalBackground, FestivalThemeType } from "./components/FestivalBackground";
import { MainTab, ToastMessage } from "./types/otp";
import { FestivalStage } from "./features/festivals/components/FestivalStage";
import { AdobeSection } from "./features/adobe/components/AdobeSection";
import { NetflixSection } from "./features/netflix/components/NetflixSection";
import { TwoFactorSection } from "./features/twoFactor/components/TwoFactorSection";
import { FaqModal } from "./components/FaqModal";
import {
  getAutoThemeByDate,
  resolvePortalTheme,
  getThemeMeta,
} from "./services/themeService";
import "./styles/festival-themes.css";

export const App: React.FC = () => {
  // Theme State: Khởi tạo ngay lập tức theo ngày lễ thực tế (Zero Flicker)
  const [theme, setTheme] = useState<FestivalThemeType>(() => getAutoThemeByDate(new Date()));

  // Gọi ngầm cấu hình theme từ admin_orderlist (/api/public/theme) nếu Admin có cài đặt cố định
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

  // Main Tab State (Adobe vs Netflix vs 2FA)
  const [activeTab, setActiveTab] = useState<MainTab>("adobe");

  // Cooldown Counters (seconds)
  const [adobeOtpCooldown, setAdobeOtpCooldown] = useState(0);
  const [netflixCooldown, setNetflixCooldown] = useState(0);

  // UI Helpers
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Tick cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setAdobeOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setNetflixCooldown((prev) => (prev > 0 ? prev - 1 : 0));
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
    <div className="h-screen max-h-screen overflow-hidden text-[var(--ink)] flex flex-col justify-between relative selection:bg-[var(--accent)] selection:text-[var(--ground)]">
      {/* 1. NỀN KHÔNG GIAN LỄ HỘI: CANVAS HẠT 60FPS + BỘ VISUAL CHUYỂN ĐỘNG 2 BÊN SƯỜN */}
      <FestivalBackground theme={theme} />

      {/* 2. TOAST THÔNG BÁO NỔI */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl border transition-all animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-bold ${
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
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
                  SECURE OTP
                </span>
              </div>
              <p className="text-[10px] text-[var(--soft)] hidden sm:block">
                Cổng Cấp Mã Xác Minh & Tra Cứu Bản Quyền Trực Tuyến
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-[var(--line)]"
              style={{ background: "rgba(0, 0, 0, 0.4)", color: "var(--soft)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>Hệ thống trực tuyến</span>
            </div>

            <button
              onClick={() => setShowFaqModal(true)}
              className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] transition-all flex items-center gap-1.5 hover:brightness-125"
              style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Hướng Dẫn</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4. SÂN KHẤU CHÍNH: MAIN STAGE CARD LUXURY GLASSMORPHISM */}
      <main className="main-stage flex-1 flex flex-col justify-center items-center px-4 py-2 relative z-10 overflow-hidden">
        {/* Hero Title Stage (Bên ngoài card) */}
        <FestivalStage
          title={currentThemeMeta.title}
          subtitle={currentThemeMeta.subtitle}
        />

        {/* Central Glassmorphism Card */}
        <div
          className="max-w-2xl w-full rounded-[26px] border border-[var(--line)] backdrop-blur-2xl p-4 sm:p-6 text-center relative overflow-hidden transition-all duration-300"
          style={{
            background: "var(--panel)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px var(--glow)",
          }}
        >
          {/* Main Product Tabs Switcher [Adobe | Netflix | 2FA] */}
          <div
            className="flex p-1 rounded-xl max-w-md mx-auto mb-4 border border-[var(--line)] shadow-lg"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("adobe")}
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
              onClick={() => setActiveTab("netflix")}
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
              onClick={() => setActiveTab("two_factor")}
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

          {/* Form Content: Adobe or Netflix or 2FA */}
          {activeTab === "adobe" && (
            <AdobeSection
              cooldown={adobeOtpCooldown}
              setCooldown={setAdobeOtpCooldown}
              showToast={showToast}
              copiedKey={copiedKey}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === "netflix" && (
            <NetflixSection
              cooldown={netflixCooldown}
              setCooldown={setNetflixCooldown}
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
          <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--soft)]">
            <span>© 2026 Mavryk Premium • Bảo mật SSL 256-bit</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>API Gateway: <strong>Hoạt động</strong></span>
            </div>
          </div>
        </div>
      </main>

      {/* 5. MODAL HƯỚNG DẪN CHI TIẾT */}
      <FaqModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />
    </div>
  );
};

export default App;
