import React, { useState, useEffect, useRef } from "react";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const activeSecretRef = useRef<string>("");

  // Hàm sinh mã OTP 6 số
  const handleGenerate = async (customKey?: string) => {
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
      const result = await generateTotp(keyToUse);
      setTotpData(result);
      activeSecretRef.current = keyToUse;
      showToast("success", `Đã tạo mã OTP 6 số [${result.code}] thành công!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể tạo mã OTP từ khóa này.");
    } finally {
      setLoading(false);
    }
  };

  // Timer đếm ngược chu kỳ 30 giây & tự động đổi mã khi hết hạn
  useEffect(() => {
    if (!totpData || !activeSecretRef.current || !autoRefresh) return;

    const interval = setInterval(async () => {
      const epochSeconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epochSeconds % 30);
      const progress = Math.round((remaining / 30) * 100);

      // Nếu chuyển sang chu kỳ 30s mới -> Tính toán mã mới
      if (remaining === 30 || remaining <= 0) {
        try {
          const fresh = await generateTotp(activeSecretRef.current);
          setTotpData(fresh);
        } catch {
          // Bỏ qua lỗi ngầm khi refresh
        }
      } else {
        setTotpData((prev) => (prev ? { ...prev, remainingSeconds: remaining, progress } : null));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totpData?.step, autoRefresh]);

  // Dán từ clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const clean = text.trim();
        setSecretKey(clean);
        setErrorMsg(null);
        showToast("info", "Đã dán khóa 2FA từ bộ nhớ tạm!");
        // Tự động sinh mã nếu hợp lệ
        if (isValidBase32Secret(clean)) {
          handleGenerate(clean);
        }
      }
    } catch {
      showToast("error", "Không thể đọc clipboard. Hãy nhấn Ctrl+V để dán trực tiếp.");
    }
  };

  // Xóa nội dung
  const handleClear = () => {
    setSecretKey("");
    setTotpData(null);
    setErrorMsg(null);
    activeSecretRef.current = "";
  };

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
          OTP 6 Số • Chu Kỳ 30s
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
            value={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Nhập hoặc dán Khóa Bí Mật 2FA (Secret Key: vd JBSWY3DPEHPK3PXP...)"
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-[var(--line)] text-xs text-[var(--ink)] placeholder:text-[var(--soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all uppercase font-mono"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {secretKey && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-[var(--soft)] hover:text-[var(--ink)] hover:bg-white/10 transition-all"
                title="Xóa nội dung"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              className="p-1.5 rounded-md text-[var(--accent)] hover:bg-white/10 transition-all flex items-center gap-1 text-[10px] font-semibold"
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
          onClick={() => handleGenerate()}
          disabled={loading || !secretKey.trim()}
          className="btn-cta flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 shrink-0" />
          )}
          <span>{loading ? "Đang tính toán..." : "Lấy Mã 2FA (6 Số)"}</span>
        </button>
      </div>

      {/* 4. Result Area: 6 Ô Số OTP & Đếm Ngược Thời Gian */}
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

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                totpData.remainingSeconds <= 5
                  ? "bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse"
                  : "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{totpData.remainingSeconds}s</span>
            </div>
          </div>

          {/* 6 Ô Số OTP Rực Rỡ & Nút Sao Chép */}
          <OtpPinDisplay
            code={totpData.code}
            copiedKey={copiedKey}
            itemKey="2fa-totp-pin"
            onCopy={copyToClipboard}
          />

          {/* Thanh Tiến Trình 30 Giây */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-[var(--line)]">
              <div
                className="h-full transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${totpData.progress}%`,
                  backgroundColor: totpData.remainingSeconds <= 5 ? "#f43f5e" : "var(--accent)",
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--soft)] pt-0.5">
              <span>Mã tự động đổi sau 30 giây</span>
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded accent-[var(--accent)] w-3 h-3 cursor-pointer"
                />
                <span>Tự động làm mới</span>
              </label>
            </div>
          </div>
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

