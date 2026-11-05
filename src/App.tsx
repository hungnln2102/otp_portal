import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  KeyRound,
  Tv,
  Home,
  Mail,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Clock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Film,
  Zap,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Headphones,
} from "lucide-react";

type MainTab = "adobe" | "netflix";
type AdobeSubForm = 0 | 1; // 0: Lấy tài khoản, 1: OTP
type NetflixSubForm = 0 | 1 | 2; // 0: Hộ gia đình, 1: Mã 6 số, 2: OTP Đăng Nhập

interface AccountResult {
  account: string;
  password?: string;
  plan?: string;
  expired_at?: string;
  note?: string;
  status?: string;
}

interface OtpResult {
  code: string;
  subject?: string;
  from?: string;
  date?: string;
  message?: string;
  duration_ms?: number;
}

interface HouseholdResult {
  link: string;
  message?: string;
  cooldown?: number;
}

export const App: React.FC = () => {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<MainTab>("adobe");

  // Sliding Sub-Form Indexes
  const [adobeIndex, setAdobeIndex] = useState<AdobeSubForm>(1); // Default: OTP
  const [netflixIndex, setNetflixIndex] = useState<NetflixSubForm>(0); // Default: Hộ gia đình

  // Inputs
  const [adobeAccountSearch, setAdobeAccountSearch] = useState("");
  const [adobeOtpEmail, setAdobeOtpEmail] = useState("");
  const [netflixEmail, setNetflixEmail] = useState("");

  // Loading States
  const [loadingAdobeAccount, setLoadingAdobeAccount] = useState(false);
  const [loadingAdobeOtp, setLoadingAdobeOtp] = useState(false);
  const [loadingNetflix, setLoadingNetflix] = useState(false);

  // Cooldown Counters (seconds)
  const [adobeOtpCooldown, setAdobeOtpCooldown] = useState(0);
  const [netflixCooldown, setNetflixCooldown] = useState(0);

  // Results
  const [adobeAccountData, setAdobeAccountData] = useState<AccountResult | null>(null);
  const [adobeOtpData, setAdobeOtpData] = useState<OtpResult | null>(null);
  const [netflixHouseholdData, setNetflixHouseholdData] = useState<HouseholdResult | null>(null);
  const [netflixSixDigitData, setNetflixSixDigitData] = useState<string | null>(null);
  const [netflixOtpData, setNetflixOtpData] = useState<OtpResult | null>(null);

  // UI Helpers
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
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

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("success", "Đã sao chép vào bộ nhớ tạm!");
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  // ==========================================
  // HANDLERS: ADOBE
  // ==========================================
  const handleFetchAdobeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = adobeAccountSearch.trim();
    if (!query) {
      showToast("error", "Vui lòng nhập Email mua hàng hoặc Mã đơn hàng!");
      return;
    }

    try {
      setLoadingAdobeAccount(true);
      setAdobeAccountData(null);

      const res = await fetch("/api/public/otp/adobe/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: query }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setAdobeAccountData(data.data);
        showToast("success", "Đã tìm thấy thông tin tài khoản Adobe!");
      } else {
        showToast("error", data.error || data.message || "Không tìm thấy tài khoản với thông tin đã nhập.");
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối tra cứu tài khoản.");
    } finally {
      setLoadingAdobeAccount(false);
    }
  };

  const handleFetchAdobeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = adobeOtpEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("error", "Vui lòng nhập đúng định dạng Email Adobe!");
      return;
    }
    if (adobeOtpCooldown > 0) return;

    try {
      setLoadingAdobeOtp(true);
      setAdobeOtpData(null);

      const res = await fetch("/api/public/otp/adobe/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.otp) {
        setAdobeOtpData({
          code: data.otp,
          message: data.message,
          duration_ms: data.duration_ms,
        });
        setAdobeOtpCooldown(30);
        showToast("success", `Đã nhận mã OTP Adobe: ${data.otp}`);
      } else {
        setAdobeOtpCooldown(15);
        showToast("error", data.error || data.message || "Chưa tìm thấy mã OTP mới. Vui lòng bấm thử lại sau 15s.");
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối khi lấy mã OTP.");
    } finally {
      setLoadingAdobeOtp(false);
    }
  };

  // ==========================================
  // HANDLERS: NETFLIX
  // ==========================================
  const handleFetchNetflixAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = netflixEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("error", "Vui lòng nhập đúng định dạng Email Netflix!");
      return;
    }
    if (netflixCooldown > 0) return;

    try {
      setLoadingNetflix(true);

      if (netflixIndex === 0) {
        // Form 1: Hộ Gia Đình
        setNetflixHouseholdData(null);
        const res = await fetch("/api/public/otp/netflix/household", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && (data.ok || data.success) && data.link) {
          setNetflixHouseholdData({
            link: data.link,
            message: data.message || "Đã tìm thấy link xác minh hộ gia đình!",
          });
          setNetflixCooldown(30);
          showToast("success", "Đã lấy link xác minh Household thành công!");
        } else {
          setNetflixCooldown(15);
          showToast("error", data.error || data.message || "Không tìm thấy link hộ gia đình gần đây.");
        }
      } else if (netflixIndex === 1) {
        // Form 2: Mã 6 số TV
        setNetflixSixDigitData(null);
        const res = await fetch("/api/public/otp/netflix/six-digit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && (data.ok || data.success) && data.code) {
          setNetflixSixDigitData(data.code);
          setNetflixCooldown(30);
          showToast("success", `Đã nhận mã 6 số: ${data.code}`);
        } else {
          setNetflixCooldown(15);
          showToast("error", data.error || data.message || "Chưa tìm thấy mã 6 số. Vui lòng thử lại sau.");
        }
      } else {
        // Form 3: OTP Đăng Nhập
        setNetflixOtpData(null);
        const res = await fetch("/api/public/otp/netflix/login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && (data.ok || data.success) && data.code) {
          setNetflixOtpData({
            code: data.code,
            subject: data.subject,
            from: data.from,
            date: data.date,
            message: data.message,
          });
          setNetflixCooldown(30);
          showToast("success", `Đã nhận mã OTP Netflix: ${data.code}`);
        } else {
          setNetflixCooldown(15);
          showToast("error", data.error || data.message || "Chưa có thư OTP mới từ Netflix.");
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối tới cổng xác minh Netflix.");
    } finally {
      setLoadingNetflix(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-red-500/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Glow Orbs */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-red-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in fade-in slide-in-from-top-4 duration-200 text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50"
              : toast.type === "error"
              ? "bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/50"
              : "bg-slate-900/90 border-slate-700/60 text-slate-200 shadow-slate-950/50"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-400/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">MAVRYK PREMIUM</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  OTP HUB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Cổng Nhận Mã Xác Minh & Kích Hoạt Trực Tuyến</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hệ thống sẵn sàng
            </div>

            <button
              onClick={() => setShowFaqModal(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs font-medium flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Hướng Dẫn</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Trung Tâm Nhận Mã OTP & Tài Khoản
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Hệ thống cấp mã xác minh tự động dành riêng cho tài khoản{" "}
            <span className="text-red-400 font-semibold">Adobe Creative Cloud</span> và{" "}
            <span className="text-rose-400 font-semibold">Netflix Premium</span>.
          </p>
        </div>

        {/* 2 Main Product Tabs Switcher */}
        <div className="flex p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-md mx-auto mb-8 shadow-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("adobe")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "adobe"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-xs font-black">A</span>
            <span>Adobe CC</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "adobe" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              2 mục
            </span>
          </button>

          <button
            onClick={() => setActiveTab("netflix")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "netflix"
                ? "bg-gradient-to-r from-red-600 via-rose-700 to-black text-white shadow-lg shadow-rose-950/60 border border-rose-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Film className="w-4 h-4 text-red-500" />
            <span>Netflix</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "netflix" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              3 mục
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ADOBE CREATIVE CLOUD (2 FORMS TRƯỢT QUA LẠI)                       */}
        {/* ========================================================================= */}
        {activeTab === "adobe" && (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Header / Sub-Tab Pill Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/60 pb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Dịch vụ Adobe Creative Cloud
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Trượt qua lại để tra cứu tài khoản hoặc lấy mã OTP đăng nhập</p>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="flex p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdobeIndex(0)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    adobeIndex === 0
                      ? "bg-red-500 text-white shadow-md shadow-red-900/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Lấy Tài Khoản
                </button>
                <button
                  type="button"
                  onClick={() => setAdobeIndex(1)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    adobeIndex === 1
                      ? "bg-red-500 text-white shadow-md shadow-red-900/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Nhận OTP (6 số)
                </button>
              </div>
            </div>

            {/* Sliding Form Container (2 Panels: 0% and -100%) */}
            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-300 ease-out w-[200%]"
                style={{ transform: `translateX(-${adobeIndex * 50}%)` }}
              >
                {/* ----------------------------------------------------------- */}
                {/* ADOBE FORM 0: LẤY TÀI KHOẢN                                 */}
                {/* ----------------------------------------------------------- */}
                <div className="w-1/2 pr-2 sm:pr-4">
                  <form onSubmit={handleFetchAdobeAccount} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Mua Hàng hoặc Mã Đơn Hàng
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={adobeAccountSearch}
                          onChange={(e) => setAdobeAccountSearch(e.target.value)}
                          placeholder="Ví dụ: customer@gmail.com hoặc mã đơn 8 chữ số..."
                          className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Nhập email bạn đã dùng để đặt mua gói Adobe hoặc mã đơn hàng trên biên lai.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loadingAdobeAccount || !adobeAccountSearch.trim()}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingAdobeAccount ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Đang tra cứu hệ thống...
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            Tra Cứu / Lấy Tài Khoản
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdobeIndex(1)}
                        className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-all"
                        title="Đã có tài khoản? Chuyển sang lấy mã OTP"
                      >
                        Lấy OTP <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </form>

                  {/* Adobe Account Display Card */}
                  {adobeAccountData && (
                    <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Thông tin tài khoản được cấp
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {adobeAccountData.status || "ĐANG HOẠT ĐỘNG"}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Tài khoản (Email Adobe):</span>
                            <span className="font-mono font-medium text-slate-100 text-sm select-all">
                              {adobeAccountData.account}
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(adobeAccountData.account, "acc_email")}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            {copiedKey === "acc_email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {adobeAccountData.password && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase">Mật khẩu:</span>
                              <span className="font-mono font-medium text-slate-100 text-sm">
                                {showPassword ? adobeAccountData.password : "••••••••••••"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(adobeAccountData.password!, "acc_pass")}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                {copiedKey === "acc_pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {adobeAccountData.plan && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                            <span className="text-slate-400">Gói bản quyền:</span>
                            <span className="font-semibold text-slate-200">{adobeAccountData.plan}</span>
                          </div>
                        )}

                        {adobeAccountData.expired_at && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              Hạn dùng:
                            </span>
                            <span className="font-mono text-slate-300">{adobeAccountData.expired_at}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick jump to OTP */}
                      <button
                        type="button"
                        onClick={() => {
                          setAdobeOtpEmail(adobeAccountData.account);
                          setAdobeIndex(1);
                        }}
                        className="w-full py-2.5 px-3 bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        Đăng nhập Adobe và chuyển sang Lấy Mã OTP <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------------- */}
                {/* ADOBE FORM 1: LẤY MÃ OTP                                    */}
                {/* ----------------------------------------------------------- */}
                <div className="w-1/2 pl-2 sm:pl-4">
                  <form onSubmit={handleFetchAdobeOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Tài Khoản Adobe
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={adobeOtpEmail}
                          onChange={(e) => setAdobeOtpEmail(e.target.value)}
                          placeholder="Ví dụ: your-adobe-account@domain.com"
                          className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Bấm Đăng Nhập trên Adobe Creative Cloud trước, sau đó nhập email tại đây để nhận mã xác minh.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAdobeIndex(0)}
                        className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-all"
                        title="Quay lại tra cứu tài khoản"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 mr-0.5" /> Lấy Tài Khoản
                      </button>

                      <button
                        type="submit"
                        disabled={loadingAdobeOtp || adobeOtpCooldown > 0 || !adobeOtpEmail.trim()}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingAdobeOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Đang quét mã OTP...
                          </>
                        ) : adobeOtpCooldown > 0 ? (
                          <>
                            <Clock className="w-4 h-4" />
                            Vui lòng chờ {adobeOtpCooldown}s
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Lấy Mã OTP Adobe
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Adobe OTP Result Card */}
                  {adobeOtpData && (
                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-red-500/30 text-center space-y-4 shadow-xl shadow-red-950/30 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Mã Xác Minh Adobe Của Bạn
                      </span>

                      <div className="flex items-center justify-center gap-3 py-2">
                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-rose-400 select-all">
                          {adobeOtpData.code}
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(adobeOtpData.code, "adobe_otp")}
                          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-900/50"
                        >
                          {copiedKey === "adobe_otp" ? (
                            <>
                              <Check className="w-4 h-4 text-white" /> Đã Sao Chép!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Sao Chép Mã OTP
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        {adobeOtpData.message || "Mã OTP đã sẵn sàng. Hãy nhập ngay vào Adobe để hoàn tất đăng nhập."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: NETFLIX PREMIUM (3 FORMS TRƯỢT QUA LẠI)                            */}
        {/* ========================================================================= */}
        {activeTab === "netflix" && (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Header / Sub-Tab Pill Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/60 pb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  Dịch vụ Netflix Premium
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">3 chế độ xác minh: Hộ gia đình, Mã TV 6 số hoặc OTP Email</p>
              </div>

              {/* Sub-Tabs Pills (3 chế độ) */}
              <div className="flex p-1 bg-slate-950/70 border border-slate-800 rounded-xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setNetflixIndex(0)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    netflixIndex === 0
                      ? "bg-rose-600 text-white shadow-md shadow-rose-950/60"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Hộ Gia Đình
                </button>
                <button
                  type="button"
                  onClick={() => setNetflixIndex(1)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    netflixIndex === 1
                      ? "bg-rose-600 text-white shadow-md shadow-rose-950/60"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  Mã TV (6 số)
                </button>
                <button
                  type="button"
                  onClick={() => setNetflixIndex(2)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    netflixIndex === 2
                      ? "bg-rose-600 text-white shadow-md shadow-rose-950/60"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  OTP Đăng Nhập
                </button>
              </div>
            </div>

            {/* Sliding Form Container (3 Panels: 0%, -33.333%, -66.666%) */}
            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-300 ease-out w-[300%]"
                style={{ transform: `translateX(-${(netflixIndex * 100) / 3}%)` }}
              >
                {/* ----------------------------------------------------------- */}
                {/* NETFLIX FORM 0: HỘ GIA ĐÌNH                                 */}
                {/* ----------------------------------------------------------- */}
                <div className="w-1/3 px-2 sm:px-3">
                  <form onSubmit={handleFetchNetflixAction} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Netflix Cần Xác Minh Hộ Gia Đình
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={netflixEmail}
                          onChange={(e) => setNetflixEmail(e.target.value)}
                          placeholder="Ví dụ: netflix-account@domain.com"
                          className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Khi TV hiện thông báo "Cập nhật hộ gia đình Netflix", hãy gửi yêu cầu trên TV rồi nhập email tại đây.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingNetflix || netflixCooldown > 0 || !netflixEmail.trim()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingNetflix ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang tìm link Hộ gia đình...
                        </>
                      ) : netflixCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Vui lòng chờ {netflixCooldown}s
                        </>
                      ) : (
                        <>
                          <Home className="w-4 h-4" />
                          Lấy Link Xác Minh Hộ Gia Đình
                        </>
                      )}
                    </button>
                  </form>

                  {/* Netflix Household Result */}
                  {netflixHouseholdData && (
                    <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã tìm thấy link xác minh Household!
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono break-all text-slate-300 select-all max-h-24 overflow-y-auto">
                        {netflixHouseholdData.link}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(netflixHouseholdData.link, "nf_link")}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                        >
                          {copiedKey === "nf_link" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Sao Chép Link
                        </button>

                        <button
                          type="button"
                          onClick={() => window.open(netflixHouseholdData.link, "_blank")}
                          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/60 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mở Link Xác Minh
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        💡 <strong>Lưu ý:</strong> Vui lòng dùng điện thoại/laptop đang kết nối <strong>cùng mạng Wi-Fi</strong> với TV để mở link này xác nhận.
                      </p>
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------------- */}
                {/* NETFLIX FORM 1: MÃ 6 SỐ TV                                  */}
                {/* ----------------------------------------------------------- */}
                <div className="w-1/3 px-2 sm:px-3">
                  <form onSubmit={handleFetchNetflixAction} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Netflix (Đăng Nhập Trên TV)
                      </label>
                      <div className="relative">
                        <Tv className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={netflixEmail}
                          onChange={(e) => setNetflixEmail(e.target.value)}
                          placeholder="Ví dụ: netflix-account@domain.com"
                          className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Khi TV yêu cầu nhập mã 6 số (hoặc gửi mã đăng nhập về TV), bấm gửi trên TV rồi lấy mã tại đây.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingNetflix || netflixCooldown > 0 || !netflixEmail.trim()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingNetflix ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang tìm mã 6 số TV...
                        </>
                      ) : netflixCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Vui lòng chờ {netflixCooldown}s
                        </>
                      ) : (
                        <>
                          <Tv className="w-4 h-4" />
                          Lấy Mã TV 6 Số
                        </>
                      )}
                    </button>
                  </form>

                  {/* Netflix 6-digit Result */}
                  {netflixSixDigitData && (
                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-rose-500/30 text-center space-y-4 shadow-xl shadow-rose-950/30 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Mã Xác Minh TV 6 Số
                      </span>

                      <div className="flex items-center justify-center gap-2 py-2">
                        {netflixSixDigitData.split("").map((digit, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-slate-900 border border-rose-500/40 flex items-center justify-center text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 shadow-md shadow-rose-950/40"
                          >
                            {digit}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(netflixSixDigitData, "nf_six")}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-950/50"
                        >
                          {copiedKey === "nf_six" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                          Sao Chép Mã 6 Số
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Nhập 6 số này vào màn hình TV của bạn để đăng nhập ngay mà không cần mật khẩu.
                      </p>
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------------- */}
                {/* NETFLIX FORM 2: OTP ĐĂNG NHẬP (EMAIL CODE)                  */}
                {/* ----------------------------------------------------------- */}
                <div className="w-1/3 px-2 sm:px-3">
                  <form onSubmit={handleFetchNetflixAction} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Netflix (Mã OTP Đăng Nhập)
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={netflixEmail}
                          onChange={(e) => setNetflixEmail(e.target.value)}
                          placeholder="Ví dụ: netflix-account@domain.com"
                          className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Khi đăng nhập trên Trình duyệt / App điện thoại yêu cầu mã xác minh từ email, nhập email tại đây.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingNetflix || netflixCooldown > 0 || !netflixEmail.trim()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingNetflix ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang tìm mã OTP đăng nhập...
                        </>
                      ) : netflixCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Vui lòng chờ {netflixCooldown}s
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Lấy Mã OTP Đăng Nhập
                        </>
                      )}
                    </button>
                  </form>

                  {/* Netflix OTP Result */}
                  {netflixOtpData && (
                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-rose-500/30 text-center space-y-4 shadow-xl shadow-rose-950/30 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Mã OTP Đăng Nhập Netflix
                      </span>

                      <div className="flex items-center justify-center gap-3 py-2">
                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-rose-500 select-all">
                          {netflixOtpData.code}
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(netflixOtpData.code, "nf_otp")}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-950/50"
                        >
                          {copiedKey === "nf_otp" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                          Sao Chép Mã OTP
                        </button>
                      </div>

                      {netflixOtpData.subject && (
                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
                          <p><strong>Tiêu đề:</strong> {netflixOtpData.subject}</p>
                          {netflixOtpData.date && <p><strong>Thời gian nhận:</strong> {netflixOtpData.date}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick FAQ / Guide Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <Clock className="w-4 h-4 text-red-400" />
              Thời gian mã OTP
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mã OTP Adobe và Netflix thường có hiệu lực trong 5–15 phút. Nếu mã hết hạn, vui lòng gửi lại yêu cầu.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <Home className="w-4 h-4 text-rose-400" />
              Lỗi Hộ Gia Đình Netflix
            </div>
            <p className="text-slate-400 leading-relaxed">
              Hãy đảm bảo thiết bị mở link xác minh (điện thoại/máy tính) kết nối cùng Wi-Fi với TV của bạn để Netflix ghi nhận.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <Headphones className="w-4 h-4 text-emerald-400" />
              Hỗ Trợ Kỹ Thuật 24/7
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nếu không nhận được mã sau 2 lần thử, vui lòng nhắn tin trực tiếp cho bộ phận hỗ trợ Mavryk Premium để được trợ giúp.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Mavryk Premium. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Domain: otp.mavrykpremium.com</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bảo mật SSL 256-bit
            </span>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-400" />
                Hướng Dẫn Sử Dụng Chi Tiết
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-red-400 uppercase tracking-wider mb-1">1. Đối với Adobe Creative Cloud:</h4>
                <p>• <strong>Lấy tài khoản:</strong> Nhập email đã mua hàng hoặc mã đơn hàng để xem tài khoản, mật khẩu và hạn sử dụng.</p>
                <p>• <strong>Lấy mã OTP:</strong> Mở ứng dụng Adobe trên máy tính, nhập email tài khoản và bấm "Continue" (Tiếp tục) để Adobe gửi mã. Sau đó vào trang này nhập email và bấm "Lấy Mã OTP".</p>
              </div>

              <div>
                <h4 className="font-bold text-rose-400 uppercase tracking-wider mb-1">2. Đối với Netflix:</h4>
                <p>• <strong>Hộ Gia Đình:</strong> Khi màn hình TV hiện cảnh báo cập nhật hộ gia đình, bấm gửi yêu cầu trên TV. Sau đó vào trang này nhập email Netflix và bấm "Lấy Link Xác Minh". Mở link bằng điện thoại dùng chung Wi-Fi với TV.</p>
                <p>• <strong>Mã TV 6 số:</strong> Khi TV hiện màn hình chờ nhập 6 số xác minh, vào tab Mã 6 số để lấy mã và nhập vào TV.</p>
                <p>• <strong>OTP Đăng Nhập:</strong> Dành cho đăng nhập trên máy tính / điện thoại yêu cầu mã xác minh từ email.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowFaqModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

