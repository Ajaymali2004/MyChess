import React, { useState, useEffect, useRef } from "react";
import newsData from "./newsData";

const PAGE_SIZE = 15; // Load 15 articles per batch
const LOAD_DELAY = 1000; // 1 second delay for each batch

const News = () => {
  const [news, setNews] = useState([]); // Articles to display
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const [hasMoreNews, setHasMoreNews] = useState(true);

  // Function to load news with a delay
  const fetchNews = () => {
    if (loading || !hasMoreNews) return; // Prevent multiple triggers
    setLoading(true);

    setTimeout(() => {
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const newArticles = newsData.articles.slice(startIndex, endIndex);

      if (newArticles.length > 0) {
        setNews((prevNews) => [...prevNews, ...newArticles]);
        setPage((prevPage) => prevPage + 1);
      }

      if (endIndex >= newsData.articles.length) {
        setHasMoreNews(false);
      }

      setLoading(false);
    }, LOAD_DELAY);
  };

  // Load first batch immediately
  useEffect(() => {
    fetchNews();
  }, []);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMoreNews) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchNews();
        }
      },
      { threshold: 1.0 }
    );

    const observerTarget = document.getElementById("loadMoreTrigger");
    if (observerTarget) observerRef.current.observe(observerTarget);

    return () => observerRef.current?.disconnect();
  }, [hasMoreNews, loading]);

  return (
    <div className="bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">♟️ Chess News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-lg transition hover:scale-105 flex flex-col h-full"
            >
              <img
                src={article.urlToImage || "/Alternative_image.jpeg"}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {article.description || "No description available."}
                  </p>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-center"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300 text-lg">
            No chess news available
          </p>
        )}
      </div>

      <div id="loadMoreTrigger" className="h-10 w-full mt-6"></div>

      {loading && <p className="text-center text-gray-400 mt-4">Loading...</p>}
      {!hasMoreNews && (
        <p className="text-center text-gray-500 mt-6">End of Page</p>
      )}
    </div>
  );
};

export default News;
