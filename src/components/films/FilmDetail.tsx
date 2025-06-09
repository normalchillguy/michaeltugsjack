import { useState } from 'react';
import Image from 'next/image';
import type { Film } from '@/types/film';
import LoadingClapper from '@/components/LoadingClapper';

interface FilmDetailProps {
  film: Film;
  onClose: () => void;
}

export default function FilmDetail({ film, onClose }: FilmDetailProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{film.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingClapper />
                </div>
              )}
              <Image
                src={film.thumb}
                alt={`${film.title} poster`}
                width={300}
                height={450}
                className={`w-full h-full object-cover ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-300">{film.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-400">Year</h4>
                  <p>{film.year}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-400">Duration</h4>
                  <p>{formatDuration(Math.floor(film.duration / 60000))}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-400">Rating</h4>
                  <p>{film.rating ? film.rating.toFixed(1) : 'Not rated'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-400">Content Rating</h4>
                  <p>{film.contentRating || 'Not rated'}</p>
                </div>
              </div>

              {film.directors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-400">Director{film.directors.length > 1 ? 's' : ''}</h4>
                  <p>{film.directors.join(', ')}</p>
                </div>
              )}

              {film.genres.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-400">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {film.genres.map(genre => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-gray-800 rounded text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-400">Added to Library</h4>
                <p>{formatDate(film.addedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 