import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import newsData from "./newsData.js";

// Read the original newsData.js file
const filePath = "newsDatafinal.js";

// Remove duplicates based on the 'url' field
const cleanedArticles = [];
const seenUrls = new Set();

newsData.articles.forEach((article) => {
  if (!seenUrls.has(article.url)) {
    seenUrls.add(article.url);
    cleanedArticles.push(article);
  }
});

// Create a cleaned version of newsData
const cleanedNewsData = `const newsData = ${JSON.stringify(
  { totalResults: cleanedArticles.length, articles: cleanedArticles },
  null,
  2
)};\n\nexport default newsData;`;

// Overwrite the original file
fs.writeFileSync(filePath, cleanedNewsData, "utf8");

console.log("✅ newsData.js has been cleaned and updated successfully!");
