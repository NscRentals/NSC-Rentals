import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { FaUserEdit, FaCalendarCheck, FaMoneyBill, FaClock, FaEnvelope, FaPhone, FaUserCircle, FaTrash, FaCamera, FaMapMarkerAlt, FaIdCard, FaIdBadge, FaEdit, FaUser } from "react-icons/fa";
import axios from "axios";
import Notification from "../../components/Notification";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import ViewAvailability from "./ViewAvailability";
import DriverHeader from "./DriverHeader";
import DriverReservations from './DriverReservations';

const API_BASE_URL = "http://localhost:4000/api";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { userid } = useParams();
  const location = useLocation();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [currentAvailability, setCurrentAvailability] = useState(true);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const driverId = sessionStorage.getItem('driverId');

  const isDriverDashboard = location.pathname.startsWith("/driver/dashboard/");

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

    // Check if the URL userid matches the logged-in driver's id
    if (userid !== driverId) {
      setNotification({
        message: 'Unauthorized access',
        type: 'error'
      });
      navigate(`/driver/dashboard/${driverId}`);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [driverResponse, availabilityResponse, scheduleResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/driver/${userid}`),
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

    // Fetch notifications (unassigned reservations)
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/reservation/reservations');
        if (res.data && res.data.reservations) {
          setNotifications(res.data.reservations.filter(r => r.needDriver && !r.driverAssigned));
        }
      } catch (err) {
        // Ignore notification errors for now
      }
    };

    loadDashboardData();
    fetchNotifications();
  }, [userid, driverId, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:4000/api/driver/update/${userid}`, {
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
      
      await axios.put(`http://localhost:4000/api/driver/pic/${userid}`, formData, {
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
      await axios.delete(`http://localhost:4000/api/driver/delete/${userid}`);
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

  const handleAcceptReservation = async (reservationId) => {
    try {
      const res = await axios.post('http://localhost:4000/api/reservation/reservations/accept', {
        reservationId,
        driverId: driverId
      });
      if (res.data && res.data.reservation) {
        setNotifications(prev => prev.filter(r => r._id !== reservationId));
        setNotification({ message: 'Reservation accepted!', type: 'success' });
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.error || 'Failed to accept reservation', type: 'error' });
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
    <div className="space-y-6">
      <DriverReservations driverId={driverId} />
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

  const renderNotificationsContent = () => (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Unassigned Reservations</h2>
      {notifications.length === 0 ? (
        <p>No new reservations needing a driver.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(reservation => (
            <li key={reservation._id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><b>Customer:</b> {reservation.name}</div>
                <div><b>Vehicle:</b> {reservation.vehicleNum}</div>
                <div><b>Date:</b> {reservation.wanteddate}</div>
                <div><b>Pickup:</b> {reservation.locationpick}</div>
                <div><b>Drop-off:</b> {reservation.locationdrop}</div>
              </div>
              <button
                onClick={() => handleAcceptReservation(reservation._id)}
                className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 md:w-80 xl:w-96 min-w-[200px] max-w-[380px] bg-white px-6 md:px-12 py-4 fixed left-0 top-0 h-screen overflow-y-auto border-r border-gray-200 z-20">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-16">Driver Dashboard</h2>
        <nav className="space-y-10 pb-8">
          <div className="w-fit">
            <button
              onClick={() => setActiveTab('profile')}
              className={`block text-lg font-medium text-black relative group text-left ${activeTab === 'profile' ? 'font-bold' : ''}`}
              style={{ width: '100%' }}
            >
              Profile
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${activeTab === 'profile' ? 'w-full' : 'w-0'}`}></span>
            </button>
          </div>
          <div className="w-fit">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`block text-lg font-medium text-black relative group text-left ${activeTab === 'reservations' ? 'font-bold' : ''}`}
              style={{ width: '100%' }}
            >
              Reservations
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${activeTab === 'reservations' ? 'w-full' : 'w-0'}`}></span>
            </button>
          </div>
          <div className="w-fit">
            <button
              onClick={() => setActiveTab('salary')}
              className={`block text-lg font-medium text-black relative group text-left ${activeTab === 'salary' ? 'font-bold' : ''}`}
              style={{ width: '100%' }}
            >
              Salary Details
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${activeTab === 'salary' ? 'w-full' : 'w-0'}`}></span>
            </button>
          </div>
          <div className="w-fit">
            <button
              onClick={() => setActiveTab('availability')}
              className={`block text-lg font-medium text-black relative group text-left ${activeTab === 'availability' ? 'font-bold' : ''}`}
              style={{ width: '100%' }}
            >
              Availability
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${activeTab === 'availability' ? 'w-full' : 'w-0'}`}></span>
            </button>
          </div>
          <div className="w-fit">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`block text-lg font-medium text-black relative group text-left ${activeTab === 'notifications' ? 'font-bold' : ''}`}
              style={{ width: '100%' }}
            >
              Notifications
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${activeTab === 'notifications' ? 'w-full' : 'w-0'}`}></span>
            </button>
          </div>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-8 left-0 w-full flex justify-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-5/6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-sans text-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 md:ml-80 xl:ml-96 p-8 bg-white min-h-screen">
        {/* Summary Cards */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold">{currentAvailability ? 'Available' : 'Not Available'}</span>
            <span className="text-gray-600 mt-2">Current Status</span>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold">{upcomingSchedule.length}</span>
            <span className="text-gray-600 mt-2">Upcoming Schedules</span>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold">--</span>
            <span className="text-gray-600 mt-2">Total Reservations</span>
          </div>
        </div>

        {notification.message && (
          <Notification message={notification.message} type={notification.type} />
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && renderProfileContent()}
            {activeTab === 'reservations' && renderReservationsContent()}
            {activeTab === 'salary' && renderSalaryContent()}
            {activeTab === 'availability' && renderAvailabilityContent()}
            {activeTab === 'notifications' && renderNotificationsContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
