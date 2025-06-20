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
    <div className="flex flex-row gap-2 items-center text-sm">
      <select
        value={sortField}
        onChange={(e) => onSortFieldChange(e.target.value as SortField)}
        className="bg-[#2D2510] text-white border border-gray-700 rounded px-2 py-1 cursor-pointer hover:border-gray-600 focus:outline-none focus:border-[#E5A00D]"
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
  );
} 