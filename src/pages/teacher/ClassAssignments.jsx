import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { fetchClasses } from '../../redux/classSlice';
import { createAssignment, fetchAssignments, deleteAssignment } from '../../redux/assignmentSlice';
import { FileText, Calendar, Clock, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

const ClassAssignments = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading: classesLoading, error: classesError } = useSelector((state) => state.classes);
  const { items: assignments, loading: assignmentsLoading, error: assignmentsError } = useSelector((state) => state.assignments);
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: ''
  });

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (classId && user) {
      dispatch(fetchAssignments({ classId, role: 'teacher', userId: user.id }));
    }
  }, [dispatch, classId, user]);

  // Validate if the teacher has access to this class
  const currentClass = classes?.find(cls => cls.id === classId);
  const hasAccess = currentClass?.teacherId === user?.id;

  useEffect(() => {
    if (!classesLoading && !currentClass) {
      navigate('/teacher/classes');
    }
    if (!classesLoading && currentClass && !hasAccess) {
      navigate('/teacher/classes');
    }
  }, [classesLoading, currentClass, hasAccess, navigate]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return false;
    }
    if (!formData.dueDate) {
      setFormError('Due date is required');
      return false;
    }
    if (!formData.totalMarks || formData.totalMarks <= 0) {
      setFormError('Total marks must be greater than 0');
      return false;
    }
    if (new Date(formData.dueDate) <= new Date()) {
      setFormError('Due date must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createAssignment({
        classId,
        teacherId: user.id,
        ...formData
      })).unwrap();

      setFormData({
        title: '',
        description: '',
        dueDate: '',
        totalMarks: ''
      });
      setShowForm(false);
    } catch (error) {
      setFormError('Failed to create assignment. Please try again.');
      console.error('Error creating assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await dispatch(deleteAssignment(assignmentId)).unwrap();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      // You might want to show an error message to the user here
    }
  };

  if (classesLoading || assignmentsLoading) {
    return (
      <Layout requiredRole="teacher">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading class information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (classesError || assignmentsError) {
    return (
      <Layout requiredRole="teacher">
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Error Loading Class
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {classesError || assignmentsError}
            </p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Classes
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentClass || !hasAccess) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <Layout requiredRole="teacher">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignments - {currentClass.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage assignments for your class
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Assignment
                </button>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    New Assignment
                  </h2>
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, title: e.target.value }));
                          setFormError('');
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, description: e.target.value }));
                          setFormError('');
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, dueDate: e.target.value }));
                          setFormError('');
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Marks
                      </label>
                      <input
                        type="number"
                        id="totalMarks"
                        min="1"
                        value={formData.totalMarks}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, totalMarks: e.target.value }));
                          setFormError('');
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Assignment'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormError('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Assignments List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Assignments
              </h2>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {assignment.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {assignment.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(assignment.id)}
                            className="p-1 text-red-600 hover:text-red-700 focus:outline-none"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            className="p-1 text-blue-600 hover:text-blue-700 focus:outline-none"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(assignment.dueDate).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FileText className="w-4 h-4 mr-1" />
                          {assignment.submissions?.length || 0} submissions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No assignments yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create your first assignment for this class.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassAssignments; 