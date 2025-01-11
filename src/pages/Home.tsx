// pages/Home.tsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ArticleList from '../components/ArticleList';
// import { fetchArticles } from '../services/newsAPI';
import { fetchArticles } from '../services/newsApi';
import { Article } from '../types/Article';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState({});

  const handleSearch = async (query: string) => {
    const fetchedArticles = await fetchArticles(query, filters);
    setArticles(fetchedArticles);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="p-4">
        <div className='flex gap-8'>
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      </div>
      <ArticleList articles={articles} />
    </div>
  );
};

export default Home;
