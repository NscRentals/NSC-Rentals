import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const API_BASE_URL = "http://localhost:4000/api"; // Update this to match your backend URL

const DriverAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const driverId = localStorage.getItem("driverId"); // Assuming driver ID is stored in localStorage after login

  useEffect(() => {
    console.log("Component mounted, driverId:", driverId);
    if (driverId) {
      fetchDriverSchedule();
    } else {
      setError("Please login first");
    }
  }, [driverId]);

  const fetchDriverSchedule = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching schedule for driver:", driverId);
      const response = await axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`);
      console.log("Schedule response:", response.data);
      setSchedule(response.data.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.response?.data?.error || "Failed to fetch schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
    // Check if there's existing availability for this date
    const existingAvailability = schedule.find(
      item => item.date === format(date, "yyyy-MM-dd")
    );
    if (existingAvailability) {
      setAvailability(existingAvailability.availability);
    } else {
      setAvailability(true); // Default to available
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverId) {
      setError("Please login first");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Submitting availability:", {
        driverId,
        date: format(selectedDate, "yyyy-MM-dd"),
        availability
      });
      
      const response = await axios.post(`${API_BASE_URL}/driver/availability`, {
        driverId,
        date: format(selectedDate, "yyyy-MM-dd"),
        availability
      });
      
      console.log("Availability update response:", response.data);
      setMessage("Availability updated successfully");
      fetchDriverSchedule(); // Refresh the schedule
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating availability:", err);
      setError(err.response?.data?.error || "Failed to update availability");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const tileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const dateSchedule = schedule.find(item => item.date === formattedDate);
    
    if (dateSchedule) {
      return dateSchedule.availability 
        ? "bg-green-200 hover:bg-green-300"
        : "bg-red-200 hover:bg-red-300";
    }
    return "";
  };

  if (!driverId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Please login to manage your availability
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Driver Availability</h1>
        <p className="text-gray-600">Manage your schedule and availability</p>
      </div>
      
      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName}
          className="mx-auto"
        />
      </div>

      {/* Availability Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Set Availability for {format(selectedDate, "MMMM dd, yyyy")}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-green-500"
                checked={availability}
                onChange={() => setAvailability(true)}
              />
              <span className="ml-2">Available</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-red-500"
                checked={!availability}
                onChange={() => setAvailability(false)}
              />
              <span className="ml-2">Not Available</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Availability'}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverAvailability;
