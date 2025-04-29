import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AcceptedRequests = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spareParts, setSpareParts] = useState([]);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    usedParts: [],
    repairNotes: '',
  });

  useEffect(() => {
    // Check if user is a technician
    if (!user) {
      toast.error('Please log in to access this page');
      navigate('/login');
      return;
    }

    if (user.type?.toLowerCase() !== 'technician') {
      toast.error('Only technicians can access this page');
      navigate('/');
      return;
    }

    fetchAcceptedRequests();
    fetchSpareParts();
  }, [user, navigate]);

  const fetchSpareParts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view spare parts');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:4000/api/maintenance',
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view spare parts');
        navigate('/');
      } else {
        toast.error('Failed to load spare parts');
      }
    }
  };

  const handleCompleteClick = (request) => {
    setSelectedRequest(request);
    setShowCompleteForm(true);
    setFormData({
      usedParts: [],
      repairNotes: '',
    });
  };

  const addPart = () => {
    setFormData(prev => ({
      ...prev,
      usedParts: [...prev.usedParts, { partId: '', quantity: 1, cost: 0 }]
    }));
  };

  const removePart = (index) => {
    setFormData(prev => ({
      ...prev,
      usedParts: prev.usedParts.filter((_, i) => i !== index)
    }));
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...formData.usedParts];
    if (field === 'partId') {
      const selectedPart = spareParts.find(part => part._id === value);
      updatedParts[index] = {
        ...updatedParts[index],
        partId: value,
        cost: selectedPart ? selectedPart.price * updatedParts[index].quantity : 0
      };
    } else if (field === 'quantity') {
      const selectedPart = spareParts.find(part => part._id === updatedParts[index].partId);
      updatedParts[index] = {
        ...updatedParts[index],
        quantity: parseInt(value),
        cost: selectedPart ? selectedPart.price * parseInt(value) : 0
      };
    }
    setFormData(prev => ({
      ...prev,
      usedParts: updatedParts
    }));
  };

  const calculateTotalCost = () => {
    return formData.usedParts.reduce((total, part) => total + (part.cost || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:4000/api/damage-requests/${selectedRequest._id}/update-status`,
        {
          status: 'Completed',
          usedParts: formData.usedParts,
          repairNotes: formData.repairNotes,
          totalCost: calculateTotalCost(),
          completedAt: new Date()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Request completed successfully');
      setShowCompleteForm(false);
      fetchAcceptedRequests();
    } catch (error) {
      toast.error('Failed to complete request');
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view requests');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:4000/api/damage-requests/my-assigned',
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching accepted requests:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view assigned requests');
        navigate('/');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to load accepted requests');
      }
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Assigned Requests</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No assigned requests found.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Vehicle: {request.vehicle?.make || 'N/A'} {request.vehicle?.model || ''}
                  </h2>
                  <p className="text-gray-600">
                    Registration: {request.vehicle?.registrationNumber || 'N/A'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Description: {request.description}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Reported by: {request.reportedBy?.firstName || 'N/A'} {request.reportedBy?.lastName || ''}
                  </p>
                  <p className="text-gray-600">
                    Scheduled Date: {formatDate(request.scheduledDate)}
                  </p>
                  <p className="text-gray-600">
                    Time Slot: {request.scheduledTimeSlot}
                  </p>
                  <p className="text-gray-600">
                    Estimated Duration: {request.estimatedDuration} hours
                  </p>
                  <p className={`mt-2 font-semibold ${
                    request.status === 'Completed' ? 'text-green-600' :
                    request.status === 'In Progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {request.status}
                  </p>
                </div>
              </div>
              
              {request.status !== 'Completed' && (
                <button
                  onClick={() => handleCompleteClick(request)}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Complete Request
                </button>
              )}
            </div>
          ))}

          {showCompleteForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Complete Request</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={addPart}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                    >
                      Add Spare Part
                    </button>
                    
                    {formData.usedParts.map((part, index) => (
                      <div key={index} className="flex gap-4 mb-2 items-center">
                        <select
                          value={part.partId}
                          onChange={(e) => handlePartChange(index, 'partId', e.target.value)}
                          className="border p-2 rounded flex-1"
                          required
                        >
                          <option value="">Select Part</option>
                          {spareParts.map(sp => (
                            <option key={sp._id} value={sp._id}>
                              {sp.name} - Stock: {sp.quantity} - Price: ${sp.price}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={part.quantity}
                          onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                          className="border p-2 rounded w-24"
                          required
                        />
                        <div className="w-24">Cost: ${part.cost}</div>
                        <button
                          type="button"
                          onClick={() => removePart(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Repair Notes:</label>
                    <textarea
                      value={formData.repairNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, repairNotes: e.target.value }))}
                      className="border p-2 rounded w-full"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="font-bold mb-4">
                    Total Cost: ${calculateTotalCost()}
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCompleteForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedRequests;
