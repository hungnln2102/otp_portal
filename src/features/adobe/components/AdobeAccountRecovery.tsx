import { fetchAdobeRecoveryReportStatus, OTP_OPERATION_ERROR, submitAdobeRecoveryReport, type AdobeOrderProof } from "../../../services/otpService";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyRound,
  UserCheck,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Mail,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  X,
} from "lucide-react";
import type { AccountResult } from "../../../types/otp";
import { AccountStatusView } from "../../../components/account-status";
import { YunaAccountResultCard } from "./YunaAccountResultCard";

const REPORT_REFRESH_INTERVAL_MS = 10_000;
const REPORT_REFRESH_TIMEOUT_MS = 180_000;
const VERIFIED_REPORT_STATES = new Set(["pending", "adobe_success", "cooldown"]);

interface Props {
  copiedKey?: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onGoOtp: (email: string) => void;
}

interface RecoveryResult {
  success: boolean;
  source?: "ades" | "yuna";
  contactRequired?: boolean;
  replacementRequired?: boolean;
  outOfStock?: boolean;
  replaced?: boolean;
  data?: Omit<AccountResult, "status_type"> & {
    status_type?: AccountResult["status_type"] | "unknown";
    report_status?: string;
  };
}

export const AdobeAccountRecovery: React.FC<Props> = ({
  copiedKey,
  copyToClipboard,
  showToast,
  onGoOtp,
}) => {
  const codeInputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [contactRequired, setContactRequired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [result, setResult] = useState<(RecoveryResult & { orderProof: AdobeOrderProof }) | null>(null);
  const [error, setError] = useState("");

  const resetCodeInput = (shouldFocus = false) => {
    setCode("");
    setContact("");
    setContactRequired(false);
    setError("");
    setResult(null);
    if (shouldFocus) {
      window.requestAnimationFrame(() => codeInputRef.current?.focus());
    }
  };
  const account = result?.data?.account;
  const password = result?.data?.password;
  const showAdesCredentials = result?.source === "ades" && Boolean(result.data);
  const refreshingProof = result?.source === "yuna" && result.data?.report_status === "adobe_renewing"
    ? result.orderProof
    : null;

  useEffect(() => {
    if (!refreshingProof || busy || error || reporting ||
        refreshingProof.code !== code.trim() || refreshingProof.contact !== contact.trim()) return;

    const proof = refreshingProof;
    const controller = new AbortController();
    let nextAttempt: number;

    async function refreshStatus() {
      try {
        const status = await fetchAdobeRecoveryReportStatus(proof, controller.signal);
        if (controller.signal.aborted) return;
        if (status && VERIFIED_REPORT_STATES.has(status)) {
          setResult((current) =>
            current?.orderProof === proof && current.data?.report_status === "adobe_renewing"
              ? { ...current, data: { ...current.data, report_status: status } }
              : current
          );
          return;
        }
      } catch {
        // A status request can fail temporarily. Keep the last confirmed state.
        if (controller.signal.aborted) return;
      }
      nextAttempt = window.setTimeout(refreshStatus, REPORT_REFRESH_INTERVAL_MS);
    }

    nextAttempt = window.setTimeout(refreshStatus, REPORT_REFRESH_INTERVAL_MS);
    const deadline = window.setTimeout(() => {
      window.clearTimeout(nextAttempt);
      controller.abort();
    }, REPORT_REFRESH_TIMEOUT_MS);

    return () => {
      window.clearTimeout(nextAttempt);
      window.clearTimeout(deadline);
      controller.abort();
    };
  }, [refreshingProof, busy, error, reporting, code, contact]);

  async function request(action: "check" | "claim") {
    if (busy || reporting || !code.trim()) return;
    const orderProof = { code: code.trim(), contact: contact.trim() };
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/public/otp/adobe/recovery/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderProof),
      });
      const next: RecoveryResult = await response.json();
      if (!response.ok || !next.success) {
        throw new Error(OTP_OPERATION_ERROR);
      }
      if (next.contactRequired) {
        setContactRequired(true);
        showToast("info", "Vui lòng nhập thêm thông tin liên hệ khi mua đơn!");
      }
      setResult({ ...next, orderProof });
      if (next.replaced) {
        showToast("success", "Đã cấp tài khoản thay thế thành công!");
      }
    } catch {
      setError(OTP_OPERATION_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function report(reason: string, details?: string) {
    if (busy || error || reporting || result?.source !== "yuna" || !result.data) return;
    const proof = result.orderProof;
    setReporting(true);
    try {
      const response = await submitAdobeRecoveryReport(proof, reason, details);
      if (!response.success || !response.report_status) throw new Error(OTP_OPERATION_ERROR);
      setResult((current) =>
        current?.orderProof === proof && current.data
          ? { ...current, data: { ...current.data, report_status: response.report_status } }
          : current
      );
    } catch {
      showToast("error", "Chưa gửi được báo lỗi. Vui lòng thử lại sau.");
    } finally {
      setReporting(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void request("check");
  };

  const isAccountCopied = copiedKey === "adobe_recovery_account";
  const isPasswordCopied = copiedKey === "adobe_recovery_password";
  const showPasswordCard = Boolean(showAdesCredentials || (password && result?.source !== "yuna"));
  const showCredentialsGrid = showAdesCredentials || showPasswordCard;

  return (
    <form className="space-y-2.5" onSubmit={handleSubmit}>
      {/* 1. Ô Nhập Mã Đơn / Mã Kích Hoạt + Nút Kiểm Tra trên 1 hàng ngang gọn */}
      <div>
        <label
          htmlFor="adobe-recovery-code"
          className="text-xs font-semibold text-[var(--soft)] mb-1 flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Mã đơn hoặc mã kích hoạt</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)] pointer-events-none" />
            <input
              ref={codeInputRef}
              id="adobe-recovery-code"
              type="text"
              required
              value={code}
              disabled={busy}
              placeholder="Nhập mã đơn (VD: MAVR-123456) hoặc mã key kích hoạt..."
              onChange={(e) => {
                setCode(e.target.value);
                setContact("");
                setContactRequired(false);
                setError("");
                setResult(null);
              }}
              className="w-full rounded-xl pl-9 pr-8 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none focus:border-[var(--accent)] transition-all border border-[var(--line)] font-mono"
              style={{ background: "rgba(0, 0, 0, 0.45)" }}
            />
            {code && !busy && (
              <button
                type="button"
                aria-label="Xóa mã đang nhập"
                onClick={() => resetCodeInput(true)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-[var(--soft)] hover:text-[var(--ink)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={busy || !code.trim() || (contactRequired && !contact.trim())}
            className="btn-cta sm:!w-auto shrink-0 whitespace-nowrap"
            style={{
              padding: "9px 16px",
              fontSize: "12.5px",
              borderRadius: "12px",
              opacity: !code.trim() || (contactRequired && !contact.trim()) ? 0.65 : 1,
              cursor: !code.trim() || (contactRequired && !contact.trim()) ? "not-allowed" : "pointer",
            }}
          >
            {busy ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>Lấy và kiểm tra tài khoản</span>
              </>
            )}
          </button>
        </div>
      </div>

      {contactRequired && (
        <label className="block space-y-1 text-xs text-[var(--soft)]">
          <span className="flex items-center gap-1.5"><UserCheck className="h-4 w-4" />Thông tin liên hệ khi mua hàng</span>
          <input required value={contact} disabled={busy}
            onChange={(event) => setContact(event.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-black/45 px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]" />
        </label>
      )}

      {/* 4. Thẻ Trạng Thái Khi Mã Không Tồn Tại / Không Tra Cứu Được */}
      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl border border-rose-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl space-y-2.5"
          style={{
            background:
              "linear-gradient(150deg, rgba(136, 19, 55, 0.26) 0%, rgba(22, 8, 14, 0.75) 100%)",
            boxShadow:
              "0 10px 26px -10px rgba(244, 63, 94, 0.18), inset 0 1px 0 rgba(253, 164, 175, 0.2)",
          }}
        >
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full pointer-events-none opacity-30 blur-xl"
            style={{ background: "radial-gradient(ellipse, #f43f5e 0%, transparent 70%)" }}
          />

          <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-500/20 relative z-10">
            <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              Tra cứu tài khoản
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/45 shadow-[0_0_12px_rgba(244,63,94,0.22)]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              KHÔNG TÌM THẤY
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left relative z-10 py-0.5">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl border border-rose-400/50 bg-rose-950/65 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(244,63,94,0.28)]">
                <AlertCircle className="w-5 h-5 text-rose-300" />
              </div>

              <div className="min-w-0 space-y-1">
                <h3 className="text-sm font-black text-rose-200 tracking-tight leading-snug">
                  Không tìm thấy mã đơn hoặc mã kích hoạt
                </h3>
                <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                  Vui lòng kiểm tra lại chính tả mã đã nhập hoặc{" "}
                  <span className="text-rose-200 font-semibold">{error}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => resetCodeInput(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-400/35 bg-rose-500/15 text-[11px] font-bold text-rose-100 hover:bg-rose-500/25 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nhập lại mã khác</span>
            </button>
          </div>
        </div>
      )}

      {result?.outOfStock && (
        <p role="status" className="rounded-xl border border-amber-500/40 p-3 text-xs text-amber-200">
          Hiện kho đã hết tài khoản thay thế.
        </p>
      )}

      {/* 5. Cảnh Báo & Nút Nhận Tài Khoản Thay Thế */}
      {result?.replacementRequired && !result.outOfStock && (
        <div
          className="space-y-2.5 rounded-2xl border border-amber-500/40 p-3.5 text-xs text-amber-200 animate-in fade-in duration-200"
          style={{ background: "rgba(30, 15, 0, 0.65)" }}
        >
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              Tài khoản đã cấp cần được thay thế mới.
            </span>
          </div>
          <p className="text-[11px] text-[var(--soft)] leading-relaxed">
            Hệ thống hỗ trợ cấp tài khoản thay thế tự động từ kho gói tương ứng.
          </p>
          <button
            type="button"
            className="btn-cta w-full"
            disabled={busy}
            onClick={() => void request("claim")}
            style={{ padding: "9px 14px", fontSize: "12px" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nhận Tài Khoản Mới Ngay</span>
          </button>
        </div>
      )}

      {/* 6. Trạng Thái Cấp Thành Công */}
      {result?.replaced && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Đã cấp tài khoản thay thế thành công vào hệ thống.</span>
        </div>
      )}

      {showCredentialsGrid && (
        <div
          className={`grid grid-cols-1 gap-2 animate-in fade-in ${
            showAdesCredentials && showPasswordCard ? "sm:grid-cols-12" : ""
          }`}
        >
          {showAdesCredentials && (
            <div
              className={`flex items-center justify-between gap-2.5 rounded-xl border border-[var(--line)] px-3 py-2 text-xs ${
                showPasswordCard ? "sm:col-span-7" : ""
              }`}
              style={{ background: "rgba(0, 0, 0, 0.45)" }}
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--soft)]">
                  <Mail className="w-3 h-3 text-[var(--accent)] shrink-0" />
                  <span>Tài khoản</span>
                </div>
                <div
                  title={account}
                  className="truncate font-mono text-[12px] font-bold text-[var(--ink)] select-all"
                >
                  {account}
                </div>
              </div>
              {account && (
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      account,
                      "adobe_recovery_account",
                      "Đã sao chép tài khoản Adobe!"
                    )
                  }
                  className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isAccountCopied
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                      : "border-[var(--line)] bg-white/[0.04] text-[var(--accent)] hover:bg-white/[0.1]"
                  }`}
                >
                  {isAccountCopied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {showPasswordCard && (
            <div
              className={`flex items-center justify-between gap-2.5 rounded-xl border border-[var(--line)] px-3 py-2 text-xs ${
                showAdesCredentials ? "sm:col-span-5" : ""
              }`}
              style={{ background: "rgba(0, 0, 0, 0.45)" }}
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--soft)]">
                  <KeyRound className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>Mật khẩu</span>
                </div>
                <div
                  title={password}
                  className="truncate font-mono text-[12px] font-bold text-amber-300 select-all"
                >
                  {password || "—"}
                </div>
              </div>
              {password && (
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      password,
                      "adobe_recovery_password",
                      "Đã sao chép mật khẩu Adobe!"
                    )
                  }
                  className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isPasswordCopied
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                      : "border-[var(--line)] bg-white/[0.04] text-[var(--accent)] hover:bg-white/[0.1]"
                  }`}
                >
                  {isPasswordCopied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 8. Render Thẻ Trạng Thái Tài Khoản */}
      {result?.data &&
        (result.source === "yuna" ? (
          <YunaAccountResultCard
            key={result.orderProof.code}
            data={result.data}
            copiedKey={copiedKey}
            copyToClipboard={copyToClipboard}
            onGoOtp={onGoOtp}
            onReport={report}
            reporting={reporting}
            reportUnavailable={busy || Boolean(error)}
          />
        ) : result.data.status_type === "active" || result.data.status_type === "inactive" ? (
          <AccountStatusView
            data={{ ...result.data, status_type: result.data.status_type }}
            orderProof={result.orderProof}
            copyToClipboard={copyToClipboard}
            showToast={showToast}
            onGoOtp={onGoOtp}
            onGoAccountLookup={() => void request("check")}
            onStatusUpdated={(data) =>
              setResult((prev) => prev && { ...prev, data: { ...prev.data, ...data } })
            }
          />
        ) : (
          <div
            className="space-y-2 rounded-2xl border border-[var(--line)] p-3.5 text-xs text-[var(--ink)] animate-in fade-in"
            style={{ background: "rgba(0, 0, 0, 0.45)" }}
          >
            {!showAdesCredentials && (
              <div className="font-mono font-bold text-slate-200">{result.data.account}</div>
            )}
            <p role="status" className="text-[var(--soft)] text-[11px]">
              Chưa xác minh được tình trạng tài khoản.
            </p>
            <button
              type="button"
              className="btn-cta w-full"
              disabled={busy}
              onClick={() => void request("check")}
              style={{ padding: "8px 12px", fontSize: "11px" }}
            >
              <RefreshCw className="w-3 h-3" />
              <span>Kiểm Tra Lại</span>
            </button>
          </div>
        ))}
    </form>
  );
};
