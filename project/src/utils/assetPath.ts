/**
 * Get the correct asset path considering the base URL
 * This is needed for GitHub Pages deployment where the app is served from a subdirectory
 */
export function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Combine base and path, ensuring no double slashes
  return `${base}${cleanPath}`.replace(/\/\//g, '/');
}
