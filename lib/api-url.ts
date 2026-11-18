/**
 * Absolute in-app URLs must go through here.
 *
 * When the app is hosted under a subpath (NEXT_BASE_PATH=/soandethi) a bare
 * `fetch('/api/memory')` hits the domain root and 404s, so every client-side
 * call and static asset path is resolved against the configured base path.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix an app-absolute path (`/api/...`, `/fonts/...`) with the base path. */
export function basePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
