import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // More detailed token log
        
        if (!token) {
          console.log('No token found in localStorage'); // Log when token is missing
          setError('Please login to view your reservations');
          setLoading(false);
          return;
        }

        console.log('Making API request to:', 'http://localhost:4000/api/reservations/my-reservations');
        const response = await axios.get('http://localhost:4000/api/reservations/my-reservations', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Full API Response:', response); // Log full response
        console.log('Response data:', response.data); // Log response data
        
        if (response.data.success) {
          console.log('Setting reservations:', response.data.data); // Log reservations being set
          setReservations(response.data.data || []);
        } else {
          console.log('API returned error:', response.data.message); // Log API error
          setError(response.data.message || 'Error fetching reservations');
        }
        setLoading(false);
      } catch (err) {
        console.error('Full error object:', err); // Log full error object
        console.error('Error response data:', err.response?.data); // Log error response data
        console.error('Error status:', err.response?.status); // Log error status
        setError(err.response?.data?.message || err.message || 'Error fetching reservations');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePayNow = (reservation) => {
    navigate('/user/make-payment', { state: { reservation } });
  };

  if (loading) return (
    <div className="p-8 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
      
      {reservations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-600 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reservations Found</h3>
          <p className="text-gray-600">You haven't made any reservations yet. Start by browsing our available vehicles.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Reservation #{reservation.rId}</h3>
                  <p className="text-gray-200">Vehicle: {reservation.vehicleNum}</p>
                  <p className="text-gray-200">Service: {reservation.service}</p>
                  <p className="text-gray-200">Type: {reservation.rType}</p>
                </div>
                <div>
                  <p className="text-gray-200">Pickup: {reservation.locationpick}</p>
                  <p className="text-gray-200">Drop-off: {reservation.locationdrop}</p>
                  <p className="text-gray-200">Start: {new Date(reservation.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-200">End: {new Date(reservation.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-white">Price: ${reservation.price}</p>
                  <p className={`text-sm ${reservation.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                    {reservation.isPaid ? 'Paid' : 'Payment Pending'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-sm ${reservation.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {reservation.isVerified ? 'Verified' : 'Pending Verification'}
                  </p>
                  {!reservation.isPaid && (
                    <button
                      onClick={() => handlePayNow(reservation)}
                      className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 