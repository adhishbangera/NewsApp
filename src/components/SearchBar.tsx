// components/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
