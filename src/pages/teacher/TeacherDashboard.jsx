
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/Layout';

const announcementSchema = Yup.object().shape({
  title: Yup.string().required('Announcement title is required'),
  content: Yup.string().required('Announcement content is required')
});

const TeacherDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Quiz Next Week', date: '2 days ago', content: 'There will be a quiz next Monday covering chapters 1-3.' },
    { id: 2, title: 'Office Hours Change', date: '1 week ago', content: 'My office hours will be changed to Tuesdays and Thursdays from 2-4 PM.' }
  ]);
  
  // Mock data
  const classes = [
    { 
      id: 1, 
      name: 'Mathematics 101', 
      schedule: 'Mon, Wed 10:00 AM', 
      room: 'A-101',
      studentCount: 25
    },
    { 
      id: 2, 
      name: 'Advanced Calculus', 
      schedule: 'Tue, Thu 1:00 PM', 
      room: 'A-205',
      studentCount: 18
    },
  ];
  
  const handleAddAnnouncement = (values, { resetForm }) => {
    // Add new announcement to the list
    const newAnnouncement = {
      id: Date.now(),
      title: values.title,
      content: values.content,
      date: 'Just now'
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    resetForm();
  };

  return (
    <Layout requiredRole="teacher">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Teacher Dashboard</h1>
      
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">My Profile</h2>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-500 dark:text-green-300 text-2xl font-bold">
              {user?.name?.charAt(0) || 'T'}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{user?.name || 'Teacher'}</h3>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'teacher@example.com'}</p>
            <p className="text-gray-600 dark:text-gray-300">Teacher ID: {user?.id || 'T12345'}</p>
            <p className="text-gray-600 dark:text-gray-300">Department: Mathematics</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Classes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Classes</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map(cls => (
              <div key={cls.id} className="p-5">
                <h3 className="font-medium text-gray-800 dark:text-white text-lg mb-2">{cls.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Schedule:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.schedule}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Room:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.room}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Students:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{cls.studentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Create Announcement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create Announcement</h2>
          </div>
          
          <div className="p-6">
            <Formik
              initialValues={{ title: '', content: '' }}
              validationSchema={announcementSchema}
              onSubmit={handleAddAnnouncement}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Announcement title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <Field
                      as="textarea"
                      id="content"
                      name="content"
                      rows="4"
                      placeholder="Announcement details"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Announcement'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      
      {/* Announcements */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Announcements</h2>
        
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div 
              key={announcement.id} 
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{announcement.title}</h3>
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

export default TeacherDashboard;
