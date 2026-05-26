#!/usr/bin/env bash

set -euo pipefail

if [[ $# -gt 1 ]]; then
  printf 'Usage: %s [/path/to/axonhub.gz]\n' "$0" >&2
  exit 1
fi

archive_path="${1:-}"

deploy_host="${AXONHUB_DEPLOY_HOST:?AXONHUB_DEPLOY_HOST is required}"
deploy_user="${AXONHUB_DEPLOY_USER:-root}"
deploy_port="${AXONHUB_DEPLOY_PORT:-22}"
deploy_service="${AXONHUB_DEPLOY_SERVICE:-axonhub}"
deploy_binary_path="${AXONHUB_DEPLOY_BINARY_PATH:-/usr/local/bin/axonhub}"
deploy_backup_dir="${AXONHUB_DEPLOY_BACKUP_DIR:-/root/axonhub-backups}"
deploy_tmp_dir="${AXONHUB_DEPLOY_TMP_DIR:-/tmp}"
deploy_identity_file="${AXONHUB_DEPLOY_SSH_IDENTITY_FILE:-}"
deploy_known_hosts_file="${AXONHUB_DEPLOY_KNOWN_HOSTS_FILE:-}"
remote_archive_url="${AXONHUB_DEPLOY_REMOTE_ARCHIVE_URL:-}"
remote_archive_kind="${AXONHUB_DEPLOY_REMOTE_ARCHIVE_KIND:-raw}"
remote_archive_sha="${AXONHUB_DEPLOY_REMOTE_ARCHIVE_SHA256:-}"

deployment_id="$(date -u +%Y%m%d%H%M%S)"
if [[ -n "${GITHUB_SHA:-}" ]]; then
  deployment_id="${deployment_id}-${GITHUB_SHA::12}"
fi

remote_bundle_path=""
remote_archive_path=""
remote_extract_dir=""
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
  if [[ -z "${remote_bundle_path}" && -z "${remote_archive_path}" && -z "${remote_extract_dir}" ]]; then
    return
  fi

  ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" bash -s -- \
    "${remote_bundle_path}" \
    "${remote_archive_path}" \
    "${remote_extract_dir}" <<'REMOTE_CLEANUP' >/dev/null 2>&1 || true
set -euo pipefail

bundle_path="$1"
archive_path="$2"
extract_dir="$3"

if [[ -n "${bundle_path}" ]]; then
  rm -f "${bundle_path}"
fi

if [[ -n "${archive_path}" ]] && [[ "${archive_path}" != "${bundle_path}" ]]; then
  rm -f "${archive_path}"
fi

if [[ -n "${extract_dir}" ]]; then
  rm -rf "${extract_dir}"
fi
REMOTE_CLEANUP
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

if [[ -n "${archive_path}" ]]; then
  if [[ ! -f "${archive_path}" ]]; then
    printf 'Archive not found: %s\n' "${archive_path}" >&2
    exit 1
  fi

  remote_bundle_path="${deploy_tmp_dir%/}/axonhub-${deployment_id}.gz"
  remote_archive_path="${remote_bundle_path}"

  printf 'Computing local archive checksum...\n'
  local_sha="$(sha256sum "${archive_path}" | awk '{print $1}')"

  printf 'Uploading %s to %s:%s\n' "${archive_path}" "${deploy_host}" "${remote_bundle_path}"
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
    "${deploy_user}@${deploy_host}:${remote_bundle_path}"
else
  if [[ -z "${remote_archive_url}" || -z "${remote_archive_sha}" ]]; then
    printf 'Provide a local archive path or set AXONHUB_DEPLOY_REMOTE_ARCHIVE_URL and AXONHUB_DEPLOY_REMOTE_ARCHIVE_SHA256.\n' >&2
    exit 1
  fi

  case "${remote_archive_kind}" in
    raw|gz)
      remote_bundle_path="${deploy_tmp_dir%/}/axonhub-${deployment_id}.gz"
      remote_archive_path="${remote_bundle_path}"
      remote_extract_dir=""
      ;;
    zip)
      remote_bundle_path="${deploy_tmp_dir%/}/axonhub-${deployment_id}.zip"
      remote_extract_dir="${deploy_tmp_dir%/}/axonhub-${deployment_id}.artifact"
      remote_archive_path="${remote_extract_dir}/axonhub.gz"
      ;;
    *)
      printf 'Unsupported remote archive kind: %s\n' "${remote_archive_kind}" >&2
      exit 1
      ;;
  esac

  local_sha="${remote_archive_sha}"
  remote_archive_url_b64="$(printf '%s' "${remote_archive_url}" | base64 | tr -d '\n')"

  printf 'Downloading deploy artifact on %s from GitHub...\n' "${deploy_host}"
  ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" bash -s -- \
    "${remote_archive_url_b64}" \
    "${remote_bundle_path}" \
    "${remote_archive_kind}" \
    "${remote_extract_dir}" <<'REMOTE_DOWNLOAD'
set -euo pipefail

archive_url="$(printf '%s' "$1" | base64 -d)"
bundle_path="$2"
archive_kind="$3"
extract_dir="$4"

curl \
  --fail \
  --location \
  --retry 3 \
  --retry-delay 2 \
  --connect-timeout 15 \
  --max-time 1800 \
  --output "${bundle_path}" \
  "${archive_url}"

if [[ "${archive_kind}" == "zip" ]]; then
  rm -rf "${extract_dir}"
  mkdir -p "${extract_dir}"
  unzip -qo "${bundle_path}" -d "${extract_dir}"
  test -f "${extract_dir}/axonhub.gz"
fi
REMOTE_DOWNLOAD
fi

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
