import React from 'react';
import { FocusXLogo } from './icons';
import ThemeToggle from './ThemeToggle';

// fix: Add `isLoggedIn` and `onLogin` to HeaderProps to handle logged-in and logged-out states.
interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  userName?: string;
  isLoggedIn: boolean;
  onLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, userName, isLoggedIn, onLogin }) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-amber-50/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2 text-amber-600 dark:text-emerald-400">
          <FocusXLogo className="h-8 w-auto" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">FocusX</span>
        </a>
        <nav className="flex items-center space-x-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <div className="flex items-center space-x-3">
            {isLoggedIn && userName ? (
              <span className="hidden sm:inline text-sm font-medium">Welcome, {userName}</span>
            ) : onLogin ? (
               <button
                onClick={onLogin}
                className="hidden sm:block px-4 py-2 text-sm font-semibold rounded-lg text-amber-600 ring-1 ring-inset ring-amber-200 hover:ring-amber-300 dark:text-emerald-400 dark:ring-emerald-500 dark:hover:ring-emerald-400 transition-colors"
              >
                Sign In
              </button>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
