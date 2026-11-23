import React, { useState, useEffect, useRef } from "react";
import { AccountResult, OrgSwitchResponse } from "../../types/otp";
import { AccountStatusActiveCard } from "./AccountStatusActiveCard";
import { AccountStatusSwitchTeamCard } from "./AccountStatusSwitchTeamCard";
import { AccountStatusNotFoundCard } from "./AccountStatusNotFoundCard";
import {
  OTP_OPERATION_ERROR,
  fetchAdobeSwitchTeam,
  fetchAdobeSwitchTeamStatus,
  fetchAdobeCheck,
  type AdobeOrderProof,
} from "../../services/otpService";

interface AccountStatusViewProps {
  data: AccountResult;
  orderProof: AdobeOrderProof;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onGoOtp?: (account: string) => void;
  onGoAccountLookup?: () => void;
  onStatusUpdated?: (newData: AccountResult) => void;
}

export const AccountStatusView: React.FC<AccountStatusViewProps> = ({
  data,
  orderProof,
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
  }, [data.account, orderProof]);

  const handleStartSwitchTeam = async () => {
    if (isSwitching) return;

    try {
      setIsSwitching(true);
      setSwitchError(null);
      setSwitchProgress({ status: "waiting" });
      pollCountRef.current = 0;

      const res = await fetchAdobeSwitchTeam(orderProof, data.account);
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
            setSwitchError(OTP_OPERATION_ERROR);
            showToast("error", OTP_OPERATION_ERROR);
          }
          return;
        }

        try {
          // 1. Kiểm tra trạng thái org-switch
          const statusRes = await fetchAdobeSwitchTeamStatus(orderProof, data.account);
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
    } catch {
      if (isMountedRef.current) {
        setIsSwitching(false);
        setSwitchError(OTP_OPERATION_ERROR);
        showToast("error", OTP_OPERATION_ERROR);
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

