import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DriverProfileUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [driver, setDriver] = useState({
        DriverName: "",  
        DriverAdd: "",
        DriverPhone: "",
    });

    useEffect(() => {
        axios.get(`http://localhost:4000/api/driver/${id}`)
            .then((res) => {
                setDriver({
                    DriverName: res.data.DriverName || "",
                    DriverAdd: res.data.DriverAdd || "",    
                    DriverPhone: res.data.DriverPhone || ""
                });
            })
            .catch((err) => console.error("Error fetching driver details:", err));
    }, [id]);

    const handleChange = (e) => {
        setDriver({ ...driver, [e.target.name]: e.target.value || "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:4000/api/driver/update/${id}`, {
            DriverAdd: driver.DriverAdd,
            DriverPhone: driver.DriverPhone
        })
            .then(() => {
                alert("Profile updated successfully!");
                navigate(`/driverprofile/${id}`);
            })
            .catch((err) => console.error("Error updating profile:", err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Driver Name</label>
                        <input 
                            type="text" 
                            name="DriverName" 
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
                            value={driver.DriverName} 
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Address</label>
                        <input 
                            type="text" 
                            name="DriverAdd" 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            value={driver.DriverAdd} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Phone</label>
                        <input 
                            type="text" 
                            name="DriverPhone" 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            value={driver.DriverPhone} 
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DriverProfileUpdate;