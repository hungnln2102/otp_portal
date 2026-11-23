import React, { useState } from "react";
import {
  Zap,
  Mail,
  RefreshCw,
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { OtpResult } from "../../../types/otp";
import { OTP_OPERATION_ERROR, fetchAdobeOtp } from "../../../services/otpService";
import { OtpPinDisplay } from "../../../components/OtpPinDisplay";
import { OtpEntryWaitBanner } from "../../../components/OtpEntryWaitBanner";
import { AdobeAccountRecovery } from "./AdobeAccountRecovery";

interface AdobeSectionProps {
  cooldown: number;
  setCooldown: (seconds: number) => void;
  entryWaitSeconds: number;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  copiedKey: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const AdobeSection: React.FC<AdobeSectionProps> = ({
  cooldown,
  setCooldown,
  entryWaitSeconds,
  showToast,
  copiedKey,
  copyToClipboard,
}) => {
  const [adobeIndex, setAdobeIndex] = useState(2);
  const [adobeOtpEmail, setAdobeOtpEmail] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpData, setOtpData] = useState<OtpResult | null>(null);
  const isEntryLocked = entryWaitSeconds > 0;

  const handleFetchOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEntryLocked) return;
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
        showToast("error", OTP_OPERATION_ERROR);
      }
    } catch {
      showToast("error", OTP_OPERATION_ERROR);
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
            onClick={() => setAdobeIndex(1)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: adobeIndex === 1 ? "var(--btn)" : "transparent",
              color: adobeIndex === 1 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: adobeIndex === 1 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            <ShieldCheck className="w-3 h-3" />
            Lấy và kiểm tra tài khoản
          </button>

          <button
            type="button"
            onClick={() => setAdobeIndex(2)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: adobeIndex === 2 ? "var(--btn)" : "transparent",
              color: adobeIndex === 2 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: adobeIndex === 2 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            <Zap className="w-3 h-3" />
            Nhận OTP
          </button>
        </div>
      </div>

      {adobeIndex === 1 ? (
        <AdobeAccountRecovery copyToClipboard={copyToClipboard} showToast={showToast}
          onGoOtp={(email) => { setAdobeOtpEmail(email); setAdobeIndex(2); }} />
      ) : (
        <div className="space-y-3">
            <OtpEntryWaitBanner remainingSeconds={entryWaitSeconds} />
            <form onSubmit={handleFetchOtp} className="space-y-3">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)]" />
                  <input
                    type="email"
                    required
                    disabled={isEntryLocked || loadingOtp}
                    value={adobeOtpEmail}
                    onChange={(e) => setAdobeOtpEmail(e.target.value)}
                    placeholder={
                      isEntryLocked
                        ? `Vui lòng chờ ${entryWaitSeconds}s để nhập Email Adobe...`
                        : "Nhập Email tài khoản Adobe cần lấy mã..."
                    }
                    className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border border-[var(--line)] disabled:opacity-55 disabled:cursor-not-allowed"
                    style={{ background: "rgba(0, 0, 0, 0.45)" }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdobeIndex(1)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--line)] flex items-center gap-1 transition-all hover:brightness-125"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
                >
                  <ArrowLeft className="w-3 h-3 mr-0.5" /> Kiểm Tra
                </button>

                <button
                  type="submit"
                  disabled={isEntryLocked || loadingOtp || cooldown > 0 || !adobeOtpEmail.trim()}
                  className="btn-cta flex-1"
                  style={{ padding: "10px 16px" }}
                >
                  {isEntryLocked ? (
                    <>
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Vui lòng chờ {entryWaitSeconds}s</span>
                    </>
                  ) : loadingOtp ? (
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
      )}
    </div>
  );
};
