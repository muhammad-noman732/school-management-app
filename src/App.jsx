import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './redux/authSlice';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingUsers from './pages/admin/PendingUsers';
import ManageClasses from './pages/admin/ManageClasses';
import AdminSettings from './pages/admin/AdminSettings';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import PendingApproval from './pages/auth/PendingApproval';
import ProtectedRoute from './routes/ProtectedRoute';

/**
 * Main application component
 */
function App() {
  const dispatch = useDispatch();
  const { user, authChecked } = useSelector((state) => state.auth);

  // Check for current user on app load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/" />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'pending' ? (
                <Navigate to="/pending-approval" />
              ) : (
                <Navigate to={`/${user?.role}`} />
              )}
            </ProtectedRoute>
          }
        />

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
          path="/teacher/*"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Pending Approval Route */}
        <Route
          path="/pending-approval"
          element={
            <ProtectedRoute requiredRole="pending">
              <PendingApproval />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
