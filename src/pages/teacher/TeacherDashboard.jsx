import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { fetchClasses } from '../../redux/classSlice';
import { BookOpen, Users, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // Filter classes assigned to this teacher
  const assignedClasses = classes?.filter(cls => cls.teacherId === user?.id) || [];

  const dashboardItems = [
    {
      title: 'My Classes',
      description: 'View and manage your assigned classes',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/teacher/classes',
      color: 'bg-blue-500'
    },
    {
      title: 'My Profile',
      description: 'View and update your profile information',
      icon: <User className="h-6 w-6" />,
      link: '/teacher/profile',
      color: 'bg-green-500'
    }
  ];

  return (
    <Layout requiredRole="teacher">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || 'Teacher'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {assignedClasses.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {assignedClasses.reduce((total, cls) => total + (cls.students?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Classes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {assignedClasses.filter(cls => cls.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Classes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Classes</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignedClasses.length > 0 ? (
              assignedClasses.map((cls) => (
                <div key={cls.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {cls.department}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cls.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Schedule</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {cls.schedule || 'Not scheduled'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Room</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {cls.room || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Students</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {cls.students?.length || 0} enrolled
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No classes assigned yet
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
