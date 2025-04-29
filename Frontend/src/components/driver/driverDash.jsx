import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUserEdit, FaCalendarCheck, FaMoneyBill, FaClock, FaEnvelope, FaPhone, FaUserCircle, FaTrash, FaCamera, FaMapMarkerAlt, FaIdCard, FaIdBadge, FaEdit, FaUser } from "react-icons/fa";
import axios from "axios";
import Notification from "../Notification";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import ViewAvailability from "./ViewAvailability";
import DriverHeader from "./DriverHeader";

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
    // Check if we have a valid driverId
    if (!driverId) {
      setNotification({
        message: 'Please log in to access the dashboard',
        type: 'error'
      });
      navigate('/login');
      return;
    }

    // Check if the URL id matches the logged-in driver's id
    if (id !== driverId) {
      setNotification({
        message: 'Unauthorized access',
        type: 'error'
      });
      navigate(`/dashboard/${driverId}`);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [driverResponse, availabilityResponse, scheduleResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/driver/${id}`),
          axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`),
          axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`)
        ]);

        // Set driver data
        setDriver(driverResponse.data.driverone);

        // Set current availability
        if (availabilityResponse.data.success) {
          const today = format(new Date(), 'yyyy-MM-dd');
          const todaySchedule = availabilityResponse.data.data.find(item => item.date === today);
          setCurrentAvailability(todaySchedule ? todaySchedule.availability : true);
        }

        // Set upcoming schedule
        if (scheduleResponse.data.success) {
          const today = new Date();
          const upcoming = scheduleResponse.data.data
            .filter(item => new Date(item.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
          setUpcomingSchedule(upcoming);
        }

      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setNotification({
          message: err.response?.data?.message || 'Failed to load dashboard data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [id, driverId, navigate]);

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
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Driver Profile</h1>
            <p className="text-gray-600 mt-2 font-sans">Manage your personal information</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              {driver?.profilePicture ? (
                <img 
                  src={`http://localhost:4000/uploads/profile_pictures/${driver.profilePicture}`} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-24 h-24" />
              )}
              <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors">
                <FaCamera className="text-white w-4 h-4" />
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
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {!isEditing ? (
            <>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.DriverName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">Email</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.DriverEmail}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">Phone</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.DriverPhone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">Address</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.DriverAdd}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">License No</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaIdCard className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.DLNo}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 font-sans">NIC No</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaIdBadge className="text-gray-400" />
                      <span className="text-gray-900 font-sans">{driver?.NICNo}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-sans"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-sans"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleProfileUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="DriverName"
                      value={driver?.DriverName || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="DriverEmail"
                      value={driver?.DriverEmail || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="DriverPhone"
                      value={driver?.DriverPhone || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="DriverAdd"
                      value={driver?.DriverAdd || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">License No</label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="DLNo"
                      value={driver?.DLNo || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 font-sans">NIC No</label>
                  <div className="relative">
                    <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="NICNo"
                      value={driver?.NICNo || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-sans"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderReservationsContent = () => (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 font-sans">Assigned Reservations</h1>
        <div className="space-y-4">
          <p className="text-gray-600 font-sans">No reservations assigned yet.</p>
        </div>
      </div>
    </div>
  );

  const renderSalaryContent = () => (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 font-sans">Salary Details</h1>
        <div className="space-y-4">
          <p className="text-gray-600 font-sans">No salary information available.</p>
        </div>
      </div>
    </div>
  );

  const renderAvailabilityContent = () => {
    return (
      <div className="max-w-7xl mx-auto font-sans">
        <ViewAvailability />
      </div>
    );
  };

  const renderDashboardHeader = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-sans">Welcome, {driver?.DriverName}</h1>
          <p className="text-gray-600 font-sans">Manage your profile and availability</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-sans">Current Status:</span>
          <button
            onClick={handleAvailabilityToggle}
            disabled={availabilityLoading}
            className={`px-4 py-2 rounded-full font-medium font-sans transition-colors ${
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 font-sans">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 font-sans">Upcoming Schedule</h2>
      {upcomingSchedule.length > 0 ? (
        <div className="space-y-3">
          {upcomingSchedule.map((schedule, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg font-sans ${
                schedule.availability ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium font-sans">
                  {format(new Date(schedule.date), 'MMMM dd, yyyy')}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-sans ${
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
        <p className="text-gray-600 font-sans">No upcoming schedule found</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <DriverHeader />
      
      <div className="flex pt-16">
        <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-16">
          <div className="p-4">
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2">
                  {driver?.profilePicture ? (
                    <img
                      src={`http://localhost:4000/${driver.profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold font-sans">{driver?.DriverName}</h2>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg font-sans ${
                  activeTab === 'profile' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FaUserEdit />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg font-sans ${
                  activeTab === 'reservations' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FaCalendarCheck />
                <span>Reservations</span>
              </button>

              <button
                onClick={() => setActiveTab('salary')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg font-sans ${
                  activeTab === 'salary' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FaMoneyBill />
                <span>Salary Details</span>
              </button>

              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg font-sans ${
                  activeTab === 'availability' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FaClock />
                <span>Availability</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1 ml-64 p-8">
          {notification.message && (
            <Notification message={notification.message} type={notification.type} />
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {renderDashboardHeader()}
              {activeTab === 'profile' && renderProfileContent()}
              {activeTab === 'reservations' && renderReservationsContent()}
              {activeTab === 'salary' && renderSalaryContent()}
              {activeTab === 'availability' && renderAvailabilityContent()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
