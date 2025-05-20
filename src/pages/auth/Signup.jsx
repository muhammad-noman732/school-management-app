import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../redux/authSlice';

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['student', 'teacher'], 'Please select a valid role')
    .required('Role is required'),
  departmentId: Yup.string()
    .required('Department is required')
    .min(2, 'Department must be at least 2 characters')
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      departmentId: ''
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          departmentId: values.departmentId
        })).unwrap();
        
        navigate('/pending-approval');
        resetForm();
      } catch (err) {
        console.error('Registration failed:', err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create an Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your full name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Role</label>
          <select
            name="role"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.role && formik.errors.role ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.role}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Department</label>
          <input
            type="text"
            name="departmentId"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.departmentId && formik.errors.departmentId ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.departmentId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g., Computer Science"
          />
          {formik.touched.departmentId && formik.errors.departmentId && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.departmentId}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm your password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || formik.isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
