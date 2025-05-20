
import React from 'react';
import Layout from '../../components/Layout';

const StudentClasses = () => {
  // Mock data for student classes
  const classes = [
    { id: 1, name: 'Mathematics 101', teacher: 'Prof. Johnson', schedule: 'Mon, Wed 10:00 AM', room: 'A-101' },
    { id: 2, name: 'Introduction to Physics', teacher: 'Dr. Wilson', schedule: 'Tue, Thu 2:00 PM', room: 'B-203' },
    { id: 3, name: 'World History', teacher: 'Ms. Davis', schedule: 'Mon, Fri 1:00 PM', room: 'C-105' },
  ];

  return (
    <Layout requiredRole="student">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Classes</h1>
      
      <div className="grid gap-6">
        {classes.map((cls) => (
          <div 
            key={cls.id} 
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{cls.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Teacher:</span> 
                <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.teacher}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Schedule:</span> 
                <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.schedule}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Room:</span> 
                <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default StudentClasses;
