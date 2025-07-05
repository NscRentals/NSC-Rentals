import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserReservations = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from navigation state or fetch it
    if (location.state?.user) {
      setUserInfo(location.state.user);
    }
    fetchUserReservations();
  }, [userId]);

  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/api/reservation/reservations/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.reservation || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      toast.error("Failed to fetch user reservations");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-lg">Loading user reservations...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">User Reservations</h2>
            {userInfo && (
              <div className="mt-2 text-gray-600">
                <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Phone:</strong> {userInfo.phone}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Users
          </button>
        </div>

        {/* Reservations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-800">{reservations.length}</div>
            <div className="text-blue-600">Total Reservations</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-800">
              ${reservations.reduce((total, r) => total + parseFloat(r.amount || 0), 0).toFixed(2)}
            </div>
            <div className="text-green-600">Total Amount</div>
          </div>
        </div>

        {/* Reservations List */}
        {reservations.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-8">
            No reservations found for this user
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Reservation Details */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Reservation Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Reservation ID:</strong> {reservation._id}</p>
                      <p><strong>Created:</strong> {formatDate(reservation.createdAt)}</p>
                      <p><strong>Wanted Date:</strong> {reservation.wanteddate}</p>
                      <p><strong>Wanted Time:</strong> {reservation.wantedtime}</p>
                      <p><strong>Service:</strong> {reservation.service}</p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {reservation.name}</p>
                      <p><strong>Email:</strong> {reservation.email}</p>
                      <p><strong>Phone:</strong> {reservation.phonenumber}</p>
                      <p><strong>Address:</strong> {reservation.address}</p>
                    </div>
                  </div>

                  {/* Vehicle & Driver Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Vehicle & Driver</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Vehicle Number:</strong> {reservation.vehicleNum}</p>
                      <p><strong>Driver ID:</strong> {reservation.driverID}</p>
                      <p><strong>Amount:</strong> ${reservation.amount}</p>
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
    </div>
  );
};

export default UserReservations; 