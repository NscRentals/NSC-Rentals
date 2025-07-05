import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from '../Notification';

const DriverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(`Fetching driver with ID: ${id}`);
      const res = await axios.get(`http://localhost:4000/api/driver/${id}`);
      console.log("API Response:", res.data);
      
      if (res.data.success && res.data.driverone) {
        setDriver(res.data.driverone);
        setNotification({
          message: 'Driver profile loaded successfully',
          type: 'success'
        });
      } else {
        throw new Error(res.data.message || 'Failed to load driver profile');
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
      setError(error.response?.data?.message || 'Failed to load driver profile');
      setNotification({
        message: error.response?.data?.message || 'Failed to load driver profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/driver/delete/${id}`);
      setNotification({
        message: 'Driver deleted successfully',
        type: 'success'
      });
      setTimeout(() => {
        navigate("/drivers");
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || 'Failed to delete driver');
      setNotification({
        message: error.response?.data?.message || 'Failed to delete driver',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-lg w-full">
          {error}
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md max-w-lg w-full">
          Driver not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Notification message={notification.message} type={notification.type} />
      
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full text-center">
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {driver.DriverName.charAt(0)}
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-4">{driver.DriverName}</h2>
        <p className="text-gray-600">{driver.DriverEmail}</p>
        <div className="mt-4 text-gray-700">
          <p><strong>Address:</strong> {driver.DriverAdd}</p>
          <p><strong>Phone:</strong> {driver.DriverPhone}</p>
          <p><strong>License No:</strong> {driver.DLNo}</p>
          <p><strong>NIC No:</strong> {driver.NICNo}</p>
        </div>
        <div className="mt-6 space-y-2">
          <button 
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Driver'}
          </button>
          <button 
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition" 
            onClick={() => navigate(`/driverprofile/update/${id}`)}
          >
            Update Driver
          </button>
          <button 
            className="w-full bg-gray-400 text-white py-2 rounded-lg shadow hover:bg-gray-500 transition" 
            onClick={() => navigate("/dashboard")}
          > 
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
