import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminVehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

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
    if (!isLoggedIn || userProfile?.type !== 'admin') {
      navigate('/login');
      return;
    }
    fetchVehicles();
  }, [isLoggedIn, userProfile, navigate, fetchVehicles]);

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
      toast.error('Failed to delete vehicle');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Not Available':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/vehicles/add')}
            className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-200"
          >
            Add New Vehicle
          </button>
          <button 
            onClick={() => navigate('/admin/vehicle-approvals')}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-200"
          >
            Pending Approvals
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
          >
            <div className="p-6 flex justify-between items-start">
              <div className="flex gap-6">
                {vehicle.vehicleImages && vehicle.vehicleImages[0] && (
                  <img
                    src={`http://localhost:4000/uploads/vehicles/${vehicle.vehicleImages[0]}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-48 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/fallback-car-image.jpg';
                    }}
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-600 mb-1">Year: {vehicle.year}</p>
                  <p className="text-gray-600 mb-1">Registration: {vehicle.registrationNumber}</p>
                  <p className="text-gray-600 mb-1">Owner Type: {vehicle.ownerType}</p>
                  <p className={`font-semibold mb-1 ${getStatusColor(vehicle.availabilityStatus)}`}>
                    Status: {vehicle.availabilityStatus}
                  </p>
                  <p className={`font-semibold ${
                    vehicle.approvalStatus === 'Approved' 
                      ? 'text-green-600' 
                      : vehicle.approvalStatus === 'Pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    Approval: {vehicle.approvalStatus}
                  </p>
                  {vehicle.approvalStatus === 'Rejected' && vehicle.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700">
                        <span className="font-semibold">Rejection Reason:</span> {vehicle.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">                <button
                  onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-200"
                >
                  Edit
                </button>
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
              </div>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            No vehicles found in the system.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehicleList;
