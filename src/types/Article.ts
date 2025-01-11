// types/Article.ts
export interface Article {
    title: string;
    description: string;
    url: string;
    author: string;
    source: { name: string };
    publishedAt: string;
    content: string;
    urlToImage?: string;
  }
  
  // types/Preferences.ts
  export interface Preferences {
    sources: string[];
    categories: string[];
    authors: string[];
  }
  