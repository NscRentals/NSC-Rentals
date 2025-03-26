import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/api/reservations")
      .then((res) => {
        console.log("API Response:", res.data); // Log the data
        if (Array.isArray(res.data)) {
          setReservations(res.data);
        } else {
          console.error("Invalid data format:", res.data);
          setReservations([]); // Prevents infinite loading
        }
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
        setReservations([]); // Stops loading if API fails
      });
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reservations");
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to fetch reservations");
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    
    try {
      await axios.delete(`http://localhost:4000/api/reservations/${id}`);
      setReservations(reservations.filter(reservation => reservation._id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation");
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Reservations List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Pickup Location</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Driver Required</th>
            <th className="border p-2">Decorations</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation._id} className="border">
              <td className="border p-2">{reservation.name}</td>
              <td className="border p-2">{reservation.email}</td>
              <td className="border p-2">{reservation.rType}</td>
              <td className="border p-2">{reservation.pickupLocation}</td>
              <td className="border p-2">{reservation.startTime}</td>
              <td className="border p-2">{reservation.endTime}</td>
              <td className="border p-2">{reservation.driverReq ? "Yes" : "No"}</td>
              <td className="border p-2">{reservation.decorations ? reservation.decoType : "None"}</td>
              <td className="border p-2">
                <button 
                  onClick={() => deleteReservation(reservation._id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;