import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleID: "",
    ownerId: "", // Assuming admin is assigning a user ID
    ownerType: "Company",
    vehicleType: "wedding car",
    make: "",
    model: "",
    year: "",
    registrationNumber: "",
    chassisNumber: "",
    color: "",
    seatingCapacity: 4,
    transmissionType: "Automatic",
    fuelType: "Petrol",
    pricing: {
      daily: 0,
      hourly: 0,
      weddingDecorationPrice: 0,
    },
    availabilityStatus: "Available",
    vehicleImages: [""],
    documentationImages: [""],
    insuranceExpiryDate: "",
    condition: "Good",
    maintenance: {
      mileage: 0,
      lastServiceDate: "",
      nextServiceDate: "",
      maintenanceStatus: "Up-to-date",
    },
    verification: {
      verified: false,
      verificationDate: "",
    },
    decoration: {
      decorated: false,
      decorationStyle: "",
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleArrayChange = (e, field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    

    try {
      const payload = {
        ...formData,
        owner: {
          ownerId: formData.ownerId,
          ownerType: formData.ownerType,
        },
      };
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:4000/api/vehicles",
        payload, // <- This is the data you want to send
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      

      toast.success("Vehicle Registered Successfully");
      navigate("/admin-fleet");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6">Add New Vehicle</h2>

      <form 
        className="bg-white p-8 rounded-lg shadow-md w-[90%] max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <input className="input" name="vehicleID" value={formData.vehicleID} onChange={handleChange} placeholder="Vehicle ID" required />

        <select name="ownerType" value={formData.ownerType} onChange={handleChange} className="input">
          <option>Company</option>
          <option>Peer-to-Peer</option>
        </select>

        <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="input">
          <option>wedding car</option>
          <option>Normal rental</option>
        </select>

        <input className="input" name="make" value={formData.make} onChange={handleChange} placeholder="Make" required />
        <input className="input" name="model" value={formData.model} onChange={handleChange} placeholder="Model" required />
        <input className="input" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" required />
        <input className="input" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Registration No." required />
        <input className="input" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} placeholder="Chassis Number" required />
        <input className="input" name="color" value={formData.color} onChange={handleChange} placeholder="Color" required />
        <input className="input" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleChange} placeholder="Seating Capacity" required />

        <select name="transmissionType" value={formData.transmissionType} onChange={handleChange} className="input">
          <option>Manual</option>
          <option>Automatic</option>
        </select>

        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="input">
          <option>Petrol</option>
          <option>Diesel</option>
          <option>Electric</option>
          <option>Hybrid</option>
        </select>


        <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="input">
          <option>Available</option>
          <option>Booked</option>
          <option>Under Maintenance</option>
        </select>

        <input className="input" name="vehicleImages[0]" value={formData.vehicleImages[0]} onChange={(e) => handleArrayChange(e, "vehicleImages", 0)} placeholder="Vehicle Image URL" required />
        <input className="input" name="documentationImages[0]" value={formData.documentationImages[0]} onChange={(e) => handleArrayChange(e, "documentationImages", 0)} placeholder="Document Image URL" required />
        <input className="input" type="date" name="insuranceExpiryDate" value={formData.insuranceExpiryDate} onChange={handleChange} placeholder="Insurance Expiry Date" required />

        <select name="condition" value={formData.condition} onChange={handleChange} className="input">
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
          <option>Needs Repair</option>
        </select>


        <select name="maintenance.maintenanceStatus" value={formData.maintenance.maintenanceStatus} onChange={handleChange} className="input">
          <option>Up-to-date</option>
          <option>Pending Service</option>
          <option>Requires Repair</option>
        </select>

    

       

        <div className="col-span-2 flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Register Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
