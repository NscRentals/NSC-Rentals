import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminVehicleFleet() {

  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveVehicles();
  }, []);

  const retrieveVehicles = () => {
    const token = localStorage.getItem("token"); 
    
    axios.get('http://localhost:4000/api/vehicles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log('Server data:', res.data);
        setVehicles(res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch vehicle data.");
      });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">

      <h1 className="text-2xl font-semibold mb-6">Vehicle Fleet</h1>

      <table className="w-[90%] bg-white shadow-md rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Vehicle ID</th>
            <th className="p-3">Owner Type</th>
            <th className="p-3">Vehicle Type</th>
            <th className="p-3">Make</th>
            <th className="p-3">Model</th>
            <th className="p-3">Year</th>
            <th className="p-3">Reg. Number</th>
            <th className="p-3">Availability</th>
            <th className="p-3">Daily Price</th>
            <th className="p-3">Condition</th>
            <th className="p-3">Maintenance</th>
            <th className="p-3">Edit</th>
            <th className="p-3">Delete</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={index} className="text-center border-b">
              <td className="p-3">
                <a href={`/vehicle-details/${vehicle._id}`} className="text-blue-600 hover:underline">
                  {vehicle.vehicleID}
                </a>
              </td>
              <td className="p-3">{vehicle.owner?.ownerType}</td>
              <td className="p-3">{vehicle.vehicleType}</td>
              <td className="p-3">{vehicle.make}</td>
              <td className="p-3">{vehicle.model}</td>
              <td className="p-3">{vehicle.year}</td>
              <td className="p-3">{vehicle.registrationNumber}</td>
              <td className="p-3">{vehicle.availabilityStatus}</td>
              <td className="p-3">{vehicle.pricing?.daily}</td>
              <td className="p-3">{vehicle.condition}</td>
              <td className="p-3">{vehicle.maintenance?.maintenanceStatus}</td>
              <td className="p-3">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              </td>
              <td className="p-3">
                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        onClick={() => navigate("/fleet/add")}
      >
        Add Vehicle
      </button>

    </div>
  );
}
