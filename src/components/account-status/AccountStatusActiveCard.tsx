import React from "react";
import { Copy, Zap, ShieldCheck, Building2 } from "lucide-react";
import { AccountResult } from "../../types/otp";

interface AccountStatusActiveCardProps {
  data: AccountResult;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  onGoOtp?: (account: string) => void;
}

export const AccountStatusActiveCard: React.FC<AccountStatusActiveCardProps> = ({
  data,
  copyToClipboard,
  onGoOtp,
}) => {
  return (
    <div
      className="p-3.5 rounded-xl border border-emerald-500/30 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-200"
      style={{
        background: "rgba(6, 78, 59, 0.2)",
        boxShadow: "0 4px 20px rgba(16, 185, 129, 0.12)",
      }}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <span className="font-bold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Trạng Thái Tài Khoản
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {data.status || "ĐANG HOẠT ĐỘNG"}
        </span>
      </div>

      {/* Account Details */}
      <div className="space-y-1.5 text-[11px]">
        {/* Email Row with Copy */}
        <div
          className="flex items-center justify-between p-2 rounded-lg border border-[var(--line)]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <span className="font-mono font-bold text-[var(--ink)] truncate max-w-[280px]">
            {data.account}
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(data.account, "active_acc_email", "Đã chép Email Adobe!")}
            className="p-1 rounded border border-[var(--line)] hover:brightness-125 transition-all"
            title="Sao chép Email"
          >
            <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
          </button>
        </div>

        {/* Organization / Team Info */}
        {data.organization && (
          <div
            className="flex items-center justify-between p-1.5 px-2 rounded-lg border border-[var(--line)]"
            style={{ background: "rgba(0, 0, 0, 0.25)" }}
          >
            <span className="text-[10px] text-[var(--soft)] flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" /> Tổ chức / Team:
            </span>
            <span className="font-semibold text-[var(--ink)] text-[10px] truncate max-w-[200px]">
              {data.organization}
            </span>
          </div>
        )}

        {/* Plan & Expiry */}
        <div className="flex items-center justify-between text-[10px] text-[var(--soft)] pt-0.5 px-0.5">
          <span>
            Gói: <strong className="text-[var(--ink)]">{data.plan || "Adobe CC All Apps"}</strong>
          </span>
          <span>
            Hạn: <strong className="text-emerald-400">{data.expired_at || "Bản quyền đang hoạt động"}</strong>
          </span>
        </div>
      </div>

      {/* CTA Button: Nhận OTP */}
      {onGoOtp && (
        <button
          type="button"
          onClick={() => onGoOtp(data.account)}
          className="w-full mt-2 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-110"
          style={{ background: "var(--btn)", color: "var(--btn-ink)" }}
        >
          <Zap className="w-3.5 h-3.5" />
          Chuyển Sang Lấy Mã OTP Cho Email Này
        </button>
      )}
    </div>
  );
};

