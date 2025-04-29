import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token) {
          navigate('/login');
          return;
        }

        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log('Fetching reservations for user:', userId);
        const response = await fetch(
          `http://localhost:4000/api/reservation/reservations/user/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const result = await response.json();
        console.log('Reservations response:', result);

        if (response.ok) {
          if (result.success && result.reservation) {
            setReservations(result.reservation);
          } else {
            setReservations([]);
            setError("No reservations found for this user");
          }
        } else {
          setError(result.message || "Failed to fetch reservations");
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError("An error occurred while fetching reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const handleDelete = async (reservationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/reservation/reservations/${reservationId}`,
          {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const result = await response.json();

        if (response.ok) {
          setReservations((prevReservations) =>
            prevReservations.filter((res) => res._id !== reservationId)
          );
          setNotification({ message: "Reservation deleted", type: "success" });
        } else {
          setError(result.message || "Failed to delete reservation");
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
        setError("An error occurred while deleting the reservation");
      }
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/reservation/reservations/${editingReservation._id}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingReservation),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setReservations((prevReservations) =>
          prevReservations.map((res) =>
            res._id === editingReservation._id ? editingReservation : res
          )
        );
        setNotification({
          message: "Reservation updated successfully",
          type: "success",
        });
        setEditingReservation(null);
        setIsModalOpen(false);
      } else {
        setError(result.message || "Failed to update reservation");
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError("An error occurred while updating the reservation");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "wantedtime") {
      updatedValue = parseFloat(value) || 0;
      const calculatedAmount = updatedValue * 100;
      setEditingReservation((prev) => ({
        ...prev,
        wantedtime: updatedValue,
        amount: calculatedAmount,
      }));
    } else {
      setEditingReservation((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="p-8">
      <Notification message={notification.message} type={notification.type} />

      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
      {reservations.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No reservations found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Vehicle Number",
                  "Name",
                  "Email",
                  "Date",
                  "Service",
                  "Pickup Location",
                  "Drop-off Location",
                  "Wanted Time (hrs)",
                  "Amount (LKR)",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.vehicleNum}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.wanteddate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.locationpick}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.locationdrop}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.wantedtime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(reservation._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Reservation</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wanted Time (hours)</label>
                  <input
                    type="number"
                    name="wantedtime"
                    value={editingReservation.wantedtime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
                  <input
                    type="text"
                    name="amount"
                    value={editingReservation.amount}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReservations;
