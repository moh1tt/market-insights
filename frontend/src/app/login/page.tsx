'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const credentials = { username, password };
    const endpoint = isSignup ? '/signup' : '/login';
    const apiUrl = `http://127.0.0.1:5000${endpoint}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        if (isSignup) {
          alert('Signup successful! You can now login.');
          setIsSignup(false);
        } else {
          localStorage.setItem('token', data.access_token);
          alert('Login successful!');
          router.push('/localnews'); // Changed from '/weather' to '/localnews'
        }
      } else {
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
            {isSignup ? 'Sign Up' : 'Login'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-black"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-black"
                required
              />
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md shadow hover:bg-pink-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            {isSignup ? (
              <p className="text-black">
                Already have an account?{' '}
                <button
                  className="text-pink-600 underline"
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-black">
                Don&apos;t have an account?{' '}
                <button
                  className="text-pink-600 underline"
                  onClick={() => setIsSignup(true)}
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
