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
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          `http://localhost:4000/api/reservation/reservations/user/${localStorage.getItem("userId")}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const result = await response.json();
        if (response.ok) {
          if (result.reservation && result.reservation.length > 0) {
            setReservations(result.reservation);
          } else {
            setError("No reservations found for this user");
          }
        } else {
          setError("Failed to fetch reservations");
        }
      } catch (error) {
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
        const response = await fetch(
          `http://localhost:4000/api/reservation/reservations/${reservationId}`,
          {
            method: "DELETE",
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
      const response = await fetch(
        `http://localhost:4000/api/reservation/reservations/${editingReservation._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "40px", marginTop: "-50px" }}>
      <Notification message={notification.message} type={notification.type} />

      <h2>All Reservations</h2>
      {reservations.length === 0 ? (
        <div>No reservations found.</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
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
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr
                key={reservation._id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                }}
              >
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.vehicleNum}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.name}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.email}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.wanteddate}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.service}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.locationpick}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.locationdrop}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.wantedtime}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {reservation.amount}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <span
                    onClick={() => handleEdit(reservation)}
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "18px",
                      color: "#2196f3",
                    }}
                    title="Edit"
                  >
                    ✏️
                  </span>
                  <span
                    onClick={() => handleDelete(reservation._id)}
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "red",
                    }}
                    title="Delete"
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Edit Form */}
      {isModalOpen && editingReservation && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "700px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginTop: "80px",
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: "relative",
                float: "right",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                color: "red",
              }}
            >
              X
            </button>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              Edit Reservation
            </h3>
            <form onSubmit={handleUpdate}>
              <div
                style={{ marginBottom: "10px", display: "flex", gap: "20px" }}
              >
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editingReservation.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="vehicleNum">Vehicle Number:</label>
                  <input
                    type="text"
                    id="vehicleNum"
                    name="vehicleNum"
                    value={editingReservation.vehicleNum}
                    onChange={handleChange}
                    required
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{ marginBottom: "10px", display: "flex", gap: "20px" }}
              >
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingReservation.email}
                    onChange={handleChange}
                    required
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="service">Service:</label>
                  <select
                    name="service"
                    value={editingReservation.service}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div
                style={{ marginBottom: "10px", display: "flex", gap: "20px" }}
              >
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="locationpick">Pickup Location:</label>
                  <input
                    type="text"
                    id="locationpick"
                    name="locationpick"
                    value={editingReservation.locationpick}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="locationdrop">Drop-off Location:</label>
                  <input
                    type="text"
                    id="locationdrop"
                    name="locationdrop"
                    value={editingReservation.locationdrop}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{ marginBottom: "10px", display: "flex", gap: "20px" }}
              >
                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="wantedtime">Wanted Time (hrs):</label>
                  <input
                    type="number"
                    id="wantedtime"
                    name="wantedtime"
                    value={editingReservation.wantedtime}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div style={{ flex: 1, marginBottom: "10px" }}>
                  <label htmlFor="amount">Amount (LKR):</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={editingReservation.amount}
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  width: "100%",
                }}
              >
                Update Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReservations;
