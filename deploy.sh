#!/bin/bash
# ==============================================================================
# Deploy the OTP Portal container on the VPS.
# Usage: bash deploy.sh [--no-cache | --commit <sha>]
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
origin=http://127.0.0.1:3005
public=https://www.mavrykpremium.com
smoke_dir=$(mktemp -d)
trap 'rm -rf -- "$smoke_dir"' EXIT
curl_checks=(curl -sS --retry 5 --retry-connrefused --max-time 10)

check_response() {
  local url=$1 output=$2 expected_status=$3 expected_type=$4
  local response status content_type
  response=$("${curl_checks[@]}" -o "$output" -w '%{http_code} %{content_type}' "$url")
  read -r status content_type <<< "$response"
  content_type=${content_type%%;*}
  if [[ $status != "$expected_status" || ! $content_type =~ $expected_type ]]; then
    echo "Unexpected response for $url ($response)" >&2
    return 1
  fi
}

check_redirect() {
  local url=$1 expected=$2
  local response status destination
  response=$("${curl_checks[@]}" -o /dev/null -w '%{http_code} %{redirect_url}' "$url")
  read -r status destination <<< "$response"
  if [[ ! $status =~ ^(301|308)$ || $destination != "$expected" ]]; then
    echo "Unexpected redirect for $url ($response, expected $expected)" >&2
    return 1
  fi
}

check_response "$origin/system/" "$smoke_dir/origin.html" 200 '^text/html$'
entry=$(grep -oE '/system/assets/[^" ]+\.js' "$smoke_dir/origin.html" | sed -n '1p')
stylesheet=$(grep -oE '/system/assets/[^" ]+\.css' "$smoke_dir/origin.html" | sed -n '1p')

for route in / /price /price/ /system/ /system/adobe-account /system/adobe-otp \
  /system/netflix-household /system/netflix-tv /system/netflix-otp \
  /system/gpt-account /system/gpt-otp /system/2fa; do
  check_response "$public$route" "$smoke_dir/public.html" 200 '^text/html$'
  if ! grep -Fq "$entry" "$smoke_dir/public.html" || ! grep -Fq "$stylesheet" "$smoke_dir/public.html"; then
    echo "Unexpected portal build at $public$route" >&2
    exit 1
  fi
done

check_bundle() {
  local bundle=$1 mime=$2
  check_response "$origin$bundle" "$smoke_dir/origin.bundle" 200 "$mime"
  check_response "$public$bundle" "$smoke_dir/public.bundle" 200 "$mime"
  if ! cmp -s "$smoke_dir/origin.bundle" "$smoke_dir/public.bundle"; then
    echo "Public bundle differs from the container build at $public$bundle" >&2
    return 1
  fi
}

check_bundle "$entry" '^(application|text)/javascript$'
check_bundle "$stylesheet" '^text/css$'
check_response "$origin/system/assets/deploy-smoke-missing.js" /dev/null 404 '.*'
check_response "$public/system/assets/deploy-smoke-missing.js" /dev/null 404 '.*'

query='theme=season-winter&smoke=portal%20deploy'
check_redirect "$public/otp?$query" "$public/system/?$query"
check_redirect "$public/otp/?$query" "$public/system/?$query"
check_redirect "$public/otp/adobe-otp?$query" "$public/system/adobe-otp?$query"
check_redirect "$public/check-profile?$query" "$public/system/adobe-account?$query"
check_redirect "$public/renew-adobe?$query" "$public/system/adobe-account?$query"
check_redirect "$public/netflix?$query" "$public/system/netflix-household?$query"

for season in spring summer autumn winter; do
  seasonal_path="/system/seasonal/$season.html"
  check_redirect "$public/$season?$query" "$public$seasonal_path?$query"
  check_response "$public$seasonal_path?$query" /dev/null 200 '^text/html$'
done

echo "Verified portal build $entry and $stylesheet"
"${DC[@]}" ps

echo "======================================"
echo "  Deployment completed!"
echo "  URL: https://www.mavrykpremium.com/system/"
echo "======================================"
