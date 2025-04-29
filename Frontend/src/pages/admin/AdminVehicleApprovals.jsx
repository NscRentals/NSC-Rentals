import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminVehicleApprovals = () => {
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/vehicles/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingVehicles(response.data.vehicles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending vehicles:', error);
      toast.error('Failed to load pending vehicles');
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:4000/api/vehicles/handle-approval/${id}`, 
        { 
          action, 
          rejectionReason: action === 'reject' ? rejectionReason : undefined 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Vehicle ${action}ed successfully`);
      setSelectedVehicle(null);
      setRejectionReason('');
      fetchPendingVehicles();
    } catch (error) {
      console.error('Error handling vehicle approval:', error);
      toast.error(`Failed to ${action} vehicle`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Vehicle Approvals</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {pendingVehicles.map((vehicle) => (
          <div 
            key={vehicle.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h2>
                  <p className="text-gray-600">Registration: {vehicle.registrationNumber}</p>
                  {vehicle.owner ? (
                    <>
                      <p className="text-gray-600">
                        Owner: {vehicle.owner.name || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Contact: {`${vehicle.owner.email || 'N/A'} ${vehicle.owner.phone ? `| ${vehicle.owner.phone}` : ''}`}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-600">Owner: No owner information available</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApproval(vehicle.id, 'approve')}
                    className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {pendingVehicles.length === 0 && (
          <div className="text-center text-gray-600">
            No pending vehicles to approve
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
            <h3 className="text-xl font-semibold mb-4">Reject Vehicle</h3>
            <p className="mb-4 text-gray-600">
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.registrationNumber})
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full p-3 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

export default AdminVehicleApprovals;
