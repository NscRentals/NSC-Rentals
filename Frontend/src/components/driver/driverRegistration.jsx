import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RxCross1 } from "react-icons/rx";

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    DriverName: '',
    DriverPhone: '',
    DriverAdd: '',
    DriverEmail: '',
    DLNo: '',
    NICNo: '',
    DriverPW: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.DriverName.trim()) {
      newErrors.DriverName = 'Name is required';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.DriverPhone)) {
      newErrors.DriverPhone = 'Phone number must be 10 digits';
    }

    // Address validation
    if (!formData.DriverAdd.trim()) {
      newErrors.DriverAdd = 'Address is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.DriverEmail)) {
      newErrors.DriverEmail = 'Invalid email format';
    }

    // License number validation
    if (!formData.DLNo.trim()) {
      newErrors.DLNo = 'License number is required';
    }

    // NIC validation
    if (formData.NICNo.length !== 10) {
      newErrors.NICNo = 'NIC must be exactly 10 characters';
    }

    // Password validation
    if (formData.DriverPW.length < 6) {
      newErrors.DriverPW = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.DriverPW !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitData } = formData;
      
      const response = await axios.post('http://localhost:4000/api/driver/register', submitData);

      if (response.data.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      if (error.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [error.response.data.field]: errorMessage
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Fixed Header with blur */}
      <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Driver Registration</h1>
        <RxCross1 
          className="ml-auto text-4xl cursor-pointer" 
          onClick={() => navigate('/')}
        />
      </div>

      {/* Main Content */}
      <div className="pt-[83px] min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Join Our Team</h2>
          <p className="text-center text-gray-600 mb-8">Register as a driver and start your journey with us</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="DriverName"
                  value={formData.DriverName}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.DriverName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="John Doe"
                />
                {errors.DriverName && <p className="text-red-500 text-sm mt-1">{errors.DriverName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="DriverPhone"
                  value={formData.DriverPhone}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.DriverPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="0712345678"
                />
                {errors.DriverPhone && <p className="text-red-500 text-sm mt-1">{errors.DriverPhone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                name="DriverAdd"
                value={formData.DriverAdd}
                onChange={handleChange}
                className={`w-full bg-white border ${errors.DriverAdd ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="123 Main St, City"
              />
              {errors.DriverAdd && <p className="text-red-500 text-sm mt-1">{errors.DriverAdd}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="DriverEmail"
                  value={formData.DriverEmail}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.DriverEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="john@example.com"
                />
                {errors.DriverEmail && <p className="text-red-500 text-sm mt-1">{errors.DriverEmail}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Driving License No</label>
                <input
                  type="text"
                  name="DLNo"
                  value={formData.DLNo}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.DLNo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="B1234567"
                />
                {errors.DLNo && <p className="text-red-500 text-sm mt-1">{errors.DLNo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">NIC No</label>
                <input
                  type="text"
                  name="NICNo"
                  value={formData.NICNo}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.NICNo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="123456789V"
                />
                {errors.NICNo && <p className="text-red-500 text-sm mt-1">{errors.NICNo}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="DriverPW"
                  value={formData.DriverPW}
                  onChange={handleChange}
                  className={`w-full bg-white border ${errors.DriverPW ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  placeholder="••••••••"
                />
                {errors.DriverPW && <p className="text-red-500 text-sm mt-1">{errors.DriverPW}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center justify-between space-x-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Back to Login
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-green-300`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
