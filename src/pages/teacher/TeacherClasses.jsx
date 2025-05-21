import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { fetchClasses } from '../../redux/classSlice';
import { BookOpen, Users, Clock, MapPin, Calendar, FileText, Megaphone } from 'lucide-react';

const TeacherClasses = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // Filter classes assigned to the current teacher
  const teacherClasses = classes?.filter(cls => cls.teacherId === user?.id) || [];

  if (loading) {
    return (
      <Layout requiredRole="teacher">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your classes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout requiredRole="teacher">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl">Error loading classes</div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requiredRole="teacher">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Classes
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            View and manage your assigned classes
          </p>
        </div>

        {teacherClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {cls.name}
                    </h2>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cls.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {cls.department}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {cls.schedule}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      Room {cls.room}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      {cls.enrolledStudents?.length || 0} students enrolled
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/teacher/classes/${cls.id}/assignments`}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Assignments
                    </Link>
                    <Link
                      to={`/teacher/classes/${cls.id}/announcements`}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Megaphone className="w-4 h-4 mr-2" />
                      Announcements
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No classes assigned
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't been assigned to any classes yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherClasses;
