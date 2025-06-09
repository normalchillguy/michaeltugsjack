export interface Film {
  id: string;
  title: string;
  year: number;
  summary: string;
  thumb: string;
  art: string;
  duration: number;
  rating: number;
  contentRating: string;
  studio: string;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  addedAt: number;
  updatedAt: number;
  lastViewedAt?: number;
  viewCount: number;
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