import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DriverProfileUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ✅ Ensure default values to prevent "uncontrolled input" issue
    const [driver, setDriver] = useState({
        DriverName: "",  
        DriverAdd: "",
        DriverPhone: "",
    });

    // ✅ Fetch driver details when component loads
    useEffect(() => {
        axios.get(`http://localhost:4000/api/driver/${id}`)
            .then((res) => {
                setDriver({
                    DriverName: res.data.DriverName || "",  // Ensuring a default value
                    DriverAdd: res.data.DriverAdd || "",    
                    DriverPhone: res.data.DriverPhone || ""
                });
            })
            .catch((err) => console.error("Error fetching driver details:", err));
    }, [id]);

    // ✅ Handle input changes
    const handleChange = (e) => {
        setDriver({ ...driver, [e.target.name]: e.target.value || "" });
    };

    // ✅ Handle form submission
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
        <div className="container">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>

                {/* ✅ Driver Name (Read-Only) */}
                <div className="mb-3">
                    <label className="form-label">Driver Name:</label>
                    <input type="" name="DriverName" className="form-control" value={driver.DriverName} readOnly />
                </div>

                {/* ✅ Corrected Address Field */}
                <div className="mb-3">
                    <label className="form-label">Address:</label>
                    <input 
                        type="text" 
                        name="DriverAdd" 
                        className="form-control" 
                        value={driver.DriverAdd} 
                        onChange={handleChange} 
                         
                    />
                </div>

                {/* ✅ Corrected Phone Field */}
                <div className="mb-3">
                    <label className="form-label">Phone:</label>
                    <input 
                        type="text" 
                        name="DriverPhone" 
                        className="form-control" 
                        value={driver.DriverPhone} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-success">Update Profile</button>
            </form>
        </div>
    );

};

export default DriverProfileUpdate;
