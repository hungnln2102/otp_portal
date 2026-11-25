import { OTP_OPERATION_ERROR } from "../../../services/otpService";
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Sparkles,
  Clipboard,
  X,
  Clock,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { OtpPinDisplay } from "../../../components/OtpPinDisplay";
import { generateTotp, isValidBase32Secret, TotpResult } from "../../../utils/totpGenerator";

const GENERATE_COOLDOWN_SECONDS = 5;

interface TwoFactorSectionProps {
  showToast: (type: "success" | "error" | "info", text: string) => void;
  copiedKey: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({
  showToast,
  copiedKey,
  copyToClipboard,
}) => {
  const [secretKey, setSecretKey] = useState<string>("");
  const [totpData, setTotpData] = useState<TotpResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cooldown 5 giây giữa mỗi lần bấm nút lấy mã mới
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown > 0]);

  // Hàm sinh mã OTP 6 số mỗi khi bấm nút lấy mã
  const handleGenerate = async (customKey?: string) => {
    if (loading || cooldown > 0) return;
    const keyToUse = (customKey !== undefined ? customKey : secretKey).trim();
    if (!keyToUse) {
      setErrorMsg("Vui lòng nhập hoặc dán khóa bí mật 2FA (Secret Key).");
      return;
    }

    if (!isValidBase32Secret(keyToUse)) {
      setErrorMsg("Khóa bí mật 2FA không hợp lệ. Khóa phải gồm chữ cái (A-Z) và số (2-7).");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await generateTotp(keyToUse, Date.now());
      setTotpData(result);
      setCooldown(GENERATE_COOLDOWN_SECONDS);
      showToast("success", `Đã tạo mã OTP 6 số [${result.code}] thành công!`);
    } catch {
      setTotpData(null);
      setErrorMsg(OTP_OPERATION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Dán từ clipboard
  const handlePaste = async () => {
    if (loading) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const clean = text.trim();
        setSecretKey(clean);
        setErrorMsg(null);
        showToast("info", "Đã dán khóa 2FA từ bộ nhớ tạm!");
      }
    } catch {
      showToast("error", OTP_OPERATION_ERROR);
    }
  };

  // Xóa nội dung
  const handleClear = () => {
    setSecretKey("");
    setTotpData(null);
    setErrorMsg(null);
  };

  const isButtonDisabled = loading || cooldown > 0 || !secretKey.trim();

  return (
    <div className="space-y-4 text-left animate-in fade-in duration-200">
      {/* 1. Sub Header Service */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            Xác Thực 2 Lớp (2FA / TOTP)
          </span>
        </div>

        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--line)]"
          style={{ background: "rgba(255, 255, 255, 0.06)", color: "var(--accent)" }}
        >
          OTP 6 Số • TOTP
        </span>
      </div>

      {/* 2. Input Box: Khóa Bí Mật 2FA */}
      <div className="space-y-1.5">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[var(--soft)] pointer-events-none">
            <KeyRound className="w-4 h-4 text-[var(--accent)]" />
          </div>

          <input
            type="text"
            disabled={loading}
            value={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isButtonDisabled) void handleGenerate();
            }}
            placeholder="Nhập hoặc dán Khóa Bí Mật 2FA (Secret Key: vd JBSWY3DPEHPK3PXP...)"
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-[var(--line)] text-xs text-[var(--ink)] placeholder:text-[var(--soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all uppercase font-mono disabled:opacity-55 disabled:cursor-not-allowed"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {secretKey && (
              <button
                type="button"
                disabled={loading}
                onClick={handleClear}
                className="p-1 rounded-md text-[var(--soft)] hover:text-[var(--ink)] hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Xóa nội dung"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handlePaste}
              className="p-1.5 rounded-md text-[var(--accent)] hover:bg-white/10 transition-all flex items-center gap-1 text-[10px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              title="Dán từ bộ nhớ tạm"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dán</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={isButtonDisabled}
          className="btn-cta flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang tính toán...</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <Clock className="w-4 h-4 shrink-0" />
              <span>Lấy mã mới sau {cooldown}s</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{totpData ? "Lấy Mã 2FA Mới (6 Số)" : "Lấy Mã 2FA (6 Số)"}</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Result Area: 6 Ô Số OTP */}
      {totpData && (
        <div
          className="p-3.5 rounded-2xl border border-[var(--line)] space-y-3 animate-in fade-in zoom-in-95 duration-200"
          style={{ background: "rgba(0, 0, 0, 0.45)" }}
        >
          {/* Header mã OTP */}
          <div className="flex items-center justify-between text-xs border-b border-[var(--line)] pb-2">
            <span className="font-bold text-[var(--ink)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Mã Xác Thực 2FA Hiện Tại:
            </span>
          </div>

          {/* 6 Ô Số OTP Rực Rỡ & Nút Sao Chép */}
          <OtpPinDisplay
            code={totpData.code}
            copiedKey={copiedKey}
            itemKey="2fa-totp-pin"
            onCopy={copyToClipboard}
          />
        </div>
      )}

      {/* 5. Gợi Ý & Hướng Dẫn Nhanh */}
      <div
        className="p-2.5 rounded-xl border border-[var(--line)] text-[11px] text-[var(--soft)] flex items-start gap-2"
        style={{ background: "rgba(255, 255, 255, 0.02)" }}
      >
        <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Khóa bí mật 2FA</strong> là chuỗi ký tự Base32 (thường gồm 16–32 chữ cái & số). Thuật toán TOTP chuẩn quốc tế tính toán mã 6 số trực tiếp trên máy của bạn, hoàn toàn bảo mật và đồng bộ tuyệt đối với Google Authenticator / 2FA.live.
        </p>
      </div>
    </div>
  );
};
