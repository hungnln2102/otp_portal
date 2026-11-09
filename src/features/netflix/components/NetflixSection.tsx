import React, { useState } from "react";
import {
  Film,
  Tv,
  Mail,
  RefreshCw,
  Clock,
  ExternalLink,
  Copy,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { NetflixSubForm, HouseholdResult, OtpResult } from "../../../types/otp";
import {
  fetchNetflixHousehold,
  fetchNetflixSixDigit,
  fetchNetflixLoginOtp,
} from "../../../services/otpService";
import { OtpPinDisplay } from "../../../components/OtpPinDisplay";

interface NetflixSectionProps {
  cooldown: number;
  setCooldown: (seconds: number) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  copiedKey: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const NetflixSection: React.FC<NetflixSectionProps> = ({
  cooldown,
  setCooldown,
  showToast,
  copiedKey,
  copyToClipboard,
}) => {
  const [netflixIndex, setNetflixIndex] = useState<NetflixSubForm>(0); // Default: Hộ gia đình
  const [netflixEmail, setNetflixEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [householdData, setHouseholdData] = useState<HouseholdResult | null>(null);
  const [sixDigitData, setSixDigitData] = useState<string | null>(null);
  const [otpData, setOtpData] = useState<OtpResult | null>(null);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = netflixEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("error", "Vui lòng nhập đúng định dạng Email Netflix!");
      return;
    }
    if (cooldown > 0) return;

    try {
      setLoading(true);

      if (netflixIndex === 0) {
        setHouseholdData(null);
        const res = await fetchNetflixHousehold(email);
        const link = res.link || (res as any).data?.link || res.extra_fields?.find((f) => f.key === "netflix_link")?.value;
        const sentTime = res.sent_time || (res as any).data?.sent_time || res.extra_fields?.find((f) => f.key === "sent_time")?.value;

        if ((res.ok || res.success) && link) {
          setHouseholdData({
            link,
            sent_time: sentTime,
            message: res.message || "Đã lấy link xác minh hộ gia đình thành công!",
          });
          setCooldown(30);
          showToast("success", "Đã lấy link xác minh Household thành công!");
        } else {
          setCooldown(15);
          showToast("error", res.error || res.message || "Không tìm thấy link hộ gia đình gần đây.");
        }
      } else if (netflixIndex === 1) {
        setSixDigitData(null);
        const res = await fetchNetflixSixDigit(email);
        if ((res.ok || res.success) && res.code) {
          setSixDigitData(res.code);
          setCooldown(30);
          showToast("success", `Đã nhận mã 6 số: ${res.code}`);
        } else {
          setCooldown(15);
          showToast("error", res.error || res.message || "Chưa tìm thấy mã 6 số. Vui lòng thử lại sau.");
        }
      } else {
        setOtpData(null);
        const res = await fetchNetflixLoginOtp(email);
        if ((res.ok || res.success) && res.code) {
          setOtpData({
            code: res.code,
            subject: res.subject,
            from: res.from,
            date: res.date,
            message: res.message,
          });
          setCooldown(30);
          showToast("success", `Đã nhận mã OTP Netflix: ${res.code}`);
        } else {
          setCooldown(15);
          showToast("error", res.error || res.message || "Chưa có thư OTP mới từ Netflix.");
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Lỗi kết nối tới cổng xác minh Netflix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
        <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-rose-500" />
          Netflix Premium
        </span>

        {/* Sub tabs Netflix: 0: Hộ gia đình | 1: Mã TV | 2: OTP */}
        <div
          className="flex p-0.5 rounded-lg border border-[var(--line)]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <button
            type="button"
            onClick={() => setNetflixIndex(0)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 0 ? "var(--btn)" : "transparent",
              color: netflixIndex === 0 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 0 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            Hộ Gia Đình
          </button>

          <button
            type="button"
            onClick={() => setNetflixIndex(1)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 1 ? "var(--btn)" : "transparent",
              color: netflixIndex === 1 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 1 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            Mã TV 6 Số
          </button>

          <button
            type="button"
            onClick={() => setNetflixIndex(2)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 2 ? "var(--btn)" : "transparent",
              color: netflixIndex === 2 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 2 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            OTP Đăng Nhập
          </button>
        </div>
      </div>

      {/* Form Netflix chung */}
      <form onSubmit={handleAction} className="space-y-3">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)]" />
            <input
              type="email"
              required
              value={netflixEmail}
              onChange={(e) => setNetflixEmail(e.target.value)}
              placeholder="Nhập Email tài khoản Netflix..."
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border border-[var(--line)]"
              style={{ background: "rgba(0, 0, 0, 0.45)" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || cooldown > 0 || !netflixEmail.trim()}
          className="btn-cta w-full"
          style={{ padding: "10px 16px" }}
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Đang kiểm tra máy chủ Netflix...</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Thử lại sau {cooldown}s</span>
            </>
          ) : netflixIndex === 0 ? (
            <>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Lấy Link Xác Minh Hộ Gia Đình</span>
            </>
          ) : netflixIndex === 1 ? (
            <>
              <Tv className="w-3.5 h-3.5 shrink-0" />
              <span>Lấy Mã TV 6 Số</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Lấy Mã OTP Đăng Nhập</span>
            </>
          )}
        </button>
      </form>

      {/* Kết Quả Netflix 0: Hộ gia đình */}
      {netflixIndex === 0 && householdData && (
        <div
          className="mt-3 p-4 rounded-xl border border-[var(--line)] space-y-3 text-xs animate-in fade-in zoom-in-95 duration-200"
          style={{ background: "rgba(0, 0, 0, 0.55)" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4" /> Link Cập Nhật Netflix Household
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              Vừa xong
            </span>
          </div>

          {/* Mục Thời gian gửi (Sent) đã parse sang UTC+7 */}
          {householdData.sent_time && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--line)] bg-black/30">
              <span className="text-[11px] text-[var(--soft)] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Thời gian gửi (Sent):
              </span>
              <span className="text-[11px] font-bold text-cyan-300 font-mono">
                {householdData.sent_time}
              </span>
            </div>
          )}

          <p className="text-[11px] text-[var(--soft)] leading-relaxed">
            Nhấn nút <strong className="text-white">"Nhận mã"</strong> bên dưới trên điện thoại hoặc máy tính đang kết nối cùng mạng Wi-Fi với TV của bạn:
          </p>

          <div className="flex gap-2 pt-1">
            <a
              href={householdData.link}
              target="_blank"
              rel="noreferrer"
              className="btn-cta flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-bold text-xs"
              style={{
                background: "linear-gradient(135deg, #e50914 0%, #b81d24 100%)",
                boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)",
              }}
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Nhận mã</span>
            </a>

            <button
              type="button"
              onClick={() => copyToClipboard(householdData.link, "household_link", "Đã sao chép link xác minh!")}
              className="px-3.5 py-2.5 rounded-xl border border-[var(--line)] flex items-center gap-1.5 transition-all hover:brightness-125"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
              title="Sao chép link"
            >
              <Copy className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span className="text-[11px] font-medium hidden sm:inline">Sao chép</span>
            </button>
          </div>
        </div>
      )}

      {/* Kết Quả Netflix 1: Mã TV 6 số */}
      {netflixIndex === 1 && sixDigitData && (
        <div
          className="mt-3 p-3.5 rounded-xl border border-[var(--line)] text-center animate-in fade-in zoom-in-95 duration-200"
          style={{ background: "rgba(0, 0, 0, 0.55)" }}
        >
          <div className="flex items-center justify-between pb-1 text-[11px] text-[var(--soft)]">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Tv className="w-3.5 h-3.5" /> Mã TV Xác Minh 6 Số
            </span>
            <span>Vừa xong</span>
          </div>

          <OtpPinDisplay
            code={sixDigitData}
            itemKey="netflix_tv_code"
            copiedKey={copiedKey}
            onCopy={copyToClipboard}
          />
        </div>
      )}

      {/* Kết Quả Netflix 2: OTP Đăng Nhập */}
      {netflixIndex === 2 && otpData && (
        <div
          className="mt-3 p-3.5 rounded-xl border border-[var(--line)] text-center animate-in fade-in zoom-in-95 duration-200"
          style={{ background: "rgba(0, 0, 0, 0.55)" }}
        >
          <div className="flex items-center justify-between pb-1 text-[11px] text-[var(--soft)]">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Mã OTP Đăng Nhập
            </span>
            <span>Vừa xong</span>
          </div>

          <OtpPinDisplay
            code={otpData.code}
            itemKey="netflix_login_otp"
            copiedKey={copiedKey}
            onCopy={copyToClipboard}
          />

          {otpData.message && (
            <p className="text-[10px] text-[var(--soft)] mt-1 italic">{otpData.message}</p>
          )}
        </div>
      )}
    </div>
  );
};
