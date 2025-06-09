import { useState } from 'react';
import Image from 'next/image';
import type { Film } from '@/types/film';
import FilmDetail from './FilmDetail';
import LoadingClapper from '@/components/LoadingClapper';

interface FilmListProps {
  films: Film[];
}

export default function FilmList({ films }: FilmListProps) {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleImageLoad = (filmId: string) => {
    setLoadingStates(prev => ({ ...prev, [filmId]: false }));
  };

  const handleImageError = (filmId: string) => {
    console.error(`Failed to load image for film ${filmId}`);
    setLoadingStates(prev => ({ ...prev, [filmId]: false }));
  };

  // Function to get the correct image path based on environment
  const getImagePath = (path: string) => {
    const basePath = process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '';
    return `${basePath}${path}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {films.map(film => (
          <div
            key={film.id}
            className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => setSelectedFilm(film)}
          >
            {loadingStates[film.id] !== false && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingClapper />
              </div>
            )}
            <Image
              src={getImagePath(film.thumb)}
              alt={`${film.title} poster`}
              width={300}
              height={450}
              className={`w-full h-full object-cover ${
                loadingStates[film.id] !== false ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => handleImageLoad(film.id)}
              onError={() => handleImageError(film.id)}
              priority={true}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-sm font-medium truncate">{film.title}</h3>
              <p className="text-xs text-gray-300">{film.year}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedFilm && (
        <FilmDetail film={selectedFilm} onClose={() => setSelectedFilm(null)} />
      )}
    </>
  );
} 