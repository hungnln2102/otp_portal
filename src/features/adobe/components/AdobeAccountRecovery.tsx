import { OTP_OPERATION_ERROR, type AdobeOrderProof } from "../../../services/otpService";
import React, { useState } from "react";
import {
  KeyRound,
  UserCheck,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { AccountResult } from "../../../types/otp";
import { AccountStatusView } from "../../../components/account-status";
import { YunaAccountResultCard } from "./YunaAccountResultCard";

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
  data?: Omit<AccountResult, "status_type"> & { status_type?: AccountResult["status_type"] | "unknown" };
}

export const AdobeAccountRecovery: React.FC<Props> = ({
  copiedKey,
  copyToClipboard,
  showToast,
  onGoOtp,
}) => {
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [contactRequired, setContactRequired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<(RecoveryResult & { orderProof: AdobeOrderProof }) | null>(null);
  const [error, setError] = useState("");
  const account = result?.data?.account;
  const password = result?.data?.password;
  const showAdesCredentials = result?.source === "ades" && Boolean(result.data);

  async function request(action: "check" | "claim") {
    if (busy || !code.trim()) return;
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
      showToast("error", OTP_OPERATION_ERROR);
    } finally {
      setBusy(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void request("check");
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit}>
      {/* 1. Ô Nhập Mã Đơn / Mã Kích Hoạt */}
      <div>
        <label className="block text-xs font-semibold text-[var(--soft)] mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Mã đơn hoặc mã kích hoạt</span>
            <span className="text-rose-400">*</span>
          </span>
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)] pointer-events-none" />
          <input
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
            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border border-[var(--line)] font-mono"
            style={{ background: "rgba(0, 0, 0, 0.45)" }}
          />
        </div>
      </div>

      {contactRequired && (
        <label className="block space-y-1 text-xs text-[var(--soft)]">
          <span className="flex items-center gap-1.5"><UserCheck className="h-4 w-4" />Thông tin liên hệ khi mua hàng</span>
          <input required value={contact} disabled={busy}
            onChange={(event) => setContact(event.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2.5 text-[var(--ink)]" />
        </label>
      )}
      <button
        type="submit"
        disabled={busy || !code.trim() || (contactRequired && !contact.trim())}
        className="btn-cta w-full"
        style={{
          padding: "11px 18px",
          opacity: !code.trim() || (contactRequired && !contact.trim()) ? 0.65 : 1,
          cursor: !code.trim() || (contactRequired && !contact.trim()) ? "not-allowed" : "pointer",
        }}
      >
        {busy ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            <span>Đang lấy và kiểm tra tài khoản...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4 shrink-0" />
            <span>Lấy và kiểm tra tài khoản</span>
          </>
        )}
      </button>

      {/* 4. Thông Báo Lỗi Nếu Có */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
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

      {showAdesCredentials && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-black/45 p-2.5 text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[10px] font-semibold uppercase text-[var(--soft)]">Tài khoản:</span>
            <span className="break-all font-mono font-bold text-[var(--ink)]">{account}</span>
          </div>
          {account && (
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--accent)] hover:underline"
              onClick={() => copyToClipboard(account, "adobe_recovery_account")}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </button>
          )}
        </div>
      )}

      {(showAdesCredentials || (password && result?.source !== "yuna")) && (
        <div
          className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--line)] text-xs animate-in fade-in"
          style={{ background: "rgba(0, 0, 0, 0.45)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[var(--soft)] text-[10px] uppercase font-semibold">
              Mật khẩu:
            </span>
            <span className="font-mono font-bold text-amber-300">
              {password}
            </span>
          </div>
          {password && (
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              onClick={() =>
                copyToClipboard(
                  password,
                  "adobe_recovery_password",
                  "Đã sao chép mật khẩu Adobe!"
                )
              }
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </button>
          )}
        </div>
      )}

      {/* 8. Render Thẻ Trạng Thái Tài Khoản */}
      {result?.data &&
        (result.source === "yuna" ? (
          <YunaAccountResultCard
            data={result.data}
            copiedKey={copiedKey}
            copyToClipboard={copyToClipboard}
            onGoOtp={onGoOtp}
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
