import React from 'react';

export type SortField = 'title' | 'year' | 'addedAt' | 'duration';
export type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

export default function SortControls({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-wrap gap-y-2 gap-x-4 items-center text-sm">
      <label className="text-gray-400 whitespace-nowrap">Sort by:</label>
      <div className="flex gap-2 flex-1 sm:flex-none">
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="flex-1 sm:flex-none bg-[#2D2510] text-white border border-gray-700 rounded px-2 py-1 cursor-pointer hover:border-gray-600 focus:outline-none focus:border-[#E5A00D]"
        >
          <option value="title">Title</option>
          <option value="year">Release Date</option>
          <option value="addedAt">Date Added</option>
          <option value="duration">Duration</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          className="bg-[#2D2510] text-white border border-gray-700 rounded px-2 py-1 cursor-pointer hover:border-gray-600 focus:outline-none focus:border-[#E5A00D]"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
} 