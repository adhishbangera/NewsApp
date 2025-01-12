import axios from 'axios';

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

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const fetchArticles = async (query: string,filters:any): Promise<Article[]> => {
  const newsAPIKey = '0017834c4c2e43ab84f79cf8af657e41';
  const guardianAPIKey = 'dd8defa5-1daf-4af4-a596-0b43ef7f188e';
  const newYorkTimesAPIKey = 'uvXeQ3yYDdhDsKcSfRWkUAtOHN6tIVYe';

  const formattedDate = filters.date
  ? new Date(filters.date).toISOString().split('T')[0] // Convert to YYYY-MM-DD
  : new Date().toISOString().split('T')[0];

const newsApiSearchByQueryUrl = `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&apiKey=${newsAPIKey}`;
const NYTimesSearchByQueryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&begin_date=${formattedDate?.replace(
  /-/g,
  ''
)}&api-key=${newYorkTimesAPIKey}`;
const theGuardianSearchByQueryUrl = `https://content.guardianapis.com/search?q=${query}&from-date=${formattedDate}&page-size=20&show-fields=thumbnail&api-key=${guardianAPIKey}`;

const newsApiSearchByCategory = `https://newsapi.org/v2/top-headlines?country=us&category=${filters.category}&from=${formattedDate}&apiKey=${newsAPIKey}`;
const NYTimesSearchByCategory = `https://api.nytimes.com/svc/news/v3/content/all/${filters.category}.json?api-key=${newYorkTimesAPIKey}`;
const theGuardianSearchByCategory = `https://content.guardianapis.com/search?section=${filters.category}&from-date=${formattedDate}&page-size=20&show-fields=thumbnail&api-key=${guardianAPIKey}`;

const newsApiSearchByQueryAndCategory = `https://newsapi.org/v2/top-headlines?country=us&q=${query}&category=${filters.category}&from=${formattedDate}&apiKey=${newsAPIKey}`;
const theGuardianSearchByQueryAndCategory = `https://content.guardianapis.com/search?q=${query}&section=${filters.category}&from-date=${formattedDate}&show-fields=thumbnail&api-key=${guardianAPIKey}`;


  const newsApiSearchUrl =
  query.length > 0 && filters?.category?.length > 0
      ? newsApiSearchByQueryAndCategory
      : filters?.category?.length > 0
      ? newsApiSearchByCategory
      : query.length > 0 && newsApiSearchByQueryUrl

  const NYTimesSearchUrl =
  query.length > 0 && filters?.category?.length > 0
      ? ''
      : filters?.category?.length > 0
      ? NYTimesSearchByCategory
      : query.length > 0 && NYTimesSearchByQueryUrl

  const theGuardianSearchUrl =
  query.length > 0 && filters?.category?.length > 0
      ? theGuardianSearchByQueryAndCategory
      : filters?.category?.length > 0
      ? theGuardianSearchByCategory
      : query.length > 0 && theGuardianSearchByQueryUrl
      
  try {
        const newsAPIPromise = fetch(
            newsApiSearchUrl
          )
            .then((response) => response.json())
            .then((data) =>
              data.articles.map((article: any) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                publishedAt: article.publishedAt,
                image:article.urlToImage,
                author:article.author,
              }))
            );

    // Fetch articles from GuardianAPI
    const guardianAPIPromise = fetch(
        theGuardianSearchUrl
    //   `https://content.guardianapis.com/search?q=${query}&api-key=${guardianAPIKey}&show-fields=all`
    )
      .then((response) => response.json())
      .then((data) =>
        data.response.results.map((article: any) => ({
          title: article.webTitle,
          description: article.fields?.trailText || 'No description available',
          url: article.webUrl,
          source: 'The Guardian',
          publishedAt: article.webPublicationDate,
          author:article.author,
          image:article.fields.thumbnail
        }))
      );

      const nyTimesAPIPromise =fetch(
        NYTimesSearchUrl
        // `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${newYorkTimesAPIKey}`
        )
      .then((response)=>response.json())
      .then((data) =>
        (data.response.docs ?? data.results).map((article: any) => ({
            title: article.headline.main || "dasdas",
            description: article.abstract || 'No description available',
            url: article.web_url || "adasd",
            source: 'New York Times' ,
            publishedAt: article.pub_date || "sdfdsfds",
          }))
      );

      let apiPromises: Promise<Article[]>[] = [];

      switch (filters.source) {
        case 'newsOrg':
          apiPromises = [newsAPIPromise];
          break;
        case 'guardian':
          apiPromises = [guardianAPIPromise];
          break;
        case 'nyTimes':
          apiPromises = [nyTimesAPIPromise];
          break;
        default:
          apiPromises = [newsAPIPromise, guardianAPIPromise, nyTimesAPIPromise];
          break;
      }

      const results = await Promise.allSettled(apiPromises);

      // Extract fulfilled results
      const articles = results
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => (result as PromiseFulfilledResult<Article[]>).value);
  
      return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};
