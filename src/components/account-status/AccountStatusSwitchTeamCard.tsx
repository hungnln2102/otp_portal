import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Building2,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
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
  copyToClipboard?: (text: string, key: string, label?: string) => void;
}

export const AccountStatusSwitchTeamCard: React.FC<AccountStatusSwitchTeamCardProps> = ({
  data,
  isSwitching,
  switchProgress,
  switchError,
  onSwitchTeam,
}) => {
  const statusHeadline =
    switchProgress?.status === "sending"
      ? "Đang gửi yêu cầu vào hệ thống..."
      : switchProgress?.status === "waiting"
      ? "Đang xếp hàng đổi team..."
      : "Đang tiến hành chuyển team...";

  return (
    <div
      className="p-3.5 rounded-2xl border border-amber-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl space-y-2.5"
      style={{
        background:
          "linear-gradient(150deg, rgba(120, 53, 15, 0.24) 0%, rgba(17, 13, 10, 0.72) 100%)",
        boxShadow:
          "0 10px 26px -10px rgba(245, 158, 11, 0.18), inset 0 1px 0 rgba(252, 211, 77, 0.2)",
      }}
    >
      {/* Ambient accent */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full pointer-events-none opacity-30 blur-xl"
        style={{ background: "radial-gradient(ellipse, #f59e0b 0%, transparent 70%)" }}
      />

      {/* 1. Header gọn gàng */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/45 shadow-[0_0_12px_rgba(245,158,11,0.22)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {data.status || "CẦN CHUYỂN TEAM"}
        </span>
      </div>

      {/* 2. Khối nội dung bố cục ngang cân đối, gọn trong 1 màn hình */}
      <div className="flex items-start gap-3 text-left relative z-10 py-0.5">
        <div className="w-11 h-11 rounded-xl border border-amber-400/50 bg-amber-950/65 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(245,158,11,0.28)]">
          <AlertTriangle className="w-5 h-5 text-amber-300" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/12 border border-amber-500/25 text-[9.5px] font-bold text-amber-300/95 uppercase tracking-wider">
            <Building2 className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span>Tổ chức hiện tại (Hết hạn/Khóa)</span>
          </div>

          <h3
            className="text-sm sm:text-[15px] font-black text-[var(--ink)] tracking-tight leading-snug break-words"
            title={data.organization || "Tổ chức cũ cần chuyển đổi"}
          >
            {data.organization || "Tổ chức cũ cần chuyển đổi"}
          </h3>

          <p className="text-[11px] text-amber-100/75 leading-relaxed">
            Tài khoản cần chuyển sang tổ chức mới để kích hoạt lại bản quyền Adobe All Apps.
          </p>
        </div>
      </div>

      {/* 3. Switching Progress Box */}
      {isSwitching && (
        <div
          className="p-2.5 rounded-xl border border-cyan-500/35 space-y-1.5 animate-in fade-in duration-200 relative z-10"
          style={{ background: "rgba(8, 51, 68, 0.45)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
              <span>{statusHeadline}</span>
            </div>

            <div className="flex items-center gap-2.5 text-[10.5px] text-[var(--soft)]">
              {switchProgress?.position !== undefined && (
                <span>
                  Hàng đợi:{" "}
                  <strong className="text-cyan-300 font-mono">#{switchProgress.position}</strong>
                </span>
              )}
              {switchProgress?.etaSeconds !== undefined && switchProgress.etaSeconds > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <strong className="text-amber-300 font-mono">~{switchProgress.etaSeconds}s</strong>
                </span>
              )}
            </div>
          </div>

          {switchProgress?.newOrgName && (
            <div className="text-[10.5px] text-emerald-300 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Team mới: {switchProgress.newOrgName}</span>
            </div>
          )}

          <div className="w-full bg-cyan-950/75 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 h-1.5 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {switchError && !isSwitching && (
        <div className="p-2 rounded-xl bg-rose-950/45 border border-rose-500/40 text-rose-300 text-[11px] text-center font-medium relative z-10">
          {switchError}
        </div>
      )}

      {/* 4. Action CTA: Chuyển Team Ngay */}
      {!isSwitching && (
        <div className="relative z-10">
          <button
            type="button"
            onClick={onSwitchTeam}
            className="w-full py-2 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:brightness-110 active:scale-[0.99] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#000",
              boxShadow: "0 4px 16px rgba(245, 158, 11, 0.32)",
            }}
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Chuyển Team Ngay (Fix Team Tự Động)</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-1 transition-transform ml-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
