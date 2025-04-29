import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import Notification from "../../components/Notification";
import axios from "axios";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    vehicleNum: "",
    userId: "",
    driverID: "",
    name: "",
    email: "",
    phonenumber: "",
    address: "",
    locationpick: "",
    locationdrop: "",
    wantedtime: "",
    amount: "",
    wanteddate: "",
    reservationType: "normal",
    needsDriver: false,
    wantsDecoration: false,
    decorations: [],
  });
  const [Data, setData] = useState({
    amount: "0",
    type: "",
    price: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showDecorationModal, setShowDecorationModal] = useState(false);
  const [availableDecorations, setAvailableDecorations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

    console.log("Location state:", location.state);
    console.log("Vehicle details:", location.state?.vehicleDetails);

    if (location.state?.vehicleDetails) {
      console.log("Setting vehicle details:", {
        model: location.state.vehicleDetails.model,
        registrationNumber: location.state.vehicleDetails.registrationNumber
      });
      
      setFormData(prev => ({
        ...prev,
        vehicleNum: location.state.vehicleDetails.model,
        model: location.state.vehicleDetails.model,
        registrationNumber: location.state.vehicleDetails.registrationNumber
      }));
    } else {
      console.warn("No vehicle details found in location state");
    }

    // Check if returning from decorations page with selected decorations
    if (location.state?.selectedDecorations) {
      const totalDecorationCost = location.state.selectedDecorations.reduce((sum, d) => sum + d.price, 0);
      setFormData(prev => ({
        ...prev,
        wantsDecoration: true,
        decorations: location.state.selectedDecorations,
        amount: (parseInt(prev.amount) + totalDecorationCost).toString()
      }));
    }

    fetchDrivers();
    fetchDecorations();
  }, [id, navigate, location.state]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Auto-fill user details
        setFormData(prev => ({
          ...prev,
          email: response.data.email || "",
          name: response.data.firstName ? `${response.data.firstName} ${response.data.lastName || ''}` : prev.name,
          phonenumber: response.data.phone || prev.phonenumber,
          address: response.data.address?.street || prev.address
        }));

      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: "error",
          text: "Failed to load user data"
        });
      }
    };

    fetchUserData();
  }, [navigate]);

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

  const fetchDecorations = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/deco/get/");
      if (response.data.success) {
        setAvailableDecorations(response.data.deco);
      }
    } catch (error) {
      console.error("Error fetching decorations:", error);
    }
  };

  const handleAddDecoration = (decoration) => {
    const isAlreadySelected = formData.decorations.some(d => d._id === decoration._id);
    if (isAlreadySelected) {
      alert("This decoration is already selected!");
      return;
    }

    const confirmAdd = window.confirm(
      `Are you sure you want to add ${decoration.type} decoration for LKR ${decoration.price}?`
    );

    if (confirmAdd) {
      const updatedDecorations = [...formData.decorations, decoration];
      const totalDecorationCost = updatedDecorations.reduce((sum, d) => sum + d.price, 0);
      
      setFormData(prev => ({
        ...prev,
        decorations: updatedDecorations,
        amount: (parseInt(prev.amount) + decoration.price).toString()
      }));
    }
  };

  const handleRemoveDecoration = (decorationId) => {
    const decorationToRemove = formData.decorations.find(d => d._id === decorationId);
    if (decorationToRemove) {
      const updatedDecorations = formData.decorations.filter(d => d._id !== decorationId);
      setFormData(prev => ({
        ...prev,
        decorations: updatedDecorations,
        amount: (parseInt(prev.amount) - decorationToRemove.price).toString()
      }));
    }
  };

  const handleClearDecorations = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all selected decorations?");
    if (confirmClear) {
      const totalDecorationCost = formData.decorations.reduce((sum, d) => sum + d.price, 0);
      setFormData(prev => ({
        ...prev,
        decorations: [],
        amount: (parseInt(prev.amount) - totalDecorationCost).toString()
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "wantedtime") {
      const time = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        wantedtime: value,
        amount: time * 500,
      }));
    } else if (name === "reservationType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        decorations: value === "wedding" ? prev.decorations : [],
        needsDriver: value === "normal" ? prev.needsDriver : false,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "wanteddate") {
      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Convert selected date to Date object
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      // Only update if selected date is tomorrow or later
      if (selectedDate >= tomorrow) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear date error if it exists
        if (errors.wanteddate) {
          setErrors(prev => ({ ...prev, wanteddate: null }));
        }
      } else {
        // Set error for invalid date
        setErrors(prev => ({ 
          ...prev, 
          wanteddate: "Please select a date from tomorrow onwards" 
        }));
        // Keep the previous valid date if it exists
        setFormData(prev => ({ ...prev, wanteddate: prev.wanteddate }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phonenumber) newErrors.phonenumber = "Phone number is required.";
    if (!formData.locationpick) newErrors.locationpick = "Pick-up location is required.";
    if (!formData.locationdrop) newErrors.locationdrop = "Drop-off location is required.";
    if (!formData.wantedtime) newErrors.wantedtime = "Wanted time is required.";
    if (!formData.wanteddate) newErrors.wanteddate = "Date is required.";
    
    if (formData.needsDriver && !formData.driverID) {
      newErrors.driverID = "Driver selection is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Starting form submission...");

    if (!validateForm()) {
        console.log("Form validation failed");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found in localStorage");
            navigate('/login');
            return;
        }

        console.log("Token found:", token);

        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.log("No user ID found");
            setMessage({ 
                type: "error", 
                text: "User ID not found. Please log in again." 
            });
            return;
        }

        // Create reservation data according to backend schema
        const startDate = new Date(formData.wanteddate);
        // Calculate end date by adding the wanted time in hours
        const endDate = new Date(startDate.getTime() + (parseFloat(formData.wantedtime) * 60 * 60 * 1000));
        
        const reservationData = {
            vehicleNum: formData.vehicleNum,
            userId: userId,
            driverID: formData.driverID || "none",
            name: formData.name,
            email: formData.email,
            phonenumber: formData.phonenumber,
            address: formData.address,
            rType: formData.reservationType,
            service: formData.reservationType,
            locationpick: formData.locationpick,
            locationdrop: formData.locationdrop,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            price: parseFloat(formData.amount) || 0,
            isVerified: false
        };

        console.log("Sending reservation data:", reservationData);

        const response = await fetch(
            "http://localhost:4000/api/reservation",
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reservationData),
            }
        );

        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Response data:", result);

        if (!response.ok) {
            console.error("Server error response:", result);
            throw new Error(result.error || result.message || "Failed to create reservation");
        }

        console.log("Reservation created successfully:", result);

        setNotification({
            message: "Reservation successful",
            type: "success",
        });

        // Navigate to summary page with the reservation data
        navigate("/reservation/summary", {
            state: {
                reservation: {
                    ...formData,
                    _id: result._id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            }
        });
    } catch (error) {
        console.error("Error creating reservation:", error);
        setMessage({
            type: "error",
            text: error.message || "An error occurred while creating the reservation. Please try again.",
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
      updatedForm.amount = value;
      setData(updatedForm);
    }
  };

  const filteredDecorations = availableDecorations.filter(decoration => 
    decoration.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decoration.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        fontSize: "42px",
        fontWeight: "800",
        color: "#333",
        textTransform: "uppercase",
        letterSpacing: "1px"
      }}>
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
              Reservation Type:
            </label>
            <select
              name="reservationType"
              value={formData.reservationType}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="normal">Normal Reservation</option>
              <option value="wedding">Wedding Reservation</option>
            </select>
          </div>
        </div>

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
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "#eee",
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
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Vehicle Name:
            </label>
            <input
              type="text"
              name="vehicleNum"
              value={formData.vehicleNum}
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

        {/* Driver Requirement Section - Shown for both types */}
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Driver Requirement:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="needsDriver"
                  value="true"
                  checked={formData.needsDriver === true}
                  onChange={() => setFormData(prev => ({ ...prev, needsDriver: true }))}
                  className="mr-2"
                />
                Yes, I need a driver
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="needsDriver"
                  value="false"
                  checked={formData.needsDriver === false}
                  onChange={() => setFormData(prev => ({ ...prev, needsDriver: false }))}
                  className="mr-2"
                />
                No, I don't need a driver
              </label>
            </div>
          </div>
        </div>

        {/* Decoration Requirement Section - Only for Wedding */}
        {formData.reservationType === "wedding" && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Want Decoration?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wantsDecoration"
                    value="true"
                    checked={formData.wantsDecoration === true}
                    onChange={() => {
                      setFormData(prev => ({ ...prev, wantsDecoration: true }));
                      setShowDecorationModal(true);
                    }}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wantsDecoration"
                    value="false"
                    checked={formData.wantsDecoration === false}
                    onChange={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        wantsDecoration: false,
                        decorations: [],
                        amount: (parseInt(prev.amount) - prev.decorations.reduce((sum, d) => sum + d.price, 0)).toString()
                      }));
                    }}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Selected Decorations Summary on Main Form */}
            {formData.wantsDecoration && formData.decorations.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Selected Decorations</h3>
                  <button
                    onClick={() => setShowDecorationModal(true)}
                    className="text-mygreen hover:text-green-700 text-sm font-medium"
                  >
                    Edit Decorations
                  </button>
                </div>
                <ul className="space-y-3">
                  {formData.decorations.map((decoration) => (
                    <li key={decoration._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{decoration.type}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">LKR {decoration.price}</span>
                        <button
                          onClick={() => handleRemoveDecoration(decoration._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-800">Total Decoration Cost: </span>
                  <span className="font-bold text-mygreen">LKR {formData.decorations.reduce((sum, d) => sum + d.price, 0)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Date:
            </label>
            <input
              type="date"
              name="wanteddate"
              value={formData.wanteddate}
              onChange={handleChange}
              min={(() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
              })()}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: errors.wanteddate ? "1px solid #dc3545" : "1px solid #ccc",
              }}
            />
            {errors.wanteddate && (
              <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                {errors.wanteddate}
              </div>
            )}
          </div>
        </div>

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

      {/* Decoration Modal */}
      {showDecorationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Available Decorations</h2>
              <button
                onClick={() => setShowDecorationModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search decorations by type or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mygreen focus:border-transparent"
              />
            </div>

            {/* Selected Decorations Summary */}
            {formData.decorations.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Selected Decorations</h3>
                  <button
                    onClick={handleClearDecorations}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.decorations.map((decoration) => (
                    <li key={decoration._id} className="flex justify-between items-center">
                      <span>{decoration.type}</span>
                      <div className="flex items-center gap-2">
                        <span>LKR {decoration.price}</span>
                        <button
                          onClick={() => handleRemoveDecoration(decoration._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-semibold">
                  Total: LKR {formData.decorations.reduce((sum, d) => sum + d.price, 0)}
                </div>
              </div>
            )}

            {/* Available Decorations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDecorations.length > 0 ? (
                filteredDecorations.map((decoration) => (
                  <div
                    key={decoration._id}
                    className="bg-white p-4 rounded-lg shadow border"
                  >
                    <h3 className="font-semibold">{decoration.type}</h3>
                    <p className="text-sm text-gray-600">{decoration.description}</p>
                    <p className="text-blue-600 font-semibold mt-2">LKR {decoration.price}</p>
                    <button
                      onClick={() => handleAddDecoration(decoration)}
                      className="mt-2 w-full bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  No decorations found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
