
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  logoutUser } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import { Sun, Moon, Menu, X, Bell, LogOut } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const isMobile = useIsMobile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  
  if (!user) return null;
  
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Campus Flow
            </span>
            {userRole && (
              <span className="hidden md:inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full">
                {userRole}
              </span>
            )}
          </div>

          {/* Right side - Theme Toggle, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <button 
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {userInitial}
                  </span>
                </div>
                {!isMobile && (
                  <span className="font-medium">{user.name}</span>
                )}
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-40">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || ''}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;