#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  printf 'Usage: %s /path/to/axonhub.gz\n' "$0" >&2
  exit 1
fi

archive_path="$1"

if [[ ! -f "${archive_path}" ]]; then
  printf 'Archive not found: %s\n' "${archive_path}" >&2
  exit 1
fi

deploy_host="${AXONHUB_DEPLOY_HOST:?AXONHUB_DEPLOY_HOST is required}"
deploy_user="${AXONHUB_DEPLOY_USER:-root}"
deploy_port="${AXONHUB_DEPLOY_PORT:-22}"
deploy_service="${AXONHUB_DEPLOY_SERVICE:-axonhub}"
deploy_binary_path="${AXONHUB_DEPLOY_BINARY_PATH:-/usr/local/bin/axonhub}"
deploy_backup_dir="${AXONHUB_DEPLOY_BACKUP_DIR:-/root/axonhub-backups}"
deploy_tmp_dir="${AXONHUB_DEPLOY_TMP_DIR:-/tmp}"
deploy_identity_file="${AXONHUB_DEPLOY_SSH_IDENTITY_FILE:-}"
deploy_known_hosts_file="${AXONHUB_DEPLOY_KNOWN_HOSTS_FILE:-}"

deployment_id="$(date -u +%Y%m%d%H%M%S)"
if [[ -n "${GITHUB_SHA:-}" ]]; then
  deployment_id="${deployment_id}-${GITHUB_SHA::12}"
fi

remote_archive_path="${deploy_tmp_dir%/}/axonhub-${deployment_id}.gz"
remote_backup_path=""

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

cleanup_remote_artifact() {
  if [[ -n "${remote_archive_path}" ]]; then
    ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" "rm -f '${remote_archive_path}'" >/dev/null 2>&1 || true
  fi
}

rollback_on_failure() {
  local exit_code="$1"

  if [[ "${exit_code}" -ne 0 ]] && [[ -n "${remote_backup_path}" ]]; then
    printf 'Deployment failed, attempting rollback to %s\n' "${remote_backup_path}" >&2
    "$(dirname "$0")/rollback-production.sh" "${remote_backup_path}" || true
  fi

  cleanup_remote_artifact
}

trap 'rollback_on_failure $?' EXIT

printf 'Computing local archive checksum...\n'
local_sha="$(sha256sum "${archive_path}" | awk '{print $1}')"

printf 'Uploading %s to %s:%s\n' "${archive_path}" "${deploy_host}" "${remote_archive_path}"
rsync_ssh_cmd="ssh -p ${deploy_port} -o BatchMode=yes -o StrictHostKeyChecking=yes"
if [[ -n "${deploy_identity_file}" ]]; then
  rsync_ssh_cmd="${rsync_ssh_cmd} -i ${deploy_identity_file}"
fi
if [[ -n "${deploy_known_hosts_file}" ]]; then
  rsync_ssh_cmd="${rsync_ssh_cmd} -o UserKnownHostsFile=${deploy_known_hosts_file}"
fi

rsync \
  --archive \
  --checksum \
  --partial \
  --inplace \
  --progress \
  -e "${rsync_ssh_cmd}" \
  "${archive_path}" \
  "${deploy_user}@${deploy_host}:${remote_archive_path}"

printf 'Verifying remote archive checksum...\n'
remote_sha="$(
  ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" \
    "sha256sum '${remote_archive_path}' | awk '{print \$1}'"
)"

if [[ "${local_sha}" != "${remote_sha}" ]]; then
  printf 'Checksum mismatch: local=%s remote=%s\n' "${local_sha}" "${remote_sha}" >&2
  exit 1
fi

printf 'Installing new binary on %s...\n' "${deploy_host}"
remote_backup_path="$(
  ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" bash -s -- \
    "${deploy_binary_path}" \
    "${deploy_backup_dir}" \
    "${deploy_service}" \
    "${remote_archive_path}" \
    "${deploy_tmp_dir}" \
    "${deployment_id}" <<'REMOTE'
set -euo pipefail

binary_path="$1"
backup_dir="$2"
service_name="$3"
archive_path="$4"
tmp_dir="$5"
deployment_id="$6"

backup_path="${backup_dir%/}/axonhub.before_${deployment_id}"
staged_binary="${tmp_dir%/}/axonhub-${deployment_id}.new"

mkdir -p "${backup_dir}"
cp "${binary_path}" "${backup_path}"
gunzip -c "${archive_path}" > "${staged_binary}"
install -m 755 "${staged_binary}" "${binary_path}"
rm -f "${staged_binary}"
systemctl restart "${service_name}"

printf '%s\n' "${backup_path}"
REMOTE
)"

printf 'New backup created at %s\n' "${remote_backup_path}"

"$(dirname "$0")/healthcheck.sh"

cleanup_remote_artifact
trap - EXIT

printf 'Deployment completed successfully.\n'
