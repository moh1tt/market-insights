'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';

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

const LocalNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      console.log("Token:", token ? "exists" : "not found");
  
      if (!token) {
        console.log("No token found, redirecting to login");
        router.push('/login');
        return;
      }
  
      const fetchData = async (latitude: number, longitude: number) => {
        try {
          console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
          const weatherRes = await fetch(`http://127.0.0.1:5000/weather?lat=${latitude}&lon=${longitude}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log("Weather response status:", weatherRes.status);
          if (!weatherRes.ok) {
            const errorText = await weatherRes.text();
            throw new Error(`Failed to fetch weather data: ${errorText}`);
          }
          const weatherData = await weatherRes.json();
          console.log("Weather data:", weatherData);
          setWeather(weatherData);
  
          // Fetch local news using the city name from weather data
          console.log(`Fetching local news for ${weatherData.city}`);
          const newsRes = await fetch(`http://127.0.0.1:5000/localnews?city=${encodeURIComponent(weatherData.city)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log("News response status:", newsRes.status);
          if (!newsRes.ok) {
            const errorText = await newsRes.text();
            throw new Error(`Failed to fetch news data: ${errorText}`);
          }
          const newsData = await newsRes.json();
          console.log("News data:", newsData);
          setArticles(newsData.articles);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      };
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got position:", position.coords);
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError(`Failed to get your location: ${err.message}. Please enable location services and try again.`);
          setIsLoading(false);
        }
      );
    }, [router]);

  console.log("Render state:", { isLoading, error, weatherExists: !!weather, articlesCount: articles.length });

  if (isLoading) return <Layout><div className='text-pink-500'>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="flex gap-6 mb-8">
        {/* Weather Card */}
        {weather && (
          <div className="bg-black text-white p-6 rounded-lg w-1/2 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold text-pink-600">Current Weather in {weather.city}</h2>
            <p className="text-lg mt-2">{weather.temperature}°C, {weather.description}</p>
          </div>
        )}
        {/* Daily Forecast Card */}
        {weather && (
          <div className="bg-gray-800 text-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold text-pink-600">Today&apos;s Forecast</h2>
            <p className="text-sm mt-4">
              Morning: {weather.forecast.morning}°C | 
              Afternoon: {weather.forecast.afternoon}°C | 
              Evening: {weather.forecast.evening}°C
            </p>
          </div>
        )}
      </div>

      <section className="news-list">
        <h2 className="text-3xl font-bold text-black mb-4">Local News</h2>
        {articles.length === 0 ? (
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
};

export default LocalNews;