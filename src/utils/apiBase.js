export function getApiBaseUrl() {
  const envBase = import.meta.env?.VITE_API_BASE_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, '');
  }
  // Default: same-origin (works on Vercel where /api is served by the same domain)
  return '';
}
