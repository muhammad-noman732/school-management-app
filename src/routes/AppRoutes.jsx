import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherClasses from '../pages/teacher/TeacherClasses';
import TeacherClassAssignments from '../pages/teacher/ClassAssignments';
import ClassAnnouncements from '../pages/teacher/ClassAnnouncements';
import TeacherProfile from '../pages/teacher/TeacherProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher" />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:classId/assignments" element={<TeacherClassAssignments />} />
        <Route path="classes/:classId/announcements" element={<ClassAnnouncements />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
