#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK_FILE="${CERT_RENEW_LOCK_FILE:-/tmp/personal-site-cert-renew.lock}"
LOG_PREFIX="[cert-renew]"

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "$LOG_PREFIX docker compose is not installed or not on PATH" >&2
  exit 1
fi

(
  flock -n 9 || {
    echo "$LOG_PREFIX another renewal is already running"
    exit 0
  }

  cd "$ROOT_DIR"

  echo "$LOG_PREFIX running certbot renew"
  "${COMPOSE[@]}" run --rm --no-deps certbot \
    renew \
    --webroot \
    -w /var/www/certbot \
    --quiet

  echo "$LOG_PREFIX reloading nginx"
  "${COMPOSE[@]}" exec -T nginx nginx -t
  "${COMPOSE[@]}" exec -T nginx nginx -s reload

  echo "$LOG_PREFIX done"
) 9>"$LOCK_FILE"
