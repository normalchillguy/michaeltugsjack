import React from 'react';
import type { SortField, SortOrder } from '@/types/film';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export default function SortControls({ sortField, sortOrder, onSortChange }: SortControlsProps) {
  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'releaseDate', label: 'Release Date' },
    { value: 'duration', label: 'Duration' },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <div className="flex gap-2 shrink-0">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(
                option.value,
                option.value === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
              )}
              className={`
                inline-flex items-center px-2.5 py-1.5 text-sm font-medium
                transition-colors duration-200 whitespace-nowrap shrink-0
                ${option.value === sortField
                  ? 'bg-[#E5A00D] text-[#1F1C17]'
                  : 'bg-[#1F1C17] text-gray-300 hover:bg-[#E5A00D]/20'
                }
              `}
            >
              {option.label}
              {option.value === sortField && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 