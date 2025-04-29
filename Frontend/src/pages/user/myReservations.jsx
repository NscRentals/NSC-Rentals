import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header';
import { useNavigate } from 'react-router-dom';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // First, try to get user ID from localStorage
        let userId = localStorage.getItem('userId');
        
        // If userId is not in localStorage, fetch user data
        if (!userId) {
          const userResponse = await fetch('http://localhost:3000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          if (!userData._id) {
            throw new Error('User ID not found');
          }

          userId = userData._id;
          localStorage.setItem('userId', userId);
        }

        // Now fetch reservations with the user ID
        const response = await fetch(`http://localhost:3000/api/reservation/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        if (data.success) {
          setReservations(data.reservation);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReservations();
  }, [navigate]);

  const handleReservationClick = (reservation) => {
    navigate('/reservation/view', { state: { reservation } });
  };

  if (loading) return (
    <div className="p-8">
      <Header />
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <Header />
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
        
        {reservations.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded relative">
            You have no reservations yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <div 
                key={reservation._id} 
                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleReservationClick(reservation)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {reservation.vehicleNum}
                    </h2>
                    <p className="text-gray-600">
                      From: {new Date(reservation.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      To: {new Date(reservation.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Pick-up: {reservation.locationpick}
                    </p>
                    <p className="text-gray-600">
                      Drop-off: {reservation.locationdrop}
                    </p>
                    <p className="text-gray-600">
                      Type: {reservation.rType}
                    </p>
                    <p className="text-gray-600">
                      Service: {reservation.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${reservation.price}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      reservation.isVerified ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.isVerified ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyReservations; 