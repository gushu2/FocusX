import React, { useState, useEffect } from 'react';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <DashboardPage theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;