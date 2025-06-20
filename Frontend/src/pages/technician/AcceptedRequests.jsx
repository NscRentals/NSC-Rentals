import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AcceptedRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/technician/requests/accepted/${user._id}`);
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch accepted requests');
      setLoading(false);
      console.error('Error fetching accepted requests:', err);
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await axios.patch(`http://localhost:4000/api/technician/requests/${requestId}/complete`);
      toast.success('Request marked as completed');
      fetchAcceptedRequests();
    } catch (err) {
      toast.error('Failed to mark request as completed');
      console.error('Error completing request:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Accepted Requests</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {request.vehicleId.make} {request.vehicleId.model}
              </h2>
              <p className="text-gray-600">
                Issue: {request.issue}
              </p>
              <p className="text-gray-600">
                Status: <span className="font-medium text-blue-600">{request.status}</span>
              </p>
              <p className="text-gray-600">
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-end">
              {request.status === 'accepted' && (
                <button
                  onClick={() => handleComplete(request._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No accepted requests found</p>
        </div>
      )}
    </div>
  );
};

export default AcceptedRequests;
