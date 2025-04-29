import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SparePartsInventory = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);  const [formData, setFormData] = useState({
    name: '',
    category: '',
    specifications: '',
    quantity: 0,
    price: 0,
    availability: true
  });

  const fetchParts = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view inventory');
        navigate('/login');
        return;
      }      // Decode the token to check user role      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');      const tokenData = JSON.parse(window.atob(base64));
      console.log('User role:', tokenData.type); // Add this line to debug
      
      if (tokenData.type !== 'admin' && tokenData.type !== 'technician') {
        toast.error('Only admins and technicians can view the spare parts inventory');
        navigate('/');
        return;
      }
      
      const response = await axios.get(
        'http://localhost:4000/api/maintenance',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setParts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      toast.error('Failed to load inventory');
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in');
        return;
      }

      if (selectedPart) {
        // Edit existing part
        await axios.put(
          `http://localhost:4000/api/maintenance/${selectedPart._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Part updated successfully');
      } else {
        // Add new part
        await axios.post(
          'http://localhost:4000/api/maintenance',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Part added successfully');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedPart(null);
      resetForm();
      fetchParts();
    } catch (error) {
      console.error('Error saving part:', error);
      toast.error(error.response?.data?.message || 'Failed to save part');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this part?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in');
        return;
      }      await axios.delete(
        `http://localhost:4000/api/maintenance/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Part deleted successfully');
      fetchParts();
    } catch (error) {
      console.error('Error deleting part:', error);
      toast.error('Failed to delete part');
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {    setFormData({
      name: '',
      category: '',
      specifications: '',
      quantity: 0,
      price: 0,
      availability: true
    });
  };
  const startEdit = (part) => {
    setSelectedPart(part);
    setFormData({      partId: part.partId,
      name: part.name,
      category: part.category,
      specifications: part.specifications,
      quantity: part.quantity,
      price: part.price,
      availability: part.availability
    });
    setShowEditModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spare Parts Inventory</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-green-600"
        >
          Add New Part
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parts.map((part) => (
              <tr key={part._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{part.partId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{part.name}</td>
                <td className="px-6 py-4">{part.specifications}</td>
                <td className="px-6 py-4 whitespace-nowrap">{part.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    part.quantity === 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {part.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${part.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    part.availability
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {part.availability ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => startEdit(part)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(part._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              {showEditModal ? 'Edit Part' : 'Add New Part'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Engine">Engine</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Body">Body</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Specifications</label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={formData.availability}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        availability: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Available</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedPart(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mygreen text-white rounded-md hover:bg-green-600"
                >
                  {showEditModal ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsInventory;
