import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats } from '../../redux/authSlice';
import { fetchClassStats } from '../../redux/classSlice';
import Layout from '../../components/Layout';
import { Users, BookOpen, Clock, AlertCircle } from 'lucide-react';
import ClassAssignmentManager from '../../components/admin/ClassAssignmentManager';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const RecentActivityCard = ({ title, items, emptyMessage }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    {items.length > 0 ? (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.name || item.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.email || item.department}</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats: userStats } = useSelector((state) => state.auth);
  const { dashboardStats: classStats } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchClassStats());
  }, [dispatch]);

  return (
    <Layout requiredRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Teachers"
            value={userStats.totalTeachers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Students"
            value={userStats.totalStudents}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Active Classes"
            value={classStats.activeClasses}
            icon={BookOpen}
            color="bg-purple-500"
          />
          <StatCard
            title="Pending Approvals"
            value={userStats.totalPending}
            icon={AlertCircle}
            color="bg-yellow-500"
          />
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(classStats.departmentStats).map(([dept, count]) => (
            <div key={dept} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {dept.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Classes</p>
            </div>
          ))}
        </div>

        {/* Class Assignments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Class Assignments
          </h2>
          <ClassAssignmentManager />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityCard
            title="Recent Pending Approvals"
            items={userStats.recentPending}
            emptyMessage="No pending approvals"
          />
          <RecentActivityCard
            title="Recent Classes"
            items={classStats.recentClasses}
            emptyMessage="No recent classes"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
