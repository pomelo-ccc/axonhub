#!/usr/bin/env bash

set -euo pipefail

if [[ $# -gt 1 ]]; then
  printf 'Usage: %s [git-ref-or-sha]\n' "$0" >&2
  exit 1
fi

deploy_host="${AXONHUB_DEPLOY_HOST:?AXONHUB_DEPLOY_HOST is required}"
deploy_user="${AXONHUB_DEPLOY_USER:-root}"
deploy_port="${AXONHUB_DEPLOY_PORT:-22}"
deploy_service="${AXONHUB_DEPLOY_SERVICE:-axonhub}"
deploy_binary_path="${AXONHUB_DEPLOY_BINARY_PATH:-/usr/local/bin/axonhub}"
deploy_backup_dir="${AXONHUB_DEPLOY_BACKUP_DIR:-/root/axonhub-backups}"
deploy_identity_file="${AXONHUB_DEPLOY_SSH_IDENTITY_FILE:-}"
deploy_known_hosts_file="${AXONHUB_DEPLOY_KNOWN_HOSTS_FILE:-}"
deploy_source_archive_base_url="${AXONHUB_DEPLOY_SOURCE_ARCHIVE_BASE_URL:-https://codeload.github.com/pomelo-ccc/axonhub/tar.gz}"
deploy_build_root="${AXONHUB_DEPLOY_BUILD_ROOT:-/root/axonhub-builds/source-builds}"
deploy_base_path="${AXONHUB_DEPLOY_BASE_PATH:-/api/}"
deploy_go_proxy="${AXONHUB_DEPLOY_GOPROXY:-https://goproxy.cn,direct}"
deploy_npm_registry="${AXONHUB_DEPLOY_NPM_REGISTRY:-https://registry.npmmirror.com}"

deploy_ref="${1:-${AXONHUB_DEPLOY_SOURCE_REF:-${GITHUB_SHA:-}}}"
if [[ -z "${deploy_ref}" ]]; then
  printf 'A git ref or sha is required.\n' >&2
  exit 1
fi

deployment_id="$(date -u +%Y%m%d%H%M%S)"
if [[ -n "${GITHUB_SHA:-}" ]]; then
  deployment_id="${deployment_id}-${GITHUB_SHA::12}"
fi

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

rollback_on_failure() {
  local exit_code="$1"

  if [[ "${exit_code}" -ne 0 ]] && [[ -n "${remote_backup_path}" ]]; then
    printf 'Deployment failed, attempting rollback to %s\n' "${remote_backup_path}" >&2
    "$(dirname "$0")/rollback-production.sh" "${remote_backup_path}" || true
  fi
}

trap 'rollback_on_failure $?' EXIT

printf 'Building and deploying ref %s on %s...\n' "${deploy_ref}" "${deploy_host}"
remote_backup_path="$(
  ssh "${ssh_opts[@]}" "${deploy_user}@${deploy_host}" bash -s -- \
    "${deploy_source_archive_base_url}" \
    "${deploy_ref}" \
    "${deploy_build_root}" \
    "${deploy_binary_path}" \
    "${deploy_backup_dir}" \
    "${deploy_service}" \
    "${deployment_id}" \
    "${deploy_base_path}" \
    "${deploy_go_proxy}" \
    "${deploy_npm_registry}" <<'REMOTE'
set -euo pipefail

source_archive_base_url="$1"
source_ref="$2"
build_root="$3"
binary_path="$4"
backup_dir="$5"
service_name="$6"
deployment_id="$7"
base_path="$8"
go_proxy="${9}"
npm_registry="${10}"

export PATH="/usr/local/go/bin:/usr/local/bin:${PATH}"
export GOPROXY="${go_proxy}"
export PNPM_HOME="${PNPM_HOME:-/root/.local/share/pnpm}"
export COREPACK_HOME="${COREPACK_HOME:-/root/.cache/corepack}"
export PATH="${PNPM_HOME}:${PATH}"
export NPM_CONFIG_REGISTRY="${npm_registry}"

if ! command -v go >/dev/null || ! command -v node >/dev/null || ! command -v pnpm >/dev/null; then
  echo "Build toolchain missing on server. Run scripts/deploy/bootstrap-build-host.sh first." >&2
  exit 1
fi

mkdir -p "${build_root}" "${backup_dir}"

short_sha="${source_ref:0:12}"
build_path="${build_root%/}/${deployment_id}-${short_sha}"
archive_path="/tmp/axonhub-source-${deployment_id}.tar.gz"

cleanup() {
  rm -rf "${build_path}" "${archive_path}"
}

trap cleanup EXIT

curl \
  --fail \
  --location \
  --retry 3 \
  --retry-delay 2 \
  --connect-timeout 15 \
  --max-time 1800 \
  --output "${archive_path}" \
  "${source_archive_base_url%/}/${source_ref}"

mkdir -p "${build_path}"
tar -xzf "${archive_path}" --strip-components=1 -C "${build_path}"

(cd "${build_path}/frontend" && pnpm install --frozen-lockfile --prefer-offline)
(cd "${build_path}" && VITE_BASE_PATH="${base_path}" make build-frontend)
(cd "${build_path}" && GOOS=linux GOARCH=amd64 make build-backend)

backup_path="${backup_dir%/}/axonhub.before_${deployment_id}"
cp "${binary_path}" "${backup_path}"
install -m 755 "${build_path}/axonhub" "${binary_path}"
systemctl restart "${service_name}"

printf '%s\n' "${backup_path}"
REMOTE
)"

printf 'New backup created at %s\n' "${remote_backup_path}"

"$(dirname "$0")/healthcheck.sh"

trap - EXIT
printf 'Deployment completed successfully.\n'
