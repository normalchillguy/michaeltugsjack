export interface Film {
  id: string;
  title: string;
  year: number;
  summary: string;
  thumb: string;
  duration: number;
  addedAt: number;
  contentRating?: string;
  rating?: number;
  genres: string[];
  directors: string[];
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