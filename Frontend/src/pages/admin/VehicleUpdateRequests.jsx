import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VehicleUpdateRequests = () => {
  const [damageRequests, setDamageRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    console.log('VehicleUpdateRequests component mounted');
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token payload:', JSON.parse(atob(token.split('.')[1])));
    }
    fetchDamageRequests();
  }, []);

  const fetchDamageRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view damage requests');
        return;
      }
      
      console.log('Fetching damage requests...');
      const response = await axios.get('http://localhost:4000/api/damage-requests/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Damage requests response:', response.data);
      setDamageRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage requests:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load damage requests');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Damage Requests</h1>
      
      {damageRequests.length === 0 ? (
        <p className="text-gray-600">No damage requests found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {damageRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                    Vehicle: {request.vehicle?.make} {request.vehicle?.model}
                  </h2>
                  <p className="text-gray-600">
                    Registration: {request.vehicle?.registrationNumber}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Description: {request.description}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  {request.reportedBy && (
                    <p className="text-gray-600">
                      Reported by: {request.reportedBy.firstName} {request.reportedBy.lastName}
                    </p>
                  )}
                  {request.technicianId && (
                    <p className="text-gray-600">
                      Technician: {request.technicianId.firstName} {request.technicianId.lastName}
                    </p>
                  )}
                  <p className={`mt-2 font-semibold ${
                    request.status === 'Completed' ? 'text-green-600' :
                    request.status === 'In Progress' ? 'text-blue-600' :
                    request.status === 'Assigned' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {request.status}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Damage Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4">Damage Request Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Vehicle Information</h4>
                <p>{selectedRequest.vehicle?.make} {selectedRequest.vehicle?.model}</p>
                <p>Registration: {selectedRequest.vehicle?.registrationNumber}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Damage Description</h4>
                <p>{selectedRequest.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Request Timeline</h4>
                <p>Reported: {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                {selectedRequest.completedAt && (
                  <p>Completed: {new Date(selectedRequest.completedAt).toLocaleDateString()}</p>
                )}
              </div>

              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Attachments</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedRequest.attachments.map((attachment, index) => (
                      <img 
                        key={index} 
                        src={attachment} 
                        alt={`Damage ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.usedParts && selectedRequest.usedParts.length > 0 && (
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
                      {selectedRequest.usedParts.map((part, index) => (
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

              {selectedRequest.totalCost > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Total Cost</h4>
                  <p>${selectedRequest.totalCost.toFixed(2)}</p>
                </div>
              )}

              {selectedRequest.repairNotes && (
                <div>
                  <h4 className="font-semibold text-gray-700">Repair Notes</h4>
                  <p>{selectedRequest.repairNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
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

export default VehicleUpdateRequests;
