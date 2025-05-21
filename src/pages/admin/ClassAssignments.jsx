import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { fetchUsers } from '../../redux/authSlice';
import { fetchClasses } from '../../redux/classSlice';

const ClassAssignments = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const { classes } = useSelector((state) => state.classes);
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchClasses());
  }, [dispatch]);

  const teachers = users?.filter(user => user?.role === 'teacher') || [];
  const students = users?.filter(user => user?.role === 'student') || [];

  const filteredTeachers = teachers.filter(teacher => 
    teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Class Assignments</h1>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`${
                activeTab === 'teachers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Teachers
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Students
            </button>
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === 'teachers' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher?.id}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {teacher?.name || 'Unnamed Teacher'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {teacher?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Assigned Classes
                    </h4>
                    {teacher?.classes?.length > 0 ? (
                      <div className="space-y-2">
                        {teacher.classes.map((classInfo) => (
                          <div
                            key={classInfo?.classId}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                          >
                            <span className="text-sm text-gray-900 dark:text-white">
                              {classes?.find(c => c?.id === classInfo?.classId)?.name || 'Unknown Class'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Assigned: {classInfo?.assignedAt ? new Date(classInfo.assignedAt).toLocaleDateString() : 'Unknown date'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No classes assigned
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div
                  key={student?.id}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {student?.name || 'Unnamed Student'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {student?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Enrolled Classes
                    </h4>
                    {student?.classes?.length > 0 ? (
                      <div className="space-y-2">
                        {student.classes.map((classInfo) => (
                          <div
                            key={classInfo?.classId}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                          >
                            <span className="text-sm text-gray-900 dark:text-white">
                              {classes?.find(c => c?.id === classInfo?.classId)?.name || 'Unknown Class'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Enrolled: {classInfo?.enrolledAt ? new Date(classInfo.enrolledAt).toLocaleDateString() : 'Unknown date'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Not enrolled in any classes
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClassAssignments; 