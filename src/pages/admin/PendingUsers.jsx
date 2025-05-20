import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { approveUser, fetchPendingUsers } from '../../redux/authSlice';
import Layout from '../../components/Layout';

// Validation schema for student approval
const studentApprovalSchema = Yup.object().shape({
  role: Yup.string()
    .oneOf(['student'], 'Role must be student')
    .required('Role is required'),
  batch: Yup.string()
    .required('Batch is required')
    .matches(/^\d{4}$/, 'Batch must be a 4-digit year'),
  semester: Yup.number()
    .required('Semester is required')
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot be more than 8'),
  section: Yup.string()
    .required('Section is required')
    .matches(/^[A-Z]$/, 'Section must be a single uppercase letter'),
  rollNumber: Yup.string()
    .required('Roll number is required')
    .matches(/^[A-Z]{2}\d{2}-\d{3}$/, 'Roll number must be in format: CS23-001')
});

// Validation schema for teacher approval
const teacherApprovalSchema = Yup.object().shape({
  role: Yup.string()
    .oneOf(['teacher'], 'Role must be teacher')
    .required('Role is required'),
  qualification: Yup.string()
    .required('Qualification is required')
    .min(3, 'Qualification must be at least 3 characters'),
  designation: Yup.string()
    .required('Designation is required')
    .min(3, 'Designation must be at least 3 characters'),
  employeeId: Yup.string()
    .required('Employee ID is required')
    .matches(/^TCHR-\d{4}$/, 'Employee ID must be in format: TCHR-1001')
});

