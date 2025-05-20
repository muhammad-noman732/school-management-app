import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchSettings, 
  updateInstitutionSettings, 
  addDepartment, 
  updateDepartment, 
  deleteDepartment, 
  updateClassSettings 
} from '../../redux/settingsSlice';
import InstitutionSettingsForm from '../../components/settings/InstitutionSettingsForm';
import DepartmentForm from '../../components/settings/DepartmentForm';
import DepartmentList from '../../components/settings/DepartmentList';
import ClassSettingsForm from '../../components/settings/ClassSettingsForm';

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { 
    institution, 
    departments, 
    classSettings, 
    loading, 
    error, 
    success 
  } = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState('institution');
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Settings updated successfully');
    }
  }, [error, success]);

  const handleInstitutionSubmit = async (values) => {
    try {
      await dispatch(updateInstitutionSettings(values));
      toast.success('Institution settings updated successfully');
    } catch (error) {
      toast.error('Failed to update institution settings');
    }
  };

  const handleDepartmentSubmit = async (values) => {
    try {
      console.log('Submitting department values:', values);
      
      if (editingDepartment && editingDepartment.id) {
        console.log('Updating department:', editingDepartment.id);
        const result = await dispatch(updateDepartment({
          id: editingDepartment.id,
          ...values
        })).unwrap();
        console.log('Update result:', result);
        toast.success('Department updated successfully');
      } else {
        console.log('Adding new department');
        const result = await dispatch(addDepartment({
          name: values.name,
          code: values.code,
          status: values.status,
          description: values.description || ''
        })).unwrap();
        console.log('Add result:', result);
        toast.success('Department added successfully');
      }
      setEditingDepartment(null);
    } catch (error) {
      console.error('Department operation failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error(error.message || 'Failed to save department');
    }
  };

  const handleDepartmentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        console.log('Deleting department:', id);
        const result = await dispatch(deleteDepartment(id)).unwrap();
        console.log('Delete result:', result);
        toast.success('Department deleted successfully');
      } catch (error) {
        console.error('Delete operation failed:', error);
        toast.error(error.message || 'Failed to delete department');
      }
    }
  };

  const handleClassSettingsSubmit = async (values) => {
    try {
      await dispatch(updateClassSettings(values));
      toast.success('Class settings updated successfully');
    } catch (error) {
      toast.error('Failed to update class settings');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your institution settings, departments, and class configurations
        </p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          {['institution', 'departments', 'classes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              } px-3 py-2 font-medium text-sm rounded-md capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800">
        {activeTab === 'institution' && (
          <InstitutionSettingsForm
            initialValues={institution}
            onSubmit={handleInstitutionSubmit}
            loading={loading}
          />
        )}

        {activeTab === 'departments' && (
          <div className="space-y-6">
            {editingDepartment ? (
              <DepartmentForm
                initialValues={editingDepartment}
                onSubmit={handleDepartmentSubmit}
                onCancel={() => setEditingDepartment(null)}
                loading={loading}
              />
            ) : (
              <DepartmentList
                departments={departments}
                onEdit={setEditingDepartment}
                onDelete={handleDepartmentDelete}
                onAdd={() => setEditingDepartment({})}
              />
            )}
          </div>
        )}

        {activeTab === 'classes' && (
          <ClassSettingsForm
            initialValues={classSettings}
            onSubmit={handleClassSettingsSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
