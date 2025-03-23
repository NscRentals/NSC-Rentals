import React, { useState } from 'react';
import axios from 'axios';
//import {userNavigate} from 'react-router-dom';   
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";





const DriverRegister = () => {
  const [formData, setFormData] = useState({
    DriverName: '',
    DriverPhone: '',
    DriverAdd: ''

  });
  const [message, setMessage] = useState('');
  //const navigate = userNavigate(); // hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/driver/register', formData);
      setMessage(response.data.success);
      setFormData({
        DriverName: '',
        DriverPhone: '',
        DriverAdd: ''
      });
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

//   const gotoAllDrivers = () => {
//     navigate('/drivers');
//     };

  return (
    <div>
        <h2>Join with us</h2>
      <h2>Driver Registration</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="DriverName">Driver Name</label>
          <input
            type="text"
            id="DriverName"
            name="DriverName"
            className="form-control"
            value={formData.DriverName}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="DriverPhone">Driver Phone</label>
          <input
            type="text"
            id="DriverPhone"
            name="DriverPhone"
            className="form-control"
            value={formData.DriverPhone}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="DriverAdd">Address</label>
          <input
            type="text"
            id="DriverAdd"
            name="DriverAdd"
            className="form-control"
            value={formData.DriverAdd}
            onChange={handleChange}
            required
          />
        </div>

      

        <button type="submit" className="btn btn-primary">Register Driver</button>
        
      </form>


      {/* <button type="button" className="btn btn-secondary ml-2" onClick={goToAllDrivers}>
          View All Drivers
        </button> */}

      {/* <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router> */}

    
    </div>
  );
};

export default DriverRegister;
