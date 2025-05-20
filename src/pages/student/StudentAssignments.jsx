
import React, { useState } from 'react';
import Layout from '../../components/Layout';

const StudentAssignments = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock data
  const upcomingAssignments = [
    { id: 1, title: 'Algebra Homework', class: 'Mathematics 101', dueDate: 'Tomorrow, 11:59 PM', status: 'Not Started' },
    { id: 2, title: 'Physics Lab Report', class: 'Introduction to Physics', dueDate: 'Friday, 5:00 PM', status: 'In Progress' },
    { id: 3, title: 'History Essay', class: 'World History', dueDate: 'Next Monday, 9:00 AM', status: 'Not Started' },
  ];
  
  const completedAssignments = [
    { id: 4, title: 'English Literature Review', class: 'English 101', dueDate: 'Last Monday', status: 'Completed', grade: 'A' },
    { id: 5, title: 'Biology Diagram Assignment', class: 'Biology', dueDate: 'Last Wednesday', status: 'Completed', grade: 'B+' },
    { id: 6, title: 'Chemistry Problem Set', class: 'Chemistry', dueDate: '2 weeks ago', status: 'Completed', grade: 'A-' },
  ];
  
  const renderAssignmentList = (assignments, showGrade = false) => (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No assignments found</p>
      ) : (
        assignments.map(assignment => (
          <div key={assignment.id} className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{assignment.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Class:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.class}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Due:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.dueDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`ml-2 ${getStatusColor(assignment.status)}`}>{assignment.status}</span>
              </div>
              {showGrade && assignment.grade && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-300">Grade:</span>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.grade}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started':
        return 'text-red-500 dark:text-red-400';
      case 'In Progress':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'Completed':
        return 'text-green-500 dark:text-green-400';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <Layout requiredRole="student">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Assignments</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 text-center ${activeTab === 'upcoming' 
            ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`py-2 px-4 text-center ${activeTab === 'completed' 
            ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>
      
      {/* Assignments List */}
      {activeTab === 'upcoming' && renderAssignmentList(upcomingAssignments)}
      {activeTab === 'completed' && renderAssignmentList(completedAssignments, true)}
    </Layout>
  );
};

export default StudentAssignments;
