
import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

/**
 * Role-based route redirect component
 */
const RoleRouter = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
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
};

export default RoleRouter;
