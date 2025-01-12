import React from 'react';
import { FilterBarProps } from '../types/Filterbar';

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange,personalized,onSearch,setIsPersonalized,filters,setShowPersonalizeSection }) => {
    const savedPreferences = JSON.parse(localStorage.getItem("preferences") || "{}");
    const handleSave=()=>{
        setIsPersonalized(true);
        setShowPersonalizeSection(false);
        localStorage.setItem("preferences", JSON.stringify(filters));
        onSearch('');
    }
  return (
    <div className="flex gap-4 flex-wrap">
      <select value={filters.category ?? savedPreferences?.category} className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300" onChange={(e) => onFilterChange('category', e.target.value)}>
        <option value="">All Categories</option>
        <option value="general">General</option>
        <option value="sports">Sports</option>
        <option value="technology">Technology</option>
        <option value="health">Health</option>
      </select>
      <select value={filters.source ?? savedPreferences?.source} className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300" onChange={(e) => onFilterChange('source', e.target.value)}>
        <option value="">All Sources</option>
        <option value="newsOrg">News.org</option>
        <option value="nyTimes">New York Times</option>
        <option value="guardian">The Guardian</option>
      </select>
      {!personalized && <input
        type="date"
        onChange={(e) => onFilterChange('date', e.target.value)}
        className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
      />}
       {personalized && <input
        type="text"
        placeholder="Author"
        value={filters.author ?? savedPreferences?.author}
        onChange={(e) => onFilterChange('author', e.target.value)}
        className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
      /> }
       {personalized && <button onClick={handleSave} className="bg-white text-blue-500  p-2 rounded">
        Save
      </button>}
    </div>
  );
};

export default FilterBar;
