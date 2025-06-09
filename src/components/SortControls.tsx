import React from 'react';

type SortField = 'title' | 'year' | 'addedAt';
type SortOrder = 'asc' | 'desc';

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
    <div className="flex gap-4 items-center">
      <label className="text-sm font-medium">
        Sort by:
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="ml-2 p-2 rounded bg-gray-700 text-white"
        >
          <option value="title">Title</option>
          <option value="year">Year</option>
          <option value="addedAt">Date Added</option>
        </select>
      </label>

      <label className="text-sm font-medium">
        Order:
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          className="ml-2 p-2 rounded bg-gray-700 text-white"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
} 