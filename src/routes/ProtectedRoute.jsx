
import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

/**
 * Protected route component that checks user authentication and role
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Block access for pending users (except to pending approval page)
  if (user.role === 'pending' && requiredRole !== 'pending') {
    return <Navigate to="/pending" replace />;
  }
  
  // Check for required role
  if (requiredRole && user.role !== requiredRole) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'teacher':
        return <Navigate to="/teacher" replace />;
      case 'student':
        return <Navigate to="/student" replace />;
      case 'pending':
        return <Navigate to="/pending" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
