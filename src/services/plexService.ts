import type { Film } from '@/types/film';

class PlexService {
  private movies: Film[] | null = null;

  private transformPlexToFilm(movie: any): Film {
    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      summary: movie.summary,
      thumb: movie.thumb,
      art: movie.art,
      duration: movie.duration,
      rating: movie.rating,
      contentRating: movie.contentRating,
      studio: movie.studio,
      genres: movie.genres,
      directors: movie.directors,
      writers: movie.writers,
      actors: movie.actors,
      addedAt: movie.addedAt,
      updatedAt: movie.updatedAt,
      lastViewedAt: movie.lastViewedAt,
      viewCount: movie.viewCount,
    };
  }

  async initialize(): Promise<void> {
    try {
      const response = await fetch('/michaeltugsjack/data/movies.json');
      if (!response.ok) {
        throw new Error('Failed to fetch movie data');
      }
      const data = await response.json();
      this.movies = data.movies.map(this.transformPlexToFilm);
      console.log(`Loaded ${this.movies.length} movies from static data`);
    } catch (error) {
      console.error('Failed to initialize Plex service:', error);
      throw error;
    }
  }

  async getAllFilms(): Promise<Film[]> {
    if (!this.movies) {
      await this.initialize();
    }
    return this.movies || [];
  }

  async searchFilms(query: string): Promise<Film[]> {
    if (!this.movies) {
      await this.initialize();
    }
    
    const normalizedQuery = query.toLowerCase();
    return (this.movies || []).filter(movie => 
      movie.title.toLowerCase().includes(normalizedQuery) ||
      movie.summary?.toLowerCase().includes(normalizedQuery) ||
      movie.genres.some(genre => genre.toLowerCase().includes(normalizedQuery)) ||
      movie.directors.some(director => director.toLowerCase().includes(normalizedQuery)) ||
      movie.actors.some(actor => actor.toLowerCase().includes(normalizedQuery))
    );
  }
}

export default new PlexService(); 