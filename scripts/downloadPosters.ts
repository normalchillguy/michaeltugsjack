import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env.local or .env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ Error: Neither .env.local nor .env file found');
  process.exit(1);
}

const PLEX_SERVER_URL = process.env.PLEX_SERVER_URL || 'http://localhost:32400';
const PLEX_TOKEN = process.env.PLEX_TOKEN;

if (!PLEX_TOKEN) {
  console.error('❌ Error: PLEX_TOKEN environment variable is not set');
  console.error('Please create a .env.local or .env file with your Plex token:');
  console.error('PLEX_TOKEN=your_token_here');
  console.error('PLEX_SERVER_URL=http://localhost:32400');
  process.exit(1);
}

interface Movie {
  id: string;
  thumb: string;
  title: string;
  // ... other movie properties
}

async function downloadImage(imageUrl: string, outputPath: string): Promise<void> {
  try {
    // Keep the original Plex URL structure
    const url = `${PLEX_SERVER_URL}${imageUrl}${imageUrl.includes('?') ? '&' : '?'}X-Plex-Token=${PLEX_TOKEN}`;
    
    console.log(`Downloading from: ${url}`);
    
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'image/jpeg,image/*',
        'X-Plex-Token': PLEX_TOKEN
      }
    });

    await fs.promises.writeFile(outputPath, response.data);
    console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed to download: ${path.basename(outputPath)}`);
    if (axios.isAxiosError(error)) {
      console.error(`  Status: ${error.response?.status}`);
      console.error(`  Message: ${error.message}`);
      if (error.response?.headers) {
        console.error('  Headers:', error.response.headers);
      }
    } else {
      console.error(error);
    }
    throw error;
  }
}

async function main() {
  console.log('Starting poster download...');
  console.log(`Using Plex server: ${PLEX_SERVER_URL}`);

  // Create posters directory if it doesn't exist
  const postersDir = path.join(process.cwd(), 'public', 'posters');
  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }

  // Read original movies data from public/data/movies.json
  const originalMoviesPath = path.join(process.cwd(), 'public', 'data', 'movies.json');
  const targetMoviesPath = path.join(process.cwd(), 'src', 'data', 'movies.json');
  
  if (!fs.existsSync(originalMoviesPath)) {
    console.error('❌ Error: Original movies data file not found:', originalMoviesPath);
    process.exit(1);
  }

  const moviesData = JSON.parse(fs.readFileSync(originalMoviesPath, 'utf-8'));

  // Take only the first three movies
  const selectedMovies = moviesData.movies.slice(0, 3);

  // Process each movie
  const updatedMovies = await Promise.all(
    selectedMovies.map(async (movie: Movie) => {
      const posterFileName = `${movie.id}.jpg`;
      const posterPath = path.join(postersDir, posterFileName);
      
      // Download the poster
      await downloadImage(movie.thumb, posterPath);

      // Update the movie data with the new local path
      return {
        ...movie,
        thumb: `/posters/${posterFileName}` // Update to use local path
      };
    })
  );

  // Update movies.json with new paths
  const updatedMoviesData = {
    ...moviesData,
    movies: updatedMovies
  };

  fs.writeFileSync(targetMoviesPath, JSON.stringify(updatedMoviesData, null, 2));
  console.log('✓ Updated movies.json with local poster paths');
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 