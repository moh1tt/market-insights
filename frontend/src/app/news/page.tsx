'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import News from '../../components/News';
import NewsFilter from '../../components/NewsFilter';
import Layout from '../../components/Layout';

interface Article {
  title: string;
  author: string;
  url: string;
  // Add other properties as needed
}

const fetchNews = async (params: { [key: string]: string }): Promise<Article[]> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`http://127.0.0.1:5000/news?${queryParams}&_=${Date.now()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
};

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getNews = async () => {
    setIsLoading(true);
    const defaultParams = { category: 'business', endpoint: 'top-headlines' };
    const filteredParams: { [key: string]: string } = { ...defaultParams };
    
    searchParams.forEach((value, key) => {
      filteredParams[key] = value;
    });

    const fetchedArticles = await fetchNews(filteredParams);
    setArticles(fetchedArticles);
    setIsLoading(false);
  };

  useEffect(() => {
    getNews();
  }, [searchParams]);

  const handleRefresh = () => {
    getNews();
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">All News</h1>
          <button 
            onClick={handleRefresh}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh News
          </button>
        </div>
        <NewsFilter />
        {isLoading ? (
          <p>Loading news...</p>
        ) : (
          <News articles={articles as Article[]} />
        )}
      </div>
    </Layout>
  );
}