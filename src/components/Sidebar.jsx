import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, LayoutDashboard, Users, BookOpen, Settings, CalendarCheck, GraduationCap, UserPlus, BookCheck, User } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '../lib/utils';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!user) return null;
  
  const isActive = (path) => location.pathname === path;
  
  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { path: '/admin/manage-classes', label: 'Manage Classes', icon: <BookOpen size={18} /> },
          { path: '/admin/class-assignments', label: 'Class Assignments', icon: <BookCheck size={18} /> },
          { path: '/admin/pending-users', label: 'Pending Users', icon: <UserPlus size={18} /> },
          { path: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
        ];
      case 'teacher':
        return [
          { path: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { path: '/teacher/classes', label: 'My Classes', icon: <BookOpen size={18} /> },
          { path: '/teacher/profile', label: 'Profile', icon: <User size={18} /> },
        ];
      case 'student':
        return [
          { path: '/student', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { path: '/student/classes', label: 'My Classes', icon: <BookOpen size={18} /> },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();
  
  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose} />
        )}
        <div
          className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } pt-16`}
        >
          <div className="flex justify-end p-2 absolute top-0 right-0">
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
              School MS
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          
          <nav className="mt-4 overflow-y-auto h-[calc(100vh-10rem)]">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={isMobile ? onClose : undefined}
                    className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-500 text-white dark:bg-indigo-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 pt-16 z-30`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
          School MS
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>
      
      <nav className="mt-4 overflow-y-auto h-[calc(100vh-9rem)]">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-500 text-white dark:bg-indigo-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;