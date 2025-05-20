
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PendingApproval = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Redirect if user is not in pending state
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'pending') {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Account Pending Approval</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your account is awaiting admin approval by the system administrator.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">What happens next?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              An administrator will review your account request and approve it. Once approved, you'll be able to access the system.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Need help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If you need assistance or have questions, please contact the school administration office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
