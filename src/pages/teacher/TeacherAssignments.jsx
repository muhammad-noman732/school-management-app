
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/Layout';

const assignmentSchema = Yup.object().shape({
  title: Yup.string().required('Assignment title is required'),
  class: Yup.string().required('Please select a class'),
  dueDate: Yup.date().required('Due date is required').min(new Date(), 'Due date must be in the future'),
  description: Yup.string().required('Assignment description is required')
});

const TeacherAssignments = () => {
  // Mock data for classes
  const classes = [
    { id: 1, name: 'Mathematics 101' },
    { id: 2, name: 'Advanced Calculus' }
  ];
  
  // Mock data for assignments
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: 'Matrix Operations Quiz', 
      class: 'Mathematics 101', 
      dueDate: '2025-06-15', 
      description: 'Online quiz covering matrix addition, subtraction, and multiplication.',
      createdAt: '2025-05-10'
    },
    { 
      id: 2, 
      title: 'Differential Equations Problem Set', 
      class: 'Advanced Calculus', 
      dueDate: '2025-06-10', 
      description: 'Complete problems 1-15 in Chapter 7.',
      createdAt: '2025-05-05'
    },
    { 
      id: 3, 
      title: 'Midterm Review', 
      class: 'Mathematics 101', 
      dueDate: '2025-06-20', 
      description: 'Review packet for upcoming midterm examination.',
      createdAt: '2025-05-12'
    }
  ]);
  
  // Handle form submission
  const handleCreateAssignment = (values, { resetForm }) => {
    const newAssignment = {
      id: Date.now(),
      title: values.title,
      class: values.class,
      dueDate: values.dueDate,
      description: values.description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAssignments([newAssignment, ...assignments]);
    resetForm();
    alert('Assignment created successfully!');
  };
  
  return (
    <Layout requiredRole="teacher">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Assignments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Assignment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Assignment</h2>
          
          <Formik
            initialValues={{
              title: '',
              class: '',
              dueDate: '',
              description: ''
            }}
            validationSchema={assignmentSchema}
            onSubmit={handleCreateAssignment}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assignment Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class
                  </label>
                  <Field
                    as="select"
                    id="class"
                    name="class"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="class" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <Field
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Assignments List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Existing Assignments</h2>
          
          <div className="space-y-4">
            {assignments.map(assignment => (
              <div 
                key={assignment.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{assignment.title}</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Class:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.class}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Due Date:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.dueDate}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-300">Created:</span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{assignment.createdAt}</span>
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{assignment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherAssignments;
