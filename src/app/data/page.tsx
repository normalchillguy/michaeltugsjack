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
import { useMediaQuery } from '@/utils/useMediaQuery';

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
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const basePath = process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '';
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

  // Calculate year range and counts
  const years = films.map(film => film.year || 0).filter(year => year > 0);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  // Create an array of all years between min and max
  const yearRange = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  // Count films per year
  const yearCounts = yearRange.map(year => ({
    year,
    count: films.filter(film => film.year === year).length,
    films: films.filter(film => film.year === year)
  }));

  const chartData = {
    labels: yearRange,
    datasets: [
      {
        label: 'Films',
        data: yearCounts.map(y => y.count),
        backgroundColor: '#E5A00D',
        borderColor: '#E5A00D',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: isMobile ? ('y' as const) : ('x' as const),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: '#1F1C17',
        titleColor: '#E5A00D',
        bodyColor: '#FFFFFF',
        padding: 16,
        callbacks: {
          title: (tooltipItems: any[]) => {
            const year = tooltipItems[0].label;
            const count = tooltipItems[0].raw;
            return `${count} film${count !== 1 ? 's' : ''} from ${year}`;
          },
          label: (context: any) => {
            const year = parseInt(context.label);
            const yearData = yearCounts.find(y => y.year === year);
            if (!yearData) return '';
            
            return yearData.films.map(film => film.title);
          },
          labelColor: (context: any) => {
            return {
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            }
          }
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isMobile ? 'Number of Films' : 'Release Year',
          color: '#FFFFFF',
        },
        ticks: {
          color: '#FFFFFF',
          stepSize: isMobile ? 1 : undefined,
        },
        grid: {
          color: '#333333',
        },
      },
      y: {
        title: {
          display: true,
          text: isMobile ? 'Release Year' : 'Number of Films',
          color: '#FFFFFF',
        },
        ticks: {
          color: '#FFFFFF',
          stepSize: isMobile ? undefined : 1,
        },
        grid: {
          color: '#333333',
        },
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#2D2510]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-[#E5A00D] text-center sm:text-left">Films by Release Year</h1>
          <Link 
            href="/" 
            className="text-[#E5A00D] hover:text-white transition-colors px-4 py-1 border border-[#E5A00D] rounded hover:bg-[#E5A00D]/10"
          >
            Back to Films
          </Link>
        </div>
        
        <div className="bg-[#1F1C17] p-6 rounded-lg shadow-lg" style={{ height: isMobile ? '80vh' : '70vh' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
} 