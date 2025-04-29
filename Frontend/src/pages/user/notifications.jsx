import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [isLoggedIn, navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          message: 'Please log in to view notifications',
          type: 'error'
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/api/notifications/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Notification message={notification.message} type={notification.type} />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-4 rounded-lg shadow-md ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium text-gray-900">{notification.title}</p>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications; 