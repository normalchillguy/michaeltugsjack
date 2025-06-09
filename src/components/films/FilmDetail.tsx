import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { Film } from '@/types/film';
import LoadingClapper from '@/components/LoadingClapper';
import { posters } from '@/assets/posters';

interface FilmDetailProps {
  film: Film;
  onClose: () => void;
  isImagePreloaded?: boolean;
  isTransitioning?: boolean;
}

export default function FilmDetail({ 
  film, 
  onClose, 
  isImagePreloaded = false,
  isTransitioning = false 
}: FilmDetailProps) {
  const [imageLoading, setImageLoading] = useState(!isImagePreloaded);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // If the image was already loaded in the list view, we can skip the loading state
    if (isImagePreloaded) {
      setImageLoading(false);
    }
  }, [isImagePreloaded]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transition-transform duration-300 will-change-transform ${
          isTransitioning ? 'scale-95' : 'scale-100'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">{film.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="hidden md:block relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden">
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 will-change-[opacity,transform] ${
                  imageLoading && !imageError ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <LoadingClapper />
              </div>
              <Image
                src={posters[film.id]}
                alt={`${film.title} poster`}
                className={`object-cover transition-opacity duration-300 will-change-[opacity,transform] ${
                  !imageLoading ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                fill
                sizes="(max-width: 768px) 0px, 400px"
                priority
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300">Details</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-400">
                    <span className="font-medium text-gray-300">Released:</span>{' '}
                    {film.year}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium text-gray-300">Duration:</span>{' '}
                    {formatDuration(Math.floor(film.duration / 60000))}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium text-gray-300">Added:</span>{' '}
                    {formatDate(film.addedAt)}
                  </p>
                  {film.contentRating && (
                    <p className="text-gray-400">
                      <span className="font-medium text-gray-300">Rating:</span>{' '}
                      {film.contentRating}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-300">Synopsis</h3>
                <p className="mt-2 text-gray-400">{film.summary}</p>
              </div>

              {film.directors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">
                    {film.directors.length === 1 ? 'Director' : 'Directors'}
                  </h3>
                  <p className="mt-2 text-[#4A9EFF]">
                    {film.directors.join(', ')}
                  </p>
                </div>
              )}

              {film.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Genres</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {film.genres.map(genre => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 