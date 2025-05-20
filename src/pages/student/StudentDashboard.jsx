
import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';

const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  // Mock data
  const classes = [
    { id: 1, name: 'Mathematics 101', teacher: 'Prof. Johnson', nextClass: 'Monday, 10:00 AM' },
    { id: 2, name: 'Introduction to Physics', teacher: 'Dr. Wilson', nextClass: 'Tuesday, 2:00 PM' },
    { id: 3, name: 'World History', teacher: 'Ms. Davis', nextClass: 'Monday, 1:00 PM' },
  ];
  
  const assignments = [
    { id: 1, title: 'Algebra Homework', className: 'Mathematics 101', dueDate: 'Tomorrow, 11:59 PM' },
    { id: 2, title: 'Physics Lab Report', className: 'Introduction to Physics', dueDate: 'Friday, 5:00 PM' },
    { id: 3, title: 'History Essay', className: 'World History', dueDate: 'Next Monday, 9:00 AM' },
  ];
  
  const announcements = [
    { id: 1, title: 'School Holiday', date: '1 day ago', content: 'Reminder: The school will be closed next Monday for the national holiday.' },
    { id: 2, title: 'Sports Day', date: '3 days ago', content: 'Annual sports day will be held next Friday. All students are encouraged to participate.' }
  ];

  return (
    <Layout requiredRole="student">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Student Dashboard</h1>
      
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">My Profile</h2>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{user?.name || 'Student'}</h3>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'student@example.com'}</p>
            <p className="text-gray-600 dark:text-gray-300">Student ID: {user?.id || 'S12345'}</p>
            <p className="text-gray-600 dark:text-gray-300">Role: Student</p>
          </div>
        </div>
      </div>
      
      {/* Classes and Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Classes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Classes</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map(cls => (
              <div key={cls.id} className="p-4">
                <h3 className="font-medium text-gray-800 dark:text-white">{cls.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Teacher: {cls.teacher}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Next Class: {cls.nextClass}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming Assignments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map(assignment => (
              <div key={assignment.id} className="p-4">
                <h3 className="font-medium text-gray-800 dark:text-white">{assignment.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Class: {assignment.className}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Due: {assignment.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Announcements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Announcements</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {announcements.map(announcement => (
            <div key={announcement.id} className="p-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-gray-800 dark:text-white">{announcement.title}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
