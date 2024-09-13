'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Article {
  title: string;
  author: string;
  url: string;
  urlToImage: string;
}

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  forecast: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch('http://127.0.0.1:5000/');
        if (!articlesRes.ok) {
          throw new Error('Failed to fetch articles');
        }
        const articlesData = await articlesRes.json();
        setArticles(articlesData?.articles || []);

        // Fetch weather data
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const weatherRes = await fetch(`http://127.0.0.1:5000/weather?lat=${latitude}&lon=${longitude}`);
          if (!weatherRes.ok) {
            throw new Error('Failed to fetch weather data');
          }
          const weatherData = await weatherRes.json();
          setWeather(weatherData);
        }, (err) => {
          console.error("Error getting location:", err);
          setError('Failed to get location. Weather data unavailable.');
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex gap-6 mb-8">
        {/* Weather Card */}
        <div className="bg-black text-white p-6 rounded-lg w-1/2 flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold text-pink-600">Current Weather</h2>
          {weather ? (
            <p className="text-lg mt-2">{weather.city}, {weather.temperature.toFixed(1)}°C, {weather.description}</p>
          ) : (
            <p className="text-lg mt-2">Weather data unavailable</p>
          )}
        </div>
        {/* Daily Forecast Card */}
        <div className="bg-gray-800 text-white p-6 rounded-lg w-1/2">
          <h2 className="text-xl font-bold text-pink-600">Today&apos;s Forecast</h2>
          {weather ? (
            <>
              <p className="text-lg mt-2">Day overview and weather trend</p>
              <p className="text-sm mt-4">
                Morning: {weather.forecast.morning.toFixed(1)}°C | 
                Afternoon: {weather.forecast.afternoon.toFixed(1)}°C | 
                Evening: {weather.forecast.evening.toFixed(1)}°C
              </p>
            </>
          ) : (
            <p className="text-lg mt-2">Forecast unavailable</p>
          )}
        </div>
      </div>

      <section className="news-list">
        <h2 className="text-3xl font-bold text-black mb-4">Latest Business News</h2>
        {isLoading ? (
          <p>Loading articles...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : articles.length === 0 ? (
          <p className="text-red-500">No news articles available.</p>
        ) : (
          <ul className="space-y-6">
            {articles.map((article: Article, index: number) => (
               
               <li key={index} className="border-b border-gray-200 pb-8">
               {article.urlToImage && (
                 <img
                   src={article.urlToImage}
                   alt={article.title}
                   className="w-full h-64 object-cover mb-4"
                 />
               )}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="text-pink-600 text-2xl font-bold mb-2">{article.title}</h3>
                  <p className="text-pink-400">{article.author || "No author available."}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}