import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSearch } from 'react-icons/fa';

const DriverReservations = ({ driverId }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reservation/driver/${driverId}`);
        
        if (response.data.success) {
          setReservations(response.data.reservations);
          setFilteredReservations(response.data.reservations);
        } else {
          setError('Failed to fetch reservations');
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [driverId]);

  useEffect(() => {
    // Filter reservations based on search term, date, and status
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(res => 
        format(new Date(res.startDate), 'yyyy-MM-dd') === dateFilter
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(res => 
        res.status === statusFilter
      );
    }

    setFilteredReservations(filtered);
  }, [searchTerm, dateFilter, statusFilter, reservations]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('');
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const handleNavigateToLocation = (location) => {
    // Open Google Maps with the location
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleStatusChange = (reservation, newStatus) => {
    setStatusToUpdate({ reservation, newStatus });
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const { reservation, newStatus } = statusToUpdate;
      
      // Create update data with the reservation data
      const updateData = {
        ...reservation,
        tripStatus: newStatus,
        status: newStatus === 'trip_finished' ? 'completed' : reservation.status
      };

      // If the new status is trip_started, record the current time
      if (newStatus === 'trip_started') {
        const now = new Date();
        const formattedTime = format(now, 'hh:mm a'); // Format: 01:30 PM
        updateData.startTime = formattedTime;
      }

      console.log('Updating reservation with data:', updateData);

      const response = await axios.put(`http://localhost:4000/api/reservation/${reservation._id}`, updateData);

      if (response.data.success) {
        // Update the local state with the new statuses and start time
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res._id === reservation._id ? { 
              ...res, 
              tripStatus: newStatus,
              status: newStatus === 'trip_finished' ? 'completed' : res.status,
              startTime: newStatus === 'trip_started' ? updateData.startTime : res.startTime
            } : res
          )
        );

        setShowConfirmModal(false);
        setStatusToUpdate(null);
      } else {
        throw new Error('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'trip_started';
      case 'trip_started':
        return 'trip_finished';
      default:
        return currentStatus;
    }
  };

  const getStatusButtonText = (status) => {
    switch (status) {
      case 'pending':
        return 'Start Trip';
      case 'trip_started':
        return 'Finish Trip';
      case 'trip_finished':
        return 'Trip Completed';
      default:
        return 'Update Status';
    }
  };

  const getStatusButtonClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'trip_started':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'trip_finished':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'trip_started':
        return 'bg-blue-100 text-blue-800';
      case 'trip_finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Date Filter */}
          <div className="w-full md:w-48">
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateFilter}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || dateFilter || statusFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dropoff
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trip Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(reservation.startDate), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.startTime || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.wantedtime} hours</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.locationpick}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.locationdrop}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                      {reservation.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(reservation, getNextStatus(reservation.tripStatus || 'pending'))}
                      disabled={reservation.tripStatus === 'trip_finished'}
                      className={`px-3 py-1 text-sm text-white rounded-md ${getStatusButtonClass(reservation.tripStatus || 'pending')} ${
                        reservation.tripStatus === 'trip_finished' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {getStatusButtonText(reservation.tripStatus || 'pending')}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(reservation)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for reservation details */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Reservation Details</h3>
              <div className="mt-2 px-7 py-3">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.email}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.phonenumber}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(selectedReservation.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReservation.startTime || 'Not specified'}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(selectedReservation.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.wantedtime} hours</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.locationpick}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Dropoff Location</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.locationdrop}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.status || 'pending'}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Trip Status</p>
                  <p className="text-sm font-medium text-gray-900">{selectedReservation.tripStatus || 'pending'}</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleNavigateToLocation(selectedReservation.locationpick)}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Navigate to Pickup
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && statusToUpdate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Confirm Status Change</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to change the trip status to "{statusToUpdate.newStatus.replace('_', ' ')}"?
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={confirmStatusChange}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setStatusToUpdate(null);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
};

export default DriverReservations; 