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
const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

if (!PLEX_TOKEN) {
  console.error('❌ Error: PLEX_TOKEN environment variable is not set');
  console.error('Please create a .env.local or .env file with your Plex token:');
  console.error('PLEX_TOKEN=your_token_here');
  console.error('PLEX_SERVER_URL=http://localhost:32400');
  process.exit(1);
}

interface Movie {
  id: string;
  title: string;
  year: number;
  summary: string;
  thumb: string;
  art: string;
  duration: number;
  rating?: number;
  contentRating?: string;
  studio?: string;
  genres: string[];
  directors: string[];
  writers?: string[];
  actors?: string[];
  addedAt: number;
  updatedAt: number;
  lastViewedAt?: number;
  viewCount?: number;
}

interface PlexSection {
  key: string;
  type: string;
  title: string;
}

interface PlexSectionsResponse {
  MediaContainer: {
    Directory: PlexSection[];
  };
}

interface PlexResponse {
  MediaContainer: {
    Metadata: Array<{
      ratingKey: string;
      title: string;
      year: number;
      summary: string;
      thumb: string;
      art: string;
      duration: number;
      rating?: number;
      contentRating?: string;
      studio?: string;
      Genre?: Array<{ tag: string }>;
      Director?: Array<{ tag: string }>;
      Writer?: Array<{ tag: string }>;
      Role?: Array<{ tag: string }>;
      addedAt: number;
      updatedAt: number;
      lastViewedAt?: number;
      viewCount?: number;
    }>;
  };
}

async function downloadImage(posterUrl: string, outputPath: string, token: string): Promise<void> {
  let quality = 90; // Start with high quality
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Add width, height, and quality parameters to request a smaller image
      const separator = posterUrl.includes('?') ? '&' : '?';
      const url = `${posterUrl}${separator}X-Plex-Token=${token}&width=400&height=600&quality=${quality}`;
      
      console.log(`Downloading from: ${url.replace(token, '***')} (Quality: ${quality}%)`);
      
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'image/jpeg,image/*',
          'X-Plex-Token': token
        }
      });

      // Check if the downloaded file size exceeds our limit
      if (response.data.length > MAX_FILE_SIZE) {
        if (attempts < maxAttempts - 1) {
          // Reduce quality by 20% each attempt, but not below 40%
          quality = Math.max(40, quality - 20);
          attempts++;
          console.log(`File too large (${(response.data.length / 1024).toFixed(1)}KB), retrying with quality=${quality}%`);
          continue;
        }
      }

      // Ensure the directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await fs.promises.writeFile(outputPath, response.data);
      const finalSize = (response.data.length / 1024).toFixed(1);
      console.log(`✓ Downloaded: ${path.basename(outputPath)} (${finalSize}KB, Quality: ${quality}%)`);
      break;

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
}

