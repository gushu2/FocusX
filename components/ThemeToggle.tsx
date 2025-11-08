import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-amber-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggle;