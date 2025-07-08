import React, { useEffect, useState } from "react";
import Notification from "../../components/Notification";

const UserViewReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
          setError("You must be logged in to view reservations.");
          setLoading(false);
          return;
        }
        const response = await fetch(
          `http://localhost:4000/api/reservation/reservations/user/${userId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const result = await response.json();
        if (response.ok && result.reservation) {
          setReservations(result.reservation);
        } else {
          setError("Failed to fetch reservations.");
        }
      } catch (err) {
        setError("An error occurred while fetching reservations.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-white text-black">
      <Notification message={error} type={error ? 'error' : ''} />
      <h2 className="text-3xl font-bold mb-8 text-center">My Reservations</h2>
      {loading ? (
        <div className="text-center text-lg">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-8">
          No reservations found.
        </div>
      ) : (
        <div className="space-y-8 max-w-3xl mx-auto">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="bg-gray-50 rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reservation Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reservation Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Reservation ID:</strong> {reservation._id}</p>
                    <p><strong>Created:</strong> {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : '-'}</p>
                    <p><strong>Wanted Date:</strong> {reservation.wanteddate}</p>
                    <p><strong>Wanted Time:</strong> {reservation.wantedtime}</p>
                    <p><strong>Service:</strong> {reservation.service}</p>
                  </div>
                </div>
                {/* Vehicle & Driver Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vehicle & Driver</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Vehicle Number:</strong> {reservation.vehicleNum}</p>
                    <p><strong>Driver ID:</strong> {reservation.driverID}</p>
                    <p><strong>Amount:</strong> Rs. {reservation.amount}</p>
                  </div>
                </div>
              </div>
              {/* Location Details */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Location Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Pickup Location:</strong></p>
                    <p>{reservation.locationpick}</p>
                  </div>
                  <div>
                    <p><strong>Drop Location:</strong></p>
                    <p>{reservation.locationdrop}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserViewReservation;
