const normalizeBasePath = (value?: string) => {
  if (!value || value === '/') {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const isAbsoluteUrl = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) || value.startsWith('//');

export const APP_BASE_URL = normalizeBasePath(import.meta.env.BASE_URL);
export const APP_BASE_PATH = APP_BASE_URL === '/' ? '' : APP_BASE_URL.replace(/\/$/, '');
export const PUBLIC_ADMIN_PATH = '/console';
const PUBLIC_PATH_ALIASES: Record<string, string> = {
  '/admin/system/status': '/bootstrap/status',
  '/admin/system/initialize': '/bootstrap/initialize',
  '/admin/auth/signin': '/session/signin',
};

export const AUTH_APP_PATH_PREFIXES = ['/sign-in', '/sign-up', '/initialization', '/forgot-password', '/otp'];

export function toAppPath(path: string) {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!APP_BASE_PATH) {
    return normalizedPath;
  }

  if (normalizedPath === APP_BASE_PATH || normalizedPath.startsWith(`${APP_BASE_PATH}/`)) {
    return normalizedPath;
  }

  return `${APP_BASE_PATH}${normalizedPath}`;
}

export function toPublicBackendPath(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (PUBLIC_PATH_ALIASES[normalizedPath]) {
    return toAppPath(PUBLIC_PATH_ALIASES[normalizedPath]);
  }

  if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')) {
    return toAppPath(normalizedPath.replace(/^\/admin/, PUBLIC_ADMIN_PATH));
  }

  return toAppPath(normalizedPath);
}

export function buildAbsoluteAppUrl(path: string) {
  const resolvedPath = toAppPath(path);
  if (isAbsoluteUrl(resolvedPath) || typeof window === 'undefined') {
    return resolvedPath;
  }

  return `${window.location.origin}${resolvedPath}`;
}

export function getCurrentAppPath(pathname = typeof window !== 'undefined' ? window.location.pathname : '/') {
  if (!APP_BASE_PATH) {
    return pathname || '/';
  }

  if (pathname === APP_BASE_PATH) {
    return '/';
  }

  if (pathname.startsWith(`${APP_BASE_PATH}/`)) {
    return pathname.slice(APP_BASE_PATH.length) || '/';
  }

  return pathname || '/';
}

export function isAuthAppPath(pathname = getCurrentAppPath()) {
  return AUTH_APP_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
