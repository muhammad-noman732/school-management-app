import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Upload } from 'lucide-react';

const InstitutionSettingsForm = ({ 
  initialValues, 
  onSubmit, 
  loading, 
  error 
}) => {
  const [imageUrl, setImageUrl] = useState(initialValues?.logo || '');
  const inputRef = useRef();

  const validationSchema = Yup.object({
    institutionName: Yup.string()
      .required('Institution name is required')
      .min(3, 'Institution name must be at least 3 characters')
      .max(100, 'Institution name must not exceed 100 characters'),
    logo: Yup.string()
      .url('Invalid image URL')
      .required('Institution logo is required'),
  });

  const imageHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dfgz4koce/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const url = data.secure_url;
      setImageUrl(url);
      formik.setFieldValue('logo', url);
    } catch (error) {
      console.error('Error uploading image:', error);
      formik.setFieldError('logo', 'Failed to upload image');
    }
  };

  const formik = useFormik({
    initialValues: {
      institutionName: initialValues?.name || '',
      logo: initialValues?.logo || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Institution Name
            </label>
            <input
              type="text"
              name="institutionName"
              value={formik.values.institutionName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {formik.touched.institutionName && formik.errors.institutionName && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.institutionName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Institution Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Logo preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={imageHandler}
                  className="hidden"
                  id="logo-upload"
                  ref={inputRef}
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </label>
              </div>
            </div>
            {formik.touched.logo && formik.errors.logo && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.logo}</div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionSettingsForm; 