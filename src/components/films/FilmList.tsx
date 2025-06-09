import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Film } from '@/types/film';
import FilmDetail from './FilmDetail';
import LoadingClapper from '@/components/LoadingClapper';
import { posters } from '@/assets/posters';

interface FilmListProps {
  films: Film[];
}

export default function FilmList({ films }: FilmListProps) {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Preload the first 10 images
    films.slice(0, 10).forEach((film) => {
      const imgElement = new window.Image();
      imgElement.src = posters[film.id].src;
      imgElement.onload = () => handleImageLoad(film.id);
    });
  }, [films]);

  const handleImageLoad = useCallback((filmId: string) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(filmId);
      return next;
    });
  }, []);

  const handleImageError = useCallback((filmId: string) => {
    console.error(`Failed to load image for film ${filmId}`);
  }, []);

  const handleFilmClick = useCallback((film: Film) => {
    setIsTransitioning(true);
    setSelectedFilm(film);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset the transition state after animation completes
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsTransitioning(true);
    setSelectedFilm(null);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset the transition state after animation completes
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  const formatDuration = (minutes: number) => {
    return `${minutes} mins`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      {films.map((film, index) => (
        <div
          key={film.id}
          className={`group bg-[#1a1a1a]/90 hover:bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
          onClick={() => handleFilmClick(film)}
        >
          <div className="flex gap-4 p-3">
            <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden bg-gray-900">
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 will-change-[opacity,transform] ${
                  loadedImages.has(film.id) ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <LoadingClapper className="scale-50" />
              </div>
              <Image
                src={posters[film.id]}
                alt={`${film.title} poster`}
                className={`object-cover transition-opacity duration-300 will-change-[opacity,transform] ${
                  loadedImages.has(film.id) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(film.id)}
                onError={() => handleImageError(film.id)}
                priority={index < 10}
                fill
                sizes="96px"
              />
            </div>
            <div className="flex-grow min-w-0 py-1">
              <h2 className="text-xl font-semibold text-white/90 group-hover:text-white">
                {film.title}
              </h2>
              <div className="flex flex-wrap gap-x-2 mt-1 text-sm text-gray-400">
                <span>{film.year}</span>
                <span>•</span>
                <span>{formatDuration(Math.floor(film.duration / 60000))}</span>
                <span>•</span>
                <span>{film.directors.join(', ')}</span>
              </div>
              <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                {film.summary}
              </p>
            </div>
          </div>
        </div>
      ))}

      {selectedFilm && (
        <FilmDetail 
          film={selectedFilm} 
          onClose={handleCloseDetail} 
          isImagePreloaded={loadedImages.has(selectedFilm.id)}
          isTransitioning={isTransitioning}
        />
      )}
    </div>
  );
} 