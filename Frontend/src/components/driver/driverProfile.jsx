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

  if (!driver) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full text-center">
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {driver.DriverName.charAt(0)}
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-4">{driver.DriverName}</h2>
        <p className="text-gray-600">{driver.DriverEmail}</p>
        <div className="mt-4 text-gray-700">
          <p><strong>Address:</strong> {driver.DriverAdd}</p>
          <p><strong>Phone:</strong> {driver.DriverPhone}</p>
          <p><strong>License No:</strong> {driver.DLNo}</p>
        </div>
        <div className="mt-6 space-y-2">
          <button className="w-full bg-red-600 text-white py-2 rounded-lg shadow hover:bg-red-700 transition" onClick={handleDelete}>
            Delete Driver
          </button>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => navigate(`/driverprofile/update/${id}`)}>
            Update Driver
          </button>
          <button className="w-full bg-gray-400 text-white py-2 rounded-lg shadow hover:bg-gray-500 transition" onClick={() => navigate("/dashboard")}> 
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
