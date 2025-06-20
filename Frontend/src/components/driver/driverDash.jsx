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
import DriverReservations from './DriverReservations';
import DriverSalary from './DriverSalary';
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:4000/api";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [currentAvailability, setCurrentAvailability] = useState(true);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for auth to be initialized
        if (authLoading) {
          console.log('Auth is still loading...');
          return;
        }

        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const driverId = localStorage.getItem('driverId');

        console.log('Checking auth state:', { token: !!token, userType, driverId });

        // Check if we have all required auth data
        if (!token || !userType || userType !== 'driver' || !driverId) {
          console.log('Missing auth data, redirecting to login');
          navigate('/login');
          return;
        }

        // Wait for user data to be available
        if (!user) {
          console.log('Waiting for user data...');
          return;
        }

        // Check if user is a driver
        if (user.type !== 'driver') {
          console.log('Not a driver, redirecting to login');
          navigate('/login');
          return;
        }

        // Use the user data from context
        setDriver(user);
        console.log("Setting driver data from context:", user);

        // Only fetch availability if we haven't already
        if (!upcomingSchedule.length) {
          // Fetch availability data
          const availabilityResponse = await axios.get(`${API_BASE_URL}/driver/availability/schedule/${user._id}`);
          if (availabilityResponse.data.success) {
            const today = format(new Date(), 'yyyy-MM-dd');
            const todaySchedule = availabilityResponse.data.data.find(item => item.date === today);
            setCurrentAvailability(todaySchedule ? todaySchedule.availability : true);
            
            // Set upcoming schedule
            const upcoming = availabilityResponse.data.data
              .filter(item => new Date(item.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5);
            setUpcomingSchedule(upcoming);
          }
        }
      } catch (err) {
        console.error('Dashboard loading error:', err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setNotification({
          message: err.response?.data?.message || 'Failed to load dashboard data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, authLoading, isAuthenticated, navigate, upcomingSchedule.length]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/driver/update/${user?._id}`, {
        DriverName: driver.DriverName || driver.name,
        DriverPhone: driver.DriverPhone || driver.phone,
        DriverAdd: driver.DriverAdd || driver.address,
        DriverEmail: driver.DriverEmail || driver.email,
        DLNo: driver.DLNo || driver.dlNo,
        NICNo: driver.NICNo || driver.nicNo
      });
      
      if (response.data.success) {
        setNotification({
          message: 'Profile updated successfully!',
          type: 'success'
        });
        setIsEditing(false);
        // Update the local state with the new data
        setDriver(response.data.driver);
      } else {
        throw new Error(response.data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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
      
      await axios.put(`http://localhost:4000/api/driver/pic/${user?._id}`, formData, {
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
      await axios.delete(`http://localhost:4000/api/driver/delete/${user?._id}`);
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
        driverId: user?._id,
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
    if (!driver) {
      return <div className="text-center py-8">Loading driver data...</div>;
    }

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
                  src={driver.profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400" />
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                  <FaCamera className="text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handleProfilePictureUpdate(e.target.files[0])} 
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="DriverName"
                value={driver.DriverName || driver.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="DriverPhone"
                value={driver.DriverPhone || driver.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="DriverEmail"
                value={driver.DriverEmail || driver.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="DriverAdd"
                value={driver.DriverAdd || driver.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver's License Number</label>
              <input
                type="text"
                name="DLNo"
                value={driver.DLNo || driver.dlNo || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NIC Number</label>
              <input
                type="text"
                name="NICNo"
                value={driver.NICNo || driver.nicNo || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2" /> Delete Account
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderReservationsContent = () => (
    <div className="space-y-6">
      <DriverReservations driverId={user?._id} />
    </div>
  );

  const renderSalaryContent = () => (
    <div className="max-w-4xl mx-auto font-sans">
      <DriverSalary driverId={user?._id} />
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
    <div className="min-h-screen bg-gray-50">
      <DriverHeader />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="w-72 bg-white shadow-sm min-h-screen fixed left-0 top-16 border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-50">
                  {driver?.profilePicture ? (
                    <img
                      src={`http://localhost:4000/${driver.profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <FaUserCircle className="w-16 h-16 text-blue-300" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{driver?.DriverName}</h2>
                <p className="text-sm text-gray-500 mt-1">Professional Driver</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaUserEdit className={activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  activeTab === 'reservations' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaCalendarCheck className={activeTab === 'reservations' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-medium">Reservations</span>
              </button>

              <button
                onClick={() => setActiveTab('salary')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  activeTab === 'salary' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaMoneyBill className={activeTab === 'salary' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-medium">Salary Details</span>
              </button>

              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  activeTab === 'availability' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaClock className={activeTab === 'availability' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-medium">Availability</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-72 p-8">
          {notification.message && (
            <div className="mb-6">
              <Notification message={notification.message} type={notification.type} />
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Dashboard Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {driver?.DriverName}</h1>
                    <p className="text-gray-500 mt-1">Here's your dashboard overview</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Availability Status</span>
                    <button
                      onClick={handleAvailabilityToggle}
                      disabled={availabilityLoading}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
                        currentAvailability
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {availabilityLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${currentAvailability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {currentAvailability ? 'Available' : 'Not Available'}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FaCalendarCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Trips</h3>
                      <p className="text-2xl font-semibold text-gray-800">24</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <FaMoneyBill className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Monthly Earnings</h3>
                      <p className="text-2xl font-semibold text-gray-800">$2,450</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <FaClock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Hours Active</h3>
                      <p className="text-2xl font-semibold text-gray-800">156h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {activeTab === 'profile' && renderProfileContent()}
                {activeTab === 'reservations' && renderReservationsContent()}
                {activeTab === 'salary' && renderSalaryContent()}
                {activeTab === 'availability' && renderAvailabilityContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
