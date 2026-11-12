import React from "react";
import { AlertTriangle, Copy, RefreshCw, Building2, Clock, CheckCircle } from "lucide-react";
import { AccountResult } from "../../types/otp";

interface AccountStatusSwitchTeamCardProps {
  data: AccountResult;
  isSwitching: boolean;
  switchProgress?: {
    status?: string;
    position?: number;
    etaSeconds?: number;
    newOrgName?: string;
    message?: string;
  } | null;
  switchError?: string | null;
  onSwitchTeam: () => void;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const AccountStatusSwitchTeamCard: React.FC<AccountStatusSwitchTeamCardProps> = ({
  data,
  isSwitching,
  switchProgress,
  switchError,
  onSwitchTeam,
  copyToClipboard,
}) => {
  return (
    <div
      className="p-3.5 rounded-xl border border-amber-500/40 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-200"
      style={{
        background: "rgba(120, 53, 15, 0.2)",
        boxShadow: "0 4px 20px rgba(245, 158, 11, 0.12)",
      }}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <span className="font-bold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px]">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Trạng Thái Tài Khoản
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          {data.status || "CẦN CHUYỂN TEAM"}
        </span>
      </div>

      {/* Account Info */}
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
            onClick={() => copyToClipboard(data.account, "inactive_acc_email", "Đã chép Email Adobe!")}
            className="p-1 rounded border border-[var(--line)] hover:brightness-125 transition-all"
            title="Sao chép Email"
          >
            <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
          </button>
        </div>

        {/* Notice Banner */}
        <div
          className="p-2 rounded-lg border border-amber-500/20 text-[11px] leading-relaxed"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <p className="text-amber-200/90 font-medium">
            Tài khoản đang bị tạm ngưng hoặc cần chuyển sang tổ chức mới để tiếp tục sử dụng.
          </p>
          {data.organization && (
            <p className="text-[10px] text-[var(--soft)] mt-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" /> Team hiện tại: <span className="text-[var(--ink)] font-semibold">{data.organization}</span>
            </p>
          )}
        </div>
      </div>

      {/* Switching Progress Box */}
      {isSwitching && (
        <div
          className="p-2.5 rounded-lg border border-cyan-500/30 space-y-2 text-center animate-in fade-in duration-200"
          style={{ background: "rgba(8, 51, 68, 0.3)" }}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-300">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>
              {switchProgress?.status === "sending"
                ? "Đang gửi yêu cầu vào hệ thống..."
                : switchProgress?.status === "waiting"
                ? "Đang xếp hàng đổi team..."
                : "Đang tiến hành chuyển team..."}
            </span>
          </div>

          {/* Details (Position, ETA, New Team) */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-[var(--soft)] pt-0.5">
            {switchProgress?.position !== undefined && (
              <span className="flex items-center gap-1">
                Hàng đợi: <strong className="text-cyan-300 font-mono">#{switchProgress.position}</strong>
              </span>
            )}
            {switchProgress?.etaSeconds !== undefined && switchProgress.etaSeconds > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Ước tính: <strong className="text-amber-300 font-mono">~{switchProgress.etaSeconds}s</strong>
              </span>
            )}
          </div>

          {switchProgress?.newOrgName && (
            <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Team mới: <strong>{switchProgress.newOrgName}</strong></span>
            </div>
          )}

          <div className="w-full bg-cyan-950/60 rounded-full h-1 overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-cyan-400 to-amber-400 h-1 rounded-full animate-pulse w-3/4 mx-auto" />
          </div>
        </div>
      )}

      {/* Error alert */}
      {switchError && !isSwitching && (
        <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[10px] text-center">
          {switchError}
        </div>
      )}

      {/* Action Button: Chuyển Team Ngay */}
      {!isSwitching && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onSwitchTeam}
            className="w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg hover:brightness-110 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#000",
              boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Chuyển Team Ngay (Fix Team)
          </button>
          <p className="text-[9.5px] text-[var(--soft)]/70 text-center mt-1 italic">
            * Hệ thống sẽ tự động ghép tài khoản vào tổ chức mới và kích hoạt lại bản quyền.
          </p>
        </div>
      )}
    </div>
  );
};

