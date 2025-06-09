import type { Film } from '@/types/film';

class PlexService {
  private movies: Film[] = [];

  private transformPlexToFilm(plexMovie: any): Film {
    return {
      id: plexMovie.id,
      title: plexMovie.title,
      year: plexMovie.year,
      summary: plexMovie.summary,
      thumb: plexMovie.thumb,
      duration: plexMovie.duration,
      addedAt: plexMovie.addedAt,
      contentRating: plexMovie.contentRating,
      rating: plexMovie.rating,
      genres: plexMovie.genres || [],
      directors: plexMovie.directors || [],
    };
  }

  public async initialize(): Promise<void> {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '';
      const response = await fetch(`${basePath}/data/movies.json`);
      const data = await response.json();
      
      if (!data.movies) {
        throw new Error('Invalid data format: missing movies array');
      }

      this.movies = data.movies.map(this.transformPlexToFilm);
      console.log(`Loaded ${this.movies.length} movies from static data`);
    } catch (error) {
      console.error('Failed to initialize Plex service:', error);
      throw error;
    }
  }

  public async getAllFilms(): Promise<Film[]> {
    if (this.movies.length === 0) {
      await this.initialize();
    }
    return this.movies;
  }

  public async searchFilms(query: string): Promise<Film[]> {
    if (this.movies.length === 0) {
      await this.initialize();
    }

    if (!query) {
      return this.movies;
    }

    const normalizedQuery = query.toLowerCase();
    return this.movies.filter(movie =>
      movie.title.toLowerCase().includes(normalizedQuery) ||
      movie.summary.toLowerCase().includes(normalizedQuery) ||
      movie.genres.some(genre => genre.toLowerCase().includes(normalizedQuery)) ||
      movie.directors.some(director => director.toLowerCase().includes(normalizedQuery))
    );
  }
}

const plexService = new PlexService();
export default plexService; 