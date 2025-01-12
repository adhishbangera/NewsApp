// pages/Home.tsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ArticleList from "../components/ArticleList";
// import { fetchArticles } from '../services/newsAPI';
import { fetchArticles } from "../services/newsApi";
import { Article } from "../types/Article";

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPersonalizeSection, setShowPersonalizeSection] = useState(false);
  const [isPersonalized,setIsPersonalized]=useState(false)

  console.log('FFFF',filters);
  const togglePersonalizeSection = () => {
    setShowPersonalizeSection(!showPersonalizeSection);
  };

  const savedPreferences = JSON.parse(localStorage.getItem("preferences") || "{}");
  const areAllValuesEmpty =savedPreferences ? Object.values(savedPreferences).every(value => value === "" || !value) : true;

  useEffect(()=>{
    setIsPersonalized(!areAllValuesEmpty)
  },[areAllValuesEmpty])

  useEffect(()=>{
    fetchData("",savedPreferences)
  },[])

  const fetchData=async(query: string,filtersValues:any)=>{
    setLoading(true);
    try {
      const fetchedArticles = await fetchArticles(query, filtersValues);
      setArticles(fetchedArticles);
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (query: string) => {
    fetchData(query,filters)
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }

  return (
    <div className="p-4 ">
        <div className="flex items-center justify-center bg-blue-500 text-white p-4 font-bold text-lg rounded-md mb-4">
            Innoscripta News
        </div>
      {!isPersonalized && <div className="flex flex-wrap gap-4 sm:flex-col lg:flex-row">
        <SearchBar onSearch={handleSearch} />
        <FilterBar onFilterChange={handleFilterChange} personalized={false} onSearch={handleSearch} setIsPersonalized={setIsPersonalized} filters={filters} setShowPersonalizeSection={setShowPersonalizeSection}/>
      </div>}
       {/* Personalize Button */}
       <div className="flex justify-between items-center text-lg mt-4">
        <div className="text-blue-700 font-semibold p-4">{areAllValuesEmpty ? "Breaking news" : "Your feed"}</div>
       <button
          className="bg-gray-200 hover:bg-gray-300 text-blue-500 font-semibold text-sm px-4 py-2 rounded shadow"
          onClick={togglePersonalizeSection}
        >
          Personalize Feed
        </button>
        </div>

        {showPersonalizeSection && (
        <div className="p-4 bg-blue-500 mt-4 shadow-md rounded">
          <h2 className="text-lg font-bold mb-4 text-white">Personalize Your Feed</h2>
          <FilterBar onFilterChange={handleFilterChange} personalized={true} onSearch={handleSearch} setIsPersonalized={setIsPersonalized} filters={filters} setShowPersonalizeSection={setShowPersonalizeSection}/>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <ArticleList articles={articles} />
      )}
    </div>
  );
};

export default Home;
