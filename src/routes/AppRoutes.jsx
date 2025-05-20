import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import RoleRouter from './RoleRouter';
import ThemeInitializer from '../theme/ThemeInitializer';

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import PendingApproval from "../pages/auth/PendingApproval";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingUsers from "../pages/admin/PendingUsers";
import ManageClasses from "../pages/admin/ManageClasses";
import AdminSettings from "../pages/admin/AdminSettings";

// Teacher Pages
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherClasses from "../pages/teacher/TeacherClasses";
import TeacherAssignments from "../pages/teacher/TeacherAssignments";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentClasses from "../pages/student/StudentClasses";
import StudentAssignments from "../pages/student/StudentAssignments";

// Other Pages
import NotFound from "../pages/NotFound";

/**
 * Main routing component for the application
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/pending" 
          element={
            <ProtectedRoute requiredRole="pending">
              <PendingApproval />
            </ProtectedRoute>
          } 
        />
        
        {/* Role-based Redirect */}
        <Route path="/" element={<RoleRouter />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/pending-users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PendingUsers />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/manage-classes" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageClasses />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } 
        />
        
        {/* Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher/classes" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherClasses />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher/assignments" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherAssignments />
            </ProtectedRoute>
          } 
        />
        
        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/classes" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentClasses />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/assignments" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentAssignments />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
