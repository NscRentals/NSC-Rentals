import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get driver ID from URL

  return (
    <div className="container">
      <h2 className="my-4">Driver Dashboard</h2>
      
      <div className="card p-3">
        <button className="btn btn-primary mb-2" onClick={() => navigate(`/driverprofile/${id}`)}>
          Edit Profile
        </button>

        <button className="btn btn-success mb-2" onClick={() => navigate(`/driver/reservations/${id}`)}>
          Assigned Reservations
        </button>

        <button className="btn btn-warning mb-2" onClick={() => navigate(`/driver/salary/${id}`)}>
          Salary Details
        </button>

        <button className="btn btn-info" onClick={() => navigate(`/driver/update-availability/${id}`)}>
          Update Availability
        </button>
      </div>
    </div>
  );
};


export default DriverDashboard;
