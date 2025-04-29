import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserDamageRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view your requests');
        navigate('/login');
        return;
      }      const response = await axios.get(
        'http://localhost:4000/api/damage-requests/my-requests',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage requests:', error);
      toast.error('Failed to load your damage requests');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete requests');
        return;
      }

      await axios.delete(
        `http://localhost:4000/api/damage-requests/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Request deleted successfully');
      fetchUserRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error(error.response?.data?.message || 'Failed to delete request');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Damage Requests</h1>
        <button
          onClick={() => navigate('/damage-request/new')}
          className="bg-mygreen text-white px-6 py-2 rounded-full hover:bg-green-600"
        >
          Report New Damage
        </button>
      </div>
      
      <div className="grid gap-6">
        {requests.map((request) => (
          <div 
            key={request._id} 
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Vehicle: {request.vehicle.make} {request.vehicle.model}
                </h2>
                <p className="text-gray-600">
                  Registration: {request.vehicle.registrationNumber}
                </p>
                <p className="text-gray-700 mt-2">
                  Description: {request.description}
                </p>
                <p className="text-gray-600 mt-2">
                  Submitted: {formatDate(request.createdAt)}
                </p>
                {request.assignedTo && (
                  <p className="text-gray-600">
                    Technician: {request.assignedTo.firstName} {request.assignedTo.lastName}
                  </p>
                )}
                <p className={`mt-2 font-semibold ${
                  request.status === 'Completed' ? 'text-green-600' :
                  request.status === 'In Progress' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  Status: {request.status}
                </p>

                {request.status === 'Completed' && (
                  <button
                    onClick={() => setSelectedReport(request)}
                    className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200"
                  >
                    View Report
                  </button>
                )}
              </div>

              {request.status === 'Pending' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this request?')) {
                      handleDelete(request._id);
                    }
                  }}
                  className="bg-red-50 text-red-700 px-4 py-2 rounded-full hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-center text-gray-600">No damage requests found.</p>
        )}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4">Repair Report</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Vehicle Information</h4>
                <p>{selectedReport.vehicle.make} {selectedReport.vehicle.model}</p>
                <p>Registration: {selectedReport.vehicle.registrationNumber}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Damage Description</h4>
                <p>{selectedReport.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Repair Timeline</h4>
                <p>Reported: {formatDate(selectedReport.createdAt)}</p>
                <p>Completed: {formatDate(selectedReport.completedAt)}</p>
              </div>

              {selectedReport.usedParts && selectedReport.usedParts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Parts Used</h4>
                  <table className="w-full mt-2">
                    <thead>
                      <tr className="text-left bg-gray-50">
                        <th className="p-2">Part</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.usedParts.map((part, index) => (
                        <tr key={index}>
                          <td className="p-2">{part.partId}</td>
                          <td className="p-2">{part.quantity}</td>
                          <td className="p-2">${part.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-700">Total Cost</h4>
                <p>${selectedReport.totalCost.toFixed(2)}</p>
              </div>

              {selectedReport.repairNotes && (
                <div>
                  <h4 className="font-semibold text-gray-700">Repair Notes</h4>
                  <p>{selectedReport.repairNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDamageRequests;
