// components/ArticleList.tsx
import React from 'react';
import NewsCard from './NewsCard';
import { Article } from '../types/Article';

interface ArticleListProps {
  articles: Article[]; // Array of articles to display
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (articles.length === 0) {
    return <p className="text-gray-500 p-4">No articles found. Try searching for something else.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-4">
      {articles.map((article, index) => (
        article.title!=="[Removed]" && <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
