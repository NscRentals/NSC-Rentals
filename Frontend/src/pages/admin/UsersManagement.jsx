import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("all"); // "all" or "verifications"
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchUnverifiedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/users/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/users/unverified", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnverifiedUsers(response.data);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:4000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        data: { email }
      });
      setUsers(users.filter(user => user.email !== email));
      setUnverifiedUsers(unverifiedUsers.filter(user => user.email !== email));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleToggleVerification = async (email, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (currentStatus) {
        // If currently verified, unverify
        await axios.put("http://localhost:4000/api/users/unverify", 
          { email }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.map(user => 
          user.email === email ? { ...user, isVerified: false } : user
        ));
        toast.success("User unverified successfully!");
      } else {
        // If currently unverified, verify
        await axios.put("http://localhost:4000/api/users/verify", 
          { email }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.map(user => 
          user.email === email ? { ...user, isVerified: true } : user
        ));
        setUnverifiedUsers(unverifiedUsers.filter(user => user.email !== email));
        toast.success("User verified successfully!");
      }
    } catch (error) {
      console.error("Error toggling verification:", error);
      toast.error("Failed to update user verification status");
    }
  };

  const handleApproveVerification = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/users/verify", 
        { email }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnverifiedUsers(unverifiedUsers.filter(user => user.email !== email));
      setUsers(users.map(user => 
        user.email === email ? { ...user, isVerified: true } : user
      ));
      toast.success("User verified successfully!");
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify user");
    }
  };

  const handleRejectVerification = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:4000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        data: { email }
      });
      setUnverifiedUsers(unverifiedUsers.filter(user => user.email !== email));
      setUsers(users.filter(user => user.email !== email));
      toast.success("User rejected and removed!");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    }
  };

  const handleSeeDetails = (user) => {
    // Navigate to user reservations page with user data
    navigate(`/admin/user-reservations/${user._id}`, { 
      state: { 
        user: user,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`
      } 
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "verified" && user.isVerified) ||
                         (filterType === "unverified" && !user.isVerified) ||
                         (filterType === "admin" && user.type === "admin") ||
                         (filterType === "customer" && user.type === "customer");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Users Management</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setViewMode("verifications")}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === "verifications"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Verifications ({unverifiedUsers.length})
            </button>
          </div>
        </div>

        {viewMode === "all" ? (
          <>
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="admin">Admins</option>
                  <option value="customer">Customers</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={`http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`}
                                  alt="Profile"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/40x40?text=U';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user._id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.type === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {user.type === 'customer' && (
                                <button
                                  onClick={() => handleSeeDetails(user)}
                                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  See Details
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </>
        ) : (
          <>
            {/* Verifications Section */}
            <div className="space-y-8">
              {unverifiedUsers.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                  No unverified users found
                </div>
              ) : (
                unverifiedUsers.map(user => (
                  <div key={user._id} className="bg-[#F6F6F6] rounded-3xl p-10 flex flex-col gap-6 shadow-sm">
                    <div className="flex flex-row items-start">
                      <div className="flex flex-col gap-2 min-w-[220px]">
                        <span className="font-bold">User ID :</span>
                        <span className="mb-2">{user._id}</span>
                        <span className="font-bold">Name :</span>
                        <span className="mb-2">{user.firstName} {user.lastName}</span>
                        <span className="font-bold">Email :</span>
                        <span className="mb-2">{user.email}</span>
                        <span className="font-bold">Phone :</span>
                        <span className="mb-2">{user.phone}</span>
                        <span className="font-bold">Address :</span>
                        <span className="mb-2">
                          {user.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}, ${user.address.country}` : 'No address provided'}
                        </span>
                        <span className="font-bold">User Type :</span>
                        <span className="mb-2">{user.type}</span>
                      </div>
                      <div className="flex flex-row gap-3 ml-auto">
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          <span className="font-bold">Profile Picture</span>
                          <img 
                            src={`http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`} 
                            alt="Profile" 
                            className="w-32 h-32 object-contain border rounded-xl bg-white cursor-pointer"
                            onClick={() => setPreviewImg(`http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`)}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-6 mt-2 justify-end">
                      <button
                        onClick={() => handleRejectVerification(user.email)}
                        className="px-10 py-3 bg-[#B94A48] text-white rounded-full text-lg font-semibold shadow-sm hover:bg-[#a03d3a]"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveVerification(user.email)}
                        className="px-10 py-3 bg-[#4A7B3F] text-white rounded-full text-lg font-semibold shadow-sm hover:bg-[#38622e]"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setPreviewImg(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={previewImg} alt="Preview" className="max-w-[90vw] max-h-[80vh] rounded shadow-lg" />
            <button onClick={() => setPreviewImg(null)} className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold text-lg shadow">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement; 