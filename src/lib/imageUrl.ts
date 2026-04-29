/**
 * Resolves an image/video path to a full URL.
 *
 * Rules:
 *  - Already a full URL (http/https) → return as-is
 *  - Starts with /uploads → prepend backend base URL (local or production)
 *  - Starts with / (public folder) → return as-is (served by Next.js)
 *  - Plain filename → prepend backend base URL + /uploads/
 *  - Empty / undefined → return fallback
 *
 * The backend base URL is read from NEXT_PUBLIC_API_URL at build time,
 * so switching between local (localhost:5000) and production (Hostinger)
 * only requires changing that env variable.
 */
const _rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.oshaia.com/api';
const _fullUrl = _rawUrl.startsWith('http') ? _rawUrl : `https://${_rawUrl}`;
// Strip only the trailing /api (not any /api inside the hostname)
const BACKEND_BASE = _fullUrl.replace(/\/api\/?$/, '');

export function getImageUrl(
  path: string | undefined | null,
  fallback = '/1080X1080/Bollywood-Unwind-Grid.jpg'
): string {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;             // already absolute
  if (path.startsWith('/uploads')) return `${BACKEND_BASE}${path}`;  // backend upload (local or prod)
  if (path.startsWith('/')) return path;                // Next.js public folder
  return `${BACKEND_BASE}/uploads/${path}`;             // bare filename
}
