import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Notification from '../../components/Notification';

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const { userProfile, isLoggedIn, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const fetchMyVehicles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          message: 'Please log in to view your vehicles',
          type: 'error'
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/api/vehicles/user/my-vehicles', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        setNotification({
          message: 'Invalid data format received from server',
          type: 'error'
        });
        return;
      }

      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error.response || error);
      if (error.response?.status === 401) {
        setNotification({
          message: 'Session expired. Please log in again.',
          type: 'error'
        });
        logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        setNotification({
          message: 'You do not have permission to view vehicles.',
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Failed to load vehicles: ' + (error.response?.data?.message || error.message),
          type: 'error'
        });
      }
      setLoading(false);
    }
  }, [navigate, logout]);

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchMyVehicles();
  }, [isLoggedIn, isLoading, navigate, fetchMyVehicles]);

  const sendNotification = async (title, message) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post('http://localhost:4000/api/notifications', {
        title,
        message,
        type: 'vehicle'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleDelete = async (id, reason) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          message: 'Please log in to perform this action',
          type: 'error'
        });
        navigate('/login');
        return;
      }

      const response = await axios.delete(`http://localhost:4000/api/vehicles/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { reason }
      });

      // Send notification for vehicle deletion
      await sendNotification(
        'Vehicle Deleted',
        `Your vehicle has been deleted. Reason: ${reason}`
      );

      setNotification({
        message: 'Vehicle deleted successfully',
        type: 'success'
      });
      fetchMyVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      if (error.response?.status === 401) {
        setNotification({
          message: 'Session expired. Please log in again.',
          type: 'error'
        });
        logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        setNotification({
          message: 'You do not have permission to delete vehicles.',
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Failed to delete vehicle: ' + (error.response?.data?.message || error.message),
          type: 'error'
        });
      }
    }
  };

  const handleDamageReport = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          message: 'Please log in to perform this action',
          type: 'error'
        });
        navigate('/login');
        return;
      }

      // Send notification for damage report
      await sendNotification(
        'Damage Report Submitted',
        `A damage report has been submitted for your vehicle. Please check the details.`
      );

      navigate(`/damage-request/new/${vehicleId}`);
    } catch (error) {
      console.error('Error reporting damage:', error);
      if (error.response?.status === 401) {
        setNotification({
          message: 'Session expired. Please log in again.',
          type: 'error'
        });
        logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        setNotification({
          message: 'You do not have permission to submit damage reports.',
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Failed to submit damage report: ' + (error.response?.data?.message || error.message),
          type: 'error'
        });
      }
    }
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (reason) => {
    if (selectedVehicle && reason) {
      await handleDelete(selectedVehicle._id, reason);
      setSelectedVehicle(null);
      setIsDeleteModalOpen(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
        <button 
          onClick={() => navigate('/vehicles/add')}
          className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-200"
        >
          Add New Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">You haven't added any vehicles yet.</p>
          <p className="mt-2 text-gray-500">
            Start by adding your first vehicle using the button above.
          </p>
        </div>
      ) : (
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
                  Status: {vehicle.availabilityStatus}
                </p>
                <p className={`text-sm font-semibold mb-3 ${
                  vehicle.approvalStatus === 'Approved' 
                    ? 'text-green-600' 
                    : vehicle.approvalStatus === 'Pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  Approval: {vehicle.approvalStatus}
                </p>
                {vehicle.approvalStatus === 'Rejected' && vehicle.rejectionReason && (
                  <div className="mt-2 mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">
                      <span className="font-semibold">Rejection Reason:</span> {vehicle.rejectionReason}
                    </p>
                  </div>
                )}                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                        className="bg-mylightblue text-mygreen px-4 py-2 rounded-full hover:bg-green-100 transition duration-200"
                      >
                        View Details
                      </button>
                      {vehicle.availabilityStatus !== 'Under Maintenance' && (
                        <button
                          onClick={() => handleDamageReport(vehicle._id)}
                          className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full hover:bg-yellow-100 transition duration-200"
                        >
                          Report Damage
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(vehicle)}
                        className="bg-red-50 text-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Vehicle'}`}
      />
    </div>
  );
}

export default MyVehicles;
