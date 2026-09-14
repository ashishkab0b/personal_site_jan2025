#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-"$ROOT_DIR/flask_app/.env"}"
DB_HOST_DIR="${MAXMIND_DB_HOST_DIR:-"$ROOT_DIR/data/flask/geoip"}"
IMAGE="${GEOIPUPDATE_IMAGE:-ghcr.io/maxmind/geoipupdate:v7.1.1}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

ACCOUNT_ID="${GEOIPUPDATE_ACCOUNT_ID:-${MAXMIND_ACCOUNT_ID:-}}"
LICENSE_KEY="${GEOIPUPDATE_LICENSE_KEY:-${MAXMIND_LICENSE_KEY:-}}"
EDITION_IDS="${GEOIPUPDATE_EDITION_IDS:-GeoLite2-City GeoLite2-ASN}"

if [[ -z "$ACCOUNT_ID" || -z "$LICENSE_KEY" ]]; then
  echo "Missing MaxMind credentials." >&2
  echo "Set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY in $ENV_FILE." >&2
  exit 1
fi

mkdir -p "$DB_HOST_DIR"

docker run --rm \
  -e "GEOIPUPDATE_ACCOUNT_ID=$ACCOUNT_ID" \
  -e "GEOIPUPDATE_LICENSE_KEY=$LICENSE_KEY" \
  -e "GEOIPUPDATE_EDITION_IDS=$EDITION_IDS" \
  -e "GEOIPUPDATE_DB_DIR=/usr/share/GeoIP" \
  -e "GEOIPUPDATE_VERBOSE=${GEOIPUPDATE_VERBOSE:-1}" \
  -v "$DB_HOST_DIR:/usr/share/GeoIP" \
  "$IMAGE"

echo "MaxMind databases updated in $DB_HOST_DIR"
