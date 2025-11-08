import React, { useState, useEffect } from 'react';
import DashboardPage from './components/DashboardPage';
import type { User } from './types';

// Mock user since there is no login flow.
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Wolfe',
  email: 'alex.wolfe@example.com',
  plan: 'Creator'
};

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState<User>(MOCK_USER);

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
  
  const handleUpdateUser = (updatedDetails: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...updatedDetails }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <DashboardPage 
        theme={theme} 
        toggleTheme={toggleTheme} 
        user={user}
        onUpdateUser={handleUpdateUser} 
      />
    </div>
  );
};

export default App;