import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const General = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        console.log("No token or userId found");
        setUserDetails(null);
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUserDetails(null);
        navigate('/login');
      } else {
        toast.error('Failed to load user details');
      }
    }
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 font-medium">Name:</label>
            <p className="text-gray-800">{userDetails.name}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">Email:</label>
            <p className="text-gray-800">{userDetails.email}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">Phone:</label>
            <p className="text-gray-800">{userDetails.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">Address:</label>
            <p className="text-gray-800">{userDetails.address || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General; 