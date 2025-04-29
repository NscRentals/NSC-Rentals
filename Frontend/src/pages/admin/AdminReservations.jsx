import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // Default to pending tab
  const { userProfile, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userProfile?.type !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAllReservations();
  }, [isLoggedIn, userProfile, navigate]);

  const fetchAllReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view reservations');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/reservation', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch reservations');
        toast.error('Failed to fetch reservations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/reservation/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      setReservations(prev => prev.filter(res => res._id !== id));
      toast.success('Reservation deleted successfully');
    } catch (err) {
      console.error('Error deleting reservation:', err);
      toast.error('Failed to delete reservation');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/reservation/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      setReservations(prev => prev.map(res => 
        res._id === id ? { ...res, status: newStatus } : res
      ));
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (err) {
      console.error('Error updating reservation status:', err);
      toast.error('Failed to update reservation status');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    switch (activeTab) {
      case 'approved':
        return reservation.status === 'approved';
      case 'rejected':
        return reservation.status === 'rejected';
      case 'pending':
      default:
        return !reservation.status || reservation.status === 'pending';
    }
  });

  if (loading) return (
    <div className="p-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-[38px] font-bold mb-8">All Reservations</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`${
              activeTab === 'approved'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`${
              activeTab === 'rejected'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rejected
          </button>
        </nav>
      </div>
      
      {filteredReservations.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No {activeTab} reservations found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.rId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.rType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.vehicleNum}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    LKR {reservation.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {reservation.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                    )}
                    {reservation.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(reservation._id)}
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
      )}
    </div>
  );
};

export default AdminReservations; 