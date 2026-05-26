#!/usr/bin/env bash

set -euo pipefail

deploy_host="${AXONHUB_DEPLOY_HOST:?AXONHUB_DEPLOY_HOST is required}"
deploy_user="${AXONHUB_DEPLOY_USER:-root}"
deploy_port="${AXONHUB_DEPLOY_PORT:-22}"
deploy_service="${AXONHUB_DEPLOY_SERVICE:-axonhub}"
deploy_identity_file="${AXONHUB_DEPLOY_SSH_IDENTITY_FILE:-}"
deploy_known_hosts_file="${AXONHUB_DEPLOY_KNOWN_HOSTS_FILE:-}"

local_healthcheck_url="${AXONHUB_LOCAL_HEALTHCHECK_URL:-http://127.0.0.1:8090/admin/system/status}"
public_healthcheck_url="${AXONHUB_PUBLIC_HEALTHCHECK_URL:-http://124.221.109.50/api/}"
secondary_healthcheck_url="${AXONHUB_SECONDARY_HEALTHCHECK_URL:-}"
secondary_healthcheck_strict="${AXONHUB_SECONDARY_HEALTHCHECK_STRICT:-false}"

ssh_opts=(
  -p "${deploy_port}"
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
)

if [[ -n "${deploy_identity_file}" ]]; then
  ssh_opts+=(-i "${deploy_identity_file}")
fi

if [[ -n "${deploy_known_hosts_file}" ]]; then
  ssh_opts+=(-o "UserKnownHostsFile=${deploy_known_hosts_file}")
fi

warn() {
  printf 'WARN: %s\n' "$*" >&2
}

run_public_check() {
  local label="$1"
  local url="$2"
  local strict="$3"
  local headers_file body_file status_code

  headers_file="$(mktemp)"
  body_file="$(mktemp)"

  status_code="$(
    curl -sS --max-time 20 -D "${headers_file}" -o "${body_file}" -w '%{http_code}' "${url}" || true
  )"

  if [[ "${status_code}" != "200" ]] || grep -qi 'dnspod.qcloud.com/static/webblock' "${headers_file}" "${body_file}"; then
    if [[ "${strict}" == "true" ]]; then
      printf 'Public health check failed for %s (%s), status=%s\n' "${label}" "${url}" "${status_code}" >&2
      printf '%s\n' '--- headers ---' >&2
      cat "${headers_file}" >&2
      printf '%s\n' '--- body preview ---' >&2
      sed -n '1,40p' "${body_file}" >&2
      rm -f "${headers_file}" "${body_file}"
      return 1
    fi

    warn "Public health check skipped for ${label}: ${url} returned status=${status_code} or a DNS block page"
    rm -f "${headers_file}" "${body_file}"
    return 0
  fi

  rm -f "${headers_file}" "${body_file}"
}

printf 'Checking service state on %s...\n' "${deploy_host}"
ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" "systemctl is-active '${deploy_service}' | grep -qx active"

printf 'Checking remote local health endpoint %s...\n' "${local_healthcheck_url}"
ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" \
  "curl -fsS --max-time 15 '${local_healthcheck_url}' >/dev/null"

printf 'Checking public health endpoint %s...\n' "${public_healthcheck_url}"
run_public_check "primary" "${public_healthcheck_url}" "true"

if [[ -n "${secondary_healthcheck_url}" ]]; then
  printf 'Checking secondary public endpoint %s...\n' "${secondary_healthcheck_url}"
  run_public_check "secondary" "${secondary_healthcheck_url}" "${secondary_healthcheck_strict}"
fi

printf 'Health checks passed.\n'
