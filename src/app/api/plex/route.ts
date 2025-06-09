import { NextResponse } from 'next/server';

const PLEX_URL = 'http://10.0.0.111:32400';
const PLEX_TOKEN = 'FhDk5Qq-uyHbazmy9Uzj';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
    }

    // Build the Plex URL with all query parameters
    const plexUrl = new URL(PLEX_URL + endpoint);
    
    // Add the token
    plexUrl.searchParams.append('X-Plex-Token', PLEX_TOKEN);
    
    // For photo transcoding, copy all other query parameters
    if (endpoint.startsWith('/photo/:/transcode')) {
      // Copy all query parameters except 'endpoint'
      for (const [key, value] of searchParams.entries()) {
        if (key !== 'endpoint') {
          plexUrl.searchParams.append(key, value);
        }
      }
    }

    console.log('Fetching from Plex:', {
      endpoint,
      url: plexUrl.toString()
    });

    // Make the request to Plex with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(plexUrl.toString(), {
      headers: {
        'Accept': endpoint.startsWith('/photo') ? 'image/*' : 'application/json',
        'X-Plex-Client-Identifier': 'letterboxd-dashboard',
        'X-Plex-Platform': 'Web',
        'X-Plex-Platform-Version': '1.0.0',
        'X-Plex-Product': 'Letterboxd Dashboard',
        'X-Plex-Version': '1.0.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Plex API error:', {
        status: response.status,
        statusText: response.statusText,
        endpoint
      });

      return NextResponse.json({
        error: `Plex API error: ${response.statusText}`,
      }, { status: response.status });
    }

    // For photos, return the image data directly
    if (endpoint.startsWith('/photo')) {
      const contentType = response.headers.get('content-type');
      const imageData = await response.arrayBuffer();
      
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': contentType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // For other requests, return JSON
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error connecting to Plex:', error);
      return NextResponse.json({
        error: 'Could not connect to Plex server. Please check if the server is running and accessible.',
        details: error.message
      }, { status: 503 });
    }

    if (error.name === 'AbortError') {
      return NextResponse.json({
        error: 'Request to Plex server timed out',
        details: error.message
      }, { status: 504 });
    }

    console.error('Unexpected proxy error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 