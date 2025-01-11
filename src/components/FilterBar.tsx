// components/FilterBar.tsx
import React from 'react';

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  return (
    <div className="flex gap-4">
      <select onChange={(e) => onFilterChange('category', e.target.value)}>
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
      </select>
      <select onChange={(e) => onFilterChange('source', e.target.value)}>
        <option value="">All Sources</option>
        <option value="bbc-news">BBC</option>
        <option value="cnn-news">CNN</option>
      </select>
      <input
        type="date"
        onChange={(e) => onFilterChange('date', e.target.value)}
        className="border p-2"
      />
    </div>
  );
};

export default FilterBar;
