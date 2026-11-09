#!/usr/bin/env bash
# ==============================================================================
# Script Triển Khai Tự Động OTP Portal (otp.mavrykpremium.com)
# Dự án: otp_portal (Vite + React + TypeScript + Tailwind CSS)
# Sử dụng: ./deploy.sh [--no-pull] [--clean]
# ==============================================================================

set -euo pipefail

APP_NAME="otp-portal"
DOMAIN="otp.mavrykpremium.com"
PORT=3005
TARGET_WEB_ROOT="${TARGET_WEB_ROOT:-/var/www/otp_portal}"

echo "======================================================"
echo "  🚀 Triển Khai Cổng OTP Portal (${DOMAIN})"
echo "======================================================"
echo "  Thời gian: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Thư mục:   $(pwd)"
echo ""

# 1. Kiểm tra yêu cầu môi trường (Node.js & npm)
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Lỗi: Node.js chưa được cài đặt trên hệ thống!"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ Lỗi: npm chưa được cài đặt trên hệ thống!"
  exit 1
fi

NODE_VER=$(node -v)
NPM_VER=$(npm -v)
echo "ℹ️  Môi trường: Node ${NODE_VER} | npm ${NPM_VER}"
echo ""

# 2. Xử lý Git & Cập nhật mã nguồn mới nhất
NO_PULL=0
if [ "${1:-}" = "--no-pull" ]; then
  NO_PULL=1
fi

if [ "$NO_PULL" -eq 0 ] && [ -d ".git" ]; then
  echo "[1/5] 📥 Kiểm tra trạng thái Git và cập nhật mã nguồn..."

  # Kiểm tra và xử lý worktree an toàn nếu có thay đổi cục bộ
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Phát hiện thay đổi chưa commit trên server, tiến hành stash an toàn..."
    git stash push -u -m "deploy-auto-stash-$(date +%s)" || true
  fi

  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
  echo "  Nhánh hiện tại: ${CURRENT_BRANCH}"

  echo "  Kéo mã nguồn mới nhất từ Git remote..."
  git pull origin "${CURRENT_BRANCH}" || git pull origin main || git pull origin master

  # Đồng bộ submodule luật (core-agents / .agents) nếu có
  if [ -f ".gitmodules" ]; then
    echo "  Đồng bộ Git submodules (.agents)..."
    git submodule update --init --recursive
  fi
  echo "✅ Cập nhật mã nguồn hoàn tất."
else
  echo "[1/5] ⏭️ Bỏ qua bước Git pull (chế độ local/no-pull)."
fi
echo ""

# 3. Cài đặt thư viện dependencies
echo "[2/5] 📦 Cài đặt thư viện phụ thuộc (npm dependencies)..."
if [ "${1:-}" = "--clean" ] || [ "${2:-}" = "--clean" ]; then
  echo "  Dọn dẹp thư mục node_modules cũ (--clean)..."
  rm -rf node_modules package-lock.json
fi

if [ -f "package-lock.json" ]; then
  npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit
else
  npm install --prefer-offline --no-audit
fi
echo "✅ Cài đặt dependencies thành công."
echo ""

# 4. Biên dịch bản sản xuất (Production Build)
echo "[3/5] 🔨 Biên dịch ứng dụng Vite (Production Build)..."
npm run build

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "❌ Lỗi nghiêm trọng: Thư mục dist/index.html không tồn tại sau khi build!"
  exit 1
fi
BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "OK")
echo "✅ Build hoàn tất thành công! Kích thước dist: ${BUILD_SIZE}"
echo ""

# 5. Triển khai tài sản tĩnh & Đồng bộ Nginx Web Root
echo "[4/5] 🌐 Triển khai bản build sản xuất..."
if [ -d "${TARGET_WEB_ROOT}" ] || [ -d "/var/www/otp_portal" ]; then
  DEST_DIR="${TARGET_WEB_ROOT}"
  if [ ! -d "${DEST_DIR}" ] && [ -d "/var/www/otp_portal" ]; then
    DEST_DIR="/var/www/otp_portal"
  fi
  echo "  Đồng bộ dist/* sang ${DEST_DIR}..."
  if command -v rsync >/dev/null 2>&1; then
    sudo rsync -av --delete dist/ "${DEST_DIR}/" 2>/dev/null || cp -r dist/* "${DEST_DIR}/" 2>/dev/null || true
  else
    sudo cp -r dist/* "${DEST_DIR}/" 2>/dev/null || cp -r dist/* "${DEST_DIR}/" 2>/dev/null || true
  fi
  echo "✅ Đã đồng bộ tài sản tĩnh vào ${DEST_DIR}."
else
  echo "ℹ️  Không tìm thấy thư mục ${TARGET_WEB_ROOT}, giữ bản build tại $(pwd)/dist."
fi
echo ""

# 6. Kiểm tra & Tải lại Dịch vụ (Host Nginx / PM2)
echo "[5/5] 🔄 Khởi động lại dịch vụ phục vụ Web..."

# A. Nếu server chạy Nginx Host
if command -v nginx >/dev/null 2>&1 || [ -x /usr/sbin/nginx ]; then
  echo "  Kiểm tra cú pháp cấu hình Nginx..."
  if sudo nginx -t 2>/dev/null; then
    sudo systemctl reload nginx 2>/dev/null || sudo nginx -s reload 2>/dev/null || true
    echo "✅ Host Nginx đã được tải lại thành công (0 downtime)."
  else
    echo "⚠️  Cảnh báo: Kiểm tra cú pháp Nginx không thành công, bỏ qua lệnh reload."
  fi
fi

# B. Nếu server chạy Node SPA qua PM2
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
    echo "  Khởi động lại tiến trình PM2 '${APP_NAME}'..."
    pm2 reload "${APP_NAME}" || pm2 restart "${APP_NAME}"
    pm2 save || true
    echo "✅ PM2 process '${APP_NAME}' đã được khởi động lại."
  fi
fi

echo ""
echo "======================================================"
echo "  🎉 TRIỂN KHAI HOÀN TẤT THÀNH CÔNG!"
echo "  🌐 Cổng OTP: https://${DOMAIN}"
echo "======================================================"

