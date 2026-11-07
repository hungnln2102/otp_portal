import React from "react";
import { HelpCircle } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="rounded-[24px] border border-[var(--line)] max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-3"
        style={{ background: "var(--panel)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
            Hướng Dẫn Sử Dụng Cổng Xác Minh
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[var(--line)] text-[var(--soft)] hover:text-white flex items-center justify-center transition-all hover:brightness-125"
            style={{ background: "rgba(255, 255, 255, 0.08)" }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-[var(--soft)] leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
          <div>
            <h4 className="font-bold text-[var(--accent)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              1. Đối với Adobe Creative Cloud:
            </h4>
            <p>
              • <strong>Lấy tài khoản:</strong> Nhập email đã mua hàng hoặc mã đơn hàng để xem tài khoản, mật khẩu và hạn sử dụng.
            </p>
            <p>
              • <strong>Lấy mã OTP:</strong> Mở ứng dụng Adobe trên máy tính, nhập email tài khoản và bấm "Continue" để Adobe gửi mã. Sau đó vào trang này nhập email và bấm "Lấy Mã OTP".
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[var(--accent)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              2. Đối với Netflix Premium:
            </h4>
            <p>
              • <strong>Hộ Gia Đình:</strong> Khi màn hình TV hiện cảnh báo cập nhật hộ gia đình, bấm gửi yêu cầu trên TV. Sau đó vào trang này nhập email Netflix và bấm "Lấy Link Xác Minh". Mở link bằng điện thoại dùng chung Wi-Fi với TV.
            </p>
            <p>
              • <strong>Mã TV 6 số:</strong> Khi TV hiện màn hình chờ nhập 6 số xác minh, vào tab Mã 6 số để lấy mã và nhập vào TV.
            </p>
            <p>
              • <strong>OTP Đăng Nhập:</strong> Dành cho đăng nhập trên máy tính / điện thoại yêu cầu mã xác minh từ email.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--line)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md hover:brightness-110"
            style={{ background: "var(--btn)", color: "var(--btn-ink)" }}
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

