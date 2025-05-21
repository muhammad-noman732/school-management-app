import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchClasses } from '../../redux/classSlice';
import { fetchUsers } from '../../redux/authSlice';
import { assignTeacherToClass, assignStudentToClass } from '../../redux/classSlice';

const ClassAssignmentManager = () => {
  const dispatch = useDispatch();
  const { classes, loading } = useSelector((state) => state.classes);
  const { users } = useSelector((state) => state.auth);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [activeTab, setActiveTab] = useState('teacher');

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users by role
  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');

  const handleTeacherAssignment = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedTeacher) {
      toast.error('Please select both class and teacher');
      return;
    }

    try {
      await dispatch(assignTeacherToClass({
        classId: selectedClass,
        teacherId: selectedTeacher
      })).unwrap();
      
      toast.success('Teacher assigned successfully');
      setSelectedClass('');
      setSelectedTeacher('');
    } catch (error) {
      toast.error(error.message || 'Failed to assign teacher');
    }
  };

  const handleStudentAssignment = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudent) {
      toast.error('Please select both class and student');
      return;
    }

    try {
      await dispatch(assignStudentToClass({
        classId: selectedClass,
        studentId: selectedStudent
      })).unwrap();
      
      toast.success('Student assigned successfully');
      setSelectedClass('');
      setSelectedStudent('');
    } catch (error) {
      toast.error(error.message || 'Failed to assign student');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`pb-2 px-4 ${
              activeTab === 'teacher'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assign Teacher
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`pb-2 px-4 ${
              activeTab === 'student'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assign Student
          </button>
        </div>
      </div>

      {activeTab === 'teacher' ? (
        <form onSubmit={handleTeacherAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.department}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedClass || !selectedTeacher}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Teacher'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleStudentAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedClass || !selectedStudent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Student'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassAssignmentManager; 