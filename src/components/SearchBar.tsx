import React from 'react';

interface SearchBarProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setQuery }) => {

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search articles..."
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 hover:border-blue-500 hover:shadow-lg transition duration-300 w-full"
      />
    </div>
  );
};

export default SearchBar;
