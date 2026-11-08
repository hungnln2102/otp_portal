export type MainTab = "adobe" | "netflix" | "gpt" | "two_factor";
export type AdobeSubForm = 0 | 1; // 0: Lấy tài khoản, 1: OTP
export type NetflixSubForm = 0 | 1 | 2; // 0: Hộ gia đình, 1: Mã 6 số, 2: OTP Đăng Nhập

export interface AccountResult {
  account: string;
  password?: string;
  plan?: string;
  expired_at?: string;
  note?: string;
  status?: string;
}

export interface OtpResult {
  code: string;
  subject?: string;
  from?: string;
  date?: string;
  message?: string;
  duration_ms?: number;
}

export interface GptOtpResult {
  code: string;
  email?: string;
  message?: string;
  duration_ms?: number;
}

export interface HouseholdResult {
  link: string;
  message?: string;
  cooldown?: number;
}

export interface ToastMessage {
  type: "success" | "error" | "info";
  text: string;
}
