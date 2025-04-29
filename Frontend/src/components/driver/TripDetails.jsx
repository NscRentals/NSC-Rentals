import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const TripDetails = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reservation/reservations/${reservationId}`);
        if (response.data.success) {
          setReservation(response.data.reservation);
        } else {
          setError('Failed to fetch reservation details');
        }
      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Failed to fetch reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!reservation) return <div className="text-center p-4">Reservation not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trip Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back to Reservations
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Name:</span> {reservation.name}</p>
              <p><span className="font-medium">Email:</span> {reservation.email}</p>
              <p><span className="font-medium">Phone:</span> {reservation.phonenumber}</p>
              <p><span className="font-medium">Address:</span> {reservation.address}</p>
            </div>
          </div>

          {/* Trip Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Date:</span> {format(new Date(reservation.wanteddate), 'MMMM dd, yyyy')}</p>
              <p><span className="font-medium">Duration:</span> {reservation.wantedtime} hours</p>
              <p><span className="font-medium">Amount:</span> Rs. {reservation.amount}</p>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Pickup Location</h3>
              <p className="mb-4">{reservation.locationpick}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.locationpick)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Open in Maps
              </a>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Dropoff Location</h3>
              <p className="mb-4">{reservation.locationdrop}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.locationdrop)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(reservation.locationpick)}&destination=${encodeURIComponent(reservation.locationdrop)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default TripDetails; 