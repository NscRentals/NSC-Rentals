import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DamageRequestsList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);  const [selectedRequest, setSelectedRequest] = useState(null);
  const [repairStatus, setRepairStatus] = useState('');
  const [usedParts, setUsedParts] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: '',
    scheduledTimeSlot: '',
    estimatedDuration: ''
  });

  useEffect(() => {
    fetchDamageRequests();
  }, []);

  const fetchDamageRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view requests');
        navigate('/login');
        return;
      }      const response = await axios.get(
        'http://localhost:4000/api/damage-requests/all',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage requests:', error);
      toast.error('Failed to load damage requests');
      setLoading(false);
    }
  };
  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to accept requests');
        return;
      }

      // First accept the request
      await axios.patch(
        `http://localhost:4000/api/damage-requests/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Then show scheduling modal
      setSelectedRequest(id);
      setShowScheduleModal(true);
      
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to schedule request');
        return;
      }

      await axios.patch(
        `http://localhost:4000/api/damage-requests/${selectedRequest}/schedule`,
        scheduleData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Request scheduled successfully');
      setShowScheduleModal(false);
      setSelectedRequest(null);
      setScheduleData({
        scheduledDate: '',
        scheduledTimeSlot: '',
        estimatedDuration: ''
      });
      fetchDamageRequests();
    } catch (error) {
      console.error('Error scheduling request:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule request');
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update status');
        return;
      }

      await axios.patch(
        `http://localhost:4000/api/damage-requests/${id}/updateRepairStatus`,
        {
          status: repairStatus,
          usedParts: usedParts
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Status updated successfully');
      setSelectedRequest(null);
      setRepairStatus('');
      setUsedParts([]);
      fetchDamageRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const renderRequestCard = (request) => (
    <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
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
          <p className={`mt-2 font-semibold ${
            request.status === 'Completed' ? 'text-green-600' :
            request.status === 'In Progress' ? 'text-blue-600' :
            'text-yellow-600'
          }`}>
            Status: {request.status}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {!request.technicianId && (
            <button
              onClick={() => handleAccept(request._id)}
              className="bg-mygreen text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Accept Request
            </button>
          )}
          
          {request.technicianId?._id === localStorage.getItem('userId') && (
            <>
              <button
                onClick={() => setSelectedRequest(request)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
              {request.status !== 'Completed' && (
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowScheduleModal(true);
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Schedule
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderScheduleModal = () => (
    showScheduleModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-semibold mb-4">Schedule Repair</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
              <input
                type="date"
                value={scheduleData.scheduledDate}
                onChange={(e) => setScheduleData(prev => ({
                  ...prev,
                  scheduledDate: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time Slot</label>
              <select
                value={scheduleData.scheduledTimeSlot}
                onChange={(e) => setScheduleData(prev => ({
                  ...prev,
                  scheduledTimeSlot: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Select a time slot</option>
                <option value="09:00-12:00">Morning (9 AM - 12 PM)</option>
                <option value="13:00-17:00">Afternoon (1 PM - 5 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Duration (hours)</label>
              <input
                type="number"
                value={scheduleData.estimatedDuration}
                onChange={(e) => setScheduleData(prev => ({
                  ...prev,
                  estimatedDuration: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => {
                setShowScheduleModal(false);
                setSelectedRequest(null);
                setScheduleData({
                  scheduledDate: '',
                  scheduledTimeSlot: '',
                  estimatedDuration: ''
                });
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleSubmit}
              className="px-4 py-2 bg-mygreen text-white rounded hover:bg-green-600"
              disabled={!scheduleData.scheduledDate || !scheduleData.scheduledTimeSlot || !scheduleData.estimatedDuration}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderStatusModal = () => (
    selectedRequest && !showScheduleModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-semibold mb-4">Update Repair Status</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={repairStatus}
              onChange={(e) => setRepairStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {repairStatus === 'Completed' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Used Parts (JSON)
              </label>
              <textarea
                value={JSON.stringify(usedParts, null, 2)}
                onChange={(e) => {
                  try {
                    setUsedParts(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder='[{"partId": "...", "quantity": 1, "cost": 100}]'
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setSelectedRequest(null);
                setRepairStatus('');
                setUsedParts([]);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedRequest._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!repairStatus}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="grid gap-6">
        {requests.filter(request => request.status === 'Pending').length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No pending damage requests available.
          </div>
        ) : (
          requests
            .filter(request => request.status === 'Pending')
            .map(renderRequestCard)
        )}
      </div>
      {renderScheduleModal()}
      {renderStatusModal()}
    </>
  );
};

export default DamageRequestsList;
