import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState('Customers');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:4000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
          data: { email } // Send email in request body
        });
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesType = selectedType === 'Customers' ? user.type === 'Customer' : user.type === 'admin';
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = searchQuery === '' || fullName.includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      
      <div className="mb-8 flex gap-4">
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Customers">Customers</option>
          <option value="Admins">Admins</option>
        </select>
        
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-md"
        />
      </div>

      <div className="space-y-6">
        {filteredUsers.map(user => (
          <div key={user._id} className="border-b pb-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-32">user id:</span>
                  <span>{user._id}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Phone:</span>
                  <span>{user.phone}</span>
                </div>
                {user.type === 'Customer' && (
                  <div className="flex">
                    <span className="font-semibold w-32">Loyalty points:</span>
                    <span>{user.loyaltyPoints}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-32">First Name:</span>
                  <span>{user.firstName}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Last Name:</span>
                  <span>{user.lastName}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(user.email)}
                className="bg-[#D05A53] hover:bg-[#B94A48] text-white px-6 py-2 rounded-full text-lg"
              >
                delete user
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManage; 