import React, { Component } from "react";
import axios from "axios";

export default class ReservationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],  // Ensure it's an array
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Fetch all reservations when the component mounts
    axios
      .get("http://localhost:4000/api/reservations/")
      .then((res) => {
        // Check if the response data is an array before setting state
        if (Array.isArray(res.data)) {
          this.setState({
            reservations: res.data,
            loading: false,
          });
        } else {
          this.setState({
            error: "Invalid data format received",
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: error.response?.data || "Error fetching reservations",
          loading: false,
        });
      });
  }

  handleDelete = (reservationId) => {
    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete this reservation?");
    if (confirmed) {
      // Delete the reservation from the backend
      axios
        .delete(`http://localhost:4000/api/reservations/${reservationId}`)
        .then(() => {
          // Remove the deleted reservation from the state
          this.setState((prevState) => ({
            reservations: prevState.reservations.filter(
              (reservation) => reservation._id !== reservationId
            ),
          }));
          alert("Reservation deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting reservation:", error);
          alert("Error deleting reservation");
        });
    }
  };

  render() {
    const { reservations, loading, error } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin - Reservation List</h2>
          
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Reservation Type</th>
                  <th className="px-4 py-2 border">Pickup Location</th>
                  <th className="px-4 py-2 border">Start Date</th>
                  <th className="px-4 py-2 border">End Date</th>
                  <th className="px-4 py-2 border">Start Time</th>
                  <th className="px-4 py-2 border">End Time</th>
                  <th className="px-4 py-2 border">Driver Required</th>
                  <th className="px-4 py-2 border">Wedding Date</th>
                  <th className="px-4 py-2 border">Decorations</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td className="px-4 py-2 border">{reservation.name}</td>
                      <td className="px-4 py-2 border">{reservation.email}</td>
                      <td className="px-4 py-2 border">{reservation.rType}</td>
                      <td className="px-4 py-2 border">{reservation.pickupLocation}</td>
                      <td className="px-4 py-2 border">
                        {reservation.startDate || reservation.weddingDate}
                      </td>
                      <td className="px-4 py-2 border">
                        {reservation.endDate || reservation.weddingDate}
                      </td>
                      <td className="px-4 py-2 border">{reservation.startTime}</td>
                      <td className="px-4 py-2 border">{reservation.endTime}</td>
                      <td className="px-4 py-2 border">
                        {reservation.driverReq ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 border">
                        {reservation.weddingDate ? reservation.weddingDate : "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {reservation.decorations ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          onClick={() => this.handleDelete(reservation._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center px-4 py-2 border">
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}
