import React from 'react';
import { FocusXLogo, NoteIcon, SearchIcon, SettingsIcon } from './icons';
import ThemeToggle from './ThemeToggle';

interface NavSidebarProps {
  theme: string;
  toggleTheme: () => void;
  userName: string;
}

const NavLink: React.FC<{ title: string, isActive?: boolean, children: React.ReactNode }> = ({ title, isActive, children }) => (
    <li>
        <a
            href="#"
            title={title}
            className={`flex items-center justify-center h-12 w-12 rounded-lg transition-colors ${
                isActive 
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-amber-200 dark:hover:bg-slate-800'
            }`}
        >
            {children}
        </a>
    </li>
);

const NavSidebar: React.FC<NavSidebarProps> = ({ theme, toggleTheme, userName }) => {
  return (
    <nav className="w-24 bg-amber-100 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between py-5">
      <div className="flex flex-col items-center space-y-10">
        <a href="#" className="text-emerald-600 dark:text-emerald-500">
          <FocusXLogo className="h-9 w-auto" />
        </a>
        <ul className="space-y-4">
          <NavLink title="Notes" isActive={true}>
            <NoteIcon className="h-6 w-6" />
          </NavLink>
          <NavLink title="Search">
            <SearchIcon className="h-6 w-6" />
          </NavLink>
          <NavLink title="Settings">
            <SettingsIcon className="h-6 w-6" />
          </NavLink>
        </ul>
      </div>
      <div className="flex flex-col items-center space-y-5">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <button className="w-10 h-10 flex items-center justify-center bg-slate-300 dark:bg-slate-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900" title={userName}>
            <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">{userName.charAt(0).toUpperCase()}</span>
        </button>
      </div>
    </nav>
  );
};

export default NavSidebar;