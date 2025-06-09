'use client';

import { useEffect, useState } from 'react';
import { Film, SortField, SortOrder } from '@/types/film';
import { plexService } from '@/services/plexService';
import FilmList from '@/components/films/FilmList';
import SortControls from '@/components/SortControls';
import Link from 'next/link';
import LoadingClapper from '@/components/LoadingClapper';

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedFilms = await plexService.getAllFilms();
        setFilms(fetchedFilms);
      } catch (err) {
        setError('Failed to fetch films. Please try again later.');
        console.error('Error fetching films:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const sortFilms = (filmsToSort: Film[]): Film[] => {
    return [...filmsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'releaseDate':
          comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          break;
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2510] flex items-center justify-center">
        <LoadingClapper />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  const sortedFilms = sortFilms(films);

  return (
    <main className="min-h-screen bg-[#2D2510]">
      <div className="sticky top-0 z-10 bg-[#1F1C17] shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#E5A00D]">
              {films.length} films in the #MichaelTugsJack server
            </h1>
            <Link href="/data" className="text-[#E5A00D] hover:text-white transition-colors">
              View Data
            </Link>
          </div>
          <SortControls
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-4 pt-6">
        <FilmList films={sortedFilms} />
      </div>
    </main>
  );
}
