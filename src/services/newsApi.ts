// import axios from 'axios';

// const API_KEY = '0017834c4c2e43ab84f79cf8af657e41';
// const BASE_URL = 'https://newsapi.org/v2';

// interface Filters {
//     date?: string;
//     category?: string;
//     source?: string;
//   }

// export const fetchArticles = async (query: string, filters: Filters) => {
//   const params = {
//     apiKey: API_KEY,
//     q: query,
//     from: filters.date || '',
//     category: filters.category || '',
//     sources: filters.source || '',
//   };

//   const { data } = await axios.get(`${BASE_URL}/top-headlines`, { params });
//   return data.articles;
// };

import { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const fetchArticles = async (query: string): Promise<Article[]> => {
  const newsAPIKey = '0017834c4c2e43ab84f79cf8af657e41';
  const guardianAPIKey = 'dd8defa5-1daf-4af4-a596-0b43ef7f188e';

  try {
    // Fetch articles from NewsAPI
    const newsAPIPromise = fetch(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsAPIKey}`
    )
      .then((response) => response.json())
      .then((data) =>
        data.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
        }))
      );

    // Fetch articles from GuardianAPI
    const guardianAPIPromise = fetch(
      `https://content.guardianapis.com/search?q=${query}&api-key=${guardianAPIKey}&show-fields=all`
    )
      .then((response) => response.json())
      .then((data) =>
        data.response.results.map((article: any) => ({
          title: article.webTitle,
          description: article.fields?.trailText || 'No description available',
          url: article.webUrl,
          source: 'The Guardian',
          publishedAt: article.webPublicationDate,
        }))
      );

    // Resolve both promises in parallel
    const [newsAPIArticles, guardianArticles] = await Promise.all([
      newsAPIPromise,
      guardianAPIPromise,
    ]);

    // Merge and return the results
    return [...newsAPIArticles, ...guardianArticles];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// export const useArticles = (query: string) => {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const fetchedArticles = await fetchArticles(query);
//       setArticles(fetchedArticles);
//       setLoading(false);
//     };

//     fetchData();
//   }, [query]);

//   return { articles, loading };
// };
