import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { RxCross1 } from "react-icons/rx";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Basic vehicle specifications
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    engineCapacity: '',
    transmissionType: 'Automatic',
    fuelType: 'Petrol',
    color: '',
    seatingCapacity: '',
    numberOfDoors: '',
    description: '',

    // Location
    district: '',
    city: '',
    address: '',

    // Rental conditions
    minRentalPeriod: 'Hour(s)',
    maxRentalPeriod: 'Month(s)',
    rentMode: 'With Driver',

    // Pricing
    pricing: {
      vehicleValue: '',
      hourly: {
        enabled: false,
        withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
        vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
      },
      daily: {
        enabled: false,
        withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
        vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
      },
      weekly: {
        enabled: false,
        withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
        vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
      },
      monthly: {
        enabled: false,
        withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
        vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
      }
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');

  const updatePricingForRentMode = useCallback((rentMode) => {
    setFormData(prev => {
      const updatedPricing = { ...prev.pricing };
      ['hourly', 'daily', 'weekly', 'monthly'].forEach(period => {
        if (updatedPricing[period].enabled) {
          if (rentMode === 'With Driver') {
            updatedPricing[period] = {
              ...updatedPricing[period],
              withDriver: { ...updatedPricing[period].withDriver },
              vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
            };
          } else if (rentMode === 'Vehicle Only') {
            updatedPricing[period] = {
              ...updatedPricing[period],
              withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
              vehicleOnly: { ...updatedPricing[period].vehicleOnly }
            };
          }
        }
      });
      return {
        ...prev,
        pricing: updatedPricing
      };
    });
  }, []);

  // Effect to handle rental mode changes
  useEffect(() => {
    updatePricingForRentMode(formData.rentMode);
  }, [formData.rentMode, updatePricingForRentMode]);

  // Validation function
  const validateFields = (tab) => {
    const newErrors = {};
    
    if (tab === 'basic') {
      if (!formData.make) newErrors.make = 'Make is required';
      if (!formData.model) newErrors.model = 'Model is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.chassisNumber) newErrors.chassisNumber = 'Chassis number is required';
      if (!formData.engineNumber) newErrors.engineNumber = 'Engine number is required';
      if (!formData.engineCapacity) newErrors.engineCapacity = 'Engine capacity is required';
      if (!formData.color) newErrors.color = 'Color is required';
      if (!formData.seatingCapacity) newErrors.seatingCapacity = 'Seating capacity is required';
      if (!formData.numberOfDoors) newErrors.numberOfDoors = 'Number of doors is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (images.length === 0) newErrors.images = 'At least one image is required';
    }
    
    if (tab === 'location') {
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextTab = () => {
    if (activeTab === 'basic' && !validateFields('basic')) {
      toast.error('Please fill in all required fields in Basic Information');
      return;
    }
    if (activeTab === 'location' && !validateFields('location')) {
      toast.error('Please fill in all required fields in Location & Conditions');
      return;
    }
    
    if (activeTab === 'basic') setActiveTab('location');
    else if (activeTab === 'location') setActiveTab('pricing');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name === 'pricing.vehicleValue') {
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          vehicleValue: parseFloat(value) || ''
        }
      }));
    } else if (name.includes('pricing.')) {
      const [_, period, field, subfield] = name.split('.');
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [period]: {
            ...prev.pricing[period],
            [field]: {
              ...prev.pricing[period][field],
              [subfield]: parseFloat(value) || 0
            }
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePeriodToggle = (period) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [period]: {
          ...prev.pricing[period],
          enabled: !prev.pricing[period].enabled
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error('You can only upload up to 4 images');
      e.target.value = ''; // Reset file input
      return;
    }
    setImages(files);

    // Create preview URLs
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newImageUrls);
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key === 'pricing') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach(image => {
      formDataToSend.append('vehicleImages', image);
    });

    // Debug log
    console.log('Form data being sent:', Object.fromEntries(formDataToSend));
    console.log('Raw pricing data:', formData.pricing);    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add a vehicle');
        navigate('/login');
        return;
      }

      // Add owner-related debug log
      console.log('User Profile:', userProfile);
      console.log('Token:', token);

      const response = await axios.post('http://localhost:4000/api/vehicles', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Server response:', response.data);

      toast.success(userProfile?.type === 'admin' 
        ? 'Vehicle added successfully!' 
        : 'Vehicle submitted for approval!'
      );
      navigate('/vehicles');
    } catch (error) {
      console.error('Error response:', error.response?.data);
      console.error('Error adding vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const renderPricingInputs = (period) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 w-full">
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id={`${period}Enabled`}
          checked={formData.pricing[period].enabled}
          onChange={() => handlePeriodToggle(period)}
          className="w-5 h-5 text-mygreen border-gray-300 rounded focus:ring-mygreen"
        />
        <label htmlFor={`${period}Enabled`} className="ml-3 text-xl font-semibold capitalize">
          {period} Rental
        </label>
      </div>

      {formData.pricing[period].enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formData.rentMode === 'With Driver' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">With Driver</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name={`pricing.${period}.withDriver.price`}
                  value={formData.pricing[period].withDriver.price}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mileage Limit</label>
                <input
                  type="number"
                  name={`pricing.${period}.withDriver.mileageLimit`}
                  value={formData.pricing[period].withDriver.mileageLimit}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Extra Charge</label>
                <input
                  type="number"
                  name={`pricing.${period}.withDriver.extraCharge`}
                  value={formData.pricing[period].withDriver.extraCharge}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
            </div>
          )}

          {formData.rentMode === 'Vehicle Only' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Vehicle Only</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name={`pricing.${period}.vehicleOnly.price`}
                  value={formData.pricing[period].vehicleOnly.price}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mileage Limit</label>
                <input
                  type="number"
                  name={`pricing.${period}.vehicleOnly.mileageLimit`}
                  value={formData.pricing[period].vehicleOnly.mileageLimit}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Extra Charge</label>
                <input
                  type="number"
                  name={`pricing.${period}.vehicleOnly.extraCharge`}
                  value={formData.pricing[period].vehicleOnly.extraCharge}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handlePreviousTab = () => {
    if (activeTab === 'pricing') setActiveTab('location');
    else if (activeTab === 'location') setActiveTab('basic');
  };

  return (
    <div>
      {/* Fixed Header with blur */}
      <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Add New Vehicle</h1>
        <RxCross1 
          className="ml-auto text-4xl cursor-pointer" 
          onClick={() => navigate('/vehicles')}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="w-full h-[60px] flex items-center fixed top-[83px] left-0 z-10 px-6 bg-white border-b border-gray-200">
        <div className="flex gap-12">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`relative text-xl font-medium ${activeTab === 'basic' ? 'text-black' : 'text-gray-500'}`}
          >
            Basic Information
            <span className={`absolute bottom-[-18px] left-0 h-[3px] bg-black transition-all ${activeTab === 'basic' ? 'w-full' : 'w-0'}`}></span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`relative text-xl font-medium ${activeTab === 'location' ? 'text-black' : 'text-gray-500'}`}
          >
            Location & Conditions
            <span className={`absolute bottom-[-18px] left-0 h-[3px] bg-black transition-all ${activeTab === 'location' ? 'w-full' : 'w-0'}`}></span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`relative text-xl font-medium ${activeTab === 'pricing' ? 'text-black' : 'text-gray-500'}`}
          >
            Pricing
            <span className={`absolute bottom-[-18px] left-0 h-[3px] bg-black transition-all ${activeTab === 'pricing' ? 'w-full' : 'w-0'}`}></span>
          </button>
        </div>
      </div>
      
      {/* Scrollable Form Section */}
      <div className="pt-[143px] flex w-full h-[calc(100vh-143px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-[830px] min-h-full bg-white flex flex-col items-center px-10 border-r border-gray-300">
          {/* Info Box */}
          <div className="w-full max-w-[700px] flex items-start bg-mylightblue rounded-[20px] p-5 text-lg mb-8">
            <img
              src="/icons/question.png"
              alt="Question Icon"
              className="h-10 w-10 mr-4"
            />
            <p className="text-xl">
              {activeTab === 'basic' && "Please fill in the basic specifications of your vehicle. Ensure all information is accurate."}
              {activeTab === 'location' && "Provide the location details and rental conditions for your vehicle."}
              {activeTab === 'pricing' && "Set up your vehicle's pricing structure based on different rental periods."}
            </p>
          </div>

          {/* Basic Information Tab */}
          <div className={`w-full max-w-[700px] ${activeTab === 'basic' ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xl font-semibold block mb-2">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter vehicle make"
                  className={`w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.make ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
                />
                {errors.make && <p className="mt-1 text-red-500">{errors.make}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter vehicle model"
                  className={`w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.model ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
                />
                {errors.model && <p className="mt-1 text-red-500">{errors.model}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  max={new Date().getFullYear()}
                  placeholder="Enter vehicle year"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter registration number"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Chassis Number</label>
                <input
                  type="text"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter chassis number"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.chassisNumber && <p className="text-red-500 text-sm">{errors.chassisNumber}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Engine Number</label>
                <input
                  type="text"
                  name="engineNumber"
                  value={formData.engineNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter engine number"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.engineNumber && <p className="text-red-500 text-sm">{errors.engineNumber}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Engine Capacity</label>
                <input
                  type="text"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter engine capacity"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.engineCapacity && <p className="text-red-500 text-sm">{errors.engineCapacity}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Transmission Type</label>
                <select
                  name="transmissionType"
                  value={formData.transmissionType}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter vehicle color"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Enter seating capacity"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.seatingCapacity && <p className="text-red-500 text-sm">{errors.seatingCapacity}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Number of Doors</label>
                <input
                  type="number"
                  name="numberOfDoors"
                  value={formData.numberOfDoors}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Enter number of doors"
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
                {errors.numberOfDoors && <p className="text-red-500 text-sm">{errors.numberOfDoors}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xl font-semibold block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe your vehicle"
                className={`w-full px-4 py-3 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
              />
              {errors.description && <p className="mt-1 text-red-500">{errors.description}</p>}
            </div>            <div className="mt-6">
              <label className="text-xl font-semibold block mb-2">Vehicle Images</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-[100px] px-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Click or drag & drop to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">(Maximum 4 images)</span>
                </div>              </div>
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== index);
                          const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
                          setImages(newImages);
                          setImagePreviewUrls(newUrls);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mygreen mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600">Upload up to 4 high-quality images of your vehicle</p>
              </div>
            </div>
          </div>

          {/* Location & Conditions Tab */}
          <div className={`w-full max-w-[700px] ${activeTab === 'location' ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xl font-semibold block mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter district"
                  className={`w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.district ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
                />
                {errors.district && <p className="mt-1 text-red-500">{errors.district}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                  className={`w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
                />
                {errors.city && <p className="mt-1 text-red-500">{errors.city}</p>}
              </div>

              <div className="col-span-2">
                <label className="text-xl font-semibold block mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full address"
                  className={`w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mygreen'}`}
                />
                {errors.address && <p className="mt-1 text-red-500">{errors.address}</p>}
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Minimum Rental Period</label>
                <select
                  name="minRentalPeriod"
                  value={formData.minRentalPeriod}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="Hour(s)">Hour(s)</option>
                  <option value="Day(s)">Day(s)</option>
                  <option value="Week(s)">Week(s)</option>
                  <option value="Month(s)">Month(s)</option>
                </select>
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Maximum Rental Period</label>
                <select
                  name="maxRentalPeriod"
                  value={formData.maxRentalPeriod}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="Hour(s)">Hour(s)</option>
                  <option value="Day(s)">Day(s)</option>
                  <option value="Week(s)">Week(s)</option>
                  <option value="Month(s)">Month(s)</option>
                </select>
              </div>

              <div>
                <label className="text-xl font-semibold block mb-2">Rental Mode</label>
                <select
                  name="rentMode"
                  value={formData.rentMode}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="With Driver">With Driver</option>
                  <option value="Vehicle Only">Vehicle Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Tab */}
          <div className={`w-full max-w-[700px] ${activeTab === 'pricing' ? 'block' : 'hidden'}`}>
            <div>
              <label className="text-xl font-semibold block mb-2">Vehicle Value</label>
              <input
                type="number"
                name="pricing.vehicleValue"
                value={formData.pricing.vehicleValue}
                onChange={handleInputChange}
                required
                placeholder="Enter vehicle market value"
                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen mb-6"
              />

              {/* Pricing Periods */}
              {renderPricingInputs('hourly')}
              {renderPricingInputs('daily')}
              {renderPricingInputs('weekly')}
              {renderPricingInputs('monthly')}

              {/* Info Note */}              <div className="mt-6 p-4 bg-mylightblue rounded-xl">
                <p className="text-lg">
                  <span className="font-semibold">Note:</span> For each enabled rental period, make sure to set:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Base rental price for the period</li>
                  <li>Mileage limit (in kilometers)</li>
                  <li>Extra charge per kilometer beyond the limit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-6 mt-10 w-full max-w-[700px] h-[80px]">
            {activeTab === 'basic' && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/vehicles')}
                  className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full"
                >
                  Next
                </button>
              </>
            )}

            {activeTab === 'location' && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousTab}
                  className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full"
                >
                  Next
                </button>
              </>
            )}

            {activeTab === 'pricing' && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousTab}
                  className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full"
                >
                  Add Vehicle
                </button>
              </>
            )}
          </div>
        </form>

        {/* Right Side Info */}
        <div className="w-[calc(100vw-830px)] min-h-full bg-white flex items-start justify-center pt-20">
          <div className="text-left max-w-[500px]">
            <h2 className="text-4xl font-bold mb-8">Adding a new vehicle?</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">1</span>
                </div>
                <p className="text-xl">Fill in accurate vehicle specifications in the Basic Information section.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">2</span>
                </div>
                <p className="text-xl">Provide location details and rental conditions to help renters find your vehicle.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">3</span>
                </div>
                <p className="text-xl">Set competitive pricing for different rental durations to attract more customers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
