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
deploy_source_repo_url="${AXONHUB_DEPLOY_SOURCE_REPO_URL:-https://github.com/pomelo-ccc/axonhub.git}"
deploy_source_dir="${AXONHUB_DEPLOY_SOURCE_DIR:-/root/axonhub-source}"
deploy_worktree_dir="${AXONHUB_DEPLOY_WORKTREE_DIR:-/root/axonhub-builds/worktrees}"
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
    "${deploy_source_repo_url}" \
    "${deploy_ref}" \
    "${deploy_source_dir}" \
    "${deploy_worktree_dir}" \
    "${deploy_binary_path}" \
    "${deploy_backup_dir}" \
    "${deploy_service}" \
    "${deployment_id}" \
    "${deploy_base_path}" \
    "${deploy_go_proxy}" \
    "${deploy_npm_registry}" <<'REMOTE'
set -euo pipefail

source_repo_url="$1"
source_ref="$2"
source_dir="$3"
worktree_dir="$4"
binary_path="$5"
backup_dir="$6"
service_name="$7"
deployment_id="$8"
base_path="$9"
go_proxy="${10}"
npm_registry="${11}"

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

mkdir -p "${worktree_dir}" "${backup_dir}"

if [[ ! -d "${source_dir}/.git" ]]; then
  git clone --filter=blob:none "${source_repo_url}" "${source_dir}"
fi

git -C "${source_dir}" fetch --tags --prune origin
resolved_sha="$(
  git -C "${source_dir}" rev-parse --verify "${source_ref}^{commit}" 2>/dev/null ||
  git -C "${source_dir}" rev-parse --verify "origin/${source_ref}^{commit}" 2>/dev/null
)"

if [[ -z "${resolved_sha}" ]]; then
  echo "Unable to resolve git ref: ${source_ref}" >&2
  exit 1
fi

short_sha="${resolved_sha:0:12}"
worktree_path="${worktree_dir%/}/${deployment_id}-${short_sha}"

cleanup() {
  if [[ -d "${worktree_path}" ]]; then
    git -C "${source_dir}" worktree remove --force "${worktree_path}" >/dev/null 2>&1 || rm -rf "${worktree_path}"
  fi
}

trap cleanup EXIT

git -C "${source_dir}" worktree add --detach "${worktree_path}" "${resolved_sha}" >/dev/null

(cd "${worktree_path}/frontend" && pnpm install --frozen-lockfile --prefer-offline)
(cd "${worktree_path}" && VITE_BASE_PATH="${base_path}" make build-frontend)
(cd "${worktree_path}" && GOOS=linux GOARCH=amd64 make build-backend)

backup_path="${backup_dir%/}/axonhub.before_${deployment_id}"
cp "${binary_path}" "${backup_path}"
install -m 755 "${worktree_path}/axonhub" "${binary_path}"
systemctl restart "${service_name}"

printf '%s\n' "${backup_path}"
REMOTE
)"

printf 'New backup created at %s\n' "${remote_backup_path}"

"$(dirname "$0")/healthcheck.sh"

trap - EXIT
printf 'Deployment completed successfully.\n'
