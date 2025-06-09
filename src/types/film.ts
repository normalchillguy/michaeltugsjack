export interface Film {
  id: string;
  title: string;
  year: number;
  releaseDate: string;
  director: string;
  description?: string;
  posterUrl: string;
  duration: number; // in minutes
  dateAdded: string;
  contentRating?: string; // e.g., 'PG-13', 'R', etc.
  genres: string[];
  audioLanguages?: string[];
  subtitleLanguages?: string[];
}

export type SortField = 'releaseDate' | 'dateAdded' | 'title' | 'duration';
export type SortOrder = 'asc' | 'desc';

export interface FilmStats {
  totalFilms: number;
  averageRating: number;
  mostWatchedDirector: string;
  favoriteGenre: string;
}

export type ViewType = 'list' | 'stats'; 