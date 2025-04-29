import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    DriverName: '',
    DriverPhone: '',
    DriverAdd: '',
    DriverEmail: '',
    DLNo: '',
    NICNo: '',
    DriverPW: ''
  });
  const [message, setMessage] = useState('');
  const [driverID, setDriverID] = useState(null);
  const navigate = useNavigate();

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

      if (response.status === 200) {
        setMessage(response.data.error);
        alert(response.data.success);
    
      } else {
        setMessage(response.data.error);
        alert(response.data.error); 
      };
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 p-4">Driver Registration</h2>
        <p className="text-center text-gray-600 mb-6">Fill out the form carefully to register the driver</p>
        {message && <div className="text-center text-green-600 font-semibold mb-4">{message}</div>}
        {driverID && <div className="text-center text-blue-600 font-semibold mb-4">Assigned Driver ID: {driverID}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2 p-4">Driver Name : </label>
              <input
                type="text"
                name="DriverName"
                value={formData.DriverName}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">Driver Phone</label>
              <input
                type="text"
                name="DriverPhone"
                value={formData.DriverPhone}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="p-4 block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              name="DriverAdd"
              value={formData.DriverAdd}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="DriverEmail"
                value={formData.DriverEmail}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">Driving License No</label>
              <input
                type="text"
                name="DLNo"
                value={formData.DLNo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">NIC No</label>
              <input
                type="text"
                name="NICNo"
                value={formData.NICNo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="DriverPW"
                value={formData.DriverPW}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="p-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Register Driver
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverRegister;
