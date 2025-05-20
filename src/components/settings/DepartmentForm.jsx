import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, X, Building2, Hash, Activity } from 'lucide-react';

const DepartmentForm = ({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      code: initialValues?.code || '',
      status: initialValues?.status || 'active',
      description: initialValues?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Department name is required')
        .min(3, 'Department name must be at least 3 characters')
        .max(50, 'Department name must not exceed 50 characters'),
      code: Yup.string()
        .required('Department code is required')
        .matches(/^[A-Z0-9-]+$/, 'Code must contain only uppercase letters, numbers, and hyphens')
        .min(2, 'Code must be at least 2 characters')
        .max(10, 'Code must not exceed 10 characters'),
      status: Yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive'], 'Invalid status'),
      description: Yup.string()
        .max(200, 'Description must not exceed 200 characters'),
    }),
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {initialValues?.id ? 'Edit Department' : 'Add New Department'}
      </h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Department Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., Computer Science"
            />
          </div>
          {formik.touched.name && formik.errors.name && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Department Code
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., CS-2024"
            />
          </div>
          {formik.touched.code && formik.errors.code && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.code}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Brief description of the department"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.description}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formik.isValid || !formik.dirty}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : initialValues?.id ? 'Update Department' : 'Add Department'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm; 