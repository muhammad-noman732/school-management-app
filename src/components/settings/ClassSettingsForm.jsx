import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save } from 'lucide-react';

const ClassSettingsForm = ({ 
  initialValues, 
  onSubmit, 
  loading 
}) => {
  const formik = useFormik({
    initialValues: {
      maxStudentsPerClass: initialValues?.maxStudentsPerClass || 30,
      defaultClassDuration: initialValues?.defaultClassDuration || 60,
      defaultStatus: initialValues?.defaultStatus || 'active',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      maxStudentsPerClass: Yup.number()
        .required('Maximum students is required')
        .min(1, 'Must be at least 1')
        .max(100, 'Cannot exceed 100'),
      defaultClassDuration: Yup.number()
        .required('Class duration is required')
        .min(15, 'Must be at least 15 minutes')
        .max(180, 'Cannot exceed 180 minutes'),
      defaultStatus: Yup.string().required('Default status is required'),
    }),
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Maximum Students per Class
        </label>
        <input
          type="number"
          name="maxStudentsPerClass"
          value={formik.values.maxStudentsPerClass}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.maxStudentsPerClass && formik.errors.maxStudentsPerClass && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.maxStudentsPerClass}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Default Class Duration (minutes)
        </label>
        <input
          type="number"
          name="defaultClassDuration"
          value={formik.values.defaultClassDuration}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.defaultClassDuration && formik.errors.defaultClassDuration && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.defaultClassDuration}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Default Class Status
        </label>
        <select
          name="defaultStatus"
          value={formik.values.defaultStatus}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Class Settings'}
        </button>
      </div>
    </form>
  );
};

export default ClassSettingsForm; 