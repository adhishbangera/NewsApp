// components/NewsCard.tsx
import React from 'react';
import { Article } from '../types/Article';

interface NewsCardProps {
  article: Article; // The article object to display
}



const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    console.log('aaaaa',article)
  return (
    <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {article.title}
        </a>
      </h3>
      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
      <div className="text-sm text-gray-500">
        <p>By: {article.author || 'Unknown Author'}</p>
        <p>Source: {article.source}</p>
        <p>Published: {new Date(article.publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default NewsCard;
