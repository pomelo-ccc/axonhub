#!/usr/bin/env bash

set -euo pipefail

go_version="${AXONHUB_DEPLOY_GO_VERSION:-1.26.0}"
node_version="${AXONHUB_DEPLOY_NODE_VERSION:-22.22.3}"
pnpm_version="${AXONHUB_DEPLOY_PNPM_VERSION:-10.11.0}"
bootstrap_tmp_dir="${AXONHUB_DEPLOY_TMP_DIR:-/tmp}"
go_dist_base_url="${AXONHUB_DEPLOY_GO_DIST_BASE_URL:-https://mirrors.aliyun.com/golang}"
node_dist_base_url="${AXONHUB_DEPLOY_NODE_DIST_BASE_URL:-https://cdn.npmmirror.com/binaries/node}"
swap_size="${AXONHUB_DEPLOY_SWAP_SIZE:-2G}"

go_archive="go${go_version}.linux-amd64.tar.gz"
go_url="${go_dist_base_url%/}/${go_archive}"

node_archive="node-v${node_version}-linux-x64.tar.xz"
node_url="${node_dist_base_url%/}/v${node_version}/${node_archive}"

ensure_system_packages() {
  dnf install -y curl git make tar xz unzip >/dev/null
}

ensure_swap() {
  if [[ -z "${swap_size}" || "${swap_size}" == "0" ]]; then
    return
  fi

  if swapon --show --noheadings | awk '{print $1}' | grep -qx '/swapfile'; then
    return
  fi

  fallocate -l "${swap_size}" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile

  if ! grep -q '^/swapfile ' /etc/fstab; then
    printf '/swapfile none swap defaults 0 0\n' >> /etc/fstab
  fi
}

install_go() {
  local current_version
  current_version="$(go version 2>/dev/null | awk '{print $3}' || true)"
  if [[ "${current_version}" == "go${go_version}" ]]; then
    return
  fi

  curl --fail --location --retry 3 --retry-delay 2 \
    --output "${bootstrap_tmp_dir}/${go_archive}" \
    "${go_url}"

  rm -rf /usr/local/go
  tar -C /usr/local -xzf "${bootstrap_tmp_dir}/${go_archive}"
  ln -sf /usr/local/go/bin/go /usr/local/bin/go
  ln -sf /usr/local/go/bin/gofmt /usr/local/bin/gofmt
}

install_node() {
  local current_version
  current_version="$(node -v 2>/dev/null || true)"
  if [[ "${current_version}" == "v${node_version}" ]]; then
    return
  fi

  curl --fail --location --retry 3 --retry-delay 2 \
    --output "${bootstrap_tmp_dir}/${node_archive}" \
    "${node_url}"

  rm -rf /usr/local/lib/nodejs
  mkdir -p /usr/local/lib/nodejs
  tar -C /usr/local/lib/nodejs -xJf "${bootstrap_tmp_dir}/${node_archive}"

  ln -sf "/usr/local/lib/nodejs/node-v${node_version}-linux-x64/bin/node" /usr/local/bin/node
  ln -sf "/usr/local/lib/nodejs/node-v${node_version}-linux-x64/bin/npm" /usr/local/bin/npm
  ln -sf "/usr/local/lib/nodejs/node-v${node_version}-linux-x64/bin/npx" /usr/local/bin/npx
  ln -sf "/usr/local/lib/nodejs/node-v${node_version}-linux-x64/bin/corepack" /usr/local/bin/corepack
}

install_pnpm() {
  export COREPACK_HOME="${COREPACK_HOME:-/root/.cache/corepack}"
  corepack enable pnpm >/dev/null 2>&1 || true
  corepack prepare "pnpm@${pnpm_version}" --activate >/dev/null
}

main() {
  ensure_system_packages
  ensure_swap
  install_go
  install_node
  install_pnpm

  printf 'go=%s\n' "$(go version)"
  printf 'node=%s\n' "$(node -v)"
  printf 'pnpm=%s\n' "$(pnpm -v)"
  printf 'swap=%s\n' "$(swapon --show --noheadings --bytes | awk '{sum += $3} END {print sum + 0}')"
}

main "$@"
