import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUserEdit, FaCalendarCheck, FaMoneyBill, FaClock, FaEnvelope, FaPhone, FaUserCircle, FaTrash } from "react-icons/fa";
import axios from "axios";
import Notification from "../Notification";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import ViewAvailability from "./ViewAvailability";

const API_BASE_URL = "http://localhost:4000/api";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [currentAvailability, setCurrentAvailability] = useState(true);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const driverId = localStorage.getItem('driverId');

  useEffect(() => {
    fetchDriverData();
    fetchCurrentAvailability();
    fetchUpcomingSchedule();
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/driver/${id}`);
      setDriver(response.data.driverone);
      setError('');
    } catch (err) {
      setError('Failed to fetch driver data');
      setNotification({
        message: 'Failed to fetch driver data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentAvailability = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`);
      if (response.data.success) {
        const todaySchedule = response.data.data.find(item => item.date === today);
        setCurrentAvailability(todaySchedule ? todaySchedule.availability : true);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setNotification({
        message: 'Failed to fetch availability status',
        type: 'error'
      });
    }
  };

  const fetchUpcomingSchedule = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`);
      if (response.data.success) {
        const today = new Date();
        const upcoming = response.data.data
          .filter(item => new Date(item.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setUpcomingSchedule(upcoming);
      }
    } catch (error) {
      console.error('Error fetching upcoming schedule:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:4000/api/driver/update/${id}`, {
        DriverName: driver.DriverName,
        DriverPhone: driver.DriverPhone,
        DriverAdd: driver.DriverAdd,
        DriverEmail: driver.DriverEmail,
        DLNo: driver.DLNo,
        NICNo: driver.NICNo
      });
      
      setNotification({
        message: 'Profile updated successfully!',
        type: 'success'
      });
      setIsEditing(false);
      fetchDriverData();
    } catch (err) {
      setError('Failed to update profile');
      setNotification({
        message: err.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpdate = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      await axios.put(`http://localhost:4000/api/driver/pic/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setNotification({
        message: 'Profile picture updated successfully!',
        type: 'success'
      });
      fetchDriverData();
    } catch (err) {
      setError('Failed to update profile picture');
      setNotification({
        message: err.response?.data?.message || 'Failed to update profile picture',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/driver/delete/${id}`);
      setNotification({
        message: 'Account deleted successfully',
        type: 'success'
      });
      localStorage.clear();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to delete account');
      setNotification({
        message: err.response?.data?.message || 'Failed to delete account',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      setAvailabilityLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const response = await axios.post(`${API_BASE_URL}/driver/availability`, {
        driverId,
        date: today,
        availability: !currentAvailability
      });

      if (response.data.success) {
        setCurrentAvailability(!currentAvailability);
        setNotification({
          message: `Availability status updated to ${!currentAvailability ? 'available' : 'not available'}`,
          type: 'success'
        });
        fetchUpcomingSchedule();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setNotification({
        message: 'Failed to update availability status',
        type: 'error'
      });
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const renderProfileContent = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <div className="flex flex-col items-center">
            {driver?.profilePicture ? (
              <img 
                src={`http://localhost:4000/uploads/profile_pictures/${driver.profilePicture}`} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-500 w-20 h-20" />
            )}
            <label className="mt-2 px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">
              Change
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleProfilePictureUpdate(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!isEditing ? (
            <>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">Name</h3>
                      <p className="text-gray-700">{driver?.DriverName}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">Email</h3>
                      <p className="text-gray-700">{driver?.DriverEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">Phone</h3>
                      <p className="text-gray-700">{driver?.DriverPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">Address</h3>
                      <p className="text-gray-700">{driver?.DriverAdd}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">License No</h3>
                      <p className="text-gray-700">{driver?.DLNo}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-bold">NIC No</h3>
                      <p className="text-gray-700">{driver?.NICNo}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">Name</h3>
                      <input
                        type="text"
                        name="DriverName"
                        value={driver?.DriverName || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">Email</h3>
                      <input
                        type="email"
                        name="DriverEmail"
                        value={driver?.DriverEmail || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">Phone</h3>
                      <input
                        type="tel"
                        name="DriverPhone"
                        value={driver?.DriverPhone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">Address</h3>
                      <input
                        type="text"
                        name="DriverAdd"
                        value={driver?.DriverAdd || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-b py-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">License No</h3>
                      <input
                        type="text"
                        name="DLNo"
                        value={driver?.DLNo || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <div className="w-full">
                      <h3 className="text-lg font-bold">NIC No</h3>
                      <input
                        type="text"
                        name="NICNo"
                        value={driver?.NICNo || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderReservationsContent = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Assigned Reservations</h1>
        <div className="space-y-4">
          {/* Add your reservations content here */}
          <p className="text-gray-600">No reservations assigned yet.</p>
        </div>
      </div>
    </div>
  );

  const renderSalaryContent = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Salary Details</h1>
        <div className="space-y-4">
          {/* Add your salary content here */}
          <p className="text-gray-600">No salary information available.</p>
        </div>
      </div>
    </div>
  );

  const renderAvailabilityContent = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <ViewAvailability />
      </div>
    );
  };

  const renderDashboardHeader = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {driver?.DriverName}</h1>
          <p className="text-gray-600">Manage your profile and availability</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Current Status:</span>
          <button
            onClick={handleAvailabilityToggle}
            disabled={availabilityLoading}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentAvailability
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {availabilityLoading ? 'Updating...' : currentAvailability ? 'Available' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpcomingSchedule = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Schedule</h2>
      {upcomingSchedule.length > 0 ? (
        <div className="space-y-3">
          {upcomingSchedule.map((schedule, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                schedule.availability ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {format(new Date(schedule.date), 'MMMM dd, yyyy')}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    schedule.availability
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {schedule.availability ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No upcoming schedule found</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Notification message={notification.message} type={notification.type} />
      
      {/* Sidebar */}
      <aside className="w-[400px] bg-white p-6 border-r">
        <h2 className="text-2xl font-bold mb-6">Driver Panel</h2>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaUserEdit className={activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'} />
            <span className={activeTab === 'profile' ? 'font-semibold text-blue-600' : 'text-gray-600'}>Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === 'reservations' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaCalendarCheck className={activeTab === 'reservations' ? 'text-blue-600' : 'text-gray-600'} />
            <span className={activeTab === 'reservations' ? 'font-semibold text-blue-600' : 'text-gray-600'}>Assigned Reservations</span>
          </button>
          <button 
            onClick={() => setActiveTab('salary')}
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === 'salary' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaMoneyBill className={activeTab === 'salary' ? 'text-blue-600' : 'text-gray-600'} />
            <span className={activeTab === 'salary' ? 'font-semibold text-blue-600' : 'text-gray-600'}>Salary Details</span>
          </button>
          <button 
            onClick={() => setActiveTab('availability')}
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === 'availability' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaClock className={activeTab === 'availability' ? 'text-blue-600' : 'text-gray-600'} />
            <span className={activeTab === 'availability' ? 'font-semibold text-blue-600' : 'text-gray-600'}>Update Availability</span>
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 p-2 rounded hover:bg-red-50 w-full text-left mt-8"
          >
            <FaTrash className="text-red-600" />
            <span className="text-red-600">Delete account</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {renderDashboardHeader()}
        {activeTab === 'profile' && (
          <>
            {renderUpcomingSchedule()}
            {renderProfileContent()}
          </>
        )}
        {activeTab === 'reservations' && renderReservationsContent()}
        {activeTab === 'salary' && renderSalaryContent()}
        {activeTab === 'availability' && renderAvailabilityContent()}
      </main>
    </div>
  );
};

export default DriverDashboard;
