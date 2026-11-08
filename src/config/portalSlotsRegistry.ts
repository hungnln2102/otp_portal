/**
 * portalSlotsRegistry.ts
 * NGUỒN SỰ THẬT DUY NHẤT (SSOT) CỦA CÁC Ô INPUT / FORM TRÊN WEB OTP_PORTAL
 * 
 * Khi thêm một form mới hoặc ô input mới vào web otp_portal:
 * - Chỉ cần khai báo thêm 1 slot vào danh sách PORTAL_SLOTS_REGISTRY bên dưới.
 * - Hệ thống sẽ tự động đồng bộ (Auto-Register) sang Backend & Trang Quản Trị Admin (admin_orderlist)
 *   để Master có thể thấy ngay trên bảng và gán các cổng API tùy ý!
 */

export interface PortalSlotDefinition {
  slot_key: string;
  name: string;
  category: "adobe" | "netflix" | "gpt" | "2fa" | string;
  sub_tab_index?: number;
  sub_tab_title?: string;
  btn_text: string;
  input_placeholder: string;
  cooldown_seconds: number;
  assigned_services?: string[];
  enabled: boolean;
  description?: string;
}

export const PORTAL_SLOTS_REGISTRY: PortalSlotDefinition[] = [
  // ── 1. NHÓM ADOBE CREATIVE CLOUD ──────────────────────────────
  {
    slot_key: "adobe_account",
    name: "Adobe: Tra Cứu Tài Khoản",
    category: "adobe",
    sub_tab_index: 0,
    sub_tab_title: "Lấy Tài Khoản",
    btn_text: "Tra Cứu Thông Tin",
    input_placeholder: "Nhập Email mua hàng hoặc Mã đơn hàng...",
    cooldown_seconds: 15,
    assigned_services: ["yuna_2fa"],
    enabled: true,
    description: "Tra cứu email, mật khẩu và gói cước tài khoản Adobe được cấp từ đơn hàng.",
  },
  {
    slot_key: "adobe_otp",
    name: "Adobe: Lấy Mã OTP 6 Số",
    category: "adobe",
    sub_tab_index: 1,
    sub_tab_title: "Nhận OTP",
    btn_text: "Lấy Mã OTP Adobe",
    input_placeholder: "Nhập địa chỉ Email Adobe (VD: user@domain.com)...",
    cooldown_seconds: 30,
    assigned_services: ["fix_ades", "tinyhost"],
    enabled: true,
    description: "Lấy mã xác thực 6 số đăng nhập Adobe từ các cổng hòm thư tự động.",
  },

  // ── 2. NHÓM NETFLIX ───────────────────────────────────────────
  {
    slot_key: "netflix_household",
    name: "Netflix: Link TV / Hộ Gia Đình",
    category: "netflix",
    sub_tab_index: 0,
    sub_tab_title: "Hộ Gia Đình",
    btn_text: "Lấy Link Cập Nhật TV",
    input_placeholder: "Nhập Email tài khoản Netflix...",
    cooldown_seconds: 45,
    assigned_services: ["vivarocky_household", "fix_ades", "tmail_webmail"],
    enabled: true,
    description: "Lấy link xác nhận vị trí hộ gia đình / TV Netflix.",
  },
  {
    slot_key: "netflix_six_digit",
    name: "Netflix: Mã Xác Minh 6 Số",
    category: "netflix",
    sub_tab_index: 1,
    sub_tab_title: "Mã 6 Số",
    btn_text: "Lấy Mã 6 Số Netflix",
    input_placeholder: "Nhập Email tài khoản Netflix...",
    cooldown_seconds: 30,
    assigned_services: ["vivarocky_six_digit", "fix_ades", "tinyhost"],
    enabled: true,
    description: "Lấy mã xác minh đăng nhập 6 số Netflix.",
  },
  {
    slot_key: "netflix_login_otp",
    name: "Netflix: OTP Đăng Nhập",
    category: "netflix",
    sub_tab_index: 2,
    sub_tab_title: "OTP Đăng Nhập",
    btn_text: "Lấy OTP Đăng Nhập",
    input_placeholder: "Nhập Email tài khoản Netflix...",
    cooldown_seconds: 30,
    assigned_services: ["vivarocky_signin", "fix_ades", "tmail_webmail"],
    enabled: true,
    description: "Lấy mã đăng nhập nhanh Sign-in Code qua email Netflix.",
  },

  // ── 3. NHÓM OPENAI CHATGPT ─────────────────────────────────────
  {
    slot_key: "gpt_account",
    name: "ChatGPT: Tra Cứu Tài Khoản",
    category: "gpt",
    sub_tab_index: 0,
    sub_tab_title: "Lấy Tài Khoản",
    btn_text: "Tra Cứu Tài Khoản",
    input_placeholder: "Nhập Email mua hàng hoặc Mã đơn hàng...",
    cooldown_seconds: 15,
    assigned_services: ["warehouse_2fa", "yuna_2fa"],
    enabled: true,
    description: "Tra cứu tài khoản và mật khẩu OpenAI ChatGPT từ kho hàng.",
  },
  {
    slot_key: "gpt_otp",
    name: "ChatGPT: Mã Xác Minh OpenAI",
    category: "gpt",
    sub_tab_index: 1,
    sub_tab_title: "Nhận OTP",
    btn_text: "Lấy Mã 6 Số GPT",
    input_placeholder: "Nhập Email tài khoản OpenAI / ChatGPT cần lấy mã...",
    cooldown_seconds: 30,
    assigned_services: ["warehouse_2fa", "tinyhost"],
    enabled: true,
    description: "Lấy mã xác minh 6 số OpenAI / ChatGPT từ kho hoặc hòm thư.",
  },

  // ── 4. NHÓM 2FA TOTP ──────────────────────────────────────────
  {
    slot_key: "two_factor_totp",
    name: "2FA: Sinh Mã TOTP",
    category: "2fa",
    sub_tab_index: 0,
    sub_tab_title: "Mã 2FA",
    btn_text: "Lấy Mã 2FA (6 Số)",
    input_placeholder: "Nhập Secret Key 2FA (VD: JBSWY3DPEHPK3PXP)...",
    cooldown_seconds: 10,
    assigned_services: ["totp", "yuna_2fa"],
    enabled: true,
    description: "Sinh mã Google Authenticator / 2FA TOTP từ khóa bí mật.",
  },
];

