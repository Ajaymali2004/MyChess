import React, { useState, useEffect, useRef } from "react";
const News = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(true); // Secure API Key
  const PAGE_SIZE = 15; // Load 18 articles at a time
  const observerRef = useRef(null);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // Fetch News Function
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=chess&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`
      );
      const data = await response.json();

      if (data.articles) {
        setNews((prevNews) => [...prevNews, ...data.articles]);
        setPage((prevPage) => prevPage + 1);
      }
      if (!data.articles || data.articles.length < PAGE_SIZE) {
        setHasMoreNews(false);
      }
    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (hasMoreNews) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            fetchNews(); // Load more news when reaching bottom
          }
        },
        { threshold: 1.0 }
      );

      const observerTarget = document.getElementById("loadMoreTrigger");
      if (observerTarget) observerRef.current.observe(observerTarget);
    }
    return () => observerRef.current?.disconnect();
  }, [loading]);

  return (
    <div className="bg-slate-900  text-white p-6">
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

              {/* News Content */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {article.description || "No description available."}
                  </p>
                </div>

                {/* Read More Button */}
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

      {/* Load More Trigger for Infinite Scroll */}
      <div id="loadMoreTrigger" className="h-10 w-full mt-6"></div>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center text-gray-400 mt-4">Loading more news...</p>
      )}
      {!loading && !hasMoreNews && (
        <p className="text-center text-white-500 mt-6">End of Page</p>
      )}
    </div>
  );
};

export default News;
