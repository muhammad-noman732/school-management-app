import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { fetchClasses } from '../../redux/classSlice';
import { createAnnouncement, fetchAnnouncements, deleteAnnouncement } from '../../redux/announcementSlice';
import { Megaphone, Calendar, Clock, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

const ClassAnnouncements = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading: classesLoading, error: classesError } = useSelector((state) => state.classes);
  const { items: announcements, loading: announcementsLoading, error: announcementsError } = useSelector((state) => state.announcements);
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (classId && user) {
      dispatch(fetchAnnouncements({ classId, role: 'teacher', userId: user.id }));
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

  const validateAnnouncement = () => {
    if (!announcementText.trim()) {
      setFormError('Announcement text is required');
      return false;
    }
    if (announcementText.length < 10) {
      setFormError('Announcement must be at least 10 characters long');
      return false;
    }
    if (announcementText.length > 500) {
      setFormError('Announcement cannot exceed 500 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateAnnouncement()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createAnnouncement({
        classId,
        teacherId: user.id,
        text: announcementText
      })).unwrap();

      setAnnouncementText('');
      setShowForm(false);
    } catch (error) {
      setFormError('Failed to create announcement. Please try again.');
      console.error('Error creating announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (announcementId) => {
    try {
      await dispatch(deleteAnnouncement(announcementId)).unwrap();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      // You might want to show an error message to the user here
    }
  };

  if (classesLoading || announcementsLoading) {
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

  if (classesError || announcementsError) {
    return (
      <Layout requiredRole="teacher">
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Error Loading Class
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {classesError || announcementsError}
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
            Announcements - {currentClass.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage announcements for your class
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcement Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Announcement
                </button>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    New Announcement
                  </h2>
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="announcement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Announcement
                      </label>
                      <textarea
                        id="announcement"
                        rows="4"
                        value={announcementText}
                        onChange={(e) => {
                          setAnnouncementText(e.target.value);
                          setFormError('');
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your announcement here..."
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {announcementText.length}/500 characters
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Announcement'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormError('');
                          setAnnouncementText('');
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

          {/* Announcements List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Announcements
              </h2>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {announcement.text}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(announcement.id)}
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
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(announcement.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No announcements yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create your first announcement for this class.
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

export default ClassAnnouncements; 