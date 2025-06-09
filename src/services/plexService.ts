import type { Film, FilmStats } from '@/types/film';

class PlexService {
  private baseUrl: string;
  private librarySection?: string;
  private initialized: boolean = false;

  constructor() {
    this.baseUrl = '/api/plex';
  }

  private async fetchFromPlex(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}?endpoint=${encodeURIComponent(endpoint)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Plex API error:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        errorData
      });
      throw new Error(errorData.error || `Plex API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // First try to connect to the root endpoint to verify connectivity
      const rootResponse = await this.fetchFromPlex('/');
      console.log('Successfully connected to Plex server');

      // Then get library sections
      const sectionsResponse = await this.fetchFromPlex('/library/sections');
      console.log('Retrieved library sections:', sectionsResponse);

      const sections = sectionsResponse.MediaContainer?.Directory;
      if (!sections) {
        throw new Error('No library sections found in response');
      }

      const movieSection = sections.find((section: any) => section.type === 'movie');
      if (movieSection) {
        this.librarySection = movieSection.key;
        console.log('Found movie library section:', this.librarySection);
        this.initialized = true;
      } else {
        throw new Error('No movie library found');
      }
    } catch (error) {
      console.error('Failed to initialize Plex service:', error);
      throw error;
    }
  }

  private transformPlexToFilm(plexData: any): Film {
    // Get the server URL from the poster path or thumb path
    const posterPath = plexData.poster || plexData.thumb;
    
    // Construct the direct Plex URL for the image
    const imageUrl = posterPath
      ? `http://10.0.0.111:32400${posterPath}?X-Plex-Token=FhDk5Qq-uyHbazmy9Uzj&width=300&height=450&minSize=1&upscale=1`
      : '/placeholder-poster.jpg';

    // Extract audio and subtitle languages
    const audioLanguages = plexData.Media?.[0]?.AudioChannels?.map((stream: any) => stream.language) || [];
    const subtitleLanguages = plexData.Media?.[0]?.SubtitleChannels?.map((stream: any) => stream.language) || [];

    return {
      id: plexData.ratingKey || plexData.key,
      title: plexData.title,
      year: plexData.year || 0,
      releaseDate: plexData.originallyAvailableAt || '',
      director: plexData.Director?.[0]?.tag || '',
      description: plexData.summary || '',
      posterUrl: imageUrl,
      genres: (plexData.Genre || []).map((g: any) => g.tag) || [],
      duration: Math.round((plexData.duration || 0) / 60000), // Convert from milliseconds to minutes
      dateAdded: new Date(plexData.addedAt * 1000).toISOString(),
      contentRating: plexData.contentRating || '',
      audioLanguages,
      subtitleLanguages
    };
  }

  async getAllFilms(): Promise<Film[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      const response = await this.fetchFromPlex(`/library/sections/${this.librarySection}/all`);
      return (response.MediaContainer?.Metadata || []).map((item: any) => this.transformPlexToFilm(item));
    } catch (error) {
      console.error('Failed to fetch films:', error);
      throw error;
    }
  }

  async getFilmStats(): Promise<FilmStats> {
    const films = await this.getAllFilms();
    
    const totalFilms = films.length;
    const averageRating = 0; // Since we don't track ratings anymore

    const directorCounts = films.reduce((acc, film) => {
      if (film.director) {
        acc[film.director] = (acc[film.director] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostWatchedDirector = Object.entries(directorCounts)
      .sort(([, a], [, b]) => b - a)
      .find(([director]) => director)?.[0] || 'Unknown';

    const genreCounts = films.reduce((acc, film) => {
      if (film.genres) {
        film.genres.forEach(genre => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const favoriteGenre = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .find(([genre]) => genre)?.[0] || 'Unknown';

    return {
      totalFilms,
      averageRating,
      mostWatchedDirector,
      favoriteGenre,
    };
  }

  async searchFilms(query: string): Promise<Film[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const response = await this.fetchFromPlex(
        `/library/sections/${this.librarySection}/search?query=${encodeURIComponent(query)}`
      );
      return (response.MediaContainer?.Metadata || []).map((item: any) => this.transformPlexToFilm(item));
    } catch (error) {
      console.error('Failed to search films:', error);
      throw error;
    }
  }

  async getFilmsByGenre(genre: string): Promise<Film[]> {
    const films = await this.getAllFilms();
    return films.filter(film => film.genres.includes(genre));
  }

  async getFilmsByDirector(director: string): Promise<Film[]> {
    const films = await this.getAllFilms();
    return films.filter(film => film.director.toLowerCase().includes(director.toLowerCase()));
  }

  async getFilmsByYear(year: number): Promise<Film[]> {
    const films = await this.getAllFilms();
    return films.filter(film => film.year === year);
  }
}

export const plexService = new PlexService(); 