import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useIsMobile } from '../hooks/use-mobile';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { BookOpen, Users, Calendar, User, LogOut, Home } from 'lucide-react';

const Layout = ({ children, requiredRole = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Block access if user is pending
    if (user.role === 'pending') {
      navigate('/pending');
      return;
    }
    
    // Redirect if role doesn't match required role
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/login');
      }
    }
  }, [user, navigate, requiredRole]);
  
  if (!user) return null;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/teacher'
    },
    {
      title: 'My Classes',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/teacher/classes'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          {/* Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/teacher/profile" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.designation || 'Teacher'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </Sidebar>
        <main className={`flex-grow transition-all duration-300 ${sidebarOpen && !isMobile ? 'md:pl-64' : 'pl-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;