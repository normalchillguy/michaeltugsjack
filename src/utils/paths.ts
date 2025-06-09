import getConfig from 'next/config';

export function getAssetPath(path: string): string {
  // Get runtime config safely with fallback for development
  const { publicRuntimeConfig = { basePath: '' } } = getConfig() || {};
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${publicRuntimeConfig.basePath}${normalizedPath}`;
}

export function getPosterPath(filmId: string): string {
  // The poster files are named exactly as the film IDs in our data
  return getAssetPath(`/posters/${filmId}.jpg`);
} 