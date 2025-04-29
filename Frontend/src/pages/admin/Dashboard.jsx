import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // Refresh activities every minute
    const interval = setInterval(fetchActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch user activities');
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent User Activities</h2>
          
          <div className="space-y-6">
            {activities.map((activity) => (
              <div 
                key={activity._id} 
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.activityType === 'login' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-lg">
                      <span className="font-medium">{activity.firstName} {activity.lastName}</span>
                      <span className="text-gray-600">
                        {activity.activityType === 'login' ? ' logged in' : ' logged out'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.email}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No recent activities
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 