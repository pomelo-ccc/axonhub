#!/usr/bin/env bash

set -euo pipefail

deploy_host="${AXONHUB_DEPLOY_HOST:?AXONHUB_DEPLOY_HOST is required}"
deploy_user="${AXONHUB_DEPLOY_USER:-root}"
deploy_port="${AXONHUB_DEPLOY_PORT:-22}"
deploy_service="${AXONHUB_DEPLOY_SERVICE:-axonhub}"
deploy_binary_path="${AXONHUB_DEPLOY_BINARY_PATH:-/usr/local/bin/axonhub}"
deploy_backup_dir="${AXONHUB_DEPLOY_BACKUP_DIR:-/root/axonhub-backups}"
deploy_identity_file="${AXONHUB_DEPLOY_SSH_IDENTITY_FILE:-}"
deploy_known_hosts_file="${AXONHUB_DEPLOY_KNOWN_HOSTS_FILE:-}"

requested_target="${1:-}"

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

printf 'Rolling back AxonHub on %s...\n' "${deploy_host}"

ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" bash -s -- \
  "${deploy_binary_path}" \
  "${deploy_backup_dir}" \
  "${deploy_service}" \
  "${requested_target}" <<'REMOTE'
set -euo pipefail

binary_path="$1"
backup_dir="$2"
service_name="$3"
requested_target="${4:-}"

resolve_target() {
  if [[ -z "${requested_target}" ]]; then
    ls -1t "${backup_dir}"/axonhub.before_* 2>/dev/null | head -n 1
    return
  fi

  if [[ -f "${requested_target}" ]]; then
    printf '%s\n' "${requested_target}"
    return
  fi

  if [[ -f "${backup_dir}/${requested_target}" ]]; then
    printf '%s\n' "${backup_dir}/${requested_target}"
    return
  fi

  return 1
}

target_backup="$(resolve_target)"

if [[ -z "${target_backup}" ]] || [[ ! -f "${target_backup}" ]]; then
  printf 'Unable to resolve rollback target in %s\n' "${backup_dir}" >&2
  exit 1
fi

install -m 755 "${target_backup}" "${binary_path}"
systemctl restart "${service_name}"

printf 'Rolled back to %s\n' "${target_backup}"
REMOTE

"$(dirname "$0")/healthcheck.sh"
