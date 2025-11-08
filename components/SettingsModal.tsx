import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import ThemeToggle from './ThemeToggle';
import type { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedDetails: Partial<User>) => void;
  theme: string;
  toggleTheme: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser, theme, toggleTheme }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  useEffect(() => {
    // Reset form data if user prop changes (e.g., on re-open)
    if (isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateUser(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4 flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Close settings"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6 flex-grow">
          {/* User Profile Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile</h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500" htmlFor="name-input">Name</label>
                <input
                  id="name-input"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500" htmlFor="email-input">Email</label>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
          
          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Appearance</h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex justify-between items-center">
              <span className="text-slate-800 dark:text-slate-200">Theme</span>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-amber-500 hover:bg-amber-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;