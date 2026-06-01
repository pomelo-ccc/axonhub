const normalizeBasePath = (value?: string) => {
  if (!value || value === '/') {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const isAbsoluteUrl = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) || value.startsWith('//');

const inferRuntimeBasePath = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }

  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment) {
    const reservedTopLevelRoutes = new Set([
      'sign-in',
      'sign-up',
      'initialization',
      'forgot-password',
      'otp',
      'console',
      'bootstrap',
      'session',
    ]);

    if (!reservedTopLevelRoutes.has(firstSegment)) {
      return `/${firstSegment}`;
    }
  }

  const assetScript = document.querySelector<HTMLScriptElement>('script[src*="/assets/"]');
  const rawSrc = assetScript?.getAttribute('src');

  if (!rawSrc) {
    return '';
  }

  try {
    const pathname = new URL(rawSrc, window.location.origin).pathname;
    const matchedPath = pathname.match(/^(.*)\/assets\/[^/]+$/);
    return matchedPath?.[1] && matchedPath[1] !== '/' ? matchedPath[1] : '';
  } catch {
    return '';
  }
};

export const APP_BASE_URL = normalizeBasePath(import.meta.env.BASE_URL);
export const APP_BASE_PATH = APP_BASE_URL === '/' ? '' : APP_BASE_URL.replace(/\/$/, '');
export const RUNTIME_APP_BASE_PATH = APP_BASE_PATH || inferRuntimeBasePath();
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
  const effectiveBasePath = RUNTIME_APP_BASE_PATH;

  if (!effectiveBasePath) {
    return normalizedPath;
  }

  if (normalizedPath === effectiveBasePath || normalizedPath.startsWith(`${effectiveBasePath}/`)) {
    return normalizedPath;
  }

  return `${effectiveBasePath}${normalizedPath}`;
}

export function resolveAppAssetPath(path?: string | null, fallbackPath = '/logo.jpg') {
  if (!path) {
    return toAppPath(fallbackPath);
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  return toAppPath(path);
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
  const effectiveBasePath = RUNTIME_APP_BASE_PATH;

  if (!effectiveBasePath) {
    return pathname || '/';
  }

  if (pathname === effectiveBasePath) {
    return '/';
  }

  if (pathname.startsWith(`${effectiveBasePath}/`)) {
    return pathname.slice(effectiveBasePath.length) || '/';
  }

  return pathname || '/';
}

export function isAuthAppPath(pathname = getCurrentAppPath()) {
  return AUTH_APP_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
