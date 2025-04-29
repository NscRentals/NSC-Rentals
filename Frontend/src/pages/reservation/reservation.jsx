import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import Notification from "../../components/Notification";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    vehicleNum: "{id}",
    userId: "",
    driverID: "",
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
  });
  const [Data, setData] = useState({
    amount: "0",
    type: "",
    price: "",
  });
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    if (location.state?.vehicleDetails) {
      setFormData(prev => ({
        ...prev,
        vehicleNum: location.state.vehicleDetails.vehicleNum,
        model: location.state.vehicleDetails.model,
        registrationNumber: location.state.vehicleDetails.registrationNumber
      }));
    }

    fetchDrivers();
  }, [id, navigate, location.state]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/driver");
      const result = await response.json();
      if (result.success) {
        setDrivers(result.posts);
      } else {
        console.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

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
    if (!formData.driverID)
      newErrors.driverID = "Driver selection is required.";
    if (!formData.wanteddate) newErrors.wanteddate = "Date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage({ 
          type: "error", 
          text: "User ID not found. Please log in again." 
        });
        return;
      }

      // Ensure all required fields are included and properly formatted
      const formDataWithUserId = {
        ...formData,
        userId: userId,
        phonenumber: formData.phonenumber.toString(),
        wantedtime: formData.wantedtime.toString(),
        amount: formData.amount.toString()
      };

      console.log("Submitting reservation data:", formDataWithUserId);

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

        // Create a more professional PDF
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text("NSC Rentals", 105, 20, { align: "center" });
        
        // Add title
        doc.setFontSize(18);
        doc.text("Reservation Confirmation", 105, 30, { align: "center" });
        
        // Add line
        doc.setDrawColor(0, 0, 0);
        doc.line(20, 35, 190, 35);
        
        // Add reservation details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Customer Information
        doc.setFontSize(14);
        doc.text("Customer Information", 20, 45);
        doc.setFontSize(12);
        doc.text(`Name: ${formData.name}`, 20, 55);
        doc.text(`Email: ${formData.email}`, 20, 60);
        doc.text(`Phone: ${formData.phonenumber}`, 20, 65);
        doc.text(`Address: ${formData.address}`, 20, 70);
        
        // Reservation Details
        doc.setFontSize(14);
        doc.text("Reservation Details", 20, 85);
        doc.setFontSize(12);
        doc.text(`Service Type: ${formData.service}`, 20, 95);
        doc.text(`Vehicle Number: ${formData.vehicleNum}`, 20, 100);
        doc.text(`Driver ID: ${formData.driverID}`, 20, 105);
        
        // Location Details
        doc.setFontSize(14);
        doc.text("Location Details", 20, 120);
        doc.setFontSize(12);
        doc.text(`Pick-up Location: ${formData.locationpick}`, 20, 130);
        doc.text(`Drop-off Location: ${formData.locationdrop}`, 20, 135);
        
        // Time and Amount
        doc.setFontSize(14);
        doc.text("Time and Amount", 20, 150);
        doc.setFontSize(12);
        doc.text(`Date: ${formData.wanteddate}`, 20, 160);
        doc.text(`Duration: ${formData.wantedtime} hours`, 20, 165);
        doc.text(`Total Amount: Rs. ${formData.amount}`, 20, 170);
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for choosing NSC Rentals!", 105, 280, { align: "center" });
        doc.text("For any queries, please contact our customer service.", 105, 285, { align: "center" });
        
        // Save the PDF
        doc.save(`Reservation-${formData.name}-${formData.wanteddate}.pdf`);
        navigate("/reservation/viewReservations");
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
          {/* Vehicle Number (Read-only) */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Vehicle Number:
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
          </div>

          {/* Driver Dropdown */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Select Driver:
            </label>
            <select
              name="driverID"
              value={formData.driverID}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                height: "46px",
              }}
            >
              <option value="">-- Select a Driver --</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.DriverName} - {driver.DriverPhone}
                </option>
              ))}
            </select>
            {errors.driverID && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.driverID}
              </div>
            )}
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

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Decorations:
          </label>

          {/* Radio Buttons */}
          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <label style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="decorations"
                value="yes"
                checked={showForm === true}
                onChange={() => setShowForm(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="decorations"
                value="no"
                checked={showForm === false}
                onChange={() => {
                  setShowForm(false);
                  setFormData({
                    ...formData,
                    type: "",
                    price: "",
                    amount: "0",
                  });
                }}
              />
              No
            </label>
          </div>

          {/* Conditionally rendered form */}
          {showForm && (
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "5px" }}>Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "5px" }}>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>
          )}
        </div>

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
