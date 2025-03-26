import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get driver ID from URL

  return (
    <div className="container">
      <h2 className="my-4">Technician Dashboard</h2>
      
      <div className="card p-3">
        <button className="btn btn-primary mb-2" onClick={() => navigate(`/technicianprofile/${id}`)}>
          Edit Profile
        </button>

        <button className="btn btn-success mb-2" onClick={() => navigate(`/technician/jobs${id}`)}>
          Jobs
        </button>

        <button className="btn btn-warning mb-2" onClick={() => navigate(`/technician/salary/${id}`)}>
          Salary Details
        </button>

        <button className="btn btn-info" onClick={() => navigate(`/technician/orderparts`)}>
          Update Availability
        </button>
      </div>
    </div>
  );
};


export default TechnicianDashboard;
