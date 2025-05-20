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
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInstitutionSubmit = async (values) => {
    try {
      await dispatch(updateInstitutionSettings(values)).unwrap();
      toast.success('Institution settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update institution settings');
    }
  };

  const handleDepartmentSubmit = async (values) => {
    try {
      console.log('Submitting department values:', values);
      
      if (editingDepartment && editingDepartment.id) {
        console.log('Updating department:', editingDepartment.id);
        await dispatch(updateDepartment({
          id: editingDepartment.id,
          ...values
        })).unwrap();
        toast.success('Department updated successfully');
      } else {
        console.log('Adding new department');
        await dispatch(addDepartment({
          name: values.name,
          code: values.code,
          status: values.status,
          description: values.description || ''
        })).unwrap();
        toast.success('Department added successfully');
      }
      setEditingDepartment(null);
    } catch (error) {
      console.error('Department operation failed:', error);
      toast.error(error.message || 'Failed to save department');
    }
  };

  const handleDepartmentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete department');
      }
    }
  };

  const handleClassSettingsSubmit = async (values) => {
    try {
      await dispatch(updateClassSettings(values)).unwrap();
      toast.success('Class settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update class settings');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNavbar onMenuClick={toggleSidebar} />
      
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
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
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