async function fetchAllMovies(plexServerUrl: string, plexToken: string): Promise<Movie[]> {
  console.log('Fetching library sections from Plex server...');

  try {
    // 1. Fetch all library sections
    const sectionsResponse = await axios.get<PlexSectionsResponse>(`${plexServerUrl}/library/sections`, {
      headers: {
        'Accept': 'application/json',
        'X-Plex-Token': plexToken,
      },
    });

    // 2. Find only the "Films" section
    const movieSections = sectionsResponse.data.MediaContainer.Directory.filter(
      section => section.type === 'movie' && section.title === 'Films'
    );

    if (movieSections.length === 0) {
      throw new Error('No "Films" library section found on Plex server');
    }

    console.log(`Found Films section: ${movieSections[0].title} (ID: ${movieSections[0].key})`);

    // 3. Fetch movies from the Films section only
    const section = movieSections[0];
    console.log(`Fetching movies from Films section (ID: ${section.key})`);
    const moviesResponse = await axios.get<PlexResponse>(`${plexServerUrl}/library/sections/${section.key}/all`, {
      headers: {
        'Accept': 'application/json',
        'X-Plex-Token': plexToken,
      },
    });

    const rawCount = moviesResponse.data.MediaContainer.Metadata ? moviesResponse.data.MediaContainer.Metadata.length : 0;
    console.log(`  [API] Raw count from Films section: ${rawCount}`);

    if (moviesResponse.data.MediaContainer.Metadata) {
      const movies = moviesResponse.data.MediaContainer.Metadata.map(item => ({
            id: item.ratingKey,
            title: item.title,
            year: item.year,
            summary: item.summary,
            thumb: `${item.ratingKey}.jpg`,
            art: item.art,
            duration: item.duration,
            rating: item.rating,
            contentRating: item.contentRating,
            studio: item.studio,
            genres: item.Genre?.map(g => g.tag) || [],
            directors: item.Director?.map(d => d.tag) || [],
            writers: item.Writer?.map(w => w.tag),
            actors: item.Role?.map(r => r.tag),
            addedAt: item.addedAt,
            updatedAt: item.updatedAt,
            lastViewedAt: item.lastViewedAt,
            viewCount: item.viewCount
        }));
        
        console.log(`  ✓ Found ${movies.length} movies in Films section`);
        return movies;
    } else {
        console.log(`  ⚠ No movies found in Films section`);
        return [];
    }

  } catch (error) {
    console.error('Failed to fetch movies from Plex server:', error);
    if (axios.isAxiosError(error)) {
        console.error(`  Status: ${error.response?.status}`);
        console.error(`  Message: ${error.message}`);
    }
    throw error;
  }
}

async function main() {
  console.log('Starting poster download...');
  
  const plexServerUrl = process.env.PLEX_SERVER_URL;
  const plexToken = process.env.PLEX_TOKEN;
  
  if (!plexServerUrl || !plexToken) {
    console.error('Plex server URL or token is not configured in .env.local');
    process.exit(1);
  }

  console.log(`Using Plex server: ${plexServerUrl}`);

  // Fetch all movies from Plex
  const movies = await fetchAllMovies(plexServerUrl, plexToken);

  // Ensure the movies data directory exists
  const moviesDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(moviesDir)) {
    fs.mkdirSync(moviesDir, { recursive: true });
  }

  // Write movies data to a JSON file
  const moviesFilePath = path.join(moviesDir, 'movies.json');
  fs.writeFileSync(moviesFilePath, JSON.stringify({
    lastUpdated: new Date().toISOString(),
    movies: movies
  }, null, 2));
  console.log(`✓ Saved ${movies.length} movies to ${moviesFilePath}`);

  // Create the posters directory in src/assets
  const postersDir = path.join(__dirname, '../src/assets/posters');
  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }

  // Download all posters
  const downloadPromises = movies.map(async (movie) => {
    const posterUrl = `${plexServerUrl}/library/metadata/${movie.id}/thumb/${movie.updatedAt}`;
    const outputPath = path.join(postersDir, `${movie.id}.jpg`);
    
    try {
      await downloadImage(posterUrl, outputPath, plexToken);
    } catch (error) {
      console.error(`✗ Failed to download poster for ${movie.title} (ID: ${movie.id})`);
      console.error(`  Status: ${(error as any)?.response?.status}`);
      console.error(`  Message: ${(error as Error).message}`);
      throw error;
    }
  });

  try {
    await Promise.all(downloadPromises);
    
    // Generate the posters/index.ts file
    const importStatements: string[] = [];
    const exportStatements: string[] = [];

    movies.forEach((movie) => {
      const importName = `poster${movie.id}`;
      importStatements.push(`import ${importName} from './${movie.id}.jpg';`);
      exportStatements.push(`  '${movie.id}': ${importName},`);
    });

    const indexContent = `${importStatements.join('\n')}\n\nexport const posters: { [key: string]: any } = {\n${exportStatements.join('\n')}\n};\n`;
    fs.writeFileSync(path.join(postersDir, 'index.ts'), indexContent);
    
    console.log('✓ All posters downloaded successfully');
    console.log('✓ Generated posters/index.ts file');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 