import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from "../../components/header";
import axios from 'axios';
import { toast } from 'react-hot-toast';

function DriverDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0
  });

  useEffect(() => {
    if (user?._id) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
      if (!user?._id) {
        toast.error('User information not available');
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/reservation/driver/${user._id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        console.log('Fetched driver reservations:', response.data);
        // Handle both possible response formats
        const reservationData = Array.isArray(response.data) ? response.data : (response.data.reservations || []);
        setReservations(reservationData);
        
        // Calculate stats
        const completed = reservationData.filter(r => r.status === 'completed').length;
        const upcoming = reservationData.filter(r => r.status === 'pending' || r.status === 'confirmed').length;
        setStats({
          total: reservationData.length,
          completed,
          upcoming
        });
      }
    } catch (error) {
      console.error('Error fetching driver reservations:', error);
      if (error.response?.status === 404) {
        toast.error('No reservations found for this driver');
        setReservations([]);
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch reservations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await axios.patch(`http://localhost:4000/api/reservation/${reservationId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      toast.success('Status updated successfully');
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const openGoogleMaps = (location) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Driver Dashboard</h1>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Rides</h2>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Completed Rides</h2>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Rides</h2>
                <p className="text-3xl font-bold text-yellow-600">{stats.upcoming}</p>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reservations</h2>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                            <div className="text-sm text-gray-500">{reservation.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reservation.vehicleModel}</div>
                            <div className="text-sm text-gray-500">{reservation.registrationNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(reservation.wanteddate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Duration: {reservation.wantedtime}h
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={reservation.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              See More
                            </button>
                            <button
                              onClick={() => openGoogleMaps(reservation.locationpick)}
                              className="text-green-600 hover:text-green-900"
                            >
                              View Location
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Reservation Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Customer Information</h4>
                  <p>Name: {selectedReservation.name}</p>
                  <p>Email: {selectedReservation.email}</p>
                  <p>Phone: {selectedReservation.phonenumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Vehicle Information</h4>
                  <p>Model: {selectedReservation.vehicleModel}</p>
                  <p>Make: {selectedReservation.vehicleMake}</p>
                  <p>Registration: {selectedReservation.registrationNumber}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Reservation Details</h4>
                <p>Date: {new Date(selectedReservation.wanteddate).toLocaleDateString()}</p>
                <p>Duration: {selectedReservation.wantedtime} hours</p>
                <p>Pick-up Location: {selectedReservation.locationpick}</p>
                <p>Drop-off Location: {selectedReservation.locationdrop}</p>
                <p>Amount: Rs. {selectedReservation.amount}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Status Update</h4>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedReservation._id, 'confirmed')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedReservation._id, 'completed')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedReservation._id, 'cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverDashboard; 