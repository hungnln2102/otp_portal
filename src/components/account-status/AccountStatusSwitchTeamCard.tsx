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
  return (
    <div
      className="p-4 rounded-2xl border border-amber-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(145deg, rgba(120, 53, 15, 0.28) 0%, rgba(30, 15, 5, 0.55) 100%)",
        boxShadow:
          "0 10px 30px -10px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(252, 211, 77, 0.25)",
      }}
    >
      {/* Ambient Cyber Light Effect */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full pointer-events-none opacity-40 blur-xl"
        style={{ background: "radial-gradient(ellipse, #f59e0b 0%, transparent 70%)" }}
      />

      {/* 1. Header: Trạng Thái Tài Khoản + Status Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.3)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_#fbbf24]" />
          {data.status || "CẦN CHUYỂN TEAM"}
        </span>
      </div>

      {/* 2. Khối Trọng Tâm: Animation Icon Ở Giữa + Tên Tổ Chức Chữ To Ra */}
      <div className="py-4 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Animated Icon Core (Hào quang sóng hổ phách) */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-16 h-16 rounded-full bg-amber-500/15 animate-ping duration-1000 opacity-60" />

          <div
            className="w-14 h-14 rounded-full border-2 border-amber-400/60 bg-amber-950/60 flex items-center justify-center relative shadow-[0_0_24px_rgba(245,158,11,0.45)] transition-transform hover:scale-105"
            style={{
              backdropFilter: "blur(8px)",
            }}
          >
            <AlertTriangle className="w-8 h-8 text-amber-300 animate-in zoom-in duration-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
        </div>

        {/* Tag Phụ: Tổ chức hiện tại */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold text-amber-300/90 uppercase tracking-widest mb-1.5">
          <Building2 className="w-3 h-3 text-amber-400" />
          <span>Tổ Chức Hiện Tại (Hết Hạn/Khóa)</span>
        </div>

        {/* Tên Tổ Chức Chữ To Ra */}
        <h3
          className="text-base sm:text-lg font-black text-[var(--ink)] tracking-tight leading-snug max-w-md mx-auto px-2 break-words drop-shadow-sm"
          title={data.organization || "Tổ chức cũ cần chuyển đổi"}
        >
          {data.organization || "Tổ chức cũ cần chuyển đổi"}
        </h3>

        <p className="text-[11px] text-amber-200/80 mt-1.5 max-w-sm mx-auto">
          Tài khoản cần chuyển sang tổ chức mới để kích hoạt lại bản quyền Adobe All Apps.
        </p>
      </div>

      {/* 3. Switching Progress Box */}
      {isSwitching && (
        <div
          className="mt-2 p-3 rounded-xl border border-cyan-500/35 space-y-2 text-center animate-in fade-in duration-200 relative z-10"
          style={{ background: "rgba(8, 51, 68, 0.4)" }}
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

          <div className="flex items-center justify-center gap-3 text-[10px] text-[var(--soft)] pt-0.5">
            {switchProgress?.position !== undefined && (
              <span>
                Hàng đợi: <strong className="text-cyan-300 font-mono">#{switchProgress.position}</strong>
              </span>
            )}
            {switchProgress?.etaSeconds !== undefined && switchProgress.etaSeconds > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Ước tính:{" "}
                <strong className="text-amber-300 font-mono">~{switchProgress.etaSeconds}s</strong>
              </span>
            )}
          </div>

          {switchProgress?.newOrgName && (
            <div className="text-[10.5px] text-emerald-300 flex items-center justify-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Team mới: {switchProgress.newOrgName}</span>
            </div>
          )}

          <div className="w-full bg-cyan-950/60 rounded-full h-1.5 overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 h-1.5 rounded-full animate-pulse w-3/4 mx-auto" />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {switchError && !isSwitching && (
        <div className="mt-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[10.5px] text-center font-medium relative z-10">
          {switchError}
        </div>
      )}

      {/* 4. Action CTA: Chuyển Team Ngay */}
      {!isSwitching && (
        <div className="mt-2 relative z-10">
          <button
            type="button"
            onClick={onSwitchTeam}
            className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xl hover:brightness-110 active:scale-[0.99] group"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#000",
              boxShadow: "0 4px 18px rgba(245, 158, 11, 0.35)",
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
