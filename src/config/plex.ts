export const PLEX_SERVER_URL = process.env.PLEX_SERVER_URL || 'http://localhost:32400';
export const PLEX_TOKEN = process.env.PLEX_TOKEN;

// Function to get the full URL for a Plex resource
export function getPlexResourceUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = `${PLEX_SERVER_URL}/${cleanPath}`;
  
  // Add the token as a query parameter
  return `${url}${url.includes('?') ? '&' : '?'}X-Plex-Token=${PLEX_TOKEN}`;
} 