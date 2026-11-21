#!/bin/bash
# ==============================================================================
# Deploy OTP Portal Container trÃªn VPS (tÆ°Æ¡ng tá»± admin_orderlist)
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
  echo "Refusing to deploy from a dirty worktree."
  exit 1
fi

echo "[1/4] Updating code from Git..."
if [ "${1:-}" = "--commit" ]; then
  [[ "${2:-}" =~ ^[0-9a-f]{40}$ ]]
  git fetch origin main
  git merge-base --is-ancestor "$2" FETCH_HEAD
  git merge --ff-only "$2"
  test "$(git rev-parse HEAD)" = "$2"
else
  git pull --ff-only origin main
fi

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

echo "[4/4] Checking deployed portal..."
origin=http://127.0.0.1:3005/otp/
public=https://www.mavrykpremium.com/otp/
entry_pattern='assets/[^" ]+\.js'
entry=$(curl -fsS --retry 5 --retry-all-errors --max-time 10 "$origin" | grep -oE "$entry_pattern" | sed -n '1p')
test -n "$entry"
curl -fsS --retry 5 --retry-all-errors --max-time 10 "$public" | grep -F "$entry" >/dev/null
curl -fsS --max-time 10 "$public$entry" -o /dev/null
"${DC[@]}" ps

echo "======================================"
echo "  Deployment completed!"
echo "  URL: https://www.mavrykpremium.com/otp/"
echo "======================================"
