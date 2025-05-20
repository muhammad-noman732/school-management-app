import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

const DepartmentList = ({ 
  departments, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Departments
        </h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Department
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {departments.map((department) => (
            <li key={department.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-600 truncate dark:text-blue-400">
                      {department.name}
                    </p>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({department.code})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        department.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {department.status}
                    </span>
                    <button
                      onClick={() => onEdit(department)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(department.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {departments.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              No departments found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentList; 