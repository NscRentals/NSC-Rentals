import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number
      if (!/^\d{10}$/.test(formData.DriverPhone)) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }

      // Validate NIC number
      if (formData.NICNo.length !== 10) {
        toast.error('NIC number must be exactly 10 characters');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.DriverEmail)) {
        toast.error('Invalid email format');
        return;
      }

      // Register the driver
      const registerResponse = await axios.post('http://localhost:4000/api/driver/register', formData);

      if (registerResponse.data.success) {
        toast.success('Driver registered successfully!');
        
        // After successful registration, attempt to log in
        try {
          const loginResult = await login(formData.DriverEmail, formData.DriverPW);
          
          if (loginResult.success) {
            toast.success('Login successful!');
            navigate('/driver');
          } else {
            toast.error(loginResult.error || 'Login failed');
            navigate('/login');
          }
        } catch (loginError) {
          console.error('Login error:', loginError);
          toast.error('Registration successful but login failed. Please try logging in manually.');
          navigate('/login');
        }
      } else {
        toast.error(registerResponse.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 p-4">Driver Registration</h2>
        <p className="text-center text-gray-600 mb-6">Fill out the form carefully to register the driver</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2 p-4">Driver Name</label>
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
                type="tel"
                name="DriverPhone"
                value={formData.DriverPhone}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
                pattern="[0-9]{10}"
                title="Phone number must be 10 digits"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="p-4 block text-gray-700 font-medium mb-2">NIC No</label>
              <input
                type="text"
                name="NICNo"
                value={formData.NICNo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
                maxLength="10"
                minLength="10"
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
                minLength="6"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`p-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register Driver'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverRegister;
