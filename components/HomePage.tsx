import React from 'react';
import Header from './Header';
import Pricing from './Pricing';
// fix: Replaced non-existent MagicIcon with SparklesIcon.
import { FocusXLogo, FileIcon, SparklesIcon, LockIcon } from './icons';

interface HomePageProps {
  onLogin: () => void;
  theme: string;
  toggleTheme: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogin, theme, toggleTheme }) => {
  return (
    <div className="bg-amber-50 dark:bg-gray-900">
      <Header theme={theme} toggleTheme={toggleTheme} isLoggedIn={false} onLogin={onLogin} />
      <main>
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FocusXLogo className="h-20 w-auto mx-auto text-emerald-600 dark:text-emerald-400" />
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Find Your Focus. Master Your Words.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600 dark:text-gray-300">
              FocusX is a minimalist writing sanctuary designed for clarity and productivity.
              Organize your thoughts, craft your content, and unleash your creativity, distraction-free.
            </p>
            <div className="mt-10">
              <button
                onClick={onLogin}
                className="px-8 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-lg shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-105 transition-transform duration-300"
              >
                Start Writing for Free
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-amber-100 dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">A Better Writing Experience</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Everything you need to write, and nothing you don't.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                  <FileIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Effortless Organization</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Structure your ideas with simple folders and notes. Our clean interface keeps your work tidy and accessible.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                  {/* fix: Replaced non-existent MagicIcon with SparklesIcon. */}
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">AI-Powered Assistance</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Overcome writer's block. Summarize, rewrite, and improve your text with our integrated Gemini AI tools.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                  <LockIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Secure & Private</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Your work is autosaved and securely stored. Share with public links or keep it private with password protection.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Pricing />
      </main>

      {/* Footer */}
      <footer id="about" className="bg-amber-100 dark:bg-gray-950">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-4">
            <FocusXLogo className="h-10 w-auto text-emerald-600 dark:text-emerald-400" />
          </div>
          <nav className="flex flex-wrap justify-center -mx-5 -my-2">
            <div className="px-5 py-2"><a href="#features" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">Features</a></div>
            <div className="px-5 py-2"><a href="#pricing" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">Pricing</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">Contact</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">Privacy</a></div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} FocusX. All rights reserved. Built for clarity and focus.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;