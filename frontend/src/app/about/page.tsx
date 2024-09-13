'use client';

import Image from 'next/image'; // For Next.js
import Layout from '../../components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">About Market Insights</h1>
          
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Our Platform</h2>
            <p className="text-lg mb-4">
              Market Insights is a comprehensive web application designed to provide users with up-to-date business news, weather information, and localized content. Our platform offers a seamless experience for staying informed about market trends and local conditions.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li><span className="text-pink-400">Home Page:</span> Features curated business news and location-based weather information.</li>
              <li><span className="text-pink-400">All News:</span> Allows users to filter and fetch news based on various criteria.</li>
              <li><span className="text-pink-400">Local News:</span> Provides location-specific news and weather, requiring user authentication for access.</li>
              <li><span className="text-pink-400">About:</span> Offers insights into our website&apos;s functionality and the technology stack powering it.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Technology Stack</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-pink-400">Backend: Flask</h3>
                <p>
                  Flask, a lightweight Python web framework, handles our API and backend logic. It&apos;s responsible for processing requests, interacting with the database, and serving data to the frontend.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-400">Frontend: Next.js, TypeScript, and Tailwind CSS</h3>
                <p>
                  Our frontend is built with Next.js, utilizing TypeScript for enhanced code quality and Tailwind CSS for responsive, utility-first styling. This combination provides a robust, type-safe, and visually appealing user interface.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-400">Database: PostgreSQL</h3>
                <p>
                  PostgreSQL serves as our primary database, storing user authentication data and supporting CRUD operations. Its reliability and advanced features make it ideal for our application&apos;s data management needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-400">Containerization: Docker</h3>
                <p>
                  We use Docker to containerize PostgreSQL and pgAdmin, ensuring easy setup and consistent environments across development and production. This approach simplifies database management and access.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-400">External APIs</h3>
                <p>
                  Our application integrates with weather and news APIs to provide real-time data to users, enhancing the overall user experience with up-to-date information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Getting Started</h2>
            <p className="text-lg mb-4">
              To clone and run this project locally:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-lg">
              <li>Clone the repository from GitHub.</li>
              <li>Set up a virtual environment and install Python dependencies.</li>
              <li>Install Node.js and npm dependencies for the frontend.</li>
              <li>Set up PostgreSQL and pgAdmin using Docker.</li>
              <li>Configure environment variables for API keys and database connections.</li>
              <li>Run the Flask backend and Next.js frontend servers.</li>
            </ol>
            <p className="text-lg mt-4">
              Detailed setup instructions can be found in the project&apos;s README file.
            </p>
          </section>


          <section className="mb-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Additional Resources</h2>
          
              
                <span className="text-pink-400">Personal Website:</span>{' '}
                <a href="https://moh1tt.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  moh1tt.vercel.app
                </a>{' '}
                - Check out my personal website built with Next.js and Tailwind CSS.
                <br />
                <span className="text-pink-400">GitHub Repository:</span>{' '}
                <a href="https://github.com/yourusername/market-insights" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  github.com/yourusername/market-insights
                </a>{' '}
                - View the source code and contribute to the project.
              
            
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-center text-pink-600">Technologies Used</h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Image src="/logos/flask.png" alt="Flask" width={80} height={80} />
              <Image src="/logos/nextjs.jpg" alt="Next.js" width={80} height={80} />
              <Image src="/logos/typescript.png" alt="TypeScript" width={80} height={80} />
              <Image src="/logos/tailwindcss.png" alt="Tailwind CSS" width={80} height={80} />
              <Image src="/logos/postgres.png" alt="PostgreSQL" width={80} height={80} />
              <Image src="/logos/docker.webp" alt="Docker" width={80} height={80} />
              <Image src="/logos/python.webp" alt="Python" width={80} height={80} />
              <Image src="/logos/react.webp" alt="React" width={80} height={80} />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

