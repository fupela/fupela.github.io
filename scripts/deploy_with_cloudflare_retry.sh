#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/docs"
LOG_FILE="$LOG_DIR/cloudflare-deploy-retry-$(date -u +%Y%m%dT%H%M%SZ).log"
PROJECT_NAME="${PROJECT_NAME:-jedaiflow}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-20}"
SLEEP_SECONDS="${SLEEP_SECONDS:-180}"

mkdir -p "$LOG_DIR"

log() {
  printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG_FILE"
}

redact() {
  sed -E \
    -e 's/(Bearer )[A-Za-z0-9._-]+/\1REDACTED/g' \
    -e 's/(refresh_token|access_token|oauth_token|api_token|authorization|token)[^,} ]*/REDACTED/Ig'
}

cd "$ROOT"

log "Starting Cloudflare Pages deploy retry for project: $PROJECT_NAME"
log "Repo: $ROOT"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  log "Attempt $attempt/$MAX_ATTEMPTS: checking Wrangler auth"

  if npx wrangler whoami >>"$LOG_FILE" 2> >(redact >>"$LOG_FILE"); then
    log "Wrangler auth is healthy; deploying"
    if npx wrangler pages deploy . --project-name "$PROJECT_NAME" >>"$LOG_FILE" 2> >(redact >>"$LOG_FILE"); then
      log "Deploy command succeeded; verifying live site"
      sleep 30
      status="$(curl -sS -o /tmp/jedaiflow-deploy-verify.html -w '%{http_code}' https://jedaiflow.com/ || true)"
      if [[ "$status" == "200" ]] && grep -q "Jedaiflow" /tmp/jedaiflow-deploy-verify.html; then
        log "Live verification passed: https://jedaiflow.com/ returned HTTP 200"
        exit 0
      fi
      log "Deploy ran, but live verification was inconclusive: HTTP $status"
      exit 2
    fi
    log "Deploy failed after auth succeeded; stopping for inspection"
    exit 3
  fi

  log "Wrangler auth still unavailable; sleeping ${SLEEP_SECONDS}s"
  sleep "$SLEEP_SECONDS"
done

log "Cloudflare auth did not recover after $MAX_ATTEMPTS attempts"
exit 1
