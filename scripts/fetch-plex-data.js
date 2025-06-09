const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PLEX_URL = process.env.PLEX_URL || 'http://10.0.0.111:32400';
const PLEX_TOKEN = process.env.PLEX_TOKEN || 'FhDk5Qq-uyHbazmy9Uzj';

async function fetchFromPlex(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(PLEX_URL + endpoint);
    url.searchParams.append('X-Plex-Token', PLEX_TOKEN);

    const options = {
      headers: {
        'Accept': 'application/json',
        'X-Plex-Client-Identifier': 'letterboxd-dashboard',
        'X-Plex-Platform': 'Web',
        'X-Plex-Platform-Version': '1.0.0',
        'X-Plex-Product': 'Letterboxd Dashboard',
        'X-Plex-Version': '1.0.0'
      }
    };

    const client = url.protocol === 'https:' ? https : http;
    client.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse Plex response'));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    // First verify connectivity
    const root = await fetchFromPlex('/');
    console.log('Connected to Plex server');

    // Get library sections
    const sections = await fetchFromPlex('/library/sections');
    const movieSection = sections.MediaContainer?.Directory?.find(
      section => section.type === 'movie'
    );

    if (!movieSection) {
      throw new Error('No movie library found');
    }

    // Get all movies
    const movies = await fetchFromPlex(`/library/sections/${movieSection.key}/all`);
    const movieData = movies.MediaContainer?.Metadata || [];

    // Transform the data
    const transformedData = movieData.map(movie => ({
      id: movie.ratingKey,
      title: movie.title,
      year: movie.year,
      summary: movie.summary,
      thumb: movie.thumb,
      art: movie.art,
      duration: movie.duration,
      rating: movie.rating,
      contentRating: movie.contentRating,
      studio: movie.studio,
      genres: movie.Genre?.map(g => g.tag) || [],
      directors: movie.Director?.map(d => d.tag) || [],
      writers: movie.Writer?.map(w => w.tag) || [],
      actors: movie.Role?.map(r => r.tag) || [],
      addedAt: movie.addedAt,
      updatedAt: movie.updatedAt,
      lastViewedAt: movie.lastViewedAt,
      viewCount: movie.viewCount,
    }));

    // Save the data
    const dataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dataDir, 'movies.json'),
      JSON.stringify({
        lastUpdated: new Date().toISOString(),
        movies: transformedData
      }, null, 2)
    );

    console.log(`Successfully saved ${transformedData.length} movies to public/data/movies.json`);
  } catch (error) {
    console.error('Failed to fetch Plex data:', error);
    process.exit(1);
  }
}

main(); 