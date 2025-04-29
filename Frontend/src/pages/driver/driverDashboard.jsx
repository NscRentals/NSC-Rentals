import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Driver Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome, {user?.firstName || 'Driver'}!</h2>
                <p className="text-gray-600">This is your driver dashboard where you can manage your rides and profile.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Stats</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Total Rides: 0</p>
                  <p className="text-gray-600">Completed Rides: 0</p>
                  <p className="text-gray-600">Upcoming Rides: 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard; 