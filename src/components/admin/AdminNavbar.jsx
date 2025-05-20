import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminNavbar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
              Campus Flow
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-4 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.displayName || 'Admin User'}
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 