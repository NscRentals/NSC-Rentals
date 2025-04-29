import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { RxCross1 } from "react-icons/rx";

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userProfile } = useAuth();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    availabilityStatus: 'Available',  // Add this line

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
  const [existingImages, setExistingImages] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const isAdmin = userProfile?.type === 'admin';

  const fetchVehicleData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to edit vehicles');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setVehicleData(response.data);
      
      // Populate form data with vehicle data
      const vehicle = response.data;
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        registrationNumber: vehicle.registrationNumber || '',
        chassisNumber: vehicle.chassisNumber || '',
        engineNumber: vehicle.engineNumber || '',
        engineCapacity: vehicle.engineCapacity || '',
        transmissionType: vehicle.transmissionType || 'Automatic',
        fuelType: vehicle.fuelType || 'Petrol',
        color: vehicle.color || '',
        seatingCapacity: vehicle.seatingCapacity || '',
        numberOfDoors: vehicle.numberOfDoors || '',
        description: vehicle.description || '',
        availabilityStatus: vehicle.availabilityStatus || 'Available',
        district: vehicle.district || '',
        city: vehicle.city || '',
        address: vehicle.address || '',
        minRentalPeriod: vehicle.minRentalPeriod || 'Hour(s)',
        maxRentalPeriod: vehicle.maxRentalPeriod || 'Month(s)',
        rentMode: vehicle.rentMode || 'With Driver',
        pricing: {
          vehicleValue: vehicle.pricing?.vehicleValue || '',
          hourly: vehicle.pricing?.hourly || {
            enabled: false,
            withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
            vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
          },
          daily: vehicle.pricing?.daily || {
            enabled: false,
            withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
            vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
          },
          weekly: vehicle.pricing?.weekly || {
            enabled: false,
            withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
            vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
          },
          monthly: vehicle.pricing?.monthly || {
            enabled: false,
            withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
            vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
          }
        }
      });
      
      // Set existing images
      if (vehicle.vehicleImages && vehicle.vehicleImages.length > 0) {
        setExistingImages(vehicle.vehicleImages);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      toast.error('Failed to load vehicle data');
      navigate('/vehicles');
    }
  }, [id, navigate]);

  // Fetch vehicle data when component mounts
  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  // Effect to handle rental mode changes
  useEffect(() => {
    if (formData.rentMode === 'With Driver') {
      // When "With Driver" is selected, disable "Vehicle Only" pricing
      const updatedPricing = { ...formData.pricing };
      ['hourly', 'daily', 'weekly', 'monthly'].forEach(period => {
        if (updatedPricing[period].enabled) {
          updatedPricing[period] = {
            ...updatedPricing[period],
            withDriver: { ...updatedPricing[period].withDriver },
            vehicleOnly: { price: 0, mileageLimit: 0, extraCharge: 0 }
          };
        }
      });

      setFormData(prev => ({
        ...prev,
        pricing: updatedPricing
      }));
    } else if (formData.rentMode === 'Vehicle Only') {
      // When "Vehicle Only" is selected, disable "With Driver" pricing
      const updatedPricing = { ...formData.pricing };
      ['hourly', 'daily', 'weekly', 'monthly'].forEach(period => {
        if (updatedPricing[period].enabled) {
          updatedPricing[period] = {
            ...updatedPricing[period],
            withDriver: { price: 0, mileageLimit: 0, extraCharge: 0 },
            vehicleOnly: { ...updatedPricing[period].vehicleOnly }
          };
        }
      });

      setFormData(prev => ({
        ...prev,
        pricing: updatedPricing
      }));
    }
  }, [formData.rentMode, formData.pricing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setImages(files);
  };

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

    // Append images if any new ones were selected
    if (images.length > 0) {
      images.forEach(image => {
        formDataToSend.append('vehicleImages', image);
      });
    } else {
      // If no new images, keep the existing ones
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
    }    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to edit vehicles');
        navigate('/login');
        return;
      }      await axios.put(`http://localhost:4000/api/vehicles/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (isAdmin) {
        toast.success('Vehicle updated successfully!');
      } else {
        toast.success('Update request submitted. Awaiting admin approval.');
      }
      
      navigate('/vehicles');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
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

  const handleNextTab = () => {
    if (activeTab === 'basic') setActiveTab('location');
    else if (activeTab === 'location') setActiveTab('pricing');
  };

  const handlePreviousTab = () => {
    if (activeTab === 'pricing') setActiveTab('location');
    else if (activeTab === 'location') setActiveTab('basic');
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-2xl">Loading vehicle data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Fixed Header with blur */}
      <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Edit Vehicle</h1>
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
          {/* Status Banner for non-admin users */}
          {!isAdmin && vehicleData?.pendingUpdate && (
            <div className="w-full max-w-[700px] flex items-start bg-yellow-100 rounded-[20px] p-5 text-lg mb-8">
              <p className="text-xl font-medium">
                This vehicle has a pending update request. Any changes you make will replace your previous update request.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="w-full max-w-[700px] flex items-start bg-mylightblue rounded-[20px] p-5 text-lg mb-8">
            <img
              src="/icons/question.png"
              alt="Question Icon"
              className="h-10 w-10 mr-4"
            />
            <p className="text-xl">
              {activeTab === 'basic' && "Update the basic specifications of your vehicle. Ensure all information is accurate."}
              {activeTab === 'location' && "Update the location details and rental conditions for your vehicle."}
              {activeTab === 'pricing' && "Adjust your vehicle's pricing structure based on different rental periods."}
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
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
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
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
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
                  disabled={!isAdmin} // Only admin can change registration number
                />
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
                  disabled={!isAdmin} // Only admin can change chassis number
                />
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
                  disabled={!isAdmin} // Only admin can change engine number
                />
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
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xl font-semibold block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter vehicle description"
                className="w-full h-[100px] px-4 py-2 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen resize-none"
              />
            </div>

            {isAdmin && (
              <div>
                <label className="text-xl font-semibold block mb-2">Availability Status</label>
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Booked">Booked</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xl font-semibold block mb-2">Current Vehicle Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={`http://localhost:4000/uploads/vehicles/${image}`} 
                      alt={`Vehicle image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
              
              <label className="text-xl font-semibold block mb-2">Upload New Images (Optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen file:mr-4 file:py-2 file:px-4 file:border-0 file:text-lg file:font-medium file:bg-mygreen file:text-white hover:file:bg-green-700"
              />
              <p className="text-sm text-gray-500 mt-2">
                Note: Uploading new images will replace all current images.
              </p>
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
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
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
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
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
                  className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-mygreen"
                />
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

              {/* Info Note */}
              <div className="mt-6 p-4 bg-mylightblue rounded-xl">
                <p className="text-lg">
                  <span className="font-semibold">Note:</span> For each enabled rental period, make sure to set:
                  <ul className="list-disc ml-6 mt-2">
                    <li>Base rental price for the period</li>
                    <li>Mileage limit (in kilometers)</li>
                    <li>Extra charge per kilometer beyond the limit</li>
                  </ul>
                </p>
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
                  {isAdmin ? 'Update Vehicle' : 'Submit Update Request'}
                </button>
              </>
            )}
          </div>
        </form>

        {/* Right Side Info */}
        <div className="w-[calc(100vw-830px)] min-h-full bg-white flex items-start justify-center pt-20">
          <div className="text-left max-w-[500px]">
            <h2 className="text-4xl font-bold mb-8">Editing vehicle information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">1</span>
                </div>
                <p className="text-xl">Review and update vehicle specifications carefully.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">2</span>
                </div>
                <p className="text-xl">Adjust location details and rental conditions as needed.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mygreen/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-mygreen">3</span>
                </div>
                <p className="text-xl">Modify pricing structure for different rental durations to maximize bookings.</p>
              </div>
              
              {!isAdmin && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl text-yellow-800">!</span>
                  </div>
                  <p className="text-xl">
                    Your changes will need admin approval before they become visible to customers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
