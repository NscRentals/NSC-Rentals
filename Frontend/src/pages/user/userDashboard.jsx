import { FaEnvelope, FaPhone, FaCheckCircle, FaUserCircle, FaBell, FaUsers, FaCreditCard, FaUserFriends, FaTrash, FaUserEdit, FaCalendarCheck, FaMoneyBill, FaClock } from "react-icons/fa";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../../components/Notification";
import DriverAvailability from "../../components/driver/DriverAvailability";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const isDriver = localStorage.getItem('driverId');

  useEffect(() => {
    if (isDriver) {
      fetchDriverData();
    } else {
      fetchUserData();
    }
  }, [isDriver]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/user/me');
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch user data');
      setNotification({
        message: 'Failed to fetch user data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/driver/${isDriver}`);
      setUser(response.data.driverone);
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isDriver) {
        await axios.put(`http://localhost:4000/api/driver/update/${isDriver}`, {
          DriverName: user.DriverName,
          DriverPhone: user.DriverPhone,
          DriverAdd: user.DriverAdd,
          DriverEmail: user.DriverEmail,
          DLNo: user.DLNo,
          NICNo: user.NICNo
        });
      } else {
        await axios.put('http://localhost:4000/api/user', {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address
        });
      }
      setNotification({
        message: 'Profile updated successfully!',
        type: 'success'
      });
      setIsEditing(false);
      if (isDriver) {
        fetchDriverData();
      } else {
        fetchUserData();
      }
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
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpdate = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      if (isDriver) {
        await axios.put(`http://localhost:4000/api/driver/pic/${isDriver}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.put('http://localhost:4000/api/user/pic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setNotification({
        message: 'Profile picture updated successfully!',
        type: 'success'
      });
      if (isDriver) {
        fetchDriverData();
      } else {
        fetchUserData();
      }
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
      if (isDriver) {
        await axios.delete(`http://localhost:4000/api/driver/delete/${isDriver}`);
      } else {
        await axios.delete('http://localhost:4000/api/user', { data: { email: user.email } });
      }
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
        <h2 className="text-2xl font-bold mb-6">{isDriver ? 'Driver Panel' : 'My Account'}</h2>
        <nav className="space-y-4">
          {isDriver ? (
            <>
              <Link to="/user/myAccount" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaUserEdit className="text-gray-600" />
                <span className="font-semibold text-black">Edit Profile</span>
              </Link>
              <Link to="/driver/reservations" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaCalendarCheck className="text-gray-600" />
                <span className="text-gray-600">Assigned Reservations</span>
              </Link>
              <Link to="/driver/salary" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaMoneyBill className="text-gray-600" />
                <span className="text-gray-600">Salary Details</span>
              </Link>
              <Link to="/user/availability" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaClock className="text-gray-600" />
                <span className="text-gray-600">Driver Availability</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/user/myAccount" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaUserCircle className="text-gray-600" />
                <span className="font-semibold text-black">General</span>
              </Link>
              <Link to="/user/notifications" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaBell className="text-gray-600" />
                <span className="text-gray-600">Notifications</span>
              </Link>
              <Link to="/user/clubs" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaUsers className="text-gray-600" />
                <span className="text-gray-600">Clubs</span>
              </Link>
              <Link to="/user/payment" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaCreditCard className="text-gray-600" />
                <span className="text-gray-600">Payment & payout</span>
              </Link>
              <Link to="/user/referrals" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaUserFriends className="text-gray-600" />
                <span className="text-gray-600">My referrals</span>
              </Link>
              <Link to="/user/drivers" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <FaUsers className="text-gray-600" />
                <span className="text-gray-600">Drivers</span>
              </Link>
            </>
          )}
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 p-2 rounded hover:bg-red-50 w-full text-left"
          >
            <FaTrash className="text-red-600" />
            <span className="text-red-600">Delete account</span>
          </button>
        </nav>
      </aside>
      
      {/* Separator Line */}
      <div className="fixed left-[380px] top-[104px] h-[calc(100vh-124px)] w-px bg-gray-200"></div>
      
      {/* Main Content */}
      <div className="flex-1 ml-[380px] p-8 bg-white">
        <Routes>
          <Route path="/myAccount" element={
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">General</h1>
                {/* Profile Section */}
                <div className="flex flex-col items-center">
                  {user?.profilePicture ? (
                    <img 
                      src={`http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`} 
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
              {/* Account Details */}
              <div className="mt-6 bg-white p-6 shadow rounded">
                {!isEditing ? (
                  <>
                    {isDriver ? (
                      <>
                        <div className="border-b pb-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Name</h3>
                            <p className="text-gray-700">{user?.DriverName}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Email</h3>
                            <p className="text-gray-700">{user?.DriverEmail}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaPhone className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Phone</h3>
                            <p className="text-gray-700">{user?.DriverPhone}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Address</h3>
                            <p className="text-gray-700">{user?.DriverAdd}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">License No</h3>
                            <p className="text-gray-700">{user?.DLNo}</p>
                          </div>
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">NIC No</h3>
                            <p className="text-gray-700">{user?.NICNo}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border-b pb-4 flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Email</h3>
                            <p className="text-gray-700">{user?.email}</p>
                            <p className="text-sm text-gray-500">{user?.isVerified ? 'verified' : 'not verified'}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaPhone className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Cell phone</h3>
                            <p className="text-gray-700">{user?.phone || 'not set'}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">First Name</h3>
                            <p className="text-gray-700">{user?.firstName}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div>
                            <h3 className="text-lg font-bold">Last Name</h3>
                            <p className="text-gray-700">{user?.lastName}</p>
                          </div>
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          <h3 className="text-lg font-bold text-green-600">Password</h3>
                        </div>
                      </>
                    )}
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
                    {isDriver ? (
                      <>
                        <div className="border-b pb-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Name</h3>
                            <input
                              type="text"
                              name="DriverName"
                              value={user?.DriverName || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Email</h3>
                            <input
                              type="email"
                              name="DriverEmail"
                              value={user?.DriverEmail || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaPhone className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Phone</h3>
                            <input
                              type="tel"
                              name="DriverPhone"
                              value={user?.DriverPhone || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Address</h3>
                            <input
                              type="text"
                              name="DriverAdd"
                              value={user?.DriverAdd || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">License No</h3>
                            <input
                              type="text"
                              name="DLNo"
                              value={user?.DLNo || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">NIC No</h3>
                            <input
                              type="text"
                              name="NICNo"
                              value={user?.NICNo || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border-b pb-4 flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Email</h3>
                            <input
                              type="email"
                              name="email"
                              value={user?.email || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">{user?.isVerified ? 'verified' : 'not verified'}</p>
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaPhone className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Cell phone</h3>
                            <input
                              type="tel"
                              name="phone"
                              value={user?.phone || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">First Name</h3>
                            <input
                              type="text"
                              name="firstName"
                              value={user?.firstName || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="border-b py-4 flex items-center gap-2">
                          <FaUserCircle className="text-gray-500" />
                          <div className="w-full">
                            <h3 className="text-lg font-bold">Last Name</h3>
                            <input
                              type="text"
                              name="lastName"
                              value={user?.lastName || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          <h3 className="text-lg font-bold text-green-600">Password</h3>
                        </div>
                      </>
                    )}
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
          } />
          <Route path="/notifications" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Notifications</h1>
              <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600">No new notifications</p>
              </div>
            </div>
          } />
          <Route path="/clubs" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Clubs</h1>
              <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600">No clubs joined yet</p>
              </div>
            </div>
          } />
          <Route path="/payment" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Payment & Payout</h1>
              <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600">No payment methods added yet</p>
              </div>
            </div>
          } />
          <Route path="/referrals" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">My Referrals</h1>
              <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600">No referrals yet</p>
              </div>
            </div>
          } />
          <Route path="/drivers" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Drivers</h1>
              <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600">No drivers assigned yet</p>
              </div>
            </div>
          } />
          <Route path="/availability" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Driver Availability</h1>
              <div className="bg-white p-6 shadow rounded">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Your Availability</h2>
                  <Link 
                    to="/user/availability/view" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Schedule
                  </Link>
                </div>
                <DriverAvailability />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}
