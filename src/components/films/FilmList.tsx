import React, { useState } from 'react';
import Image from 'next/image';
import type { Film } from '@/types/film';
import FilmDetail from './FilmDetail';
import LoadingClapper from '@/components/LoadingClapper';

interface FilmListProps {
  films: Film[];
}

export default function FilmList({ films }: FilmListProps) {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Function to format the date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Function to format duration in minutes
  const formatDuration = (minutes: number) => {
    return `${minutes} mins`;
  };

  const handleImageLoad = (filmId: string) => {
    setLoadedImages(prev => new Set(prev).add(filmId));
  };

  return (
    <>
      <div className="space-y-4">
        {films.map((film) => (
          <div
            key={film.id}
            className="flex bg-[#1F1C17] overflow-hidden border border-white/10 hover:border-[#E5A00D]/50 transition-colors duration-200 cursor-pointer"
            onClick={() => setSelectedFilm(film)}
          >
            <div className="w-24 sm:w-32 flex-shrink-0 relative bg-[#1F1C17]">
              {!loadedImages.has(film.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingClapper className="scale-50" />
                </div>
              )}
              <Image
                src={film.posterUrl}
                alt={`${film.title} poster`}
                width={128}
                height={192}
                className={`object-cover w-full h-full transition-opacity duration-200 ${loadedImages.has(film.id) ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 640px) 96px, 128px"
                priority={false}
                loading="lazy"
                onLoad={() => handleImageLoad(film.id)}
              />
            </div>
            
            <div className="flex-grow p-4">
              <div>
                <h3 className="text-lg font-semibold text-white hover:text-[#E5A00D] transition-colors duration-200">
                  {film.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {formatDate(film.releaseDate)} • {formatDuration(film.duration)} • {film.director}
                </p>
              </div>
              {film.description && (
                <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                  {film.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedFilm && (
        <FilmDetail
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}
    </>
  );
} 