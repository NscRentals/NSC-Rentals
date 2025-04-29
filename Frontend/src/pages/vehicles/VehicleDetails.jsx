import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.type === 'admin';

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicle(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      toast.error('Failed to load vehicle details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // For admin, update directly. For user, submit update request
      if (isAdmin) {
        await axios.put(`http://localhost:4000/api/vehicles/${id}`, {
          ...formData,
          action: 'approve' // Direct update by admin
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Vehicle updated successfully');
      } else {
        await axios.put(`http://localhost:4000/api/vehicles/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Update request submitted for approval');
      }

      setEditing(false);
      fetchVehicleDetails();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
          {(isAdmin || vehicle.owner === userProfile?._id) && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-opacity-90"
            >
              Edit Vehicle
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-mygreen text-white rounded-full hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Images Carousel */}
              <div className="space-y-4">
                {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <Slider {...carouselSettings}>
                      {vehicle.vehicleImages.map((image, index) => (
                        <div key={index} className="h-64">
                          <img
                            src={`http://localhost:4000/uploads/vehicles/${image}`}
                            alt={`${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{vehicle.make} {vehicle.model}</h2>
                  <p className="text-gray-600">Year: {vehicle.year}</p>
                  <p className="text-gray-600">Registration: {vehicle.registrationNumber}</p>
                  <p className="text-gray-600">Transmission: {vehicle.transmissionType}</p>
                  <p className="text-gray-600">Fuel Type: {vehicle.fuelType}</p>
                  <p className="text-gray-600">Color: {vehicle.color}</p>
                  <p className="text-gray-600">Seating Capacity: {vehicle.seatingCapacity}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Rental Information</h3>
                  <p className="text-gray-600">Location: {vehicle.city}, {vehicle.district}</p>
                  <p className="text-gray-600">Rental Mode: {vehicle.rentMode}</p>
                  <p className="text-gray-600">Minimum Period: {vehicle.minRentalPeriod}</p>
                  <p className="text-gray-600">Maximum Period: {vehicle.maxRentalPeriod}</p>
                </div>

                <div className="mt-4 space-y-2 flex items-center gap-4">
                  <div className={`inline-block px-4 py-2 rounded-full ${
                    vehicle.availabilityStatus === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {vehicle.availabilityStatus}
                  </div>
                  {vehicle.pendingUpdate && (
                    <div className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800">
                      Update Request Pending
                    </div>
                  )}
                  {vehicle.availabilityStatus === 'Available' && !isAdmin && vehicle.owner !== userProfile?._id && (
                    <button
                      onClick={() => navigate(`/rent/${vehicle._id}`)}
                      className="px-6 py-2 bg-mygreen text-white rounded-full hover:bg-opacity-90 flex items-center gap-2"
                    >
                      Rent Vehicle
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{vehicle.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
