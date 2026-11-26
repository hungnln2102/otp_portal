import React, { useState } from "react";
import { SelectField } from "../../../components/SelectField";
import {
  Mail,
  KeyRound,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface YunaAccountData {
  account: string;
  password?: string;
  plan?: string;
  expired_at?: string;
  report_status?: string;
}

const REPORT_REASONS = [
  { value: "expired", label: "Gói hết hạn" },
  { value: "credentials", label: "Sai tài khoản/mật khẩu" },
  { value: "otp", label: "Không nhận được OTP" },
  { value: "inactive", label: "Tài khoản không hoạt động" },
  { value: "other", label: "Tự điền lý do" },
];

const REPORT_STATUS_MESSAGES: Record<string, string> = {
  pending: "⚠️ Tài khoản này đã được báo lỗi và đang chờ bảo hành. Vui lòng chờ.",
  adobe_renewing: "Yuna đang kiểm tra bảo hành. Vui lòng chờ.",
  adobe_success: "Báo lỗi của tài khoản này đã được xử lý.",
  cooldown: "Chưa thể gửi báo lỗi lúc này. Vui lòng thử lại sau.",
};

interface YunaAccountResultCardProps {
  data: YunaAccountData;
  copiedKey?: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  onGoOtp?: (email: string) => void;
  onReport: (reason: string, details?: string) => Promise<void>;
  reporting: boolean;
  reportUnavailable: boolean;
}

export const YunaAccountResultCard: React.FC<YunaAccountResultCardProps> = ({
  data,
  copiedKey,
  copyToClipboard,
  onGoOtp,
  onReport,
  reporting,
  reportUnavailable,
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const reportLocked = Boolean(data.report_status && data.report_status !== "none");
  const reportMessage = REPORT_STATUS_MESSAGES[data.report_status ?? ""];
  const isAccountCopied = copiedKey === "adobe_recovery_account";
  const isPasswordCopied = copiedKey === "adobe_recovery_password";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] p-4 text-xs animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl space-y-3"
      style={{
        background:
          "linear-gradient(155deg, rgba(15, 23, 42, 0.72) 0%, rgba(7, 11, 20, 0.88) 100%)",
        boxShadow:
          "0 12px 28px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
      }}
    >
      {/* Subtle top ambient accent */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-20 w-56 rounded-full opacity-25 blur-2xl"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 72%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--line)]">
        <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--ink)]">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--accent)]" />
          <span>Thông tin tài khoản Adobe</span>
        </span>

        {data.plan ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-bold text-[var(--ink)] max-w-[170px] truncate">
            <Sparkles className="w-3 h-3 shrink-0 text-[var(--accent)]" />
            <span className="truncate" title={data.plan}>
              {data.plan}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sẵn sàng</span>
          </span>
        )}
      </div>

      {/* Credentials block: Account first, Password second */}
      <div className="relative z-10 space-y-2">
        {/* 1. Tài khoản Adobe */}
        <div
          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] px-3 py-2.5 transition-colors hover:border-white/20"
          style={{ background: "rgba(0, 0, 0, 0.42)" }}
        >
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--soft)]">
              <Mail className="w-3 h-3 text-[var(--accent)] shrink-0" />
              <span>Tài khoản Adobe</span>
            </div>
            <div className="break-all font-mono text-[13px] font-bold text-[var(--ink)] select-all">
              {data.account}
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                data.account,
                "adobe_recovery_account",
                "Đã sao chép tài khoản Adobe!"
              )
            }
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
              isAccountCopied
                ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                : "border-[var(--line)] bg-white/[0.04] text-[var(--accent)] hover:bg-white/[0.1]"
            }`}
          >
            {isAccountCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Mật khẩu */}
        {data.password && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] px-3 py-2.5 transition-colors hover:border-white/20"
            style={{ background: "rgba(0, 0, 0, 0.42)" }}
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--soft)]">
                <KeyRound className="w-3 h-3 text-amber-300 shrink-0" />
                <span>Mật khẩu</span>
              </div>
              <div className="break-all font-mono text-[13px] font-bold text-amber-300 select-all">
                {data.password}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  data.password!,
                  "adobe_recovery_password",
                  "Đã sao chép mật khẩu Adobe!"
                )
              }
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                isPasswordCopied
                  ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                  : "border-[var(--line)] bg-white/[0.04] text-[var(--accent)] hover:bg-white/[0.1]"
              }`}
            >
              {isPasswordCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 3. Hạn sử dụng (nếu có) */}
        {data.expired_at && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--line)]/70 bg-white/[0.02] px-3 py-2 text-[11px]">
            <span className="flex items-center gap-1.5 text-[var(--soft)]">
              <Clock className="w-3.5 h-3.5 text-[var(--soft)] shrink-0" />
              <span>Hạn sử dụng</span>
            </span>
            <span className="font-mono font-semibold text-[var(--ink)]">
              {data.expired_at}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-10 space-y-2 pt-1">
        {onGoOtp && (
          <button
            type="button"
            onClick={() => onGoOtp(data.account)}
            className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:brightness-110 active:scale-[0.99] group cursor-pointer"
            style={{
              background: "var(--btn)",
              color: "var(--btn-ink)",
              boxShadow: "0 4px 18px var(--glow)",
            }}
          >
            <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Chuyển sang nhận mã OTP cho email này</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        <button
          type="button"
          aria-expanded={reportOpen && !reportLocked}
          disabled={reportLocked || reporting || reportUnavailable}
          onClick={() => setReportOpen((open) => !open)}
          className="w-full py-2 px-3 rounded-xl border border-[var(--line)] bg-white/[0.03] text-[11px] font-semibold text-[var(--ink)] flex items-center justify-center gap-1.5 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AlertTriangle className="w-3.5 h-3.5 opacity-70" />
          <span>Báo lỗi</span>
        </button>
        {reportMessage && <p role="status" className="text-[var(--ink)]">{reportMessage}</p>}
        {reportOpen && !reportLocked && (
          <div className="space-y-2 rounded-xl border border-[var(--line)] p-3">
            <SelectField
              label="Lý do báo lỗi"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              disabled={reporting || reportUnavailable}
            >
              <option value="" disabled>Chọn lý do</option>
              {REPORT_REASONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </SelectField>
            {reportReason === "other" && (
              <label className="block space-y-1.5 font-semibold text-[var(--ink)]">
                <span>Mô tả lỗi (không bắt buộc)</span>
                <textarea
                  value={reportDetails}
                  onChange={(event) => setReportDetails(event.target.value)}
                  maxLength={400}
                  rows={3}
                  disabled={reporting || reportUnavailable}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--ground)] px-3 py-2"
                />
              </label>
            )}
            <button
              type="button"
              disabled={!reportReason || reporting || reportUnavailable}
              onClick={() => void onReport(
                reportReason,
                reportReason === "other" ? reportDetails.trim() || undefined : undefined
              )}
              className="w-full rounded-lg bg-[var(--btn)] px-3 py-2 font-bold text-[var(--btn-ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reporting ? "Đang gửi báo lỗi…" : "Gửi báo lỗi"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
