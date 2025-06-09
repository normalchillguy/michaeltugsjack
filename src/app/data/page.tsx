'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { plexService } from '@/services/plexService';
import type { Film } from '@/types/film';
import Link from 'next/link';
import LoadingClapper from '@/components/LoadingClapper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

export default function DataPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Create a map to count films by year
  const filmsByYear = films.reduce((acc: { [key: string]: number }, film: Film) => {
    const year = new Date(film.releaseDate).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Get all years and sort them
  const years = Object.keys(filmsByYear).sort((a, b) => Number(a) - Number(b));

  const chartData = {
    labels: years,
    datasets: [
      {
        data: years.map(year => filmsByYear[year]),
        backgroundColor: '#E5A00D',
        borderColor: '#E5A00D',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '#MichaelTugsJack films by release year',
        color: '#E5A00D',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#1F1C17',
        titleColor: '#E5A00D',
        bodyColor: '#fff',
        borderColor: '#E5A00D',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: any) => `Year: ${tooltipItems[0].label}`,
          label: (context: any) => `Films: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#ffffff10',
        },
        ticks: {
          color: '#ffffff80',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          },
          autoSkip: true,
          maxTicksLimit: 15,
        },
        title: {
          display: true,
          text: 'Release Year',
          color: '#ffffff80',
          font: {
            size: 12
          },
          padding: { top: 10 }
        },
      },
      y: {
        grid: {
          color: '#ffffff10',
        },
        ticks: {
          color: '#ffffff80',
          font: {
            size: 11
          },
        },
        title: {
          display: true,
          text: 'Number of Films',
          color: '#ffffff80',
          font: {
            size: 12
          },
          padding: { bottom: 10 }
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2510]">
        <header className="sticky top-0 bg-[#1F1C17] border-b border-[#E5A00D] z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link 
              href="/"
              className="text-white hover:text-[#E5A00D] transition-colors"
            >
              ← Back to Films
            </Link>
            <h1 className="text-2xl font-bold text-[#E5A00D]">
              #MichaelTugsJack data
            </h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[calc(100vh-73px)]">
          <LoadingClapper />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2D2510]">
        <header className="sticky top-0 bg-[#1F1C17] border-b border-[#E5A00D] z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link 
              href="/"
              className="text-white hover:text-[#E5A00D] transition-colors"
            >
              ← Back to Films
            </Link>
            <h1 className="text-2xl font-bold text-[#E5A00D]">
              #MichaelTugsJack data
            </h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#2D2510]">
      <header className="sticky top-0 bg-[#1F1C17] border-b border-[#E5A00D] z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="text-white hover:text-[#E5A00D] transition-colors"
          >
            ← Back to Films
          </Link>
          <h1 className="text-2xl font-bold text-[#E5A00D]">
            #MichaelTugsJack data
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-[#1F1C17] p-4 sm:p-6">
          <div className="h-[400px] sm:h-[600px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </main>
  );
} 