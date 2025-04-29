import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaInfoCircle } from 'react-icons/fa';

const DriverReservations = ({ driverId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log('Fetching reservations for driver:', driverId);
        const response = await axios.get(`http://localhost:4000/api/reservation/reservations/driver/${driverId}`);
        console.log('Reservations response:', response.data);
        
        if (response.data.success) {
          setReservations(response.data.reservations || []);
        } else {
          setError(response.data.message || 'Failed to fetch reservations');
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchReservations();
    } else {
      setError('Driver ID not found');
      setLoading(false);
    }
  }, [driverId]);

  const handleShowDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowTripModal(true);
  };

  const closeTripModal = () => {
    setShowTripModal(false);
    setSelectedReservation(null);
  };

  const handleStartTrip = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/reservation/reservations/${selectedReservation._id}`,
        { status: 'trip started' }
      );

      if (response.data.success) {
        // Update the local state to reflect the new status
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res._id === selectedReservation._id
              ? { ...res, status: 'trip started' }
              : res
          )
        );
        closeTripModal();
      } else {
        setError('Failed to update trip status');
      }
    } catch (err) {
      console.error('Error updating trip status:', err);
      setError(err.response?.data?.message || 'Failed to update trip status');
    }
  };

  const handleCompleteTrip = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/reservation/reservations/${selectedReservation._id}`,
        { status: 'completed' }
      );

      if (response.data.success) {
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res._id === selectedReservation._id
              ? { ...res, status: 'completed' }
              : res
          )
        );
        setShowCompletionModal(false);
        closeTripModal();
      } else {
        setError('Failed to complete trip');
      }
    } catch (err) {
      console.error('Error completing trip:', err);
      setError(err.response?.data?.message || 'Failed to complete trip');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading reservations...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reservations found.</p>
      ) : (
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
                    <div className="text-sm text-gray-900">
                      {format(new Date(reservation.wanteddate), 'MMM dd, yyyy')}
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reservation.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : reservation.status === 'trip started'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleShowDetails(reservation)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaInfoCircle className="mr-2" />
                      More Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trip Details Modal */}
      {showTripModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Trip Details</h3>
              <div className="mt-2 px-7 py-3">
                <div className="text-sm text-gray-500 text-left">
                  <p className="font-semibold">Customer Information:</p>
                  <p>Name: {selectedReservation.name}</p>
                  <p>Email: {selectedReservation.email}</p>
                  <p>Phone: {selectedReservation.phonenumber}</p>
                  <p>Address: {selectedReservation.address}</p>
                  
                  <p className="font-semibold mt-4">Trip Information:</p>
                  <p>Date: {format(new Date(selectedReservation.wanteddate), 'MMMM dd, yyyy')}</p>
                  <p>Duration: {selectedReservation.wantedtime} hours</p>
                  <p>Pickup: {selectedReservation.locationpick}</p>
                  <p>Dropoff: {selectedReservation.locationdrop}</p>
                  <p>Amount: Rs. {selectedReservation.amount}</p>
                </div>
              </div>
              <div className="items-center px-4 py-3 space-y-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReservation.locationpick)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                >
                  Open Pickup Location in Maps
                </a>
                {selectedReservation.status !== 'completed' && selectedReservation.status !== 'cancelled' && selectedReservation.status !== 'trip started' && (
                  <button
                    onClick={handleStartTrip}
                    className="block w-full px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Start Trip
                  </button>
                )}
                {selectedReservation.status === 'trip started' && (
                  <button
                    onClick={() => setShowCompletionModal(true)}
                    className="block w-full px-4 py-2 bg-purple-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    Complete Trip
                  </button>
                )}
                <button
                  onClick={closeTripModal}
                  className="block w-full px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Trip Completion</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to mark this trip as completed? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3 space-y-3">
                <button
                  onClick={handleCompleteTrip}
                  className="block w-full px-4 py-2 bg-purple-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Yes, Complete Trip
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="block w-full px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverReservations; 