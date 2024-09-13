import React from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

interface NewsProps {
  articles: Article[];
}

const News: React.FC<NewsProps> = ({ articles }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-black mb-6">News</h2>
      <ul className="space-y-8">
        {articles.map((article, index) => (
          <li key={index} className="border-b border-gray-200 pb-8">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-64 object-cover mb-4"
              />
            )}
            <h3 className="text-2xl font-bold text-pink-600 hover:text-pink-800">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </h3>
            <p className="text-lg text-gray-700">{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
