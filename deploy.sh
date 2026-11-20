#!/bin/bash
# ==============================================================================
# Deploy OTP Portal Container trên VPS (tương tự admin_orderlist)
# Usage: ./deploy.sh | ./deploy.sh --no-cache
# ==============================================================================

set -euo pipefail

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
else
  DC=(docker-compose)
fi

NO_CACHE=""
if [ "${1:-}" = "--no-cache" ]; then
  NO_CACHE="--no-cache"
fi

echo "======================================"
echo "  Deploying OTP Portal Container"
echo "======================================"
echo ""

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Notice: Stashing server-side uncommitted changes..."
  git stash push -u -m "deploy-auto-stash-$(date +%s)" || true
fi

echo "[1/4] Pulling latest code from Git..."
git pull origin main || git pull origin master

echo ""
if [ -n "$NO_CACHE" ]; then
  echo "[2/4] Rebuilding Docker image (--no-cache)..."
else
  echo "[2/4] Rebuilding Docker image (BuildKit + layer cache)..."
fi
"${DC[@]}" -f docker-compose.yml build $NO_CACHE

echo ""
echo "[3/4] Starting updated container..."
"${DC[@]}" -f docker-compose.yml up -d --remove-orphans

if command -v nginx >/dev/null 2>&1 || [ -x /usr/sbin/nginx ]; then
  echo ""
  echo "[4/4] Validating and reloading Host Nginx..."
  (sudo nginx -t && sudo nginx -s reload) 2>/dev/null && echo "Host Nginx reloaded successfully." || echo "Notice: Host Nginx reload skipped or failed."
fi

echo ""
echo "Checking container status..."
sleep 2
"${DC[@]}" ps

echo ""
echo "======================================"
echo "  Deployment completed!"
echo "  URL: https://www.mavrykpremium.com/otp/"
echo "======================================"
