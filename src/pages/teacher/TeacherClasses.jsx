
import React from 'react';
import Layout from '../../components/Layout';

const TeacherClasses = () => {
  // Mock data for teacher classes
  const classes = [
    { 
      id: 1, 
      name: 'Mathematics 101', 
      schedule: 'Mon, Wed 10:00 AM', 
      room: 'A-101',
      students: [
        'Alice Brown', 
        'Bob Smith', 
        'Carol Davis'
      ] 
    },
    { 
      id: 2, 
      name: 'Advanced Calculus', 
      schedule: 'Tue, Thu 1:00 PM', 
      room: 'A-205',
      students: [
        'Dave Miller', 
        'Emma Clark', 
        'Frank Thomas',
        'Grace Lee'
      ] 
    },
  ];

  return (
    <Layout requiredRole="teacher">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Classes</h1>
      
      <div className="grid gap-8">
        {classes.map((cls) => (
          <div 
            key={cls.id} 
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{cls.name}</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-medium">Schedule:</span> {cls.schedule}
                </div>
                <div>
                  <span className="font-medium">Room:</span> {cls.room}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Enrolled Students ({cls.students.length})</h3>
              <ul className="list-disc list-inside pl-2 space-y-1 text-gray-600 dark:text-gray-300">
                {cls.students.map((student, index) => (
                  <li key={index}>{student}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default TeacherClasses;
