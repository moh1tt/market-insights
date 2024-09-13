// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home page after logout
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt="Market Insights Logo"
              width={48}
              height={48}
              className="mr-4"
            />
            <Link href="/">
              <h1 className="text-4xl font-bold cursor-pointer">Market Insights</h1>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="space-x-6">
            <Link href="/" className="text-pink-600 hover:text-pink-800 text-lg">Home</Link>
            <Link href="/news" className="text-pink-600 hover:text-pink-800 text-lg">All News</Link>
            <Link href="/localnews" className="text-pink-600 hover:text-pink-800 text-lg">Local News</Link>
            <Link href="/about" className="text-pink-600 hover:text-pink-800 text-lg">About</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-pink-600 hover:text-pink-800 text-lg">Logout</button>
            ) : (
              <Link href="/login" className="text-pink-600 hover:text-pink-800 text-lg">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-black text-white shadow-inner mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">© 2024 Market Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;