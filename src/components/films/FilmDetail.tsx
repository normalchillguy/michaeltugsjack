import React, { useState } from 'react';
import Image from 'next/image';
import { Film } from '@/types/film';
import LoadingClapper from '@/components/LoadingClapper';

interface FilmDetailProps {
  film: Film;
  onClose: () => void;
}

export default function FilmDetail({ film, onClose }: FilmDetailProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Format date to match the list view format
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}min`;
  };

  // Close on backdrop click, but not when clicking the content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1F1C17] max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        <div className="hidden md:block md:w-[300px] flex-shrink-0 h-full bg-[#1F1C17] relative">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingClapper className="scale-75" />
            </div>
          )}
          <Image
            src={film.posterUrl}
            alt={`${film.title} poster`}
            width={300}
            height={450}
            className={`object-cover w-full h-full transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority={true}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        <div className="flex-grow p-6 overflow-y-auto relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#E5A00D]">{film.title}</h2>
              <p className="text-sm text-gray-400 mt-1">Directed by {film.director}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="text-[#E5A00D]">Released:</span> {formatDate(film.releaseDate)}
                </p>
                <p className="text-gray-400">
                  <span className="text-[#E5A00D]">Added:</span> {formatDate(film.dateAdded)}
                </p>
                <p className="text-gray-400">
                  {formatDuration(film.duration)}
                </p>
                {film.contentRating && (
                  <p className="text-gray-400">{film.contentRating}</p>
                )}
                {film.genres && film.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {film.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#E5A00D]/10 border border-[#E5A00D]/30 text-[#E5A00D]"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {film.description && (
                <div>
                  <p className="text-gray-300">{film.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 