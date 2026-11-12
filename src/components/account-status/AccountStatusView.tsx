import React, { useState, useEffect, useRef } from "react";
import { AccountResult, OrgSwitchResponse } from "../../types/otp";
import { AccountStatusActiveCard } from "./AccountStatusActiveCard";
import { AccountStatusSwitchTeamCard } from "./AccountStatusSwitchTeamCard";
import { AccountStatusNotFoundCard } from "./AccountStatusNotFoundCard";
import {
  fetchAdobeSwitchTeam,
  fetchAdobeSwitchTeamStatus,
  fetchAdobeCheck,
} from "../../services/otpService";

interface AccountStatusViewProps {
  data: AccountResult;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onGoOtp?: (account: string) => void;
  onGoAccountLookup?: () => void;
  onStatusUpdated?: (newData: AccountResult) => void;
}

export const AccountStatusView: React.FC<AccountStatusViewProps> = ({
  data,
  copyToClipboard,
  showToast,
  onGoOtp,
  onGoAccountLookup,
  onStatusUpdated,
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchProgress, setSwitchProgress] = useState<OrgSwitchResponse | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, []);

  // Hủy polling nếu data thay đổi (ví dụ người dùng kiểm tra email khác)
  useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setIsSwitching(false);
    setSwitchProgress(null);
    setSwitchError(null);
    pollCountRef.current = 0;
  }, [data.account]);

  const handleStartSwitchTeam = async () => {
    if (isSwitching) return;

    try {
      setIsSwitching(true);
      setSwitchError(null);
      setSwitchProgress({ status: "waiting" });
      pollCountRef.current = 0;

      const res = await fetchAdobeSwitchTeam(data.account);
      if (!res.success) {
        throw new Error(res.error || res.message || "Không thể kích hoạt yêu cầu đổi team.");
      }

      setSwitchProgress(res.data || res);
      showToast("info", "Đã gửi yêu cầu đổi team, hệ thống đang xử lý...");

      // Bắt đầu chu kỳ Polling
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);

      pollTimerRef.current = setInterval(async () => {
        if (!isMountedRef.current) return;
        pollCountRef.current += 1;

        // Giới hạn an toàn: tối đa 20 lần thử (~70s)
        if (pollCountRef.current > 20) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          if (isMountedRef.current) {
            setIsSwitching(false);
            setSwitchError("Quá thời gian chờ phản hồi từ hệ thống đổi team. Vui lòng bấm thử lại.");
            showToast("error", "Hết thời gian chờ đổi team. Vui lòng thử lại sau.");
          }
          return;
        }

        try {
          // 1. Kiểm tra trạng thái org-switch
          const statusRes = await fetchAdobeSwitchTeamStatus(data.account);
          if (isMountedRef.current && statusRes) {
            setSwitchProgress(statusRes.data || statusRes);
          }

          // 2. Kiểm tra trạng thái tài khoản thực tế (user-status)
          const checkRes = await fetchAdobeCheck(data.account);
          if (isMountedRef.current && checkRes.success && checkRes.data) {
            if (checkRes.data.status_type === "active") {
              // Chuyển team thành công!
              if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
              }
              setIsSwitching(false);
              showToast("success", "Chúc mừng! Đã chuyển team thành công, tài khoản đang hoạt động bình thường.");
              if (onStatusUpdated) {
                onStatusUpdated(checkRes.data);
              }
            }
          }
        } catch (pollErr: any) {
          console.warn("[Ades Switch Team Poll] Lỗi chu kỳ polling:", pollErr.message);
        }
      }, 3500);
    } catch (err: any) {
      if (isMountedRef.current) {
        setIsSwitching(false);
        setSwitchError(err.message || "Lỗi khi yêu cầu chuyển team.");
        showToast("error", err.message || "Lỗi khi yêu cầu chuyển team.");
      }
    }
  };

  // Xác định form hiển thị dựa trên status_type
  const statusType = data.status_type || (
    data.status === "KHÔNG TỒN TẠI" ? "not_found" :
    data.status === "CẦN CHUYỂN TEAM" ? "inactive" : "active"
  );

  if (statusType === "inactive") {
    return (
      <AccountStatusSwitchTeamCard
        data={data}
        isSwitching={isSwitching}
        switchProgress={switchProgress}
        switchError={switchError}
        onSwitchTeam={handleStartSwitchTeam}
        copyToClipboard={copyToClipboard}
      />
    );
  }

  if (statusType === "not_found") {
    return (
      <AccountStatusNotFoundCard
        data={data}
        copyToClipboard={copyToClipboard}
        onGoAccountLookup={onGoAccountLookup}
      />
    );
  }

  return (
    <AccountStatusActiveCard
      data={data}
      copyToClipboard={copyToClipboard}
      onGoOtp={onGoOtp}
    />
  );
};

