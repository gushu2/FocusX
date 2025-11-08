import React, { useState } from 'react';
import type { User } from '../types';
import { FocusXLogo, NoteIcon, SearchIcon, SettingsIcon } from './icons';
import ThemeToggle from './ThemeToggle';

interface NavSidebarProps {
  theme: string;
  toggleTheme: () => void;
  user: User;
  onOpenSettings: () => void;
  onFocusSearch: () => void;
}

const NavLink: React.FC<{ title: string; isActive?: boolean; onClick?: () => void; children: React.ReactNode }> = ({ title, isActive, onClick, children }) => (
    <li>
        <button
            onClick={onClick}
            title={title}
            className={`flex items-center justify-center h-12 w-12 rounded-lg transition-colors w-full ${
                isActive 
                    ? 'bg-amber-200 text-amber-800 dark:bg-emerald-900/60 dark:text-emerald-300' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-amber-200 dark:hover:bg-slate-800'
            }`}
        >
            {children}
        </button>
    </li>
);

const NavSidebar: React.FC<NavSidebarProps> = ({ theme, toggleTheme, user, onOpenSettings, onFocusSearch }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  return (
    <nav className="w-24 bg-amber-100 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between py-5">
      <div className="flex flex-col items-center space-y-10">
        <a href="#" className="text-amber-600 dark:text-emerald-500">
          <FocusXLogo className="h-9 w-auto" />
        </a>
        <ul className="space-y-4">
          <NavLink title="Notes" isActive={true}>
            <NoteIcon className="h-6 w-6" />
          </NavLink>
          <NavLink title="Search" onClick={onFocusSearch}>
            <SearchIcon className="h-6 w-6" />
          </NavLink>
          <NavLink title="Settings" onClick={onOpenSettings}>
            <SettingsIcon className="h-6 w-6" />
          </NavLink>
        </ul>
      </div>
      <div className="flex flex-col items-center space-y-5">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div className="relative">
            <button 
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="w-10 h-10 flex items-center justify-center bg-slate-300 dark:bg-slate-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 dark:focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900" 
                title={user.name}
            >
                <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">{user.name.charAt(0).toUpperCase()}</span>
            </button>
            {isUserMenuOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 p-2">
                    <div className="p-2">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavSidebar;