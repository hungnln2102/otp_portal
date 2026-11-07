import React, { useState } from "react";
import {
  KeyRound,
  Zap,
  User,
  Mail,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
} from "lucide-react";
import { AccountResult, OtpResult, AdobeSubForm } from "../../../types/otp";
import { fetchAdobeAccount, fetchAdobeOtp } from "../../../services/otpService";
import { OtpPinDisplay } from "../../../components/OtpPinDisplay";

interface AdobeSectionProps {
  cooldown: number;
  setCooldown: (seconds: number) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  copiedKey: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const AdobeSection: React.FC<AdobeSectionProps> = ({
  cooldown,
  setCooldown,
  showToast,
  copiedKey,
  copyToClipboard,
}) => {
  const [adobeIndex, setAdobeIndex] = useState<AdobeSubForm>(1); // Default: OTP
  const [adobeAccountSearch, setAdobeAccountSearch] = useState("");
  const [adobeOtpEmail, setAdobeOtpEmail] = useState("");

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const [accountData, setAccountData] = useState<AccountResult | null>(null);
  const [otpData, setOtpData] = useState<OtpResult | null>(null);

  const handleFetchAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = adobeAccountSearch.trim();
    if (!query) {
      showToast("error", "Vui lòng nhập Email mua hàng hoặc Mã đơn hàng!");
      return;
    }

    try {
      setLoadingAccount(true);
      setAccountData(null);

      const res = await fetchAdobeAccount(query);
      if (res.success && res.data) {
        setAccountData(res.data);
        showToast("success", "Đã tìm thấy thông tin tài khoản Adobe!");
      } else {
        showToast("error", res.error || res.message || "Không tìm thấy tài khoản với thông tin đã nhập.");
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối tra cứu tài khoản.");
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleFetchOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = adobeOtpEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("error", "Vui lòng nhập đúng định dạng Email Adobe!");
      return;
    }
    if (cooldown > 0) return;

    try {
      setLoadingOtp(true);
      setOtpData(null);

      const res = await fetchAdobeOtp(email);
      if (res.success && res.otp) {
        setOtpData({
          code: res.otp,
          message: res.message,
          duration_ms: res.duration_ms,
        });
        setCooldown(30);
        showToast("success", `Đã nhận mã OTP Adobe: ${res.otp}`);
      } else {
        setCooldown(15);
        showToast("error", res.error || res.message || "Chưa tìm thấy mã OTP mới. Vui lòng thử lại sau 15s.");
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối khi lấy mã OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="text-left space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
        <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
          Adobe Creative Cloud
        </span>

        <div
          className="flex p-0.5 rounded-lg border border-[var(--line)]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <button
            type="button"
            onClick={() => setAdobeIndex(0)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: adobeIndex === 0 ? "var(--btn)" : "transparent",
              color: adobeIndex === 0 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: adobeIndex === 0 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            <KeyRound className="w-3 h-3" />
            Lấy Tài Khoản
          </button>

          <button
            type="button"
            onClick={() => setAdobeIndex(1)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: adobeIndex === 1 ? "var(--btn)" : "transparent",
              color: adobeIndex === 1 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: adobeIndex === 1 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            <Zap className="w-3 h-3" />
            Nhận OTP
          </button>
        </div>
      </div>

      {/* Sliding Form Panels */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-300 ease-out w-[200%]"
          style={{ transform: `translateX(-${adobeIndex * 50}%)` }}
        >
          {/* ADOBE FORM 0: LẤY TÀI KHOẢN */}
          <div className="w-1/2 pr-2">
            <form onSubmit={handleFetchAccount} className="space-y-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)]" />
                  <input
                    type="text"
                    required
                    value={adobeAccountSearch}
                    onChange={(e) => setAdobeAccountSearch(e.target.value)}
                    placeholder="Nhập Email mua hàng hoặc Mã đơn hàng..."
                    className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border border-[var(--line)]"
                    style={{ background: "rgba(0, 0, 0, 0.45)" }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loadingAccount || !adobeAccountSearch.trim()}
                  className="btn-cta flex-1"
                  style={{ padding: "10px 16px" }}
                >
                  {loadingAccount ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Đang tra cứu...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span>Tra Cứu Tài Khoản</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAdobeIndex(1)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--line)] flex items-center gap-1 transition-all hover:brightness-125"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                >
                  Lấy OTP <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </form>

            {accountData && (
              <div
                className="mt-3 p-3.5 rounded-xl border border-[var(--line)] space-y-2 text-xs animate-in fade-in zoom-in-95 duration-200"
                style={{ background: "rgba(0, 0, 0, 0.55)" }}
              >
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                  <span className="font-bold text-[var(--soft)] uppercase flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tài Khoản Được Cấp
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {accountData.status || "ĐANG HOẠT ĐỘNG"}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {/* Email Tài Khoản */}
                  <div className="flex items-center justify-between p-2 rounded-lg border border-[var(--line)]" style={{ background: "rgba(0, 0, 0, 0.35)" }}>
                    <span className="font-mono font-bold text-[var(--ink)] truncate max-w-[280px]">
                      {accountData.account}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accountData.account, "acc_email", "Đã chép Email Adobe!")}
                      className="p-1 rounded border border-[var(--line)]"
                      title="Sao chép Email"
                    >
                      <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </button>
                  </div>

                  {/* Mật Khẩu */}
                  {accountData.password && (
                    <div className="flex items-center justify-between p-2 rounded-lg border border-[var(--line)]" style={{ background: "rgba(0, 0, 0, 0.35)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--soft)] text-[10px] uppercase font-semibold">Mật khẩu:</span>
                        <span className="font-mono font-bold text-amber-300">
                          {accountData.password}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(accountData.password!, "acc_pass", "Đã chép Mật khẩu Adobe!")}
                        className="p-1 rounded border border-[var(--line)]"
                        title="Sao chép Mật khẩu"
                      >
                        <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                      </button>
                    </div>
                  )}

                  {/* Gói cước & Hạn sử dụng */}
                  <div className="flex items-center justify-between text-[10px] text-[var(--soft)] pt-1">
                    <span>Gói: <strong>{accountData.plan || "Adobe CC All Apps"}</strong></span>
                    <span>Hạn: <strong>{accountData.expired_at || "Vĩnh viễn / Theo gói"}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAdobeOtpEmail(accountData.account);
                    setAdobeIndex(1);
                  }}
                  className="w-full mt-2 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-110"
                  style={{ background: "var(--btn)", color: "var(--btn-ink)" }}
                >
                  <Zap className="w-3.5 h-3.5" /> Chuyển Sang Lấy Mã OTP Cho Email Này
                </button>
              </div>
            )}
          </div>

          {/* ADOBE FORM 1: NHẬN MÃ OTP */}
          <div className="w-1/2 pl-2">
            <form onSubmit={handleFetchOtp} className="space-y-3">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)]" />
                  <input
                    type="email"
                    required
                    value={adobeOtpEmail}
                    onChange={(e) => setAdobeOtpEmail(e.target.value)}
                    placeholder="Nhập Email tài khoản Adobe cần lấy mã..."
                    className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border border-[var(--line)]"
                    style={{ background: "rgba(0, 0, 0, 0.45)" }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdobeIndex(0)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--line)] flex items-center gap-1 transition-all hover:brightness-125"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                >
                  <ArrowLeft className="w-3 h-3 mr-0.5" /> Tài Khoản
                </button>

                <button
                  type="submit"
                  disabled={loadingOtp || cooldown > 0 || !adobeOtpEmail.trim()}
                  className="btn-cta flex-1"
                  style={{ padding: "10px 16px" }}
                >
                  {loadingOtp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Đang kiểm tra hòm thư...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Thử lại sau {cooldown}s</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>Lấy Mã OTP Adobe</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {otpData && (
              <div
                className="mt-3 p-3.5 rounded-xl border border-[var(--line)] text-center animate-in fade-in zoom-in-95 duration-200"
                style={{ background: "rgba(0, 0, 0, 0.55)" }}
              >
                <div className="flex items-center justify-between pb-1 text-[11px] text-[var(--soft)]">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Sparkles className="w-3 h-3" /> Mã OTP mới nhất
                  </span>
                  <span>{otpData.duration_ms ? `${(otpData.duration_ms / 1000).toFixed(1)}s` : "Vừa xong"}</span>
                </div>

                <OtpPinDisplay
                  code={otpData.code}
                  itemKey="adobe_otp"
                  copiedKey={copiedKey}
                  onCopy={copyToClipboard}
                />

                {otpData.message && (
                  <p className="text-[10px] text-[var(--soft)] mt-1 italic">{otpData.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
