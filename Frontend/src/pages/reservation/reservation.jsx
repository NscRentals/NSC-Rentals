import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import Notification from "../../components/Notification";
import UserLayout from "../user/UserLayout";
import DecorationsSelector from '../decorations/user/DecorationsSelector';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    vehicleNum: "",
    userId: "",
    name: "",
    email: "",
    phonenumber: "",
    address: "",
    service: "",
    locationpick: "",
    locationdrop: "",
    wantedtime: "",
    amount: "",
    wanteddate: "",
    needDriver: false,
  });
  const [Data, setData] = useState({
    amount: "0",
    type: "",
    price: "",
  });
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedDecorations, setSelectedDecorations] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    if (location.state?.vehicleDetails) {
      setFormData(prev => ({
        ...prev,
        vehicleNum: location.state.vehicleDetails.registrationNumber,
        model: location.state.vehicleDetails.model
      }));
    } else if (id) {
      // Fallback: fetch vehicle details from backend
      const token = sessionStorage.getItem("token");
      fetch(`http://localhost:4000/api/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.registrationNumber) {
            setFormData(prev => ({
              ...prev,
              vehicleNum: data.registrationNumber,
              model: data.model
            }));
          }
        })
        .catch(() => {});
    }
  }, [id, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "wantedtime") {
      const time = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        wantedtime: value,
        amount: time * 100,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleNum) newErrors.vehicleNum = "Registration number is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phonenumber)
      newErrors.phonenumber = "Phone number is required.";
    if (!formData.locationpick)
      newErrors.locationpick = "Pick-up location is required.";
    if (!formData.locationdrop)
      newErrors.locationdrop = "Drop-off location is required.";
    if (!formData.wantedtime) newErrors.wantedtime = "Wanted time is required.";
    if (!formData.service) newErrors.service = "Service type is required.";
    if (!formData.wanteddate) newErrors.wanteddate = "Date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setMessage({ 
          type: "error", 
          text: "User ID not found. Please log in again." 
        });
        return;
      }
      const formDataWithUserId = {
        ...formData,
        userId: userId,
        phonenumber: formData.phonenumber.toString(),
        wantedtime: formData.wantedtime.toString(),
        amount: formData.amount.toString(),
        vehicleNum: formData.vehicleNum,
        decorations: selectedDecorations,
      };
      const response = await fetch(
        "http://localhost:4000/api/reservation/reservations",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formDataWithUserId),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setNotification({
          message: "Reservation successful",
          type: "success",
        });
        // Remove automatic PDF generation here
        navigate("/reservation/summary", { state: { reservation: formDataWithUserId } });
      } else {
        console.error("Reservation error:", result);
        setMessage({ 
          type: "error", 
          text: result.error || result.message || "Failed to create reservation. Please try again." 
        });
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      setMessage({
        type: "error",
        text: "An error occurred while creating the reservation. Please try again.",
      });
    }
  };

  const handleYesClick = () => setShowForm(true);
  const handleNoClick = () => {
    setShowForm(false);
    setData({ ...Data, type: "", price: "", amount: "0" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...Data, [name]: value };
    setData(updatedForm);

    if (name === "price") {
      updatedForm.amount = value; // Set amount = price
      setData(updatedForm);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        marginTop: "-50px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Reservation Form
      </h2>
      <Notification message={notification.message} type={notification.type} />
      {message && (
        <div
          style={{
            padding: "12px",
            backgroundColor: message.type === "success" ? "#28a745" : "#dc3545",
            color: "white",
            borderRadius: "6px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.name && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.email && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Phone Number:
            </label>
            <input
              type="number"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.phonenumber && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.phonenumber}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.address && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.address}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          {/* Registration Number (Read-only) */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Registration Number:
            </label>
            <input
              type="text"
              name="vehicleNum"
              value={formData.vehicleNum || "Not assigned"}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "#eee",
              }}
            />
            {errors.vehicleNum && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.vehicleNum}
              </div>
            )}
          </div>

          {/* Need a driver? */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Need a driver?
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label>
                <input
                  type="radio"
                  name="needDriver"
                  value={true}
                  checked={formData.needDriver === true}
                  onChange={() => setFormData(prev => ({ ...prev, needDriver: true }))}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="needDriver"
                  value={false}
                  checked={formData.needDriver === false}
                  onChange={() => setFormData(prev => ({ ...prev, needDriver: false }))}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Other Inputs (Same as before) */}

        {/* Paired Inputs */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Service Type:
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                height: "46px",
              }}
            >
              <option value="">-- Select Service --</option>
              <option value="Wedding">Wedding</option>
              <option value="Other">Other</option>
            </select>
            {errors.service && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.service}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Date:
            </label>
            <input
              type="date"
              name="wanteddate"
              value={formData.wanteddate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.wanteddate && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.wanteddate}
              </div>
            )}
          </div>
        </div>

        {/* Pickup and Drop */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Pick-up Location:
            </label>
            <input
              type="text"
              name="locationpick"
              value={formData.locationpick}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.locationpick && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.locationpick}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Drop-off Location:
            </label>
            <input
              type="text"
              name="locationdrop"
              value={formData.locationdrop}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.locationdrop && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.locationdrop}
              </div>
            )}
          </div>
        </div>

        {/* Time and Amount */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Wanted Time (hrs):
            </label>
            <input
              type="number"
              name="wantedtime"
              value={formData.wantedtime}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {errors.wantedtime && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.wantedtime}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Amount (Rs.):
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount || "0"}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "#eee",
              }}
            />
          </div>
        </div>

        {/* Move DecorationsSelector up for visibility */}
        <DecorationsSelector selectedDecorations={selectedDecorations} setSelectedDecorations={setSelectedDecorations} />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
