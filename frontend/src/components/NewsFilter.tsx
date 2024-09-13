'use client';

import React, { useState } from 'react';

const NewsFilter: React.FC = () => {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('');
  const [domain, setDomain] = useState('');
  const [endpoint, setEndpoint] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // Only append the parameters that are not empty
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    if (source) params.append('sources', source);
    if (domain) params.append('domain', domain);
    if (endpoint) params.append('endpoint', endpoint);

    // Perform a client-side redirect with the new parameters
    window.location.href = `/news?${params.toString()}`;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-black">Filter News</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-black"
            placeholder="Enter category"
          />
          <p className="text-gray-500 text-xs mt-1">e.g., Business, Technology, Health</p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-black"
            placeholder="Enter keyword"
          />
          <p className="text-gray-500 text-xs mt-1">e.g., COVID-19, Stock Market</p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-black"
            placeholder="Enter source"
          />
          <p className="text-gray-500 text-xs mt-1">e.g., CNN, BBC</p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-black"
            placeholder="Enter domain"
          />
          <p className="text-gray-500 text-xs mt-1">e.g., example.com, news.com</p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Endpoint</label>
          <select
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
          >
            <option value="" disabled>Select an endpoint</option>
            <option value="top-headlines">Top Headlines</option>
            <option value="everything">Everything</option>
          </select>
          <p className="text-gray-500 text-xs mt-1">Choose between &quot;Top Headlines&quot; and &quot;Everything&quot;</p>
        </div>

        <div className="flex-1 flex items-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white font-medium rounded-md shadow-sm hover:bg-pink-700 w-full"
          >
            Fetch News
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsFilter;
