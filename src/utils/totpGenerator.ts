/**
 * Bộ sinh mã xác thực 2 lớp (2FA / TOTP) chuẩn quốc tế RFC 6238
 * Sinh mã OTP 6 chữ số từ Khóa Bí Mật (Base32 Secret Key)
 * Hoạt động 100% Client-Side an toàn, bảo mật tuyệt đối, không gửi key qua mạng.
 */

// Bảng mã Base32 RFC 4648
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Giải mã chuỗi Base32 thành mảng byte
 */
export function base32ToBytes(base32Str: string): Uint8Array {
  const clean = base32Str.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue; // Bỏ qua ký tự không hợp lệ
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

/**
 * Kiểm tra xem chuỗi có phải là Secret Key Base32 hợp lệ không
 */
export function isValidBase32Secret(secret: string): boolean {
  if (!secret) return false;
  const clean = secret.toUpperCase().replace(/[\s=-]/g, '');
  if (clean.length < 8) return false;
  return /^[A-Z2-7]+$/.test(clean);
}

export interface TotpResult {
  code: string; // 6 chữ số
  remainingSeconds: number; // 1 -> 30 giây
  progress: number; // 0% -> 100%
  step: number;
}

/**
 * Sinh mã OTP 6 số từ Base32 Secret Key theo thời gian hiện tại
 */
export async function generateTotp(secret: string, timestamp: number = Date.now()): Promise<TotpResult> {
  const cleanSecret = secret.trim();
  if (!isValidBase32Secret(cleanSecret)) {
    throw new Error('Khóa bí mật 2FA không hợp lệ (phải là chuỗi Base32 A-Z, 2-7).');
  }

  const keyBytes = base32ToBytes(cleanSecret);
  if (keyBytes.length === 0) {
    throw new Error('Không thể giải mã khóa bí mật 2FA.');
  }

  const epochSeconds = Math.floor(timestamp / 1000);
  const timeStep = Math.floor(epochSeconds / 30);
  const remainingSeconds = 30 - (epochSeconds % 30);
  const progress = Math.round((remainingSeconds / 30) * 100);

  // Chuẩn bị 8-byte buffer cho time counter (Big-Endian)
  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  timeView.setBigUint64(0, BigInt(timeStep), false);

  // HMAC-SHA1 qua Web Crypto API
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
  const hmac = new Uint8Array(signature);

  // Dynamic Truncation theo chuẩn RFC 4226 / 6238
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otpNumber = binary % 1000000;
  const code = otpNumber.toString().padStart(6, '0');

  return {
    code,
    remainingSeconds,
    progress,
    step: timeStep,
  };
}