const PendingUsers = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const { pendingUsers, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const studentFormik = useFormik({
    initialValues: {
      role: 'student',
      batch: '',
      semester: '',
      section: '',
      rollNumber: ''
    },
    validationSchema: studentApprovalSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(approveUser({
          userId: selectedUser.id,
          ...values
        })).unwrap();

        dispatch(fetchPendingUsers());
        setSelectedUser(null);
        setSelectedRole('');
        resetForm();
      } catch (error) {
        console.error('Approval failed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const teacherFormik = useFormik({
    initialValues: {
      role: 'teacher',
      qualification: '',
      designation: '',
      employeeId: ''
    },
    validationSchema: teacherApprovalSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(approveUser({
          userId: selectedUser.id,
          ...values
        })).unwrap();

        dispatch(fetchPendingUsers());
        setSelectedUser(null);
        setSelectedRole('');
        resetForm();
      } catch (error) {
        console.error('Approval failed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Pending Users
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Users List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
              Users Pending Approval
            </h2>
            <div className="space-y-4">
      {pendingUsers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No pending users to approve</p>
              ) : (
                pendingUsers.map(user => (
                  <div
                    key={user.id}
                    className={`border rounded-lg p-4 transition-colors duration-200 cursor-pointer
                      ${selectedUser?.id === user.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedRole('');
                    }}
                  >
                    <h3 className="font-medium text-gray-800 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Department: {user.departmentId}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Approval Form */}
          {selectedUser && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
                Approve User
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Department: {selectedUser.departmentId}
          </p>
        </div>

                {!selectedRole ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800 dark:text-white">Select Role</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedRole('student')}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h4 className="font-medium text-gray-800 dark:text-white">Student</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Assign as a student with roll number and academic details
                        </p>
                      </button>
                      <button
                        onClick={() => setSelectedRole('teacher')}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h4 className="font-medium text-gray-800 dark:text-white">Teacher</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Assign as a teacher with employee ID and professional details
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={selectedRole === 'student' ? studentFormik.handleSubmit : teacherFormik.handleSubmit}>
                    {selectedRole === 'student' ? (
                      <>
                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Batch</label>
                          <input
                            type="text"
                            name="batch"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              studentFormik.touched.batch && studentFormik.errors.batch ? "border-red-500" : "border-gray-300"
                            }`}
                            value={studentFormik.values.batch}
                            onChange={studentFormik.handleChange}
                            onBlur={studentFormik.handleBlur}
                            placeholder="e.g., 2023"
                          />
                          {studentFormik.touched.batch && studentFormik.errors.batch && (
                            <p className="text-sm text-red-500 mt-1">{studentFormik.errors.batch}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Semester</label>
                          <input
                            type="number"
                            name="semester"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              studentFormik.touched.semester && studentFormik.errors.semester ? "border-red-500" : "border-gray-300"
                            }`}
                            value={studentFormik.values.semester}
                            onChange={studentFormik.handleChange}
                            onBlur={studentFormik.handleBlur}
                            placeholder="e.g., 1"
                          />
                          {studentFormik.touched.semester && studentFormik.errors.semester && (
                            <p className="text-sm text-red-500 mt-1">{studentFormik.errors.semester}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Section</label>
                          <input
                            type="text"
                            name="section"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              studentFormik.touched.section && studentFormik.errors.section ? "border-red-500" : "border-gray-300"
                            }`}
                            value={studentFormik.values.section}
                            onChange={studentFormik.handleChange}
                            onBlur={studentFormik.handleBlur}
                            placeholder="e.g., A"
                          />
                          {studentFormik.touched.section && studentFormik.errors.section && (
                            <p className="text-sm text-red-500 mt-1">{studentFormik.errors.section}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Roll Number</label>
                          <input
                            type="text"
                            name="rollNumber"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              studentFormik.touched.rollNumber && studentFormik.errors.rollNumber ? "border-red-500" : "border-gray-300"
                            }`}
                            value={studentFormik.values.rollNumber}
                            onChange={studentFormik.handleChange}
                            onBlur={studentFormik.handleBlur}
                            placeholder="e.g., CS23-001"
                          />
                          {studentFormik.touched.rollNumber && studentFormik.errors.rollNumber && (
                            <p className="text-sm text-red-500 mt-1">{studentFormik.errors.rollNumber}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Qualification</label>
                          <input
                            type="text"
                            name="qualification"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              teacherFormik.touched.qualification && teacherFormik.errors.qualification ? "border-red-500" : "border-gray-300"
                            }`}
                            value={teacherFormik.values.qualification}
                            onChange={teacherFormik.handleChange}
                            onBlur={teacherFormik.handleBlur}
                            placeholder="e.g., Ph.D. in Computer Science"
                          />
                          {teacherFormik.touched.qualification && teacherFormik.errors.qualification && (
                            <p className="text-sm text-red-500 mt-1">{teacherFormik.errors.qualification}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Designation</label>
                          <input
                            type="text"
                            name="designation"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              teacherFormik.touched.designation && teacherFormik.errors.designation ? "border-red-500" : "border-gray-300"
                            }`}
                            value={teacherFormik.values.designation}
                            onChange={teacherFormik.handleChange}
                            onBlur={teacherFormik.handleBlur}
                            placeholder="e.g., Assistant Professor"
                          />
                          {teacherFormik.touched.designation && teacherFormik.errors.designation && (
                            <p className="text-sm text-red-500 mt-1">{teacherFormik.errors.designation}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Employee ID</label>
                          <input
                            type="text"
                            name="employeeId"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                              teacherFormik.touched.employeeId && teacherFormik.errors.employeeId ? "border-red-500" : "border-gray-300"
                            }`}
                            value={teacherFormik.values.employeeId}
                            onChange={teacherFormik.handleChange}
                            onBlur={teacherFormik.handleBlur}
                            placeholder="e.g., TCHR-1001"
                          />
                          {teacherFormik.touched.employeeId && teacherFormik.errors.employeeId && (
                            <p className="text-sm text-red-500 mt-1">{teacherFormik.errors.employeeId}</p>
                          )}
                        </div>
                      </>
                    )}

                    <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={selectedRole === 'student' ? studentFormik.isSubmitting : teacherFormik.isSubmitting}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {selectedRole === 'student' 
                          ? (studentFormik.isSubmitting ? 'Approving...' : 'Approve as Student')
                          : (teacherFormik.isSubmitting ? 'Approving...' : 'Approve as Teacher')
                        }
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setSelectedRole('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                    </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PendingUsers;
