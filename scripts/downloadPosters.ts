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
  
  const plexServerUrl = process.env.PLEX_SERVER_URL;
  const plexToken = process.env.PLEX_TOKEN;
  
  if (!plexServerUrl || !plexToken) {
    throw new Error('Missing PLEX_SERVER_URL or PLEX_TOKEN environment variables');
  }

  console.log(`Using Plex server: ${plexServerUrl}`);

  // Read the existing movies.json file
  const moviesJsonPath = path.join(process.cwd(), 'src', 'data', 'movies.json');
  const moviesData = JSON.parse(fs.readFileSync(moviesJsonPath, 'utf8'));

  // Update the paths in the movies data to include the base path
  moviesData.movies = moviesData.movies.map((movie: any) => ({
    ...movie,
    thumb: `/michaeltugsjack/posters/${movie.id}.jpg`
  }));

  // Download the first 3 posters
  const downloadPromises = moviesData.movies.slice(0, 3).map(async (movie: any) => {
    const posterUrl = `${plexServerUrl}/library/metadata/${movie.id}/thumb/${movie.updatedAt}?X-Plex-Token=${plexToken}`;
    const outputPath = path.join(process.cwd(), 'public', 'posters', `${movie.id}.jpg`);
    
    console.log(`Downloading from: ${posterUrl.replace(plexToken, '***')}`);
    
    try {
      await downloadImage(posterUrl, outputPath);
    } catch (error) {
      console.error(`✗ Failed to download: ${path.basename(outputPath)}`);
      console.error(`  Status: ${(error as any)?.response?.status}`);
      console.error(`  Message: ${(error as Error).message}`);
      throw error;
    }
  });

  try {
    await Promise.all(downloadPromises);
    
    // Write the updated movies.json file
    fs.writeFileSync(moviesJsonPath, JSON.stringify(moviesData, null, 2));
    
    console.log('✓ All posters downloaded successfully');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 