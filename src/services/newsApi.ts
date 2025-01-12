import { GUARDIAN_API_KEY, GUARDIAN_SOURCE, NEWS_API_KEY, NEWYORKTIME_SOURCE, NEWYORKTIMES_API_KEY, NO_AUTHOR, NO_DESCRIPTION, NO_PUBLISH_DATE, NO_TITLE, NO_URL } from "../constants/constants";
import { Article } from "../types/Article";
import { Filter } from "../types/Filter";

export const fetchArticles = async (
  query: string,
  filters: Filter
): Promise<Article[]> => {
  const newsAPIKey = NEWS_API_KEY;
  const guardianAPIKey = GUARDIAN_API_KEY;
  const newYorkTimesAPIKey = NEWYORKTIMES_API_KEY;

  const formattedDate = filters.date
    ? new Date(filters.date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
    : new Date().toISOString().split("T")[0];

  const newsApiSearchByQueryUrl = `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&apiKey=${newsAPIKey}`;
  const NYTimesSearchByQueryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&begin_date=${formattedDate?.replace(
    /-/g,
    ""
  )}&api-key=${newYorkTimesAPIKey}`;
  const theGuardianSearchByQueryUrl = `https://content.guardianapis.com/search?q=${query}&from-date=${formattedDate}&page-size=20&show-fields=thumbnail&api-key=${guardianAPIKey}`;

  const newsApiSearchByCategory = `https://newsapi.org/v2/top-headlines?country=us&category=${filters.category}&from=${formattedDate}&apiKey=${newsAPIKey}`;
  const NYTimesSearchByCategory = `https://api.nytimes.com/svc/news/v3/content/all/${filters.category}.json?api-key=${newYorkTimesAPIKey}`;
  const theGuardianSearchByCategory = `https://content.guardianapis.com/search?section=${filters.category}&from-date=${formattedDate}&page-size=20&show-fields=thumbnail&api-key=${guardianAPIKey}`;

  const newsApiSearchByQueryAndCategory = `https://newsapi.org/v2/top-headlines?country=us&q=${query}&category=${filters.category}&from=${formattedDate}&apiKey=${newsAPIKey}`;
  const theGuardianSearchByQueryAndCategory = `https://content.guardianapis.com/search?q=${query}&section=${filters.category}&from-date=${formattedDate}&show-fields=thumbnail&api-key=${guardianAPIKey}`;

  const newAPIDefault=`https://newsapi.org/v2/top-headlines?country=us&from=${formattedDate}&apiKey=${newsAPIKey}`;
  const nytimesDefault = `https://api.nytimes.com/svc/news/v3/content/all/general.json?api-key=${newYorkTimesAPIKey}`;
  const theGuardianDefault = `https://content.guardianapis.com/search?section=general&from-date=${formattedDate}&page-size=20&show-fields=thumbnail&api-key=${guardianAPIKey}`;

  //Form urls based on query,category and date
  const newsApiSearchUrl =
    query.length > 0 && filters?.category?.length > 0
      ? newsApiSearchByQueryAndCategory
      : filters?.category?.length > 0
      ? newsApiSearchByCategory
      : query.length > 0 ? newsApiSearchByQueryUrl:newAPIDefault;

  const NYTimesSearchUrl =
    query.length > 0 && filters?.category?.length > 0
      ? ""
      : filters?.category?.length > 0
      ? NYTimesSearchByCategory
      : query.length > 0 ? NYTimesSearchByQueryUrl:nytimesDefault;

  const theGuardianSearchUrl =
    query.length > 0 && filters?.category?.length > 0
      ? theGuardianSearchByQueryAndCategory
      : filters?.category?.length > 0
      ? theGuardianSearchByCategory
      : query.length > 0 ? theGuardianSearchByQueryUrl:theGuardianDefault;

  try {
    // Fetch articles from news API
    const newsAPIPromise = fetch(newsApiSearchUrl)
      .then((response) => response.json())
      .then((data) =>
        data.articles.map((article: any) => ({
          title: article.title || NO_TITLE,
          description: article.description || NO_DESCRIPTION,
          url: article.url || NO_URL,
          source: article.source.name,
          publishedAt: article.publishedAt || NO_AUTHOR,
          image: article.urlToImage,
          author: article.author || NO_AUTHOR,
        }))
      );

    // Fetch articles from Guardian API
    const guardianAPIPromise = fetch(theGuardianSearchUrl)
      .then((response) => response.json())
      .then((data) =>
        data.response.results.map((article: any) => ({
          title: article.webTitle || NO_TITLE,
          description: article.fields?.trailText || NO_DESCRIPTION,
          url: article.webUrl || NO_URL,
          source: GUARDIAN_SOURCE,
          publishedAt: article.webPublicationDate || NO_PUBLISH_DATE,
          author: article.author || NO_AUTHOR,
          image: article.fields.thumbnail,
        }))
      );

    // Fetch articles from New york times API
    const nyTimesAPIPromise = fetch(NYTimesSearchUrl)
      .then((response) => response.json())
      .then((data) =>
        (data?.response?.docs ?? data.results).map((article: any) => ({
          title:
            article.headline?.main || article.title || NO_TITLE,
          description:
            article.abstract ||
            article.des_facet?.join(", ") ||
            NO_DESCRIPTION,
          url: article.web_url || article.url || NO_URL,
          source: NEWYORKTIME_SOURCE,
          publishedAt:
            article.pub_date ||
            article.published_date ||
            NO_PUBLISH_DATE,
          image: article.multimedia[0]?.url,
          author: article.byline || article.byline.original || NO_AUTHOR,
        }))
      );

    let apiPromises: Promise<Article[]>[] = [];

    switch (filters.source) {
      case "newsOrg":
        apiPromises = [newsAPIPromise];
        break;
      case "guardian":
        apiPromises = [guardianAPIPromise];
        break;
      case "nyTimes":
        apiPromises = [nyTimesAPIPromise];
        break;
      default:
        apiPromises = [newsAPIPromise, guardianAPIPromise, nyTimesAPIPromise];
        break;
    }

    const results = await Promise.allSettled(apiPromises);

    // Extract fulfilled results
    const articles = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => (result as PromiseFulfilledResult<Article[]>).value);

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
