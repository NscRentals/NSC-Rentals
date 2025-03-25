
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DriverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
        console.log(`Fetching driver with ID: ${id}`);
        const res = await axios.get(`http://localhost:4000/api/driver/${id}`);
        console.log("API Response:", res.data.driverone);

        // Ensure you are setting the correct data structure
        if (res.data && res.data.driverone) {
            setDriver(res.data.driverone);
        } else {
            console.error("Driver data is missing from response:", res.data);
        }
    } catch (error) {
        console.error("Error fetching driver:", error);
    }
};


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/driver/delete/${id}`);
      alert("Driver deleted!");
      navigate("/drivers");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };



//update driver
  const handleUpdate =async () =>{
    try{
      await axios.put(`http://localhost:4000/api/driver/update/${id}`);
      alert("Driver Updated!");
    }catch(error){
      console.error("Update error:", error);
    }
  };




   if (!driver) return <p>Loading...</p>; // Prevent rendering before data is loaded

  return (
    <div className="container">
      <h2>Driver Profile</h2>
      <div className="card p-3">
        <p><strong>Driver Name:</strong> {driver.DriverName}</p>
        <p><strong>Address:</strong> {driver.DriverAdd}</p>
        <p><strong>Phone Number:</strong> {driver.PhoneNumber}</p>

        <div className="mt-3">
          <button className="btn btn-danger" onClick={(handleDelete)}>
            Delete Driver
          </button>

          <button className="btn btn-danger" onClick={ () => navigate("/driverprofile/update/:id") }>
            Update Driver
          </button>

          <button className="btn btn-secondary ms-2" onClick={() => navigate("/drivers")}>
            Back to Drivers
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
