import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AssignedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [usedParts, setUsedParts] = useState([]);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    fetchAssignedRequests();
  }, []);

  const fetchAssignedRequests = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view assigned tasks");
        return;
      }
      const response = await axios.get(
        "http://localhost:4000/api/damage-requests/my-assigned",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load assigned tasks");
      setLoading(false);
    }
  };

  const fetchSpareParts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:4000/api/maintenance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpareParts(response.data);
    } catch (error) {
      toast.error("Failed to load spare parts inventory");
    }
  };

  const openCompleteModal = (requestId) => {
    setSelectedRequestId(requestId);
    setUsedParts([]);
    setEstimatedHours(0);
    setShowModal(true);
    fetchSpareParts();
  };

  const handlePartChange = (partId, field, value) => {
    setUsedParts((prev) => {
      const existing = prev.find((p) => p.partId === partId);
      if (existing) {
        return prev.map((p) =>
          p.partId === partId ? { ...p, [field]: value } : p
        );
      } else {
        const part = spareParts.find((p) => p._id === partId);
        return [
          ...prev,
          { partId, name: part.name, price: part.price, quantity: value, cost: part.price * value },
        ];
      }
    });
  };

  const handleMarkComplete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to mark as complete");
        return;
      }
      // Calculate totals
      const partsTotal = usedParts.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity || 0)), 0);
      const fullTotal = partsTotal + (Number(estimatedHours) * 800);
      await axios.patch(
        `http://localhost:4000/api/damage-requests/${selectedRequestId}/update-status`,
        {
          status: "Completed",
          usedParts: usedParts.filter((p) => Number(p.quantity) > 0),
          totalCost: fullTotal,
          repairNotes: `Spare parts used. Estimated hours: ${estimatedHours}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Marked as complete");
      setShowModal(false);
      fetchAssignedRequests();
      window.dispatchEvent(new Event('refreshCompletedRequests'));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as complete");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-white text-black">
      <h2 className="text-2xl font-bold mb-8">My Assigned Tasks</h2>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No assigned tasks to display yet.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {requests.map((request) => (
            <div key={request._id} className="bg-gray-50 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{request.vehicle?.make} {request.vehicle?.model}</h3>
                  <p className="text-gray-600">Registration: {request.vehicle?.registrationNumber}</p>
                  <p className="text-gray-700 mt-2">Description: {request.description}</p>
                  <p className="text-gray-600 mt-2">Status: <span className="font-semibold">{request.status}</span></p>
                </div>
                {request.status !== "Completed" && (
                  <button
                    onClick={() => openCompleteModal(request._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for marking as complete */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Mark as Complete</h3>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Select Used Spare Parts:</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {spareParts.map((part) => (
                  <div key={part._id} className="flex items-center gap-2">
                    <span className="w-32">{part.name}</span>
                    <span className="w-16 text-xs text-gray-500">(Qty: {part.quantity})</span>
                    <span className="w-16 text-xs text-gray-500">${part.price}</span>
                    <input
                      type="number"
                      min={0}
                      max={part.quantity}
                      value={usedParts.find((p) => p.partId === part._id)?.quantity || ''}
                      onChange={(e) => handlePartChange(part._id, 'quantity', Number(e.target.value))}
                      className="border rounded px-2 py-1 w-16"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estimated Hours Worked:</label>
              <input
                type="number"
                min={0}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="border rounded px-2 py-1 w-32"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Total for Spare Parts: </label>
              <span className="ml-2">${usedParts.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity || 0)), 0).toFixed(2)}</span>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Full Total (Parts + Labor): </label>
              <span className="ml-2">${(usedParts.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity || 0)), 0) + (Number(estimatedHours) * 800)).toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedRequests; 