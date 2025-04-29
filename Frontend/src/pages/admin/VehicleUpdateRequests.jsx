import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VehicleUpdateRequests = () => {  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchPendingUpdates();
  }, []);
  const fetchPendingUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view pending updates');
        return;
      }
      
      const response = await axios.get('http://localhost:4000/api/vehicles/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data.vehicles.filter(v => v.pendingUpdate));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending updates:', error);
      toast.error('Failed to load pending update requests');
      setLoading(false);
    }
  };  const handleApproval = async (vehicleId, action) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to approve/reject vehicles');
        return;
      }

      const data = {
        action,
        isUpdateRequest: true,
        rejectionReason: action === 'reject' ? rejectionReason : undefined
      };

      await axios.put(`http://localhost:4000/api/vehicles/handle-approval/${vehicleId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Update request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setSelectedVehicle(null);
      setRejectionReason('');
      fetchPendingUpdates();
    } catch (error) {
      console.error('Error handling approval:', error);
      toast.error(error.response?.data?.message || 'Failed to process the request');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Vehicle Update Requests</h1>
      
      {vehicles.length === 0 ? (
        <p className="text-gray-600">No pending update requests found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </h2>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <span className="font-medium mr-2">Registration:</span>
                      {vehicle.registrationNumber}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium mr-2">Owner:</span>
                      {vehicle.owner?.name} 
                      <span className="text-gray-500 ml-2">({vehicle.owner?.email})</span>
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Requested Changes
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      {Object.entries(vehicle.pendingUpdateData || {}).map(([key, value]) => (
                        key !== 'updatedAt' && (
                          <div key={key} className="mb-3 last:mb-0 flex items-start">
                            <span className="font-medium text-gray-700 min-w-[120px]">{key}:</span>
                            <span className="text-gray-600 bg-white px-3 py-1 rounded-md ml-2 flex-grow">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 md:justify-start min-w-[140px]">
                  <button
                    onClick={() => handleApproval(vehicle.id, 'approve')}
                    className="w-full bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="w-full bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Reject Update Request</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full p-2 border rounded-lg mb-4 h-32"
              required
            />
            <div className="flex justify-end gap-4">              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproval(selectedVehicle.id, 'reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={!rejectionReason.trim() || processing}
              >
                {processing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleUpdateRequests;
