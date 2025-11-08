import React from 'react';
import { FocusXLogo } from './icons';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, userName }) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-amber-50/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
          <FocusXLogo className="h-8 w-auto" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">FocusX</span>
        </a>
        <nav className="flex items-center space-x-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-sm font-medium">Welcome, {userName}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;