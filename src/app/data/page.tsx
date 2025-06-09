'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from 'chart.js';
import plexService from '@/services/plexService';
import type { Film } from '@/types/film';
import Link from 'next/link';
import LoadingClapper from '@/components/LoadingClapper';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip
);

export default function DataPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const allFilms = await plexService.getAllFilms();
        setFilms(allFilms);
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

  if (loading) {
    return <LoadingClapper />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Calculate statistics
  const totalFilms = films.length;
  const averageRating = films.reduce((sum, film) => sum + (film.rating || 0), 0) / totalFilms;

  // Calculate director statistics
  const directorCounts = films.reduce((acc, film) => {
    film.directors.forEach(director => {
      acc[director] = (acc[director] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topDirectors = Object.entries(directorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Calculate genre statistics
  const genreCounts = films.reduce((acc, film) => {
    film.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Chart data
  const genreChartData = {
    labels: topGenres.map(([genre]) => genre),
    datasets: [
      {
        label: 'Number of Films',
        data: topGenres.map(([, count]) => count),
        backgroundColor: '#E5A00D',
      },
    ],
  };

  const directorChartData = {
    labels: topDirectors.map(([director]) => director),
    datasets: [
      {
        label: 'Number of Films',
        data: topDirectors.map(([, count]) => count),
        backgroundColor: '#E5A00D',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: '#FFFFFF',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: '#333333',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: '#333333',
        },
      },
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Library Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="space-y-2">
            <p>Total Films: {totalFilms}</p>
            <p>Average Rating: {averageRating.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Top Genres</h2>
          <Bar data={genreChartData} options={chartOptions} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Top Directors</h2>
          <Bar data={directorChartData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
} 