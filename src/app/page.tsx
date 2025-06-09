'use client';

import { useEffect, useState } from 'react';
import type { Film } from '@/types/film';
import FilmList from '@/components/films/FilmList';
import SortControls, { SortField, SortOrder } from '@/components/SortControls';
import Link from 'next/link';
import LoadingClapper from '@/components/LoadingClapper';

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    const loadFilms = async () => {
      try {
        // Use the correct path based on environment
        const basePath = process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '';
        const response = await fetch(`${basePath}/data/movies.json`);
        const data = await response.json();
        setFilms(data.movies);
        setError(null);
      } catch (err) {
        setError('Failed to fetch films. Please try again later.');
        console.error('Error fetching films:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  const sortedFilms = [...films].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = (a.year || 0) - (b.year || 0);
        break;
      case 'addedAt':
        comparison = (a.addedAt || 0) - (b.addedAt || 0);
        break;
      case 'duration':
        comparison = (a.duration || 0) - (b.duration || 0);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2510] flex items-center justify-center">
        <LoadingClapper />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2D2510] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#2D2510]">
      <div className="sticky top-0 z-10 bg-[#1F1C17] shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#E5A00D]">
              {films.length} films in the #MichaelTugsJack server
            </h1>
            <Link 
              href="/data" 
              className="text-[#E5A00D] hover:text-white transition-colors"
            >
              View Data
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <SortControls
              sortField={sortField}
              sortOrder={sortOrder}
              onSortFieldChange={setSortField}
              onSortOrderChange={setSortOrder}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <FilmList films={sortedFilms} />
      </div>
    </main>
  );
}
