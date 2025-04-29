import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = userProfile?.type === 'admin';

  const fetchVehicles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view vehicles');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/api/vehicles/getVehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to load vehicles');
      }
      setLoading(false);
    }
  }, [navigate, logout]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchVehicles();
  }, [isLoggedIn, navigate, fetchVehicles]);

  const handleDelete = async (id, reason) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to perform this action');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:4000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason }
      });
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to delete vehicle');
      }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <button 
          onClick={() => navigate('/vehicles/add')}
          className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-200"
        >
          Add New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
          >
            {vehicle.vehicleImages && vehicle.vehicleImages[0] && (
              <img
                src={`http://localhost:4000/uploads/vehicles/${vehicle.vehicleImages[0]}`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/fallback-car-image.jpg';
                }}
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{vehicle.make} {vehicle.model}</h3>
              <p className="text-gray-600 mb-2">Year: {vehicle.year}</p>
              <p className="text-gray-600 mb-2">Registration: {vehicle.registrationNumber}</p>
              <p className={`text-sm font-semibold mb-3 ${
                vehicle.availabilityStatus === 'Available' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {vehicle.availabilityStatus}
              </p>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                  className="bg-mylightblue text-mygreen px-4 py-2 rounded-full hover:bg-green-100 transition duration-200"
                >
                  View Details
                </button>
                {(isAdmin || vehicle.owner === userProfile?._id) && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this vehicle?')) {
                        const reason = prompt('Please provide a reason for deletion:');
                        if (reason) {
                          handleDelete(vehicle._id, reason);
                        }
                      }
                    }}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition duration-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
